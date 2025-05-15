import {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions"
import { Audio } from "remotion"

/**
 * Wraps a Remotion transition presentation to add a sound effect when entering.
 * The sound is played only when the presentationDirection is 'entering'.
 *
 * @template T The props type for the transition presentation.
 * @param transition The original transition presentation.
 * @param src The audio file source URL.
 * @returns A new TransitionPresentation with the sound effect added.
 */
export function addSound<T extends Record<string, unknown>>(
  transition: TransitionPresentation<T>,
  src: string,
): TransitionPresentation<T> {
  const { component: Component, ...other } = transition

  const C = Component as React.FC<TransitionPresentationComponentProps<T>>

  const NewComponent: React.FC<TransitionPresentationComponentProps<T>> = (
    p,
  ) => {
    return (
      <>
        {p.presentationDirection === "entering" ? (
          <Audio src={src} volume={0.2} />
        ) : null}
        <C {...p} />
      </>
    )
  }

  return {
    component: NewComponent,
    ...other,
  }
}
