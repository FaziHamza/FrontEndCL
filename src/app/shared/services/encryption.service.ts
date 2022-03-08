import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js'; //imports
@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }
  encryptSecretKey = "mySecretKeyHere"; //adding secret key

  //Data Encryption Function
  encryptData(msg) {
    var keySize = 256;
    var salt = CryptoJS.lib.WordArray.random(16);
    var key = CryptoJS.PBKDF2(this.encryptSecretKey, salt, {
      keySize: keySize / 32,
      iterations: 100
    });

    var iv = CryptoJS.lib.WordArray.random(128 / 8);

    var encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    var result = CryptoJS.enc.Base64.stringify(salt.concat(iv).concat(encrypted.ciphertext));

    return result;
  }
}
