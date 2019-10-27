import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocumentProxy } from 'pdfjs-dist';
import styled from 'styled-components';
import socketIOClient from 'socket.io-client';
import { EventType, NextSlidePayload, AniMoAnimation, PrevSlidePayload } from '../../AnimoTypes';
import { WithAnimation } from '../standalones/WithAnimation';
import Fullscreen from 'react-full-screen';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

enum KeyCode {
  LEFT_ARROW = 37,
  RIGHT_ARROW = 39,
}

export const SlideShowPage: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageNum, setPageNum] = useState<number>(0);
  const [visible, setVisible] = useState(true);
  const [payload, setPayload] = useState<NextSlidePayload>();
  const [fullScreen, setFullScreen] = useState(false);
  const animationTimeMs = 500;

  const handleLoadSucceeded = (pdf: PDFDocumentProxy) => {
    setPageNum(pdf.numPages);
  };

  const handleFullScreenChange = (enabled: boolean) => setFullScreen(enabled);
  const socket = socketIOClient.connect(
    'http://ec2-54-65-64-81.ap-northeast-1.compute.amazonaws.com'
  );

  useEffect(() => {
    socket.on(EventType.Web_Go_To_NextSlide, (payload: NextSlidePayload) => {
      console.log(JSON.stringify(payload));
      setPayload(payload);
      setVisible(false);
      setTimeout(() => {
        setCurrentPageIndex(i => i + 1);
        setVisible(true);
      }, animationTimeMs);
    });

    socket.on(EventType.Web_Return_To_PrevSlide, (payload: PrevSlidePayload) => {
      setPayload({ animType: AniMoAnimation.None, direction: 'left' });
      setVisible(false);
      setTimeout(() => {
        setCurrentPageIndex(i => i - 1);
        setVisible(true);
      }, 0);
    });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.keyCode) {
      case KeyCode.RIGHT_ARROW:
        setPayload({ animType: AniMoAnimation.ZoomOut, direction: 'right' });
        setVisible(false);
        setTimeout(() => {
          setCurrentPageIndex(i => i + 1);
          setVisible(true);
        }, animationTimeMs);
        break;
      case KeyCode.LEFT_ARROW:
        setPayload({ animType: AniMoAnimation.None, direction: 'left' });
        setVisible(false);
        setTimeout(() => {
          setCurrentPageIndex(i => i - 1);
          setVisible(true);
        }, 0);
        break;
    }
  };
  const handleStart = () => {
    setCurrentPageIndex(i => i + 1);
    setFullScreen(f => (f === true ? false : true));
  };
  return currentPageIndex <= 0 ? (
    <div tabIndex={1} onKeyDown={handleStart}>
      スタートする
    </div>
  ) : (
    <Fullscreen enabled={fullScreen} onChange={handleFullScreenChange}>
      <Wrapper tabIndex={0} onKeyDown={handleKeyDown}>
        <Document
          file='https://animo-teamx.s3-ap-northeast-1.amazonaws.com/AniMo.pdf'
          onLoadSuccess={handleLoadSucceeded}
        >
          <WithAnimation payload={payload} visible={visible} duration={animationTimeMs}>
            <Page
              key={currentPageIndex}
              pageNumber={currentPageIndex}
              scale={1.6}
              renderMode='svg'
            />
          </WithAnimation>
        </Document>
      </Wrapper>
    </Fullscreen>
  );
};
