import { ServiceCard } from "~/components/ServiceCard"

export interface Service {
  title: string
  description: string
}

export interface ServiceCategoryProps {
  title: string
  services: Service[]
  colorClass?: string
}

export function ServiceCategory({
  title,
  services,
  colorClass = "from-purple-500 to-pink-500",
}: ServiceCategoryProps) {
  return (
    <div className="mb-14">
      <h2 className="text-2xl font-bold mb-8 relative text-center">
        <span className="relative z-10 inline-block pb-4">{title}</span>
        <span
          className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-[5px] w-36 bg-gradient-to-r ${colorClass} rounded-full opacity-70`}
        ></span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </div>
  )
}
