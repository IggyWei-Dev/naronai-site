'use client'

import { useState, useRef } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import Image from 'next/image'
import { X, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  value:    string[]
  onChange: (urls: string[]) => void
}

export function ImageUploadZone({ value, onChange }: Props) {
  const [dragging,  setDragging]  = useState(false)
  const [uploading, setUploading] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFiles(files: File[]) {
    const supabase     = createClient()
    const fileNames    = files.map((f) => f.name)
    setUploading((prev) => [...prev, ...fileNames])

    const uploadedUrls: string[] = []
    for (const file of files) {
      const ext  = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path)
        uploadedUrls.push(publicUrl)
      }
    }

    setUploading((prev) => prev.filter((n) => !fileNames.includes(n)))
    onChange([...value, ...uploadedUrls])
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)
    )
    if (files.length) uploadFiles(files)
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length) uploadFiles(files)
    e.target.value = ''
  }

  function removeImage(url: string) {
    onChange(value.filter((u) => u !== url))
  }

  function moveImage(from: number, to: number) {
    const next = [...value]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          'flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors',
          dragging
            ? 'border-[#c9a96e] bg-[#c9a96e]/5'
            : 'border-[#2a2a2a] hover:border-[#3a3a3a] bg-[#1a1a1a]',
        ].join(' ')}
      >
        <Upload size={20} className="text-[#8a8070] mb-2" />
        <p className="text-[#8a8070] text-sm">Drop images here or click to select</p>
        <p className="text-[#8a8070] text-xs mt-1">JPG, PNG or WebP · max 5 MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      {uploading.length > 0 && (
        <p className="text-[#c9a96e] text-xs">
          Uploading {uploading.length} file{uploading.length !== 1 ? 's' : ''}…
        </p>
      )}

      {value.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {value.map((url, i) => (
            <div key={url} className="relative group">
              <div className={`w-20 h-20 rounded overflow-hidden border-2 ${i === 0 ? 'border-[#c9a96e]' : 'border-[#2a2a2a]'}`}>
                <Image
                  src={url}
                  alt={`Product image ${i + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-[#c9a96e] text-[#0f0f0f] text-[9px] text-center py-0.5 font-medium">
                  HERO
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#f87171] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={8} className="text-white" />
              </button>
              <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i - 1)}
                    className="bg-black/60 text-white text-xs px-1 rounded"
                  >
                    ←
                  </button>
                )}
                {i < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i + 1)}
                    className="bg-black/60 text-white text-xs px-1 rounded"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
