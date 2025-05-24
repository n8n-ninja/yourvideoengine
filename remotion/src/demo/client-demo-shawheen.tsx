import { Composition } from "remotion"
import { Storyboard } from "@/schemas/project"
import {
  ProjectComposition,
  calculateMetadata,
} from "@/compositions/ProjectComposition"

const URL_INTRO =
  "https://diwa7aolcke5u.cloudfront.net/uploads/shawheen-yve-demohook.mp4"
const URL_BODY =
  "https://diwa7aolcke5u.cloudfront.net/uploads/shawheen-yve-demobody.mp4"
const URL_OUTRO =
  "https://diwa7aolcke5u.cloudfront.net/uploads/shawheen-yve-demooutro.mp4"

const BROL_URL_1 =
  "https://diwa7aolcke5u.cloudfront.net/uploads/shawheen-yve-demo1b7cb741-74bf-40e1-b680-be0d5273f023.mp4"
const BROL_URL_2 =
  "https://diwa7aolcke5u.cloudfront.net/uploads/shawheen-yve-demo2a8cd05d-c9d1-4197-803a-58503f651c2c.mp4"
const BROL_URL_3 =
  "https://diwa7aolcke5u.cloudfront.net/uploads/shawheen-yve-demo3d0a3e33-d053-4e0b-8a21-2cf84c035b02.mp4"
const BROL_URL_4 =
  "https://diwa7aolcke5u.cloudfront.net/uploads/shawheen-yve-demo3fe49942-f423-4de9-9ad0-b2a9f9d6e290.mp4"
const BROL_URL_5 =
  "https://diwa7aolcke5u.cloudfront.net/uploads/shawheen-yve-demo5788a189-0560-449b-8ac8-fbdf6eda2d4f.mp4"
const BROL_URL_6 =
  "https://diwa7aolcke5u.cloudfront.net/uploads/shawheen-yve-demo7d5342dd-493a-498f-b837-b7b626ec30ed.mp4"

const MUSIC_URL =
  "https://diwa7aolcke5u.cloudfront.net/uploads/1748099564616-mbgrk0.mp3"

const introWords = [
  {
    word: "have",
    start: 0,
    end: 0.48,
    confidence: 0.99370146,
  },
  {
    word: "you",
    start: 0.48,
    end: 0.64,
    confidence: 0.9999436,
  },
  {
    word: "ever",
    start: 0.64,
    end: 0.79999995,
    confidence: 0.9997429,
  },
  {
    word: "wondered",
    start: 0.79999995,
    end: 1.12,
    confidence: 0.9998821,
  },
  {
    word: "about",
    start: 1.12,
    end: 1.28,
    confidence: 0.99990296,
  },
  {
    word: "the",
    start: 1.28,
    end: 1.4399999,
    confidence: 0.9998406,
  },
  {
    word: "charm",
    start: 1.4399999,
    end: 1.76,
    confidence: 0.9999211,
  },
  {
    word: "and",
    start: 1.76,
    end: 2,
    confidence: 0.9995702,
  },
  {
    word: "variety",
    start: 2,
    end: 2.32,
    confidence: 0.99995375,
  },
  {
    word: "of",
    start: 2.32,
    end: 2.48,
    confidence: 0.9997813,
  },
  {
    word: "houses",
    start: 2.48,
    end: 2.8799999,
    confidence: 0.9997795,
  },
  {
    word: "nestled",
    start: 2.8799999,
    end: 3.28,
    confidence: 0.99967194,
  },
  {
    word: "in",
    start: 3.28,
    end: 3.4399998,
    confidence: 0.99979216,
  },
  {
    word: "city",
    start: 3.4399998,
    end: 3.76,
    confidence: 0.99746144,
  },
  {
    word: "areas",
    start: 3.76,
    end: 4.4,
    confidence: 0.9826632,
  },
  {
    word: "from",
    start: 4.64,
    end: 4.88,
    confidence: 0.9997008,
  },
  {
    word: "grand",
    start: 4.88,
    end: 5.2,
    confidence: 0.99892646,
  },
  {
    word: "abodes",
    start: 5.2,
    end: 5.6,
    confidence: 0.99077225,
  },
  {
    word: "to",
    start: 5.6,
    end: 5.8399997,
    confidence: 0.99805284,
  },
  {
    word: "cozy",
    start: 5.8399997,
    end: 6.16,
    confidence: 0.9982109,
  },
  {
    word: "hideaways",
    start: 6.16,
    end: 7.04,
    confidence: 0.99647015,
  },
  {
    word: "city",
    start: 7.04,
    end: 7.3599997,
    confidence: 0.5225239,
  },
  {
    word: "living",
    start: 7.3599997,
    end: 7.68,
    confidence: 0.9988932,
  },
  {
    word: "offers",
    start: 7.68,
    end: 8,
    confidence: 0.9999652,
  },
  {
    word: "it",
    start: 8,
    end: 8.16,
    confidence: 0.99434114,
  },
  {
    word: "all",
    start: 8.16,
    end: 8.4,
    confidence: 0.9961741,
  },
]

