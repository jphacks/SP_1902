import React from 'react';
import { IonSlide, IonText, IonButton, IonItem, IonAvatar, IonIcon, IonLabel } from '@ionic/react';
import { Title } from '../Title';
import { swap, qrScanner, refreshCircle, apps } from 'ionicons/icons';

export const ReadySlide: React.FC = () => {
  return (
    <IonSlide class='ion-justify-content-start ion-padding '>
      <IonText>
        <Title>プレゼンテーションをはじめる</Title>
      </IonText>
      <IonText>
        <h2>アニメーション</h2>
      </IonText>
      <IonItem>
        <IonAvatar>
          <IonIcon icon={swap} size='large' color='#2ECC70' />
        </IonAvatar>
        <IonLabel>なし</IonLabel>
      </IonItem>
      <IonItem>
        <IonAvatar>
          <IonIcon icon={qrScanner} size='large' color='#2ECC70' />
        </IonAvatar>
        <IonLabel>ズームアウト</IonLabel>
      </IonItem>
      <IonItem>
        <IonAvatar>
          <IonIcon icon={apps} size='large' color='#2ECC70' />
        </IonAvatar>
        <IonLabel>フェードアウト</IonLabel>
      </IonItem>
      <IonItem>
        <IonAvatar>
          <IonIcon icon={refreshCircle} size='large' color='#2ECC70' />
        </IonAvatar>
        <IonLabel>回転</IonLabel>
      </IonItem>
      <IonButton routerLink='/slideshow/1'>AniMoでプレゼンテーションを開始</IonButton>
    </IonSlide>
  );
};
