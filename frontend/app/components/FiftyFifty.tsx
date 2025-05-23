import React from "react"

export interface FiftyFiftyProps {
  imagePosition?: "left" | "right"
  colorTheme?: "blue" | "purple"
  imageContent?: React.ReactNode
  children: React.ReactNode
}

export function FiftyFifty({
  imagePosition = "right",
  colorTheme = "purple",
  imageContent,
  children,
}: FiftyFiftyProps) {
  // Déterminer les classes de dégradé en fonction du colorTheme
  const gradientClasses = {
    purple: "from-purple-900/50 to-pink-800/50",
    blue: "from-indigo-900/50 to-blue-800/50",
  }

  // Déterminer la direction du dégradé en fonction de la position de l'image
  const gradientDirection =
    imagePosition === "right" ? "bg-gradient-to-br" : "bg-gradient-to-bl"

  // Assembler la classe complète du dégradé
  const gradientClass = `${gradientDirection} ${gradientClasses[colorTheme]}`

  // Icône par défaut en fonction du theme de couleur
  const defaultImageContent = (
    <div className="text-gray-400 flex flex-col items-center">
      {colorTheme === "purple" ? (
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
      ) : (
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
      )}
      <p>{colorTheme === "purple" ? "Image" : "Video"} placeholder</p>
    </div>
  )

  // Créer les sections de texte et d'image
  const textContent = (
    <div className="w-full md:w-1/2 p-8 md:p-10 prose prose-lg text-left">
      {children}
    </div>
  )

  const imageBlock = (
    <div
      className={`w-full md:w-1/2 ${gradientClass} min-h-[300px] flex items-center justify-center`}
    >
      {imageContent || defaultImageContent}
    </div>
  )

  return (
    <section className="w-full px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700/50 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {imagePosition === "left" ? (
              <>
                {imageBlock}
                {textContent}
              </>
            ) : (
              <>
                {textContent}
                {imageBlock}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