const bodyWords = [
  {
    word: "hi",
    start: 0,
    end: 0.56,
    confidence: 0.9950546,
  },
  {
    word: "there",
    start: 0.56,
    end: 1.1199999,
    confidence: 0.8740121,
  },
  {
    word: "i'm",
    start: 1.12,
    end: 1.36,
    confidence: 0.9990154,
  },
  {
    word: "emmanuel",
    start: 1.36,
    end: 1.8399999,
    confidence: 0.89915603,
  },
  {
    word: "bernard",
    start: 1.8399999,
    end: 2.6399999,
    confidence: 0.91035926,
  },
  {
    word: "your",
    start: 2.6399999,
    end: 2.8799999,
    confidence: 0.99784565,
  },
  {
    word: "fun",
    start: 2.8799999,
    end: 3.12,
    confidence: 0.99351656,
  },
  {
    word: "loving",
    start: 3.12,
    end: 3.4399998,
    confidence: 0.99931026,
  },
  {
    word: "real",
    start: 3.4399998,
    end: 3.76,
    confidence: 0.9775392,
  },
  {
    word: "estate",
    start: 3.76,
    end: 4,
    confidence: 0.99981755,
  },
  {
    word: "agent",
    start: 4,
    end: 4.3199997,
    confidence: 0.99975437,
  },
  {
    word: "with",
    start: 4.3199997,
    end: 4.48,
    confidence: 0.9990314,
  },
  {
    word: "hellotest",
    start: 4.48,
    end: 5.52,
    confidence: 0.70418996,
  },
  {
    word: "right",
    start: 5.52,
    end: 5.7599998,
    confidence: 0.99886715,
  },
  {
    word: "here",
    start: 5.7599998,
    end: 6,
    confidence: 0.9996469,
  },
  {
    word: "in",
    start: 6,
    end: 6.24,
    confidence: 0.997619,
  },
  {
    word: "beautiful",
    start: 6.24,
    end: 6.56,
    confidence: 0.99878114,
  },
  {
    word: "lausanne",
    start: 6.56,
    end: 7.44,
    confidence: 0.9968476,
  },
  {
    word: "whether",
    start: 7.9199996,
    end: 8.24,
    confidence: 0.99947506,
  },
  {
    word: "you're",
    start: 8.24,
    end: 8.559999,
    confidence: 0.9958165,
  },
  {
    word: "dreaming",
    start: 8.559999,
    end: 8.88,
    confidence: 0.99991995,
  },
  {
    word: "of",
    start: 8.88,
    end: 9.04,
    confidence: 0.9987478,
  },
  {
    word: "a",
    start: 9.04,
    end: 9.2,
    confidence: 0.99919266,
  },
  {
    word: "big",
    start: 9.2,
    end: 9.44,
    confidence: 0.9995552,
  },
  {
    word: "family",
    start: 9.44,
    end: 9.76,
    confidence: 0.999607,
  },
  {
    word: "home",
    start: 9.76,
    end: 10,
    confidence: 0.9994241,
  },
  {
    word: "or",
    start: 10,
    end: 10.24,
    confidence: 0.97373635,
  },
  {
    word: "a",
    start: 10.24,
    end: 10.4,
    confidence: 0.9894706,
  },
  {
    word: "quaint",
    start: 10.4,
    end: 10.639999,
    confidence: 0.99910766,
  },
  {
    word: "urban",
    start: 10.639999,
    end: 11.04,
    confidence: 0.9937827,
  },
  {
    word: "retreat",
    start: 11.04,
    end: 11.759999,
    confidence: 0.9899597,
  },
  {
    word: "i've",
    start: 11.92,
    end: 12.24,
    confidence: 0.9994184,
  },
  {
    word: "got",
    start: 12.24,
    end: 12.4,
    confidence: 0.9997762,
  },
  {
    word: "you",
    start: 12.4,
    end: 12.48,
    confidence: 0.9994955,
  },
  {
    word: "covered",
    start: 12.48,
    end: 13.119999,
    confidence: 0.9967451,
  },
  {
    word: "having",
    start: 13.599999,
    end: 14,
    confidence: 0.99952817,
  },
  {
    word: "explored",
    start: 14,
    end: 14.4,
    confidence: 0.9999615,
  },
  {
    word: "every",
    start: 14.4,
    end: 14.799999,
    confidence: 0.99958366,
  },
  {
    word: "nook",
    start: 14.799999,
    end: 15.04,
    confidence: 0.9975951,
  },
  {
    word: "of",
    start: 15.04,
    end: 15.2,
    confidence: 0.99837047,
  },
  {
    word: "lausanne",
    start: 15.2,
    end: 15.679999,
    confidence: 0.97247577,
  },
  {
    word: "from",
    start: 16.105,
    end: 16.425,
    confidence: 0.9997378,
  },
  {
    word: "the",
    start: 16.425,
    end: 16.505,
    confidence: 0.99954164,
  },
  {
    word: "vibrant",
    start: 16.505,
    end: 16.904999,
    confidence: 0.9999229,
  },
  {
    word: "city",
    start: 16.904999,
    end: 17.225,
    confidence: 0.9988048,
  },
  {
    word: "center",
    start: 17.225,
    end: 17.545,
    confidence: 0.97135115,
  },
  {
    word: "to",
    start: 17.545,
    end: 17.785,
    confidence: 0.99882954,
  },
  {
    word: "the",
    start: 17.785,
    end: 17.865,
    confidence: 0.99914634,
  },
  {
    word: "charming",
    start: 17.865,
    end: 18.265,
    confidence: 0.9999087,
  },
  {
    word: "outskirts",
    start: 18.265,
    end: 19.144999,
    confidence: 0.9982134,
  },
  {
    word: "i",
    start: 19.305,
    end: 19.465,
    confidence: 0.99988556,
  },
  {
    word: "know",
    start: 19.465,
    end: 19.625,
    confidence: 0.9998865,
  },
  {
    word: "the",
    start: 19.625,
    end: 19.785,
    confidence: 0.9995653,
  },
  {
    word: "city's",
    start: 19.785,
    end: 20.185,
    confidence: 0.9982375,
  },
  {
    word: "housing",
    start: 20.185,
    end: 20.505,
    confidence: 0.9998098,
  },
  {
    word: "market",
    start: 20.505,
    end: 20.825,
    confidence: 0.99990404,
  },
  {
    word: "like",
    start: 20.825,
    end: 21.145,
    confidence: 0.99341714,
  },
  {
    word: "the",
    start: 21.145,
    end: 21.305,
    confidence: 0.99970406,
  },
  {
    word: "back",
    start: 21.305,
    end: 21.465,
    confidence: 0.99994636,
  },
  {
    word: "of",
    start: 21.465,
    end: 21.625,
    confidence: 0.99978083,
  },
  {
    word: "my",
    start: 21.625,
    end: 21.785,
    confidence: 0.9999198,
  },
  {
    word: "hand",
    start: 21.785,
    end: 22.345,
    confidence: 0.99963534,
  },
  {
    word: "imagine",
    start: 23.625,
    end: 23.945,
    confidence: 0.9998234,
  },
  {
    word: "living",
    start: 23.945,
    end: 24.265,
    confidence: 0.9999337,
  },
  {
    word: "in",
    start: 24.265,
    end: 24.425,
    confidence: 0.99986875,
  },
  {
    word: "a",
    start: 24.425,
    end: 24.585,
    confidence: 0.9995142,
  },
  {
    word: "place",
    start: 24.585,
    end: 24.744999,
    confidence: 0.99893636,
  },
  {
    word: "as",
    start: 24.744999,
    end: 24.985,
    confidence: 0.9954531,
  },
  {
    word: "dynamic",
    start: 24.985,
    end: 25.544998,
    confidence: 0.9998288,
  },
  {
    word: "and",
    start: 25.544998,
    end: 25.785,
    confidence: 0.9997899,
  },
  {
    word: "diverse",
    start: 25.785,
    end: 26.185,
    confidence: 0.9997093,
  },
  {
    word: "as",
    start: 26.185,
    end: 26.345,
    confidence: 0.99957246,
  },
  {
    word: "lausanne",
    start: 26.345,
    end: 27.305,
    confidence: 0.9456756,
  },
  {
    word: "where",
    start: 27.544998,
    end: 27.704998,
    confidence: 0.9998555,
  },
  {
    word: "each",
    start: 27.704998,
    end: 28.025,
    confidence: 0.9999523,
  },
  {
    word: "neighborhood",
    start: 28.025,
    end: 28.345,
    confidence: 0.9858394,
  },
  {
    word: "feels",
    start: 28.345,
    end: 28.744999,
    confidence: 0.9999174,
  },
  {
    word: "like",
    start: 28.744999,
    end: 28.904999,
    confidence: 0.9998306,
  },
  {
    word: "a",
    start: 28.904999,
    end: 29.064999,
    confidence: 0.9997427,
  },
  {
    word: "new",
    start: 29.064999,
    end: 29.305,
    confidence: 0.9999614,
  },
  {
    word: "adventure",
    start: 29.305,
    end: 29.625,
    confidence: 0.98771703,
  },
  {
    word: "in",
    start: 30.77,
    end: 31.01,
    confidence: 0.99462587,
  },
  {
    word: "a",
    start: 31.01,
    end: 31.17,
    confidence: 0.9969811,
  },
  {
    word: "city",
    start: 31.17,
    end: 31.41,
    confidence: 0.99697065,
  },
  {
    word: "where",
    start: 31.41,
    end: 31.650002,
    confidence: 0.99402964,
  },
  {
    word: "the",
    start: 31.650002,
    end: 31.810001,
    confidence: 0.9943281,
  },
  {
    word: "big",
    start: 31.810001,
    end: 31.970001,
    confidence: 0.9964725,
  },
  {
    word: "houses",
    start: 31.970001,
    end: 32.45,
    confidence: 0.9988158,
  },
  {
    word: "offer",
    start: 32.45,
    end: 32.850002,
    confidence: 0.99737346,
  },
  {
    word: "expansive",
    start: 32.850002,
    end: 33.49,
    confidence: 0.99718684,
  },
  {
    word: "views",
    start: 33.49,
    end: 33.81,
    confidence: 0.9993279,
  },
  {
    word: "and",
    start: 33.81,
    end: 34.13,
    confidence: 0.98825127,
  },
  {
    word: "endless",
    start: 34.13,
    end: 34.61,
    confidence: 0.9995376,
  },
  {
    word: "potential",
    start: 34.61,
    end: 35.33,
    confidence: 0.9998821,
  },
  {
    word: "and",
    start: 35.49,
    end: 35.73,
    confidence: 0.69468623,
  },
  {
    word: "the",
    start: 35.73,
    end: 35.97,
    confidence: 0.9947448,
  },
  {
    word: "smaller",
    start: 35.97,
    end: 36.29,
    confidence: 0.99788696,
  },
  {
    word: "ones",
    start: 36.29,
    end: 36.61,
    confidence: 0.9908608,
  },
  {
    word: "exude",
    start: 36.61,
    end: 37.010002,
    confidence: 0.99696857,
  },
  {
    word: "charm",
    start: 37.010002,
    end: 37.41,
    confidence: 0.99920136,
  },
  {
    word: "and",
    start: 37.41,
    end: 37.65,
    confidence: 0.9976816,
  },
  {
    word: "efficiency",
    start: 37.65,
    end: 38.53,
    confidence: 0.83258843,
  },
  {
    word: "there's",
    start: 39.010002,
    end: 39.25,
    confidence: 0.952623,
  },
  {
    word: "truly",
    start: 39.25,
    end: 39.65,
    confidence: 0.99821424,
  },
  {
    word: "something",
    start: 39.65,
    end: 40.05,
    confidence: 0.9994783,
  },
  {
    word: "for",
    start: 40.05,
    end: 40.21,
    confidence: 0.99965215,
  },
  {
    word: "everyone",
    start: 40.21,
    end: 40.93,
    confidence: 0.9935926,
  },
  {
    word: "the",
    start: 41.81,
    end: 41.97,
    confidence: 0.99792,
  },
  {
    word: "lush",
    start: 41.97,
    end: 42.29,
    confidence: 0.9995246,
  },
  {
    word: "scenery",
    start: 42.29,
    end: 42.77,
    confidence: 0.99969023,
  },
  {
    word: "and",
    start: 42.77,
    end: 43.010002,
    confidence: 0.9970385,
  },
  {
    word: "beautiful",
    start: 43.010002,
    end: 43.49,
    confidence: 0.991714,
  },
  {
    word: "surroundings",
    start: 43.49,
    end: 44.05,
    confidence: 0.9989099,
  },
  {
    word: "of",
    start: 44.05,
    end: 44.21,
    confidence: 0.99850625,
  },
  {
    word: "zip",
    start: 44.21,
    end: 44.53,
    confidence: 0.57681376,
  },
  {
    word: "code",
    start: 44.53,
    end: 44.77,
    confidence: 0.9962346,
  },
  {
    word: "one",
    start: 44.77,
    end: 45.09,
    confidence: 0.99053603,
  },
  {
    word: "thousand",
    start: 45.09,
    end: 45.33,
    confidence: 0.9986143,
  },
  {
    word: "six",
    start: 45.33,
    end: 46.45,
    confidence: 0.68036216,
  },
  {
    word: "make",
    start: 46.075,
    end: 46.475002,
    confidence: 0.96735615,
  },
  {
    word: "for",
    start: 46.475002,
    end: 46.635002,
    confidence: 0.99935895,
  },
  {
    word: "a",
    start: 46.635002,
    end: 46.795002,
    confidence: 0.99865425,
  },
  {
    word: "delightful",
    start: 46.795002,
    end: 47.355,
    confidence: 0.99974716,
  },
  {
    word: "setting",
    start: 47.355,
    end: 47.835,
    confidence: 0.99843603,
  },
  {
    word: "no",
    start: 47.835,
    end: 48.235,
    confidence: 0.7886694,
  },
  {
    word: "matter",
    start: 48.235,
    end: 48.395,
    confidence: 0.9997837,
  },
  {
    word: "what",
    start: 48.395,
    end: 48.635002,
    confidence: 0.99895006,
  },
  {
    word: "size",
    start: 48.635002,
    end: 48.875,
    confidence: 0.99675816,
  },
  {
    word: "home",
    start: 48.875,
    end: 49.115,
    confidence: 0.98574984,
  },
  {
    word: "you're",
    start: 49.115,
    end: 49.355,
    confidence: 0.98287696,
  },
  {
    word: "considering",
    start: 49.355,
    end: 50.075,
    confidence: 0.9495298,
  },
  {
    word: "and",
    start: 50.315002,
    end: 50.475002,
    confidence: 0.99644226,
  },
  {
    word: "guess",
    start: 50.475002,
    end: 50.795002,
    confidence: 0.99095106,
  },
  {
    word: "what",
    start: 50.795002,
    end: 51.355,
    confidence: 0.8742777,
  },
  {
    word: "if",
    start: 51.435,
    end: 51.675,
    confidence: 0.9888601,
  },
  {
    word: "you",
    start: 51.675,
    end: 51.835,
    confidence: 0.9998048,
  },
  {
    word: "love",
    start: 51.835,
    end: 52.075,
    confidence: 0.99868554,
  },
  {
    word: "houses",
    start: 52.075,
    end: 52.395,
    confidence: 0.99878865,
  },
  {
    word: "as",
    start: 52.395,
    end: 52.715,
    confidence: 0.9987066,
  },
  {
    word: "much",
    start: 52.715,
    end: 52.795002,
    confidence: 0.99993,
  },
  {
    word: "as",
    start: 52.795002,
    end: 52.955,
    confidence: 0.99878293,
  },
  {
    word: "i",
    start: 52.955,
    end: 53.195,
    confidence: 0.9984854,
  },
  {
    word: "do",
    start: 53.195,
    end: 53.675,
    confidence: 0.9366441,
  },
  {
    word: "you've",
    start: 53.835,
    end: 54.155,
    confidence: 0.9974502,
  },
  {
    word: "come",
    start: 54.155,
    end: 54.235,
    confidence: 0.99966526,
  },
  {
    word: "to",
    start: 54.235,
    end: 54.395,
    confidence: 0.9987993,
  },
  {
    word: "the",
    start: 54.395,
    end: 54.555,
    confidence: 0.99958354,
  },
  {
    word: "right",
    start: 54.555,
    end: 54.715,
    confidence: 0.99989426,
  },
  {
    word: "place",
    start: 54.715,
    end: 55.035,
    confidence: 0.989686,
  },
]

