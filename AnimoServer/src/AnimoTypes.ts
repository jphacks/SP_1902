export type TrasitionDirection = 'up' | 'down' | 'left' | 'right';

export enum AniMoAnimation {
  None = 'none',
  FadeOut = 'fadeOut',
  SlideOut = 'slideOut',
  ZoomOut = 'zoomOut',
}

export type AniMoAction = {
  animType: AniMoAnimation;
  direction: TrasitionDirection;
};
