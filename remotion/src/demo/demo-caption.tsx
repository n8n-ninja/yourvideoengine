import { Composition } from "remotion"
import { SceneType } from "@/schemas/project"
import {
  ProjectComposition,
  calculateMetadata,
} from "@/compositions/ProjectComposition"
import { Storyboard } from "@/schemas/project"

const sampleWords = [
  { word: "an", start: 0.24, end: 0.56, confidence: 0.9003301 },
  { word: "intelligent", start: 0.56, end: 1.04, confidence: 0.9968802 },
  { word: "workflow", start: 1.04, end: 1.5999999, confidence: 0.99087054 },
  { word: "that", start: 1.5999999, end: 1.92, confidence: 0.9981071 },
  { word: "starts", start: 1.92, end: 2.24, confidence: 0.99966526 },
  { word: "with", start: 2.24, end: 2.48, confidence: 0.9998723 },
  { word: "your", start: 2.48, end: 2.6399999, confidence: 0.9996111 },
  { word: "ideas", start: 2.6399999, end: 3.04, confidence: 0.9998356 },
  { word: "and", start: 3.04, end: 3.28, confidence: 0.99221814 },
  { word: "delivers", start: 3.28, end: 3.76, confidence: 0.99963415 },
  { word: "finished", start: 3.76, end: 4.24, confidence: 0.99925464 },
  { word: "videos", start: 4.24, end: 4.7999997, confidence: 0.9993401 },
  { word: "with", start: 4.7999997, end: 5.12, confidence: 0.9922294 },
  { word: "identity", start: 5.12, end: 6, confidence: 0.9761163 },
  { word: "consistency", start: 6, end: 6.7999997, confidence: 0.8541879 },
  { word: "and", start: 6.7999997, end: 6.8799996, confidence: 0.9997956 },
  { word: "efficiency", start: 6.8799996, end: 7.44, confidence: 0.9948331 },
]

const CAMERA_URL =
  "https://diwa7aolcke5u.cloudfront.net/uploads/4e629c9b-f4f9-4628-9cc5-d561d477dbdd.mp4"

const makeScene = (timeline: any[], duration = 8): SceneType => ({
  duration,
  layers: [
    {
      type: "camera",
      url: CAMERA_URL,
    },
    ...timeline,
  ],
})

const scenes: SceneType[] = [
  makeScene([
    {
      type: "title",
      title: "Simple captions",
      position: { bottom: 75 },
    },
    {
      type: "caption",
      words: sampleWords,
      combineTokensWithinMilliseconds: 800,
      position: { top: 50 },
    },
  ]),
  makeScene([
    {
      type: "title",
      title: "Captions with long sentences",
      position: { bottom: 75 },
    },
    {
      type: "caption",
      words: sampleWords,
      combineTokensWithinMilliseconds: 2000,
      position: { top: 50 },
    },
  ]),
  makeScene([
    {
      type: "title",
      title: "Or word by word",
      position: { bottom: 75 },
    },
    {
      type: "caption",
      words: sampleWords,
      combineTokensWithinMilliseconds: 0,
      position: { top: 50 },
    },
  ]),
  makeScene([
    {
      type: "title",
      title: "Custom color",
      position: { bottom: 75 },
    },
    {
      type: "caption",
      words: sampleWords,
      combineTokensWithinMilliseconds: 0,
      activeWordStyle: "color: #E16E79",
      position: { top: 50 },
    },
  ]),
  makeScene([
    {
      type: "title",
      title: "Uppercase",
      position: { bottom: 75 },
    },
    {
      type: "caption",
      words: sampleWords,
      combineTokensWithinMilliseconds: 800,
      textStyle: "textTransform: uppercase;",
      position: { top: 50 },
    },
  ]),
  makeScene([
    {
      type: "title",
      title: "MultiColors",
      position: { bottom: 75 },
    },
    {
      type: "caption",
      words: sampleWords,
      position: { top: 50 },
      multiColors: ["#008F3E", "#FF321A", "#25789E"],
    },
  ]),
  makeScene([
    {
      type: "title",
      title: "Active word effects",
      position: { bottom: 75 },
    },
    {
      type: "caption",
      words: sampleWords,
      boxStyle: "background: transparent;",
      textStyle: "color: white; fontFamily: 'Serif'; fontWeight: 100",
      position: { top: 50, left: 50, right: 50, bottom: 50 },
      activeWordStyle: "color: #00CF00; transform: scale(1.2) skewX(-10deg);",
    },
  ]),
  makeScene([
    {
      type: "title",
      title: "No active word effects",
      position: { bottom: 75 },
    },
    {
      type: "caption",
      words: sampleWords,
      position: { top: 50 },
      boxStyle: "background: transparent;",
      textStyle: "color: white; fontFamily: 'Verdana'; fontWeight: 100",
      activeWordStyle: "color: white;",
    },
  ]),
  makeScene([
    {
      type: "title",
      title: "Custom container styling",
      position: { bottom: 75 },
    },
    {
      type: "caption",
      words: sampleWords,
      position: { top: 70 },
      containerStyle:
        "background: rgba(0,0,0,0.5); padding: 0px; backdropFilter: blur(10px);",
      boxStyle: "background: transparent;",
      textStyle: "color: white; fontFamily: 'Serif'; fontWeight: 100",
      activeWordStyle:
        "color: white; textDecoration: underline; color: #ed0909;",
    },
  ]),
  makeScene([
    {
      type: "title",
      title: "Bottom align",
      position: { bottom: 75 },
    },
    {
      type: "caption",
      words: sampleWords,
      position: { bottom: 0, verticalAlign: "end" },
    },
  ]),
  makeScene([
    {
      type: "title",
      title: "top align",
      position: { top: 75 },
    },
    {
      type: "caption",
      words: sampleWords,
      position: { bottom: 50, verticalAlign: "start" },
    },
  ]),
  makeScene([
    {
      type: "title",
      title: "Custom alignement",
      position: { bottom: 75 },
      style: "fontWeight: 400; fontSize: 70px; ",
    },
    {
      type: "caption",
      words: sampleWords,
      position: { bottom: 0, right: 40, top: 50 },
      boxStyle: "textAlign: left; margin: 0; borderRadius: 0; ",
      textStyle: "fontSize: 50px; fontWeight: 400;",
    },
  ]),
  makeScene([
    {
      type: "title",
      title: "Float effect",
      position: { bottom: 75 },
    },
    {
      type: "caption",
      words: sampleWords,
      position: { top: 50 },
      effects: [{ type: "float", options: { amplitude: 0.5, speed: 0.5 } }],
    },
  ]),
  makeScene([
    {
      type: "title",
      title: "Tilt3D effect",
      position: { bottom: 75 },
    },
    {
      type: "caption",
      words: sampleWords,
      position: { top: 50 },
      effects: [{ type: "tilt3D", options: { amplitude: 0.1, speed: 0.1 } }],
    },
  ]),
]

export const DemoCaption = ({
  fps = 30,
  width = 1080,
  height = 1920,
}: {
  fps?: number
  width?: number
  height?: number
}) => {
  return (
    <Composition
      id="DemoCaption"
      component={ProjectComposition}
      durationInFrames={scenes.length * 30}
      fps={fps}
      width={width}
      height={height}
      schema={Storyboard}
      calculateMetadata={calculateMetadata}
      defaultProps={{
        tracks: scenes,
      }}
    />
  )
}