const outroWords = [
  {
    word: "so",
    start: 0,
    end: 0.64,
    confidence: 0.8984375,
  },
  {
    word: "if",
    start: 0.64,
    end: 0.96,
    confidence: 0.75097656,
  },
  {
    word: "you're",
    start: 0.96,
    end: 1.1999999,
    confidence: 0.98095703,
  },
  {
    word: "ready",
    start: 1.1999999,
    end: 1.4399999,
    confidence: 1,
  },
  {
    word: "to",
    start: 1.4399999,
    end: 1.5999999,
    confidence: 0.99902344,
  },
  {
    word: "explore",
    start: 1.5999999,
    end: 1.92,
    confidence: 1,
  },
  {
    word: "the",
    start: 1.92,
    end: 2.1599998,
    confidence: 0.99902344,
  },
  {
    word: "various",
    start: 2.1599998,
    end: 2.48,
    confidence: 1,
  },
  {
    word: "house",
    start: 2.48,
    end: 2.8,
    confidence: 0.9951172,
  },
  {
    word: "options",
    start: 2.8,
    end: 3.12,
    confidence: 1,
  },
  {
    word: "the",
    start: 3.12,
    end: 3.36,
    confidence: 0.99316406,
  },
  {
    word: "city",
    start: 3.36,
    end: 3.6,
    confidence: 0.9194336,
  },
  {
    word: "has",
    start: 3.6,
    end: 3.84,
    confidence: 1,
  },
  {
    word: "to",
    start: 3.84,
    end: 4,
    confidence: 0.99902344,
  },
  {
    word: "offer",
    start: 4,
    end: 4.56,
    confidence: 0.8129883,
  },
  {
    word: "don't",
    start: 4.96,
    end: 5.2,
    confidence: 0.9980469,
  },
  {
    word: "hesitate",
    start: 5.2,
    end: 5.6,
    confidence: 1,
  },
  {
    word: "to",
    start: 5.6,
    end: 5.8399997,
    confidence: 0.99902344,
  },
  {
    word: "reach",
    start: 5.8399997,
    end: 6,
    confidence: 1,
  },
  {
    word: "out",
    start: 6,
    end: 6.56,
    confidence: 0.9885254,
  },
  {
    word: "call",
    start: 7.3599997,
    end: 7.68,
    confidence: 0.99609375,
  },
  {
    word: "me",
    start: 7.68,
    end: 8.24,
    confidence: 0.7883301,
  },
  {
    word: "emmanuel",
    start: 8.24,
    end: 8.8,
    confidence: 0.8041992,
  },
  {
    word: "bernard",
    start: 8.8,
    end: 9.599999,
    confidence: 0.8388672,
  },
  {
    word: "and",
    start: 9.76,
    end: 9.92,
    confidence: 0.99902344,
  },
  {
    word: "let's",
    start: 9.92,
    end: 10.24,
    confidence: 0.99658203,
  },
  {
    word: "make",
    start: 10.24,
    end: 10.4,
    confidence: 1,
  },
  {
    word: "your",
    start: 10.4,
    end: 10.559999,
    confidence: 0.99609375,
  },
  {
    word: "real",
    start: 10.559999,
    end: 10.8,
    confidence: 0.99316406,
  },
  {
    word: "estate",
    start: 10.8,
    end: 11.04,
    confidence: 0.99902344,
  },
  {
    word: "dreams",
    start: 11.04,
    end: 11.36,
    confidence: 0.9970703,
  },
  {
    word: "come",
    start: 11.36,
    end: 11.599999,
    confidence: 1,
  },
  {
    word: "true",
    start: 11.599999,
    end: 12.08,
    confidence: 0.99902344,
  },
  {
    word: "right",
    start: 12.08,
    end: 12.4,
    confidence: 0.57958984,
  },
  {
    word: "here",
    start: 12.4,
    end: 12.559999,
    confidence: 1,
  },
  {
    word: "in",
    start: 12.559999,
    end: 12.719999,
    confidence: 0.99609375,
  },
  {
    word: "lausanne",
    start: 12.719999,
    end: 13.599999,
    confidence: 0.98254395,
  },
  {
    word: "i",
    start: 13.679999,
    end: 13.84,
    confidence: 0.9980469,
  },
  {
    word: "can't",
    start: 13.84,
    end: 14.08,
    confidence: 1,
  },
  {
    word: "wait",
    start: 14.08,
    end: 14.24,
    confidence: 1,
  },
  {
    word: "to",
    start: 14.24,
    end: 14.4,
    confidence: 1,
  },
  {
    word: "hear",
    start: 14.4,
    end: 14.559999,
    confidence: 1,
  },
  {
    word: "from",
    start: 14.559999,
    end: 14.719999,
    confidence: 1,
  },
  {
    word: "you",
    start: 14.719999,
    end: 14.88,
    confidence: 0.9667969,
  },
]

