import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocumentProxy } from 'pdfjs-dist';
import styled, { keyframes } from 'styled-components';
import socketIOClient from 'socket.io-client';
import { EventType, NextSlidePayload } from '../../AnimoTypes';
const { slideOutLeft } = require('react-animations');

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const fadeOutAnimation = keyframes`${slideOutLeft}`;

const FadeOut = styled.div`
  animation: 1s ${fadeOutAnimation};
`;

const TeMae = styled.div`
  z-index: 1;
  left: 0;
  top: 0;
`;

const Usiro = styled.div`
  z-index: 2;
  left: 0;
  top: 0;
`;

const Root = styled.div``;

export const SlideShowPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNum, setPageNum] = useState<number>(0);
  const [show, setShow] = useState(true);

  const handleLoadSucceeded = (pdf: PDFDocumentProxy) => {
    setPageNum(pdf.numPages);
  };
  const socket = socketIOClient.connect(
    'http://ec2-54-65-64-81.ap-northeast-1.compute.amazonaws.com'
  );
  useEffect(() => {
    // socket.emit('onreq');
    socket.on('connect', () => {});
    socket.on(EventType.Web_Go_To_NextSlide, (payload: NextSlidePayload) => {
      console.log(JSON.stringify(payload));
      setShow(!show);
      setCurrentPage(currentPage + 1);
    });
  }, [show]);

  const CurrentPage = <Page pageNumber={currentPage} scale={1.0} renderMode='svg' />;
  const NextPage = <Page pageNumber={currentPage + 1} scale={1.0} renderMode='svg' />;

  return (
    <Wrapper>
      <Document
        file='https://animo-teamx.s3-ap-northeast-1.amazonaws.com/AniMo.pdf'
        onLoadSuccess={handleLoadSucceeded}
      >
        <FadeOut>
          <Page pageNumber={currentPage} scale={1.0} renderMode='svg' />
        </FadeOut>
      </Document>
      <button
        onClick={() => {
          setShow(!show);
          setCurrentPage(currentPage + 1);
        }}
      >
        あああ
      </button>
    </Wrapper>
  );
};
