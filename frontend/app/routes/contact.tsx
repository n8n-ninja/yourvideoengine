import type { MetaFunction } from "@remix-run/cloudflare"
import { Form, Link } from "@remix-run/react"
import { useState } from "react"
import { GlowyTitle } from "~/components/ui/glowy-title"
import { FancyButton } from "~/components/ui/fancy-button"

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
  const [showOtherVideoType, setShowOtherVideoType] = useState(false)

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

      <Form method="post" className="space-y-8">
        {/* Main Goal */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30">
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
              { emoji: "⏳", value: "saveTime", label: "Save time" },
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
        </div>

        {/* Profile Type */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30">
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
        </div>

        {/* Video Types */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30">
          <label
            htmlFor="videoTypes"
            className="block text-lg font-medium text-gray-300 mb-3"
          >
            3. What kind of videos do you dream of automating?
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
              { emoji: "🎤", value: "reviews", label: "Reviews / interviews" },
              { emoji: "✨", value: "other", label: "Other" },
            ].map((type) => (
              <div key={type.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`videoType-${type.value}`}
                  name="videoTypes"
                  value={type.value}
                  onChange={(e) =>
                    type.value === "other" &&
                    setShowOtherVideoType(e.target.checked)
                  }
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
        </div>

        {/* Current Production */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30">
          <label
            htmlFor="production"
            className="block text-lg font-medium text-gray-300 mb-3"
          >
            4. How are you producing videos today?
          </label>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
            id="production"
            role="group"
          >
            {[
              { emoji: "🧠", value: "ideas", label: "I come up with ideas" },
              { emoji: "📝", value: "scripts", label: "I write scripts" },
              { emoji: "🎥", value: "shoot", label: "I shoot video" },
              { emoji: "✂️", value: "edit", label: "I edit manually" },
              { emoji: "🤖", value: "ai", label: "I use AI tools" },
              { emoji: "🚫", value: "none", label: "I don't make videos yet" },
            ].map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`production-${option.value}`}
                  name="production"
                  value={option.value}
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
        </div>

        {/* Video System Vision */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30">
          <label
            htmlFor="vision"
            className="block text-lg font-medium text-gray-300 mb-2"
          >
            5. What kind of video system are you imagining?
          </label>
          <textarea
            id="vision"
            name="vision"
            rows={3}
            placeholder="Tell us in your own words what you'd love to build or automate."
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Name */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30">
          <label
            htmlFor="name"
            className="block text-lg font-medium text-gray-300 mb-2"
          >
            What is your name?
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full mb-7 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />

          <label
            htmlFor="email"
            className="block text-lg font-medium text-gray-300 mb-2"
          >
            What is your email?
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="mt-12">
          <FancyButton type="submit" className="w-full text-lg">
            Submit your project
          </FancyButton>
        </div>
      </Form>
    </div>
  )
}
