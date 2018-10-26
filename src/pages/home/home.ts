import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UploaderProvider } from '../../providers/uploader/uploader';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  imageURI:any;
  imageFileName:any;
  constructor(public navCtrl: NavController,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public uploadProvider: UploaderProvider,
    public httpClient: HttpClient) {

  }

  getImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType:sourceType,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageFileName = "data:image/jpeg;base64," + imageData;
      var headers = new HttpHeaders();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'multipart/form-data');
      let postParams = {
        files:this.imageFileName
      };

      console.log('uploading image to nigpro');
      this.httpClient.post(`https://nigpro.com/nigpro/api/v1/mock-photo/277`, postParams, {headers:headers})
      .subscribe(
        resp => {
          console.log('done uploading image');
          console.log(resp)
      },
      error => {
          console.log('unable to upload image');
          console.log(error)
      });
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
