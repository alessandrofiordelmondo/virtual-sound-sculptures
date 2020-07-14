import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { SculptureInterface } from './interfaces'
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators'

 
@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(
    private http: HttpClient,
    private fireAuth: AngularFireAuth,
    private firebase: AngularFireStorage
  ) {
    this.storage = this.firebase.storage;
   }
  private storage = this.firebase.storage;
  private _sculpture = new BehaviorSubject<SculptureInterface[]>([])
 
  get sculpture(){
    return this._sculpture.asObservable()
  }
  //////////////
  // FIREBASE //
  //////////////
  // AUTHENTIFICATION
  // get the permission to communicate with the server
  authentification(){
    return new Promise((resolve, reject) => {
      this.fireAuth.signInAnonymously().catch(function(error) {
        //var errorCode = error.code;
        var errorMessage = error.message;
        reject(errorMessage)
      })
      this.fireAuth.onAuthStateChanged(()=>{
        resolve()
      })   
    })
  }
  //Get sculpture data
  fetchSculpture(){
    return this.http.get<SculptureInterface[]>(
      `${environment.firebaseConfig.databaseURL}/sculptures.json`
    ).pipe(map(data => {
      const sculpt = []
      data.forEach((s:SculptureInterface) => {
        sculpt.push(s)
      })
      return sculpt
    }), tap(sculpt => {
      this._sculpture.next(sculpt)
    }))
  }

  //get gs url inside a firebase folder (with sculpture sound)
  getStorageList(sculptureName:string){
    return new Promise((resolve, reject) => {
      let gsUrlsArray = [];
      let storageRef = this.storage.ref(`/sounds/${sculptureName}`)
      storageRef.listAll().then((result) => {
        result.items.forEach((itemRef:any) => {
          gsUrlsArray.push(`gs://${itemRef.location.bucket}/${itemRef.location.path_}`);
        });
      }).then(() => {
        resolve(gsUrlsArray)
      }).catch(err => {
        reject(err)
      });
    })
  }
  //Get URL from firebase storage url
  getUrl(gsUrl:string){
    return this.storage.refFromURL(gsUrl)
    .getDownloadURL()
  }
  //Loading audio data
  loadAudioData(url:string){
    return this.http.request(
      'GET',
      url,
      {responseType: 'arraybuffer'}
    )
  }

  /////////
  // MAP //
  ////////
  reverseGeocoding(coord:number[]){
    return this.http.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coord[0]},${coord[1]}.json?types=place,address&access_token=${environment.mapBoxToken}`
    )
  }
  
  
}
