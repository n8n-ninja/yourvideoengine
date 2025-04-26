export interface WhatWeOfferProps {
  title: string
  paragraphs: string[]
}

export function WhatWeOffer({ title, paragraphs }: WhatWeOfferProps) {
  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700/50 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Texte à gauche */}
            <div className="w-full md:w-1/2 p-8 md:p-10">
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

            {/* Image placeholder à droite */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-900/50 to-pink-800/50 min-h-[300px] flex items-center justify-center">
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p>Image placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
