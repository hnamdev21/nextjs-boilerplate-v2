type AssetEventHandler = {
  onStart?: () => void;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: unknown) => void;
};

type FontEventHandler = {
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (error: unknown) => void;
};

type CursorEventHandler = {
  onMove?: (position: SimpleVector2) => void;
};

type FrameEventHandler = {
  onFrame?: (delta: number) => void;
};

type ViewportEventHandler = {
  onVisible?: () => void;
  onHidden?: () => void;
};
