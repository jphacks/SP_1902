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
  let directions = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  switch (direction) {
    case 'up':
      directions.down = true;
    case 'down':
      directions.up = true;
    case 'left':
      directions.left = true;
    case 'right':
      directions.right = true;
  }

  switch (animType) {
    case AniMoAnimation.FadeOut:
      return (
        <Fade
          top={directions.up}
          bottom={directions.down}
          left={directions.left}
          right={directions.right}
          opposite
          when={visible}
          duration={duration}
        >
          {children}
        </Fade>
      );
    case AniMoAnimation.ZoomOut:
      return (
        <Zoom
          top={directions.up}
          bottom={directions.down}
          left={directions.left}
          right={directions.right}
          opposite
          when={visible}
          duration={duration}
        >
          {children}
        </Zoom>
      );
    case AniMoAnimation.Rotate:
      const top = directions.up || directions.left;
      const bottom = directions.down || directions.right;
      return (
        <Rotate top={top} bottom={bottom} opposite when={visible} duration={duration}>
          {children}
        </Rotate>
      );
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
