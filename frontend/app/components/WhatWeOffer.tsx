import React, { useState } from "react"
import { FiftyFifty } from "./FiftyFifty"
import { Dialog } from "@headlessui/react"

interface WhatWeOfferProps {
  children: React.ReactNode
}

export function WhatWeOffer({ children }: WhatWeOfferProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const videoImage = (
    <img
      src="/video-sales-letter.webp"
      alt="Watch our presentation"
      className="w-full h-full object-cover rounded-lg"
    />
  )
  const videoThumbnail = (
    <button
      className="w-full h-full focus:outline-none p-3"
      onClick={openModal}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          openModal()
        }
      }}
      aria-label="Open presentation video"
    >
      <div className=" relative w-full h-full min-h-[300px] group overflow-hidden rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:border-white/30">
        <img
          src="/video-sales-letter.webp"
          alt="Watch our presentation"
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 shadow-lg">
          <p className="text-white font-medium">Watch presentation</p>
        </div>
      </div>
    </button>
  )

  return (
    <>
      <FiftyFifty
        imagePosition="right"
        colorTheme="purple"
        imageContent={videoImage}
      >
        {children}
      </FiftyFifty>

      {/* <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-[0_0_25px_5px_rgba(255,255,255,0.15),0_0_10px_1px_rgba(255,140,255,0.3)] border border-white/20">
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/80 border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                aria-label="Close video"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="aspect-video">
                <video
                  className="w-full h-full object-cover"
                  src="https://aiatelier.s3.eu-west-1.amazonaws.com/temporary-uploads/1746165300012-preview_video_target.mp4"
                  autoPlay
                  controls
                  playsInline
                  onCanPlay={(e) => e.currentTarget.play()}
                >
                  <track
                    kind="captions"
                    src=""
                    label="English"
                    srcLang="en"
                    default
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog> */}
    </>
  )
}
