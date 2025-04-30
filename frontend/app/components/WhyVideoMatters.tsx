export interface WhyVideoMattersProps {
  title: string
  paragraphs: string[]
}

export function WhyVideoMatters({ title, paragraphs }: WhyVideoMattersProps) {
  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700/50 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image placeholder à gauche */}
            <div className="w-full md:w-1/2 bg-gradient-to-bl from-indigo-900/50 to-blue-800/50 min-h-[300px] flex items-center justify-center">
              <div className="text-gray-400 flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mb-4 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <p>Video placeholder</p>
              </div>
            </div>

            {/* Texte à droite */}
            <div className="w-full md:w-1/2 p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-left">
                {title}
              </h2>
              <div className="prose prose-lg text-left">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-lg text-left mb-6 text-gray-100"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
