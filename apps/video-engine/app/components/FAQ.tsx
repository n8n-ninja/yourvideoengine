import { useState } from "react"

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQProps {
  title: string
  description: string[]
  faqs: FAQItem[]
}

export function FAQ({ title, description, faqs }: FAQProps) {
  // Initialiser avec la première question ouverte (index 0)
  const [openItems, setOpenItems] = useState<number[]>([0])

  // Fonction pour basculer l'état ouvert/fermé d'une question
  const toggleItem = (index: number) => {
    setOpenItems((prevOpenItems) => {
      // Si l'élément est déjà ouvert, on le ferme
      if (prevOpenItems.includes(index)) {
        return prevOpenItems.filter((i) => i !== index)
      }
      // Sinon, on l'ajoute aux éléments ouverts
      return [...prevOpenItems, index]
    })
  }

  // Vérifier si un élément est ouvert
  const isItemOpen = (index: number) => openItems.includes(index)

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

        <div className="space-y-4 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900/40 to-gray-800/30 backdrop-blur-md border border-gray-800/40 rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                className="w-full text-left p-6 flex justify-between items-center"
                onClick={() => toggleItem(index)}
                aria-expanded={isItemOpen(index)}
              >
                <h3 className="text-lg md:text-xl font-medium text-white pr-6">
                  {faq.question}
                </h3>
                <div
                  className={`text-2xl text-gray-400 transition-transform duration-300 ${
                    isItemOpen(index) ? "rotate-180" : ""
                  }`}
                >
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
                    className="feather feather-chevron-down"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isItemOpen(index)
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 pt-0">
                  <div className="h-px w-full bg-gradient-to-r from-gray-800/60 to-transparent mb-4"></div>
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
