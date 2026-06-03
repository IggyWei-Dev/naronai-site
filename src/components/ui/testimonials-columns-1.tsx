"use client";
import React from "react";
import { motion } from "framer-motion";

export type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className} style={{ overflow: "hidden" }}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-5 pb-5"
      >
        {[...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={i}
                style={{
                  padding: "28px 24px",
                  border: "0.5px solid rgba(46,29,27,0.14)",
                  background: "#FAF6F1",
                  maxWidth: "300px",
                  width: "100%",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "13.5px",
                    fontStyle: "italic",
                    fontWeight: 300,
                    lineHeight: 1.7,
                    color: "#2E1D1B",
                    margin: 0,
                  }}
                >
                  {text}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "0.5px solid rgba(46,29,27,0.10)",
                  }}
                >
                  <img
                    width={36}
                    height={36}
                    src={image}
                    alt={name}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-ui)",
                        fontSize: "9px",
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#2E1D1B",
                        lineHeight: 1.4,
                      }}
                    >
                      {name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-ui)",
                        fontSize: "8px",
                        letterSpacing: "0.08em",
                        color: "rgba(46,29,27,0.55)",
                        lineHeight: 1.4,
                        marginTop: "2px",
                      }}
                    >
                      {role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))]}
      </motion.div>
    </div>
  );
};
