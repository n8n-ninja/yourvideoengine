export interface ServiceCardProps {
  title: string
  description: string
}

export function ServiceCard({ title, description }: ServiceCardProps) {
  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/40 shadow-md h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:bg-gray-800/50">
      <h3 className="text-lg font-semibold mb-3 text-gray-100">{title}</h3>
      <p className="text-gray-300 text-sm flex-grow">{description}</p>
    </div>
  )
}
