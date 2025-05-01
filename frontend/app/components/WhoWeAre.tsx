import { SectionTitle } from "~/components/SectionTitle"

export interface TeamMember {
  name: string
  role: string
  location: string
  description: string
}

export interface WhoWeAreProps {
  title: string
  description: string
  team: TeamMember[]
}

export function WhoWeAre({ title, description, team }: WhoWeAreProps) {
  const manu = team[0]
  const thais = team[1]

  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-gradient-to-b from-purple-950/20 to-blue-950/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <SectionTitle title={title} subtitle={description} />
        </div>

        {/* Deux cartes côte à côte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Carte de Manu */}
          <div className="bg-blue-900/20 hover:bg-blue-900/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/20 border border-blue-800/20 hover:border-blue-700/30 transition-all duration-300 group">
            <div className="p-8 md:p-10">
              {/* Photo en haut */}
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-blue-400/30 shadow-lg group-hover:shadow-blue-500/30 group-hover:scale-105 transition-all duration-500">
                  <img
                    src="manu.jpg"
                    alt={manu.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Informations */}
              <h3 className="text-2xl font-semibold mb-2 text-center text-white group-hover:scale-105 group-hover:text-blue-100 transition-all duration-300">
                {manu.name}
              </h3>
              <p className="text-blue-300 mb-2 text-center font-medium group-hover:text-blue-200 transition-colors duration-300">
                {manu.role}
              </p>
              <p className="text-gray-400 mb-6 text-center text-sm group-hover:text-gray-300 transition-colors duration-300">
                {manu.location}
              </p>

              <div className="h-px w-2/3 mx-auto bg-gradient-to-r from-transparent via-blue-500/40 to-transparent mb-6 group-hover:via-blue-400/60 group-hover:w-3/4 transition-all duration-300"></div>

              <p className="text-gray-200 leading-relaxed group-hover:text-white transition-colors duration-300">
                {manu.description}
              </p>
            </div>
          </div>

          {/* Carte de Thais */}
          <div className="bg-pink-900/20 hover:bg-pink-900/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-pink-500/20 border border-pink-800/20 hover:border-pink-700/30 transition-all duration-300 group">
            <div className="p-8 md:p-10">
              {/* Photo en haut */}
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-pink-400/30 shadow-lg group-hover:shadow-pink-500/30 group-hover:scale-105 transition-all duration-500">
                  <img
                    src="thais.png"
                    alt={thais.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Informations */}
              <h3 className="text-2xl font-semibold mb-2 text-center text-white group-hover:scale-105 group-hover:text-pink-100 transition-all duration-300">
                {thais.name}
              </h3>
              <p className="text-pink-300 mb-2 text-center font-medium group-hover:text-pink-200 transition-colors duration-300">
                {thais.role}
              </p>
              <p className="text-gray-400 mb-6 text-center text-sm group-hover:text-gray-300 transition-colors duration-300">
                {thais.location}
              </p>

              <div className="h-px w-2/3 mx-auto bg-gradient-to-r from-transparent via-pink-500/40 to-transparent mb-6 group-hover:via-pink-400/60 group-hover:w-3/4 transition-all duration-300"></div>

              <p className="text-gray-200 leading-relaxed group-hover:text-white transition-colors duration-300">
                {thais.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