const scenes = [
  {
    duration: 9.057,
    layers: [
      {
        type: "audio",
        sound: "woosh-1.mp3",
        timing: { start: 0.05, duration: 9.057 },
      },
      {
        type: "camera",
        url: URL_INTRO,
        keyFrames: [
          { time: 0, value: { scale: 1 } },
          { time: 0.1, value: { scale: 1.1 } },
          { time: 0.4, value: { scale: 1.5 } },
          { time: 3, value: { scale: 1 } },
          { time: 4, value: { scale: 1.4 } },
          { time: -0.01, value: { scale: 1 } },
        ],
      },
      {
        type: "caption",
        words: introWords,
        textStyle: "text-transform: uppercase",
        activeWordStyle: "transform: scale(1.1) skewX(-10deg)",
        position: { bottom: 70 },
      },
      {
        type: "title",
        title: "🏠",
        position: { top: 60 },
        style: "font-size: 20rem",
        timing: { start: 2.2, duration: 3 },
        reveal: { type: "zoom-in", duration: 0.35 },
        effects: [
          {
            type: "wobble",
            options: { speed: 0.5, minOpacity: 0.2, maxOpacity: 1 },
          },
        ],
      },
      {
        type: "audio",
        sound: "slow-woosh-5.mp3",
        timing: { start: 1.2 },
      },
    ],
  },
  {
    type: "transition",
    animation: "slide",
    duration: 0.5,
    sound: "woosh-3.mp3",
  },
  {
    duration: 55.816,
    layers: [
      {
        type: "camera",
        url: URL_BODY,
        keyFrames: [
          { time: 0, value: { scale: 1 } },
          { time: 20, value: { scale: 1.4 } },
          { time: 35, value: { scale: 1 } },
          { time: 50, value: { scale: 1.6 } },
        ],
      },
      {
        type: "camera",
        url: BROL_URL_1,
        timing: { start: 4, duration: 5 },
        reveal: { type: "zoom-out", duration: 0.35 },
      },
      {
        type: "camera",
        url: BROL_URL_2,
        timing: { start: 10, duration: 3 },
        position: { top: 0, left: 10, right: 10, bottom: 30 },
        reveal: { type: "slide-down", duration: 0.35 },
        containerStyle:
          "border-radius: 30px; box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);",
      },
      {
        type: "camera",
        url: BROL_URL_3,
        timing: { start: 19, duration: 5 },
        reveal: { type: "zoom-out", duration: 0.35 },
      },
      {
        type: "camera",
        url: BROL_URL_4,
        timing: { start: 30, duration: 5 },
        reveal: { type: "zoom-out", duration: 0.35 },
      },
      {
        type: "camera",
        url: BROL_URL_5,
        timing: { start: 40, duration: 4 },
        reveal: { type: "zoom-in", duration: 0.35 },
      },
      {
        type: "camera",
        url: BROL_URL_6,
        timing: { start: 50, duration: 4 },
        position: { bottom: 60 },
        containerStyle:
          "border-radius: 30px; box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);",
        reveal: { type: "fade", duration: 0.35 },
      },
      {
        type: "caption",
        words: bodyWords,
        boxStyle: "background-color: transparent",
        textStyle: "text-transform: uppercase",
        combineTokensWithinMilliseconds: 800,
        activeWordStyle: "transform: scale(1.3) skewX(-10deg)",
        position: { top: 70 },
        multiColors: ["#d47e1c", "#d41c5c", "#1c90d4"],
      },
    ],
  },
  {
    type: "transition",
    animation: "clockWipe",
    duration: 0.5,
    sound: "woosh-3.mp3",
  },
  {
    duration: 15.614,
    layers: [
      {
        type: "camera",
        url: URL_OUTRO,
        keyFrames: [
          { time: 0, value: { scale: 1.5 } },
          { time: 0.1, value: { scale: 1.55 } },
          { time: 3, value: { scale: 1 } },
          { time: -0.01, value: { scale: 1.3 } },
        ],
      },
      {
        type: "title",
        title: "@Shawheen",
        position: { top: 80, left: 10, right: 10, bottom: 10 },
        timing: { start: 3 },
        reveal: { type: "slide-up", duration: 0.35 },
        containerStyle:
          "background-color: #d41c5c; border: 3px solid white; box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.5);",
        effects: [
          {
            type: "pointer",
            options: { direction: "bottom", amplitude: 0.5, speed: 0.4 },
          },
        ],
        style: "text-transform: uppercase",
      },
      {
        type: "title",
        title: "XXX-YYY-ZZZ",
        position: { top: 90 },
        timing: { start: 5 },
        reveal: { type: "fade", duration: 0.35 },
        style: "text-transform: uppercase; font-weight: 500; font-size: 3rem",
      },
      {
        type: "caption",
        words: outroWords,
        textStyle: "text-transform: uppercase",
        activeWordStyle: "transform: scale(1.1) skewX(-10deg)",
        position: { bottom: 70 },
      },
    ],
  },
]

export const ClientDemoShawheen = ({
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
      id="ClientDemoShawheen"
      component={ProjectComposition}
      durationInFrames={Math.ceil(
        scenes.reduce((acc, s) => acc + (s.duration ?? 0), 0) * fps,
      )}
      fps={fps}
      width={width}
      height={height}
      schema={Storyboard}
      calculateMetadata={calculateMetadata}
      defaultProps={{
        tracks: scenes,
        overlay: [
          {
            type: "sound",
            sound: MUSIC_URL,
            timing: { start: 3 },
            volume: 0.2,
            transition: {
              type: "fade",
              duration: 2,
            },
          },
        ],
      }}
    />
  )
}
