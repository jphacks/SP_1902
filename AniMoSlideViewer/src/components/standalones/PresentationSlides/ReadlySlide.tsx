import React from 'react';
import { IonSlide, IonText, IonButton } from '@ionic/react';
import { Title } from '../Title';

export const ReadySlide: React.FC = () => {
  return (
    <IonSlide class='ion-justify-content-start ion-padding '>
      <IonText>
        <Title>プレゼンテーションをはじめる</Title>
      </IonText>
      <IonText>
        <h2>アニメーション</h2>
      </IonText>
      <IonButton routerLink='/slideshow/1'>AniMoでプレゼンテーションを開始</IonButton>
    </IonSlide>
  );
};
