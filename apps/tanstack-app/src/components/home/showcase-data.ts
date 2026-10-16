import type {
  BodyEditMode,
  BodyEditIntensity,
} from "../../../../../config/body-editor";

export type EditorSample = {
  id: string;
  src: string;
  alt: string;
  afterAlt?: string;
  mode: BodyEditMode;
  intensity?: BodyEditIntensity;
  instructions?: string;
  loadPhoto?: boolean;
};

export type EditorSettings = { mode: BodyEditMode; intensity: BodyEditIntensity; instructions: string };
export type EditorPhotoSource = "local" | "sample" | null;

/** Actual editor outputs paired with their fictional sample originals. */
export const REAL_RESULT_IMAGES = {
  breast: "/examples/results-2026-10-16/breast.webp",
  waistOnly: "/examples/results-2026-10-16/waist-only.webp",
  naturalSlim: "/examples/results-2026-10-16/natural-slim.webp",
  muscle: "/examples/results-2026-10-16/muscle.webp",
  proportions: "/examples/results-2026-10-16/proportions.webp",
  shoulders: "/examples/results-2026-10-16/shoulders.webp",
  legProportions: "/examples/results-2026-10-16/leg-proportions.webp",
  breastSubtle: "/examples/results-2026-10-16/breast-subtle.webp",
  fullerFigure: "/examples/results-2026-10-16/fuller-figure-unique.webp",
  customCombination: "/examples/results-2026-10-16/custom-combination-unique.webp",
} as const;

export const REAL_RESULT_CASES = [
  { key: "naturalSlim", mode: "slim", intensity: 80, subject: "city-woman" },
  { key: "muscle", mode: "muscle", intensity: 90, subject: "shorts-man" },
  { key: "proportions", mode: "proportions", intensity: 90, subject: "black-man" },
  { key: "breast", mode: "breast", intensity: 70, subject: "terrace-woman" },
  { key: "breastSubtle", mode: "breast", intensity: 40, subject: "asian-dress-woman" },
  { key: "legProportions", mode: "proportions", intensity: 80, subject: "skirt-woman" },
  { key: "shoulders", mode: "muscle", intensity: 80, subject: "studio-man" },
  { key: "waistOnly", mode: "slim", intensity: 70, subject: "gym-man" },
  { key: "fullerFigure", mode: "proportions", intensity: 70, subject: "fuller-blonde-woman" },
  { key: "customCombination", mode: "muscle", intensity: 70, subject: "combination-white-man" },
] as const;

