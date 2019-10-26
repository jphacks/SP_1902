import React from 'react';
import { IonSlide, IonText, IonButton } from '@ionic/react';
import { Title } from '../Title';

export const PairingSlide: React.FC = () => {
  return (
    <IonSlide class='ion-justify-content-start'>
      <IonText class='ion-padding'>
        <Title>モバイルコントローラーとペアリング</Title>
      </IonText>
    </IonSlide>
  );
};
