import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonImg,
} from '@ionic/react';
import React from 'react';
import { RouteDefinition } from '../../types';
import AniMoLogo from '../../assets/animo_logo.png';
import styled from 'styled-components';

interface MenuProps {
  routes: RouteDefinition[];
}

const IconContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 16px 16px 0px;
  max-width: 150px;
`;

export const Menu: React.FC<MenuProps> = ({ routes }) => (
  <IonMenu contentId='main' type='overlay'>
    <IonContent>
      <IconContainer>
        <IonImg src={AniMoLogo} />
      </IconContainer>
      <IonList>
        {routes.map((appPage, index) => {
          return (
            <IonMenuToggle key={index} autoHide={false}>
              <IonItem routerLink={appPage.url} routerDirection='none'>
                <IonIcon slot='start' icon={appPage.icon} />
                <IonLabel>{appPage.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          );
        })}
      </IonList>
    </IonContent>
  </IonMenu>
);
