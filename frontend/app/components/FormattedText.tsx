import { ReactNode } from "react"

interface FormattedTextProps {
  text: string
}

export function FormattedText({ text }: FormattedTextProps): ReactNode {
  const formattedText = text.replace(
    /\*\*(.*?)\*\*/g,
    '<b class="text-pink-400">$1</b>'
  )

  return <span dangerouslySetInnerHTML={{ __html: formattedText }} />
}
