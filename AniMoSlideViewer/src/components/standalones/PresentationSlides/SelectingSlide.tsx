import React from 'react';
import { IonSlide, IonText, IonCard, IonCardHeader, IonCardTitle } from '@ionic/react';
import { Title } from '../Title';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;

export const SelectingSlide: React.FC = () => {
  return (
    <IonSlide class='ion-justify-content-start'>
      <IonText class='ion-padding'>
        <Title>スライドを選択</Title>
      </IonText>
      <IonCard>
        <Document file='https://animo-teamx.s3-ap-northeast-1.amazonaws.com/AniMo.pdf'>
          <Page pageNumber={1} scale={0.5} renderMode='svg' />
        </Document>
        <IonCardHeader>
          <IonCardTitle>JP Hacks 2019 発表スライド</IonCardTitle>
        </IonCardHeader>
      </IonCard>
    </IonSlide>
  );
};
