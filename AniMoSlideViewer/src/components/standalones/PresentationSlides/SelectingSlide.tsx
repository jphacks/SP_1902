import React from 'react';
import { IonSlide, IonText, IonFabButton } from '@ionic/react';
import { Title } from '../Title';
import * as AWS from 'aws-sdk'
import * as S3 from 'aws-sdk/clients/s3'


const accessKeyId = process.env.REACT_APP_AccessKeyId; // IAMユーザの認証情報の「アクセスキーID」から確認できます。
const secretAccessKey = process.env.REACT_APP_SecretAccessKey; // IAMユーザのシークレットアクセスキー。アクセスキーを作ったときだけ見れるやつです。
const bucketName = process.env.REACT_APP_BucketName; // 保存先のバケット名

const bucket = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: 'ap-northeast-1',
})

export const SelectingSlide: React.FC = () => {
  return (
    <IonSlide class='ion-justify-content-start'>
      <IonText class='ion-padding'>
        <Title>スライドを選択</Title>
      </IonText>
      <IonFabButton>Default</IonFabButton>
    </IonSlide>
  );
};
