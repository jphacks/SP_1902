import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocumentProxy } from 'pdfjs-dist';
import styled from 'styled-components';
import socketIOClient from 'socket.io-client';
import { EventType, NextSlidePayload } from '../../AnimoTypes';
const Fade = require('react-reveal/Fade');

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

export const SlideShowPage: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [pageNum, setPageNum] = useState<number>(0);
  const [visible, setVisible] = useState(true);

  const handleLoadSucceeded = (pdf: PDFDocumentProxy) => {
    setPageNum(pdf.numPages);
  };

  const socket = socketIOClient.connect(
    'http://ec2-54-65-64-81.ap-northeast-1.compute.amazonaws.com'
  );

  useEffect(() => {
    socket.on(EventType.Web_Go_To_NextSlide, (payload: NextSlidePayload) => {
      console.log(JSON.stringify(payload));
      setCurrentPageIndex(i => i + 1);
    });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    setVisible(false);
    setTimeout(() => {
      setCurrentPageIndex(i => i + 1);
      setVisible(true);
    }, 500);
  };

  return (
    <Wrapper tabIndex={0} onKeyDown={handleKeyDown}>
      <Document
        file='https://animo-teamx.s3-ap-northeast-1.amazonaws.com/AniMo.pdf'
        onLoadSuccess={handleLoadSucceeded}
      >
        <Fade right opposite when={visible} duration={500}>
          <Page key={currentPageIndex} pageNumber={currentPageIndex} scale={1.0} renderMode='svg' />
        </Fade>
      </Document>
    </Wrapper>
  );
};
