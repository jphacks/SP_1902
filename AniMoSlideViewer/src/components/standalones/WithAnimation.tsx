import React from 'react';
import { NextSlidePayload, AniMoAnimation } from '../../AnimoTypes';
import styled from 'styled-components';

const Fade = require('react-reveal/Fade');
const Zoom = require('react-reveal/Zoom');
const Rotate = require('react-reveal/Rotate');

const getAnimatedChildren = (
  children: React.ReactNode,
  visible: boolean,
  duration: number,
  payload?: NextSlidePayload
) => {
  if (payload === undefined) {
    return <>{children}</>;
  }
  const { animType, direction } = payload;

  switch (animType) {
    case AniMoAnimation.FadeOut:
      switch (direction) {
        case 'up':
          return (
            <Fade bottom opposite when={visible} duration={duration}>
              {children}
            </Fade>
          );
        case 'down':
          return (
            <Fade top opposite when={visible} duration={duration}>
              {children}
            </Fade>
          );
        case 'left':
          return (
            <Fade left opposite when={visible} duration={duration}>
              {children}
            </Fade>
          );
        case 'right':
          return (
            <Fade right opposite when={visible} duration={duration}>
              {children}
            </Fade>
          );
        case 'none':
          return (
            <Fade when={visible} duration={duration}>
              {children}
            </Fade>
          );
      }
    case AniMoAnimation.ZoomOut:
      switch (direction) {
        case 'up':
          return (
            <Zoom bottom opposite when={visible} duration={duration}>
              {children}
            </Zoom>
          );
        case 'down':
          return (
            <Zoom top opposite when={visible} duration={duration}>
              {children}
            </Zoom>
          );
        case 'left':
          return (
            <Zoom left opposite when={visible} duration={duration}>
              {children}
            </Zoom>
          );
        case 'right':
          return (
            <Zoom right opposite when={visible} duration={duration}>
              {children}
            </Zoom>
          );
        case 'none':
          return (
            <Zoom when={visible} duration={duration}>
              {children}
            </Zoom>
          );
      }
    case AniMoAnimation.Rotate:
      switch (direction) {
        case 'down':
        case 'left':
          return (
            <Rotate top left opposite when={visible} duration={duration}>
              {children}
            </Rotate>
          );
        case 'up':
        case 'right':
          return (
            <Rotate bottom right opposite when={visible} duration={duration}>
              {children}
            </Rotate>
          );
        case 'none':
          return (
            <Rotate when={visible} duration={duration}>
              {children}
            </Rotate>
          );
      }
    case AniMoAnimation.None:
    default:
      return <>{children}</>;
  }
};

type Props = {
  payload?: NextSlidePayload;
  visible: boolean;
  duration: number;
};

const Wrapper = styled.div``;

export const WithAnimation: React.FC<Props> = ({ children, payload, visible, duration }) => {
  const animated = getAnimatedChildren(children, visible, duration, payload);
  return <Wrapper>{animated}</Wrapper>;
};
