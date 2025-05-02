import React from "react"
import { FiftyFifty } from "./FiftyFifty"
import { HighlightBox } from "~/components/ui/highlight-box"
import { FormattedText } from "./FormattedText"

interface ValuePropositionProps {
  children: React.ReactNode
  highlightText: string
}

export function ValueProposition({
  children,
  highlightText,
}: ValuePropositionProps) {
  const statContent = (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <div className="text-center mb-8 transform transition-all duration-700 hover:scale-105">
        <div className="mb-4 opacity-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-blue-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight leading-tight">
          Save up to{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            97%
          </span>
        </h3>
        <p className="text-xl md:text-2xl text-blue-200 font-light">
          of your video production time
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto my-6 rounded-full"></div>
      </div>

      <div className="w-full max-w-md mx-auto">
        <HighlightBox>
          <p className="text-lg text-left text-gray-100">
            <FormattedText text={highlightText} />
          </p>
        </HighlightBox>
      </div>
    </div>
  )

  return (
    <FiftyFifty
      imagePosition="left"
      colorTheme="blue"
      imageContent={statContent}
    >
      {children}
    </FiftyFifty>
  )
}
