export type TrasitionDirection = 'up' | 'down' | 'left' | 'right';

export enum AniMoAnimation {
  None = 'none',
  FadeOut = 'fadeOut',
  SlideOut = 'slideOut',
  ZoomOut = 'zoomOut',
  Rotate = 'rotate',
}

export type NextSlidePayload = {
  sessionId: string;
  animType: AniMoAnimation;
  direction: TrasitionDirection;
};

export type PrevSlidePayload = {
  sessionId: string;
};

export enum EventType {
  Mobile_Connect_Presentation = 'mobileConnectPresentation',
  Mobile_Send_NextSlide_Action = 'mobileSendNextSlideAction',
  Mobile_Send_PrevSlide_Action = 'mobileSendPrevSlideAction',
  Mobile_Connect_Complete = 'mobileConnectComplete',
  Web_Start_Presentation = 'webStartPresentation',
  Web_Go_To_NextSlide = 'webGoToNextSlide',
  Web_Return_To_PrevSlide = 'webReturnToPrevSlide',
}
