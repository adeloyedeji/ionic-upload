import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the UploaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UploaderProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UploaderProvider Provider');
  }

  uploadPhoto(img) {

    console.log('upload image to server');
    // Split the base64 string in data and contentType
    var block = img.split(";");
    console.log('block');
    console.log(block);
    // Get the content type of the image
    var contentType = block[0].split(":")[1];// In this case "image/gif"
    console.log('contentType');
    console.log(contentType);
    // get the real base64 content of the file
    var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

    // Convert it to a blob to upload
    var blob = this.b64toBlob(realData, contentType);
    var f = new FormData();
    f.append("files", blob);
    return new Promise( (resolve, reject) => {
      this.http.post(`https://nigpro.com/nigpro/api/v1/mock-photo/277`, f)
      .subscribe(
          resp => {
              console.log(resp)
              resolve(resp)
          },
          error => {
              console.log(error)
              reject(error)
          }
      )
  } );
  }

  b64toBlob(b64Data, contentType, sliceSize=null) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

}
