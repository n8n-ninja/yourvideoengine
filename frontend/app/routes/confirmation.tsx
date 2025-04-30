import { GlowyTitle } from "~/components/ui/glowy-title"
import { Link } from "@remix-run/react"

export default function Confirmation() {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-gray-900/80 rounded-2xl shadow-2xl border border-gray-700/40 px-10 py-16 max-w-xl w-full text-center">
        <GlowyTitle size="xl" className="mb-10">
          Merci
        </GlowyTitle>
        <p className="text-xl text-gray-200 mb-8 text-balance">
          We have received your demand and will follow up quickly.
        </p>
        <Link
          to="/"
          className="inline-block mt-4 px-8 py-4 rounded-lg border-2 border-pink-400 text-white font-semibold hover:bg-pink-400/10 transition-all duration-200"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  )
}
