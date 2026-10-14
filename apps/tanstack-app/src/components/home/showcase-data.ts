import {
  BODY_EDITOR_MODES,
  type BodyEditorMode,
} from "../../../../../config/body-editor";

export { BODY_EDITOR_MODES, type BodyEditorMode };

export type EditorSample = {
  id: string;
  src: string;
  alt: string;
  mode: BodyEditorMode;
};

/** Original, AI-generated concepts. Neither variant is an output of this app's editor. */
export const SHOWCASE_IMAGES = {
  slim: {
    primary: "/examples/v3/slim-editorial.webp",
    secondary: "/examples/v3/slim-lifestyle.webp",
  },
  muscle: {
    primary: "/examples/v3/muscle-editorial.webp",
    secondary: "/examples/v3/muscle-lifestyle.webp",
  },
  proportions: {
    primary: "/examples/v3/proportions-editorial.webp",
    secondary: "/examples/v3/proportions-lifestyle.webp",
  },
} satisfies Record<BodyEditorMode, { primary: string; secondary: string }>;
