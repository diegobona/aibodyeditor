import type { ReactNode } from 'react'
import { cn } from '@libs/ui/utils/cn'

/** Full-width content section with the site's container (server-rendered). */
export function Section({
  id,
  className,
  containerClassName,
  children,
}: {
  id?: string
  className?: string
  containerClassName?: string
  children: ReactNode
}) {
  return (
    <section id={id} className={cn('scroll-mt-20 py-20 md:py-24', className)}>
      <div className={cn('container max-w-6xl px-4 md:px-6', containerClassName)}>{children}</div>
    </section>
  )
}

/** The section's <h2> (+ optional lead paragraph). */
export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10 max-w-2xl md:mb-12">
      <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{subtitle}</p>}
    </div>
  )
}
