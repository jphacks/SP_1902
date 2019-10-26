export type TrasitionDirection = 'up' | 'down' | 'left' | 'right';

export enum AniMoAnimation {
  None = 'none',
  FadeOut = 'fadeOut',
  SlideOut = 'slideOut',
  ZoomOut = 'zoomOut',
}

export type NextSlidePayload = {
  animType: AniMoAnimation;
  direction: TrasitionDirection;
};

export enum EventType {
  NextSlide = 'nextSlide',
  PrevSlide = 'prevSlide',
}
