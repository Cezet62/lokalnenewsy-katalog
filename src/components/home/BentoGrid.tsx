import { ReactNode } from 'react'

interface BentoGridProps {
  children: ReactNode
}

export default function BentoGrid({ children }: BentoGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
      {children}
    </div>
  )
}

// Size variants for bento items
export type BentoSize = '1x1' | '1x2' | '2x1' | '2x2'

interface BentoItemProps {
  children: ReactNode
  size?: BentoSize
  className?: string
}

export function BentoItem({ children, size = '1x1', className = '' }: BentoItemProps) {
  const sizeClasses: Record<BentoSize, string> = {
    '1x1': 'col-span-1 row-span-1',
    '1x2': 'col-span-1 row-span-2',
    '2x1': 'col-span-2 row-span-1',
    '2x2': 'col-span-2 row-span-2',
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  )
}
