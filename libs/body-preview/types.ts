/** Photo-space coordinates normalized to [0, 1]. */
export interface PreviewPoint { x: number; y: number }
export interface PreviewLandmark extends PreviewPoint { visibility?: number }
export interface BodyPhotoAnalysis {
  width: number;
  height: number;
  landmarks: PreviewLandmark[];
  contours: PreviewPoint[][];
}

/** Optional user-adjusted local target area, in normalized photo coordinates. */
export interface PreviewRegion extends PreviewPoint { radiusX: number; radiusY: number }

export interface BodyContourPreview {
  originalPath: string;
  targetPath: string;
  /** False when the current region produces no measurable chest-side change. */
  targetAvailable: boolean;
  /** Unscaled deformation field saved by manual alignment. */
  region: PreviewRegion;
  /** Display area; the breast ellipse scales with intensity around its center. */
  guideRegion: PreviewRegion;
}
