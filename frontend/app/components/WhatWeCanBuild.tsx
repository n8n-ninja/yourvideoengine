import { ServiceCategory, type Service } from "~/components/ServiceCategory"
import { SectionTitle } from "~/components/SectionTitle"

export interface ServiceCategoryData {
  title: string
  services: Service[]
}

export interface WhatWeCanBuildProps {
  title: string
  description: string
  categories: ServiceCategoryData[]
  footer: string
}

export function WhatWeCanBuild({
  title,
  description,
  categories,
  footer,
}: WhatWeCanBuildProps) {
  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-12 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionTitle title={title} subtitle={description} />

        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-lg border border-gray-700/50 relative z-10">
          {categories.map((category, index) => (
            <ServiceCategory
              key={index}
              title={category.title}
              services={category.services}
            />
          ))}
        </div>
      </div>

      <div className="text-center text-xl mt-12">{footer}</div>
    </section>
  )
}
