'use client'

import { Plus, X } from 'lucide-react'

export interface ColorVariant {
  name: string
  hex:  string
}

interface Props {
  value:    ColorVariant[]
  onChange: (colors: ColorVariant[]) => void
}

export function ColorVariantBuilder({ value, onChange }: Props) {
  function add() {
    onChange([...value, { name: '', hex: '#1a1a1a' }])
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i))
  }

  function update(i: number, field: keyof ColorVariant, val: string) {
    onChange(value.map((c, idx) => idx === i ? { ...c, [field]: val } : c))
  }

  return (
    <div className="space-y-2">
      {value.map((color, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="color"
            value={color.hex}
            onChange={(e) => update(i, 'hex', e.target.value)}
            className="w-8 h-8 rounded border border-[#2a2a2a] cursor-pointer bg-transparent p-0.5"
          />
          <input
            type="text"
            value={color.name}
            onChange={(e) => update(i, 'name', e.target.value)}
            placeholder="Color name (e.g. Natural Black)"
            className="flex-1 px-3 py-1.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded text-[#f5f0e8] text-sm placeholder:text-[#8a8070]"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-[#8a8070] hover:text-[#f87171] transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-[#c9a96e] text-sm hover:text-[#b8975e] transition-colors"
      >
        <Plus size={14} /> Add colour
      </button>
    </div>
  )
}
