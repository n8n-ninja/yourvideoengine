interface SectionTitleProps {
  title: string
  subtitle?: string
}

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <>
      <h2 className="text-3xl text-balance md:text-5xl font-bold mb-4 text-center">
        {title}
      </h2>
      {subtitle && (
        <div className="mb-14 max-w-4xl mx-auto">
          <p className="text-lg md:text-xl text-balance text-center mb-4 text-gray-100">
            {subtitle}
          </p>
        </div>
      )}
    </>
  )
}
