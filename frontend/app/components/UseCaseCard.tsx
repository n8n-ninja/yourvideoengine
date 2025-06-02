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
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl pt-10 px-8 pb-8 border border-gray-700/50 shadow-lg h-full transition-all duration-500 hover:shadow-xl hover:border-gray-600/70 flex flex-col relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="bg-[#191923] border border-gray-700/70 h-8 w-16 rounded-full flex items-center justify-center text-gray-300 font-medium text-sm shadow-sm">
          {number}
        </div>
      </div>

      <div className="mb-2 text-center">
        <h3 className="text-xl md:text-2xl font-bold  bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent transition-transform duration-300 text-center">
          {name}
        </h3>
      </div>

      <h2 className="text-xl mb-8 md:text-2xl font-bold mt-6 text-white text-center text-balance">
        {title}
      </h2>

      {/* <p className="text-gray-300 mb-6 flex-grow text-center">{intro}</p> */}

      <div className="space-y-3">
        {bullets.map((bullet, index) => (
          <div key={index} className="flex items-start">
            <div className="h-5 w-5 rounded-full bg-pink-500/20 flex-shrink-0 mt-1 mr-3 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-pink-400"></div>
            </div>
            <p className="text-gray-300 text-sm">{bullet.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
