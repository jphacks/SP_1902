export type TrasitionDirection = 'up' | 'down' | 'left' | 'right';

export enum AniMoAnimation {
  None = 'none',
  FadeOut = 'fadeOut',
  SlideOut = 'slideOut',
  ZoomOut = 'zoomOut',
  Rotate = 'rotate',
}

export type NextSlidePayload = {
  animType: AniMoAnimation;
  direction: TrasitionDirection;
};

export type PrevSlidePayload = {};

export enum EventType {
  Mobile_Send_NextSlide_Action = 'mobileSendNextSlideAction',
  Mobile_Send_PrevSlide_Action = 'mobileSendPrevSlideAction',
  Web_Go_To_NextSlide = 'webGoToNextSlide',
  Web_Return_To_PrevSlide = 'webReturnToPrevSlide',
}
