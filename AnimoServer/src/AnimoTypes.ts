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

export type PrevSlidePayload = {};

export enum EventType {
  Mobile_NextSlide_Action = 'mobileNextSlideAction',
  Mobile_PrevSlide_Action = 'mobilePrevSlideAction',
  Web_Go_To_NextSlide = 'webGoToNextSlide',
  Web_Return_To_PrevSlide = 'webReturnToPrevSlide',
}
