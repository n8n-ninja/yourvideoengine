import { useState } from "react"

export interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
}

export interface TestimonialsProps {
  title: string
  description: string[]
  testimonials: Testimonial[]
}

export function Testimonials({
  title,
  description,
  testimonials,
}: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Navigation entre les témoignages
  const goToTestimonial = (index: number) => {
    setActiveIndex(index)
  }

  // Témoignage précédent
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    )
  }

  // Témoignage suivant
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    )
  }

  return (
    <div className="w-full bg-gradient-to-b from-blue-950/40 to-purple-950/30 backdrop-blur-md py-16 md:py-32 relative overflow-hidden border-t border-b border-blue-800/20">
      {/* Bordure supérieure décorative avec dégradé */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

      {/* Bordure inférieure décorative avec dégradé */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/5 blur-3xl"></div>
      </div>

      <section className="relative z-10 w-full px-6 md:px-12">
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

          <div className="relative">
            {/* Témoignage actif */}
            <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/60 backdrop-blur-md border border-gray-800/40 rounded-xl p-8 md:p-12 shadow-lg">
              <div className="mb-6">
                <svg
                  className="w-10 h-10 text-pink-500/60"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.89.41-2.8.303-.9.688-1.698 1.16-2.396.718-.991 1.34-1.799 1.865-2.425.284-.336.57-.688.86-1.055.276-.358.556-.712.838-1.06.15-.165.288-.345.416-.544.128-.2.248-.394.36-.584.297-.506.455-.987.455-1.435 0-.35-.077-.66-.23-.93-.148-.272-.356-.49-.627-.656-.26-.166-.55-.258-.86-.258-.21 0-.41.039-.6.117-.19.078-.36.18-.51.309-.16.12-.3.268-.42.443-.12.175-.21.357-.27.544-.32.679-.67 1.326-1.04 1.942-.38.617-.76 1.202-1.14 1.754-.66.899-1.22 1.765-1.7 2.6-.48.834-.89 1.681-1.22 2.54-.4 1.028-.65 2.067-.76 3.115-.11 1.048-.11 2.096 0 3.145.08.679.22 1.337.43 1.976.2.638.48 1.196.83 1.672.36.504.81.912 1.35 1.221.56.31 1.2.465 1.93.465.38 0 .76-.05 1.15-.148.39-.099.75-.243 1.09-.432.34-.19.65-.413.92-.673.26-.26.47-.545.63-.858.35-.688.53-1.416.53-2.187zm8.517 0c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.89.41-2.8.31-.9.69-1.698 1.16-2.396.73-.991 1.35-1.799 1.87-2.425.29-.336.57-.688.86-1.055.28-.358.56-.712.84-1.06.16-.165.29-.345.43-.544.12-.2.24-.394.36-.584.29-.506.45-.987.45-1.435 0-.35-.08-.66-.23-.93-.15-.272-.36-.49-.63-.656-.26-.166-.55-.258-.86-.258-.21 0-.41.039-.6.117-.19.078-.36.18-.51.309-.15.12-.3.268-.42.443-.12.175-.21.357-.27.544-.33.679-.67 1.326-1.04 1.942-.38.617-.76 1.202-1.15 1.754-.66.899-1.22 1.765-1.7 2.6-.48.834-.88 1.681-1.21 2.54-.4 1.028-.65 2.067-.76 3.115-.11 1.048-.11 2.096 0 3.145.08.679.22 1.337.43 1.976.21.638.48 1.196.84 1.672.36.504.81.912 1.35 1.221.55.31 1.2.465 1.92.465.38 0 .76-.05 1.15-.148.39-.099.75-.243 1.09-.432.34-.19.64-.413.92-.673.27-.26.47-.545.63-.858.35-.688.52-1.416.52-2.187z" />
                </svg>
              </div>
              <p className="text-xl md:text-2xl text-gray-100 italic mb-8 leading-relaxed">
                {testimonials[activeIndex].quote}
              </p>
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                  {testimonials[activeIndex].author[0]}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-white">
                    {testimonials[activeIndex].author}
                  </h4>
                  <p className="text-gray-400">
                    {testimonials[activeIndex].role},{" "}
                    {testimonials[activeIndex].company}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 bg-gray-900/80 backdrop-blur-md h-10 w-10 rounded-full flex items-center justify-center text-white border border-gray-700 hover:bg-gray-800 transition-colors duration-300"
              aria-label="Previous testimonial"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 bg-gray-900/80 backdrop-blur-md h-10 w-10 rounded-full flex items-center justify-center text-white border border-gray-700 hover:bg-gray-800 transition-colors duration-300"
              aria-label="Next testimonial"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Indicateurs */}
          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === activeIndex ? "bg-pink-500" : "bg-gray-600"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
