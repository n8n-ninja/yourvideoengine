import { SectionTitle } from "~/components/SectionTitle"
import { FormattedText } from "~/components/FormattedText"

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
  description: string
  categories: TechCategory[]
  customDevelopment?: {
    title: string
    description: string
    tags: string[]
  }
}

export function TechnologyExpertise({
  title,
  description,
  categories,
  customDevelopment,
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
          <SectionTitle title={title} subtitle={description} />
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
                                className="bg-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-lg p-3 flex flex-col items-center justify-center transition-all duration-300 shadow-[0_0_6px_rgba(59,130,246,0.5)]"
                              >
                                <span className="text-sm text-center text-gray-200 font-medium">
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
                  {customDevelopment && (
                    <div className="mt-8 rounded-xl bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/50 p-6 shadow-lg hover:shadow-pink-900/20 transition-all duration-300">
                      <div className="flex flex-col md:flex-row items-start md:items-center">
                        <div className="md:w-1/4 mb-4 md:mb-0 flex items-center">
                          <h4 className="text-xl font-medium text-pink-300">
                            {customDevelopment.title}
                          </h4>
                        </div>
                        <div className="md:w-3/4">
                          <div className="rounded-lg p-4">
                            <p className="text-white text-md">
                              <FormattedText
                                text={customDevelopment.description}
                              />
                            </p>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {customDevelopment.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center rounded-md bg-pink-800/30 px-3 py-1 text-sm font-medium text-pink-200 shadow-[0_0_4px_rgba(236,72,153,0.5)] border border-pink-700/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Pour les autres catégories, on utilise 6 éléments par ligne
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="bg-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-lg p-3 flex flex-col items-center justify-center transition-all duration-300 shadow-[0_0_6px_rgba(59,130,246,0.5)]"
                    >
                      <span className="text-sm text-center text-gray-200 font-medium">
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
