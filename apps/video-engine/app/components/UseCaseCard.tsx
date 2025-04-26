export interface UseCaseBullet {
  text: string
}

export interface UseCaseCardProps {
  number: number
  name: string
  title: string
  intro: string
  bullets: UseCaseBullet[]
}

export function UseCaseCard({
  number,
  name,
  title,
  intro,
  bullets,
}: UseCaseCardProps) {
  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-lg h-full transition-all duration-500 hover:shadow-xl hover:border-gray-600/70 flex flex-col">
      <div className="mb-4 flex items-center">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-9 w-9 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-md">
          {number}
        </div>
        <h3 className="text-lg text-gray-400 font-medium">{name}</h3>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>

      <p className="text-gray-300 mb-6 flex-grow">{intro}</p>

      <div className="space-y-3">
        {bullets.map((bullet, index) => (
          <div key={index} className="flex items-start">
            <div className="h-5 w-5 rounded-full bg-pink-500/20 flex-shrink-0 mt-1 mr-3 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-pink-400"></div>
            </div>
            <p className="text-gray-300 text-sm">{bullet.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
