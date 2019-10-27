import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocumentProxy } from 'pdfjs-dist';
import styled from 'styled-components';
import socketIOClient from 'socket.io-client';
import { EventType, NextSlidePayload, AniMoAnimation, PrevSlidePayload } from '../../AnimoTypes';
import { WithAnimation } from '../standalones/WithAnimation';
import Fullscreen from 'react-full-screen';
import {
  IonContent,
  IonButton,
  IonText,
  IonPage,
  IonItem,
  IonAvatar,
  IonIcon,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react';
import { Title } from '../standalones/Title';
import { swap, qrScanner, apps, refreshCircle } from 'ionicons/icons';

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
  const [pageNum, setPageNum] = useState<number>(-1);
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
      setVisible(v => !v);
      setTimeout(() => {
        setCurrentPageIndex(i => i + 1);
        setVisible(v => !v);
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

  useEffect(() => {
    if (currentPageIndex <= 0) {
      setFullScreen(false);
    } else if (pageNum > 0 && currentPageIndex > pageNum) {
      setCurrentPageIndex(0);
    }
  }, [currentPageIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.keyCode) {
      case KeyCode.RIGHT_ARROW:
        setPayload({ animType: AniMoAnimation.FadeOut, direction: 'none' });
        setVisible(v => !v);
        setTimeout(() => {
          setCurrentPageIndex(i => i + 1);
          setVisible(v => !v);
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
    setFullScreen(true);
  };

  return currentPageIndex <= 0 ? (
    <FirstPage handleStart={handleStart} />
  ) : (
    <Fullscreen enabled={fullScreen} onChange={handleFullScreenChange}>
      <Wrapper tabIndex={0}>
        <Document
          file='https://animo-teamx.s3-ap-northeast-1.amazonaws.com/AniMo.pdf'
          onLoadSuccess={handleLoadSucceeded}
        >
          <WithAnimation payload={payload} visible={visible} duration={animationTimeMs}>
            <Page
              key={currentPageIndex}
              pageNumber={currentPageIndex}
              scale={1.5}
              renderMode='svg'
            />
          </WithAnimation>
        </Document>
      </Wrapper>
    </Fullscreen>
  );
};

type FirstPageProps = {
  handleStart: () => void;
};

const Thumbnails = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FirstPage: React.FC<FirstPageProps> = ({ handleStart }) => (
  <IonContent class='ion-padding'>
    <IonText>
      <Title>プレゼンテーションをはじめる</Title>
    </IonText>
    <IonText>
      <IonCard>
        <Document file='https://animo-teamx.s3-ap-northeast-1.amazonaws.com/AniMo.pdf'>
          <Thumbnails>
            <Page pageNumber={1} scale={0.5} renderMode='svg' />
            <Page pageNumber={2} scale={0.5} renderMode='svg' />
            <Page pageNumber={3} scale={0.5} renderMode='svg' />
          </Thumbnails>
        </Document>
        <IonCardHeader>
          <IonCardTitle>JP Hacks 2019 発表スライド</IonCardTitle>
        </IonCardHeader>
      </IonCard>
      <h2>モバイルから操作可能なアニメーション</h2>
    </IonText>
    <IonItem>
      <IonAvatar>
        <IonIcon icon={swap} size='large' />
      </IonAvatar>
      <IonLabel>なし</IonLabel>
    </IonItem>
    <IonItem>
      <IonAvatar>
        <IonIcon icon={qrScanner} size='large' />
      </IonAvatar>
      <IonLabel>ズームアウト</IonLabel>
    </IonItem>
    <IonItem>
      <IonAvatar>
        <IonIcon icon={apps} size='large' />
      </IonAvatar>
      <IonLabel>フェードアウト</IonLabel>
    </IonItem>
    <IonItem>
      <IonAvatar>
        <IonIcon icon={refreshCircle} size='large' />
      </IonAvatar>
      <IonLabel>回転</IonLabel>
    </IonItem>
    <IonText>
      <p>キーボードの左右矢印でも操作可能です。</p>
    </IonText>
    <IonButton onClick={handleStart} expand='full'>
      はじめる
    </IonButton>
  </IonContent>
);
