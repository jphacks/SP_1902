import { IonHeader, IonContent, IonPage, IonSlides, IonToolbar, IonTitle } from '@ionic/react';
import React from 'react';
import { ReadySlide, PairingSlide, SelectingSlide } from '../standalones/Presentation';

const slideOpts = {
  initialSlide: 0,
  speed: 400,
};

export const PresentatinPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>プレゼンテーション</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scroll-y={false}>
        <IonSlides pager options={slideOpts}>
          <PairingSlide />
          <SelectingSlide />
          <ReadySlide />
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};
