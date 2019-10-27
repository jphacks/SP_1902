import React from 'react';
import { IonSlide, IonText, IonFabButton } from '@ionic/react';
import { Title } from '../Title';
import * as AWS from 'aws-sdk'
import * as S3 from 'aws-sdk/clients/s3'
import * as fs from 'fs'

const accessKeyId = process.env.REACT_APP_AccessKeyId; // IAMユーザの認証情報の「アクセスキーID」から確認できます。
const secretAccessKey = process.env.REACT_APP_SecretAccessKey; // IAMユーザのシークレットアクセスキー。アクセスキーを作ったときだけ見れるやつです。
const bucketName = process.env.REACT_APP_BucketName; // 保存先のバケット名

const bucket = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: 'ap-northeast-1',
})


export const SelectingSlide: React.FC = () => {

  const sendPdf = () => {
    const file = fs.readFileSync("/Users/kmdkuk/go/src/github.com/jphacks/SP1902/openlab.pdf")
    const param: AWS.S3.Types.PutObjectRequest = {
      Bucket: bucketName as string,
      Key: 'oepnlab.png', // ファイル絶対パス
      Body: file, // ファイルの内容
      ContentType : 'application/pdf',
    }

    bucket.upload(param, (err: Error, data: S3.ManagedUpload.SendData) => {
      if (err) {
        console.error(err)
      } else {
        console.log('Successfully uploaded file.', data)
      }
    });
  }

  return (
    <IonSlide class='ion-justify-content-start'>
      <IonText class='ion-padding'>
        <Title>スライドを選択</Title>
      </IonText>
      <IonFabButton type='button' onClick={sendPdf}>
        Default
      </IonFabButton>
    </IonSlide>
  );
};
