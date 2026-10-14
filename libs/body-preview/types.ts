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
  region: PreviewRegion;
}
