import React from 'react';
import { IonSlide, IonText, IonButton } from '@ionic/react';
import { Title } from '../Title';

export const SelectingSlide: React.FC = () => {
  return (
    <IonSlide class='ion-justify-content-start'>
      <IonText class='ion-padding'>
        <Title>スライドを選択</Title>
      </IonText>
    </IonSlide>
  );
};
