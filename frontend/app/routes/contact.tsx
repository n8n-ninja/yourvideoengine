import type { MetaFunction } from "@remix-run/cloudflare"
import { Form, Link, useNavigate } from "@remix-run/react"
import { useState } from "react"
import { GlowyTitle } from "~/components/ui/glowy-title"
import { FancyButton } from "~/components/ui/fancy-button"
import * as gtag from "~/utils/gtags.client"

export const meta: MetaFunction = () => {
  return [
    { title: "Contact - YourVideoEngine" },
    {
      name: "description",
      content: "Contactez-nous pour toute question ou demande d'information",
    },
  ]
}

export default function Contact() {
  const [formData, setFormData] = useState({
    mainGoal: "",
    profile: "",
    industry: "",
    videoTypes: [] as string[],
    production: [] as string[],
    vision: "",
    name: "",
    email: "",
    phone: "",
    website: "",
  })
  const [showOtherVideoType, setShowOtherVideoType] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState("")
  const navigate = useNavigate()

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.mainGoal) newErrors.mainGoal = "This field is required. 1"
    if (!formData.profile) newErrors.profile = "This field is required. 2"
    if (!formData.videoTypes || formData.videoTypes.length === 0)
      newErrors.videoTypes = "At least one type is required. 3"
    if (!formData.production || formData.production.length === 0)
      newErrors.production = "At least one option is required. 4"
    if (!formData.vision) newErrors.vision = "This field is required. 5"
    if (!formData.name) newErrors.name = "This field is required. 6"
    if (!formData.email) newErrors.email = "This field is required. 7"
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return

    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)

    gtag.event({
      action: "submit_form",
      category: "Contact",
      label: formData.industry + " " + formData.profile,
    })

    try {
      const response = await fetch(
        "https://n8n.the-aitelier.com/webhook/your-video-engine/submit-form",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      )
      if (!response.ok) throw new Error("Erreur lors de l'envoi du formulaire.")
      navigate("/confirmation")
    } catch (err) {
      setGlobalError(
        "Une erreur est survenue lors de l'envoi. Veuillez réessayer."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-12 text-center">
        <Link
          to="/"
          className="inline-block text-2xl font-bold bg-gradient-to-r from-white via-purple-300 to-pink-200 bg-clip-text text-transparent hover:from-pink-200 hover:via-purple-300 hover:to-white transition-all duration-300"
        >
          Your Video Engine
        </Link>
      </div>

      <GlowyTitle size="xl" className="text-center mb-16">
        Let&apos;s create something amazing together
      </GlowyTitle>

      <Form method="post" className="space-y-8" onSubmit={handleSubmit}>
        {globalError && (
          <div className="text-red-500 text-center mb-4">{globalError}</div>
        )}
        {/* Main Goal */}
        <div
          className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30 transition-all duration-500 transform`}
        >
          <label
            htmlFor="mainGoal"
            className="block text-lg font-medium text-gray-300 mb-3"
          >
            1. What&apos;s your #1 goal with video automation?
          </label>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
            id="mainGoal"
            role="radiogroup"
          >
            {[
              { emoji: "⏳", value: "save time", label: "Save time" },
              {
                emoji: "📈",
                value: "scale",
                label: "Scale content production",
              },
              {
                emoji: "🎯",
                value: "quality",
                label: "Improve content quality",
              },
              {
                emoji: "📆",
                value: "frequency",
                label: "Publish more frequently",
              },
              {
                emoji: "🌍",
                value: "reach",
                label: "Reach new platforms / audiences",
              },
              {
                emoji: "🤔",
                value: "exploring",
                label: "Not sure yet — just exploring",
              },
            ].map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`mainGoal-${option.value}`}
                  name="mainGoal"
                  value={option.value}
                  required
                  className="sr-only peer"
                  aria-label={option.label}
                  onChange={() => handleInputChange("mainGoal", option.value)}
                />
                <label
                  htmlFor={`mainGoal-${option.value}`}
                  className="w-full p-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700/50 peer-checked:bg-blue-500/20 peer-checked:border-blue-500 peer-checked:text-white transition-all cursor-pointer flex items-center peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-gray-900"
                >
                  <span className="text-xl mr-2">{option.emoji}</span>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          {errors.mainGoal && (
            <p className="text-red-500 text-sm mt-2">{errors.mainGoal}</p>
          )}
        </div>

        {/* Profile Type */}
        <div
          className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30 transition-all duration-500 transform`}
        >
          <label
            htmlFor="profile"
            className="block text-lg font-medium text-gray-300 mb-3"
          >
            2. Which best describes you?
          </label>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
            id="profile"
            role="radiogroup"
          >
            {[
              { emoji: "🎥", value: "creator", label: "Content creator" },
              { emoji: "🏢", value: "business", label: "Small business" },
              { emoji: "💼", value: "marketing", label: "Marketing team" },
              { emoji: "🧠", value: "agency", label: "Agency / Consultant" },
              { emoji: "🚀", value: "startup", label: "Startup" },
              { emoji: "🤷‍♂️", value: "exploring", label: "Just exploring" },
            ].map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`profile-${option.value}`}
                  name="profile"
                  value={option.value}
                  required
                  className="sr-only peer"
                  aria-label={option.label}
                  onChange={() => handleInputChange("profile", option.value)}
                />
                <label
                  htmlFor={`profile-${option.value}`}
                  className="w-full p-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700/50 peer-checked:bg-blue-500/20 peer-checked:border-blue-500 peer-checked:text-white transition-all cursor-pointer flex items-center peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-gray-900"
                >
                  <span className="text-xl mr-2">{option.emoji}</span>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          {errors.profile && (
            <p className="text-red-500 text-sm mt-2">{errors.profile}</p>
          )}
        </div>

        {/* Industry */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30 transition-all duration-500 transform">
          <label
            htmlFor="industry"
            className="block text-lg font-medium text-gray-300 mb-3"
          >
            3. What is your industry?
          </label>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
            id="industry"
            role="radiogroup"
          >
            {[
              { emoji: "💻", value: "Technology", label: "Technology" },
              { emoji: "🏥", value: "Healthcare", label: "Healthcare" },
              { emoji: "🎓", value: "Education", label: "Education" },
              { emoji: "🎬", value: "Entertainment", label: "Entertainment" },
              { emoji: "🛒", value: "Retail", label: "Retail" },
              { emoji: "🏭", value: "Manufacturing", label: "Manufacturing" },
              {
                emoji: "💰",
                value: "Financial Services",
                label: "Financial Services",
              },
              { emoji: "🏠", value: "Real Estate", label: "Real Estate" },
              { emoji: "❤️", value: "Non-Profit", label: "Non-Profit" },
              { emoji: "🧩", value: "Other", label: "Other" },
            ].map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`industry-${option.value}`}
                  name="industry"
                  value={option.value}
                  required
                  className="sr-only peer"
                  aria-label={option.label}
                  onChange={() => handleInputChange("industry", option.value)}
                />
                <label
                  htmlFor={`industry-${option.value}`}
                  className="w-full p-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700/50 peer-checked:bg-blue-500/20 peer-checked:border-blue-500 peer-checked:text-white transition-all cursor-pointer flex items-center peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-gray-900"
                >
                  <span className="text-xl mr-2">{option.emoji}</span>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          {errors.industry && (
            <p className="text-red-500 text-sm mt-2">{errors.industry}</p>
          )}
        </div>

        {/* Video Types */}
        <div
          className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30 transition-all duration-500 transform`}
        >
          <label
            htmlFor="videoTypes"
            className="block text-lg font-medium text-gray-300 mb-3"
          >
            4. What kind of videos do you dream of automating?
          </label>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
            id="videoTypes"
            role="group"
          >
            {[
              { emoji: "🎬", value: "demos", label: "Product demos" },
              {
                emoji: "🧑‍🏫",
                value: "educational",
                label: "Educational / tutorials",
              },
              { emoji: "📈", value: "news", label: "News & updates" },
              { emoji: "📱", value: "short-form", label: "TikToks / Reels" },
              {
                emoji: "🎤",
                value: "reviews",
                label: "Reviews / interviews",
              },
              { emoji: "✨", value: "other", label: "Other" },
            ].map((type) => (
              <div key={type.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`videoType-${type.value}`}
                  name="videoTypes"
                  value={type.value}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...formData.videoTypes, type.value]
                      : formData.videoTypes.filter((v) => v !== type.value)
                    handleInputChange("videoTypes", newValue)
                    if (type.value === "other") {
                      setShowOtherVideoType(e.target.checked)
                    }
                  }}
                  className="sr-only peer"
                  aria-label={type.label}
                />
                <label
                  htmlFor={`videoType-${type.value}`}
                  className="w-full p-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700/50 peer-checked:bg-blue-500/20 peer-checked:border-blue-500 peer-checked:text-white transition-all cursor-pointer flex items-center peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-gray-900"
                >
                  <span className="text-xl mr-2">{type.emoji}</span>
                  {type.label}
                </label>
              </div>
            ))}
          </div>
          {showOtherVideoType && (
            <input
              type="text"
              name="otherVideoType"
              placeholder="Tell us more..."
              className="w-full mt-3 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          )}
          {errors.videoTypes && (
            <p className="text-red-500 text-sm mt-2">{errors.videoTypes}</p>
          )}
        </div>

        {/* Current Production */}
        <div
          className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30 transition-all duration-500 transform`}
        >
          <label
            htmlFor="production"
            className="block text-lg font-medium text-gray-300 mb-3"
          >
            5. How are you producing videos today?
          </label>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
            id="production"
            role="group"
          >
            {[
              {
                emoji: "🧠",
                value: "idea generation",
                label: "I come up with ideas",
              },
              {
                emoji: "📝",
                value: "script writing",
                label: "I write scripts",
              },
              { emoji: "🎥", value: "video shooting", label: "I shoot video" },
              {
                emoji: "✂️",
                value: "manual editing",
                label: "I edit manually",
              },
              { emoji: "🤖", value: "ai tools", label: "I use AI tools" },
              {
                emoji: "🚫",
                value: "no video yet",
                label: "I don't make videos yet",
              },
            ].map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`production-${option.value}`}
                  name="production"
                  value={option.value}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...formData.production, option.value]
                      : formData.production.filter((v) => v !== option.value)
                    handleInputChange("production", newValue)
                  }}
                  className="sr-only peer"
                  aria-label={option.label}
                />
                <label
                  htmlFor={`production-${option.value}`}
                  className="w-full p-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700/50 peer-checked:bg-blue-500/20 peer-checked:border-blue-500 peer-checked:text-white transition-all cursor-pointer flex items-center peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-gray-900"
                >
                  <span className="text-xl mr-2">{option.emoji}</span>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          {errors.production && (
            <p className="text-red-500 text-sm mt-2">{errors.production}</p>
          )}
        </div>

        {/* Vision */}
        <div
          className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30 transition-all duration-500 transform`}
        >
          <label
            htmlFor="vision"
            className="block text-lg font-medium text-gray-300 mb-3"
          >
            6. What is your vision for the video?
          </label>
          <textarea
            id="vision"
            name="vision"
            required
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onChange={(e) => handleInputChange("vision", e.target.value)}
          />
          {errors.vision && (
            <p className="text-red-500 text-sm mt-2">{errors.vision}</p>
          )}
        </div>

        {/* Name and Email */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30 transition-all duration-500 transform">
          <label
            htmlFor="name"
            className="block text-lg font-medium text-gray-300 mb-2"
          >
            And finally, what is your name?
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full mb-7 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onChange={(e) => handleInputChange("name", e.target.value)}
          />

          <label
            htmlFor="email"
            className="block text-lg font-medium text-gray-300 mb-2"
          >
            and email?
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full mb-7 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onChange={(e) => handleInputChange("email", e.target.value)}
          />

          <label
            htmlFor="phone"
            className="block text-lg font-medium text-gray-300 mb-2"
          >
            Phone number{" "}
            <span className="text-gray-400 text-sm">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full mb-7 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Optional"
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />

          <label
            htmlFor="website"
            className="block text-lg font-medium text-gray-300 mb-2"
          >
            Website <span className="text-gray-400 text-sm">(optional)</span>
          </label>
          <input
            type="url"
            id="website"
            name="website"
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Optional"
            onChange={(e) => handleInputChange("website", e.target.value)}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-2">{errors.name}</p>
          )}
          {errors.email && (
            <p className="text-red-500 text-sm mt-2">{errors.email}</p>
          )}
        </div>

        <div className="mt-12">
          <FancyButton
            type="submit"
            className="w-full text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin opacity-70"></span>
                <span>ENVOI…</span>
              </span>
            ) : (
              "Submit your project"
            )}
          </FancyButton>
        </div>
      </Form>
    </div>
  )
}
