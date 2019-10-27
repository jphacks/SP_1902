import React from 'react';
import { IonSlide, IonText, IonIcon, IonAvatar, IonItem, IonLabel } from '@ionic/react';
import { Title } from '../Title';
import { checkmarkCircle } from 'ionicons/icons';

export const PairingSlide: React.FC = () => {
  return (
    <IonSlide class='ion-justify-content-start'>
      <IonText class='ion-padding'>
        <Title>AniMoに接続する</Title>
      </IonText>
      <IonItem>
        <IonAvatar>
          <IonIcon icon={checkmarkCircle} size='large' color='#2ECC70' />
        </IonAvatar>
        <IonLabel>接続完了</IonLabel>
      </IonItem>
    </IonSlide>
  );
};
