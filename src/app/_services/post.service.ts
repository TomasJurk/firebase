import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from '../core/auth.service';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

@Injectable()
export class PostService {

  constructor(
    private _aS: AuthService,
    private afs: AngularFirestore
  ) { }

  uploadPicture(upload, uid) {
    const storageRef = firebase.storage().ref();
    const imageName = new Date().getTime();
    const uploadTask = storageRef.child(`posts/${imageName}`).put(upload);

    return uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) => {
        const snap = snapshot;
        upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
      },
      (error) => {
        console.log('error');
      },
      () => {
        if (uploadTask.snapshot.downloadURL) {
          upload.url = uploadTask.snapshot.downloadURL;
         this.updatePicture(upload, uid);
         return;
        } else {
          console.log('file not loaded');
        }
      }
    );
  }

  createPostPicture(uid) {
    const picture = {
      'user_uid': uid,
      'status': 'draft'
    };
    return this.afs.collection('posts').add(picture);
  }

  getOnePost(uid) {
    return this.afs.doc<any>(`posts/${uid}`);
  }

  private updatePicture(upload, uid) {
    return this.getOnePost(uid).update({'photoURL': upload.url});
  }
}
