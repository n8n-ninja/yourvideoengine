import { Audio, interpolate, useVideoConfig } from "remotion";

type AudioWithFadeProps = {
  src: string;
  maxVolume?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
};

export const AudioWithFade: React.FC<AudioWithFadeProps> = ({
  src,
  maxVolume = 1,
  fadeInDuration = 10,
  fadeOutDuration = 10,
}) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <Audio
      src={src}
      volume={(frame) =>
        interpolate(
          frame,
          [
            0,
            fadeInDuration,
            durationInFrames - fadeOutDuration,
            durationInFrames,
          ],
          [0, maxVolume, maxVolume, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      }
    />
  );
};
