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
    primary: "/examples/v2/slim-editorial-v2.webp",
    secondary: "/examples/v2/slim-lifestyle.webp",
  },
  muscle: {
    primary: "/examples/v2/muscle-editorial.webp",
    secondary: "/examples/v2/muscle-lifestyle.webp",
  },
  proportions: {
    primary: "/examples/v2/proportions-editorial.webp",
    secondary: "/examples/v2/proportions-lifestyle.webp",
  },
} satisfies Record<BodyEditorMode, { primary: string; secondary: string }>;
