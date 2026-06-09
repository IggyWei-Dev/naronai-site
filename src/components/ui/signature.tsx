"use client";

import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { parse as opentypeParse } from "opentype.js";
import { cn } from "@/lib/utils";

interface SignatureProps {
  text?: string;
  color?: string;
  gradient?: [string, string]; // [from, to] — overrides color when provided
  shimmer?: boolean;           // animated highlight sweep — overrides gradient
  shimmerHighlight?: string;   // lighter sweep colour, defaults to near-white
  fontSize?: number;
  duration?: number;
  delay?: number;
  strokeWidth?: number;
  className?: string;
  inView?: boolean;
  once?: boolean;
  fontUrl?: string;
  stretch?: boolean;           // scale SVG to fill container width, stroke stays fixed
}

function sanitizePath(d: string): string {
  if (!d.includes('NaN')) return d
  // Replace NaN tokens BEFORE splitting on command letters —
  // the 'a' inside 'NaN' would otherwise be treated as an SVG arc command,
  // splitting the token across two segments so neither contains 'NaN'.
  const safe = d.replace(/NaN/g, '##')
  return safe
    .replace(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g, (seg) =>
      seg.includes('##') ? '' : seg
    )
    .replace(/\s+/g, ' ')
    .trim()
}

export function Signature({
  text = "Signature",
  color = "currentColor",
  gradient,
  shimmer = false,
  shimmerHighlight = "var(--color-on-dark)",
  fontSize = 32,
  duration = 1.5,
  delay = 0,
  strokeWidth = 2,
  className,
  inView = false,
  once = true,
  fontUrl,
  stretch = false,
}: SignatureProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [width, setWidth] = useState<number>(300);
  const height = fontSize * 3;
  const horizontalPadding = fontSize * (stretch ? 0.3 : 0.1);
  const topMargin = fontSize * 1.5;
  const baseline = topMargin;
  const maskId      = `signature-reveal-${useId().replace(/:/g, "")}`;
  const gradId      = `signature-grad-${useId().replace(/:/g, "")}`;
  const shimmerGradId = `signature-shimmer-${useId().replace(/:/g, "")}`;
  const paint       = shimmer
    ? `url(#${shimmerGradId})`
    : gradient
    ? `url(#${gradId})`
    : color;

  useEffect(() => {
    async function load() {
      try {
        let font;
        const fontPaths = fontUrl
          ? [fontUrl]
          : ["/AnandaBlackPersonalUseRegular-rg9Rx.ttf"];

        for (const path of fontPaths) {
          try {
            const res = await fetch(path);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const buffer = await res.arrayBuffer();
            font = opentypeParse(buffer);
            break;
          } catch {
            // Try next path
          }
        }

        if (!font) {
          throw new Error("Font could not be loaded from any path");
        }

        let x = horizontalPadding;
        const newPaths: string[] = [];

        for (const char of text) {
          const glyph = font.charToGlyph(char);
          // Pass font as 5th arg so composite glyphs can resolve their components
          const path = glyph.getPath(x, baseline, fontSize, {}, font);
          const pathData = sanitizePath(path.toPathData(3));

          // Fallback: if GSUB gave a broken glyph, try raw cmap lookup
          if (!pathData) {
            try {
              const rawIndex = (font as any).encoding.charToGlyphIndex(char);
              const rawGlyph = font.glyphs.get(rawIndex);
              if (rawGlyph) {
                const rawPath = rawGlyph.getPath(x, baseline, fontSize, {}, font);
                const rawData = sanitizePath(rawPath.toPathData(3));
                newPaths.push(rawData);
              } else {
                newPaths.push('');
              }
            } catch {
              newPaths.push('');
            }
          } else {
            newPaths.push(pathData);
          }

          const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm;
          x += advanceWidth * (fontSize / font.unitsPerEm);
        }

        setPaths(newPaths);
        setWidth(x + horizontalPadding);
      } catch (error) {
        console.error("Signature component font load error:", error);
        setPaths([]);
        setWidth(text.length * fontSize * 0.6);
      }
    }

    load();
  }, [text, fontSize, baseline, horizontalPadding, stretch, fontUrl]);

  const variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  return (
    <motion.svg
      key={paths.length}
      width={stretch ? "100%" : width}
      height={stretch ? undefined : height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={stretch ? "xMinYMid meet" : undefined}
      fill="none"
      className={cn("text-foreground overflow-visible", className)}
      style={stretch ? { display: 'block', height: 'auto' } : undefined}
      initial="hidden"
      whileInView={inView ? "visible" : undefined}
      animate={inView ? undefined : "visible"}
      viewport={{ once }}
    >
      <defs>
        {gradient && !shimmer && (
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={gradient[0]} />
            <stop offset="100%" stopColor={gradient[1]} />
          </linearGradient>
        )}
        {shimmer && (
          <linearGradient id={shimmerGradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={width} y2="0">
            <stop offset="0%"   stopColor={color} />
            <stop offset="35%"  stopColor={color} />
            <stop offset="50%"  stopColor={shimmerHighlight} />
            <stop offset="65%"  stopColor={color} />
            <stop offset="100%" stopColor={color} />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from={`${-width * 1.5} 0`}
              to={`${width * 2} 0`}
              dur="5s"
              repeatCount="indefinite"
            />
          </linearGradient>
        )}
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="white"
              strokeWidth={fontSize * 0.22}
              fill="none"
              variants={variants}
              transition={{
                pathLength: {
                  delay: delay + i * 0.2,
                  duration,
                  ease: "easeInOut",
                },
                opacity: {
                  delay: delay + i * 0.2 + 0.01,
                  duration: 0.01,
                },
              }}
              vectorEffect={stretch ? undefined : "non-scaling-stroke"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </mask>
      </defs>

      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={paint}
          strokeWidth={strokeWidth}
          fill="none"
          variants={variants}
          transition={{
            pathLength: {
              delay: delay + i * 0.2,
              duration,
              ease: "easeInOut",
            },
            opacity: {
              delay: delay + i * 0.2 + 0.01,
              duration: 0.01,
            },
          }}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      ))}

      <g mask={`url(#${maskId})`}>
        {paths.map((d, i) => (
          <path key={i} d={d} fill={paint} />
        ))}
      </g>
    </motion.svg>
  );
}
