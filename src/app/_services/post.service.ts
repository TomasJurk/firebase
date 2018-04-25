import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from '../core/auth.service';
import { UserService } from '../_services/user.service';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { post } from 'selenium-webdriver/http';

@Injectable()
export class PostService {

  constructor(
    private _aS: AuthService,
    private _uS: UserService,
    private afs: AngularFirestore
  ) { }

  uploadPicture(upload, id) {
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
          const newPicture = {
            photoURL: uploadTask.snapshot.downloadURL,
            imageName: imageName
          };
          this.updatePicture(newPicture, id);
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
      'status': 'draft',
      'photoURL': ''
    };
    return this.afs.collection('posts').add(picture);
  }

  getOnePost(id) {
    return this.afs.doc<any>(`posts/${id}`);
  }

  private updatePicture(upload, id) {
    return this.getOnePost(id).update(upload);
  }

  deletePhoto(id, pictureName) {
    return this.getOnePost(id).update({
      'photoURL': '',
      'imageName': ''
    }).then(
      () => {
        const storageRef = firebase.storage().ref();
        storageRef.child(`posts/${pictureName}`).delete();
      }
    );
  }

  addDescription(id, description) {
    return this.getOnePost(id).update({'description': description});
  }

  addComment(id, user_id, comment_text, name) {
    const comment = {
      'posted_on': new Date().getTime(),
      'post_id': id,
      'user_id': user_id,
      'userName': name,
      'comment': comment_text
    };
    return this.afs.collection('comments').add(comment);
  }

  getAllComments(post_id) {
    return this.afs.collection('comments', ref => ref.where('post_id', '==', `${post_id}`).orderBy('posted_on', 'desc'));
  }

  addLike(id, user_id) {
    const like = {
      'liked_on': new Date().getTime(),
      'post_id': id,
      'user_id': user_id
    };
    return this.afs.collection('likes').add(like);
  }

  getAllLikes(post_id) {
    return this.afs.collection('likes', ref => ref.where('post_id', '==', `${post_id}`).orderBy('liked_on', 'desc'));

  }
  getIfLikes(post_id, user_id) {
    return this.afs.collection('likes', ref => ref.where('post_id', '==', `${post_id}`)
    .where('user_id', '==', `${user_id}`));
  }

  deleteLike(like_id) {
    return this.afs.doc(`likes/${like_id}`).delete();
  }

  addPost(id) {
    return this.getOnePost(id).update({'status': 'active'});
  }

  getAllPosts() {
    return this.afs.collection('posts', ref => ref.where('status', '==', 'active').orderBy('imageName', 'desc'))
    .snapshotChanges().map((posts) => {
      return posts.map(r => {
        const data = r.payload.doc.data();
        const user = this._uS.getProfile(data.user_uid).valueChanges();
        return {
          id: r.payload.doc.id,
          user_uid: data.user_uid,
          photoURL: data.photoURL,
          imgName: data.imageName,
          description: data.description,
          user: user
        };
      });
    });
  }
}
