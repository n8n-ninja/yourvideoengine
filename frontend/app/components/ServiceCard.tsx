export interface ServiceCardProps {
  title: string
  description: string
}

export function ServiceCard({ title, description }: ServiceCardProps) {
  return (
    <div className="group relative bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/40 shadow-md h-full flex flex-col transition-all duration-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:bg-gray-800/60 hover:border-pink-500/30 overflow-hidden">
      {/* Contenu avec effet au survol */}
      <div className="relative z-10">
        <h3 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent transition-transform duration-300 text-center">
          {title}
        </h3>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-500/40 to-transparent mb-4 group-hover:via-pink-500/60 transition-colors duration-300"></div>
        <p className="text-gray-300 text-sm flex-grow text-center">
          {description}
        </p>
      </div>
    </div>
  )
}
