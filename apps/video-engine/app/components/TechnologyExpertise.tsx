export interface TechItem {
  name: string
  icon?: string // URL de l'icône ou nom d'icône
  category?: string // Catégorie ou sous-catégorie de la technologie
}

export interface TechCategory {
  title: string
  description: string
  items: TechItem[]
}

export interface TechnologyExpertiseProps {
  title: string
  description: string[]
  categories: TechCategory[]
}

export function TechnologyExpertise({
  title,
  description,
  categories,
}: TechnologyExpertiseProps) {
  // Fonction pour déterminer la classe de gradient selon l'index
  const getCategoryGradient = (index: number) => {
    const gradients = [
      "from-blue-900/30 to-purple-900/20", // Premier gradient
      "from-cyan-900/30 to-blue-900/20", // Deuxième gradient
      "from-purple-900/30 to-pink-900/20", // Troisième gradient
    ]
    return gradients[index % gradients.length]
  }

  // Fonction pour déterminer la classe de bordure selon l'index
  const getCategoryBorder = (index: number) => {
    const borders = [
      "border-blue-800/30", // Premier style de bordure
      "border-cyan-800/30", // Deuxième style de bordure
      "border-purple-800/30", // Troisième style de bordure
    ]
    return borders[index % borders.length]
  }

  // Fonction pour obtenir les sous-catégories
  const getSubcategories = (category: TechCategory) => {
    const categoryHeaders = category.items.filter(
      (item) => item.category === "category"
    )

    // Pour chaque en-tête de catégorie, récupérer ses éléments
    return categoryHeaders.map((header) => {
      const nextHeaderIndex = category.items.findIndex(
        (item, i) =>
          i > category.items.indexOf(header) && item.category === "category"
      )

      const subcategoryItems = category.items.filter(
        (item) =>
          item.category &&
          item.category !== "category" &&
          category.items.indexOf(item) > category.items.indexOf(header) &&
          (nextHeaderIndex === -1 ||
            category.items.indexOf(item) < nextHeaderIndex)
      )

      return {
        header,
        items: subcategoryItems,
      }
    })
  }

  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
          <div className="mb-10">
            {description.map((paragraph, index) => (
              <p key={index} className="text-lg mb-4 text-gray-100">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-16">
          {categories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className={`flex flex-col bg-gradient-to-br ${getCategoryGradient(
                categoryIndex
              )} backdrop-blur-md border ${getCategoryBorder(
                categoryIndex
              )} rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-semibold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {category.title}
                </h3>
                <p className="text-gray-300 mb-6 max-w-3xl">
                  {category.description}
                </p>
                <div className="h-px w-full bg-gradient-to-r from-blue-500/30 to-transparent max-w-xl"></div>
              </div>

              {/* Pour la première catégorie (Core Technologies), on applique un formatage spécial */}
              {categoryIndex === 0 ? (
                // Structure de tableau avec 2 colonnes
                <div className="space-y-6">
                  {getSubcategories(category).map(
                    (subcategory, subcatIndex) => (
                      <div
                        key={subcatIndex}
                        className="flex flex-col md:flex-row border-b border-gray-800/30 pb-6 last:border-0 last:pb-0"
                      >
                        {/* Colonne 1: Titre de la famille d'outils */}
                        <div className="md:w-1/4 mb-3 md:mb-0">
                          <h4 className="text-xl font-medium text-blue-300">
                            {subcategory.header.name}
                          </h4>
                        </div>

                        {/* Colonne 2: Les outils */}
                        <div className="md:w-3/4">
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                            {subcategory.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="bg-gray-900/40 backdrop-blur-md border border-gray-800/40 rounded-lg p-3 flex flex-col items-center justify-center hover:border-blue-700/40 transition-colors duration-300 hover:bg-gray-900/50"
                              >
                                <div className="w-10 h-10 mb-2 flex items-center justify-center bg-blue-900/30 rounded-lg">
                                  {/* Placeholder icon */}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-400"
                                  >
                                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                                    <line x1="16" y1="8" x2="2" y2="22"></line>
                                    <line
                                      x1="17.5"
                                      y1="15"
                                      x2="9"
                                      y2="15"
                                    ></line>
                                  </svg>
                                </div>
                                <span className="text-sm text-center text-gray-200">
                                  {item.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {/* Encadré rose pour les outils et interfaces sur mesure */}
                  <div className="mt-8 rounded-xl bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/50 p-6 shadow-lg hover:shadow-pink-900/20 transition-all duration-300">
                    <div className="flex flex-col md:flex-row items-start md:items-center">
                      <div className="md:w-1/4 mb-4 md:mb-0 flex items-center">
                        <div className="w-12 h-12 mr-4 bg-pink-800/40 rounded-lg flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-pink-400"
                          >
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                          </svg>
                        </div>
                        <h4 className="text-xl font-medium text-pink-300">
                          Custom Development
                        </h4>
                      </div>
                      <div className="md:w-3/4">
                        <p className="text-white text-md">
                          We develop{" "}
                          <span className="font-bold text-pink-300">
                            custom tools and interfaces
                          </span>{" "}
                          to meet your specific needs. Our technical expertise
                          allows us to create solutions tailored to your unique
                          production workflow, from specialized APIs to
                          intuitive user interfaces.
                        </p>
                        <div className="mt-3 flex flex-wrap ">
                          <span className="inline-flex items-center rounded-md bg-pink-800/30 px-3 py-1 text-sm font-medium text-pink-200 mr-2">
                            Custom APIs
                          </span>
                          <span className="inline-flex items-center rounded-md bg-pink-800/30 px-3 py-1 text-sm font-medium text-pink-200 mr-2">
                            Custom Interfaces
                          </span>
                          <span className="inline-flex items-center rounded-md bg-pink-800/30 px-3 py-1 text-sm font-medium text-pink-200">
                            Automation
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Pour les autres catégories, on utilise 6 éléments par ligne
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="bg-gray-900/40 backdrop-blur-md border border-gray-800/40 rounded-lg p-3 flex flex-col items-center justify-center hover:border-blue-700/40 transition-colors duration-300 hover:bg-gray-900/50"
                    >
                      <div className="w-10 h-10 mb-2 flex items-center justify-center bg-blue-900/30 rounded-lg">
                        {/* Placeholder icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-400"
                        >
                          <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                          <line x1="16" y1="8" x2="2" y2="22"></line>
                          <line x1="17.5" y1="15" x2="9" y2="15"></line>
                        </svg>
                      </div>
                      <span className="text-sm text-center text-gray-200">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
