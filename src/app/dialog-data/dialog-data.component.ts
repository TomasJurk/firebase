import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { PostService } from '../_services/post.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-dialog-data',
  templateUrl: './dialog-data.component.html',
  styleUrls: ['./dialog-data.component.scss']
})
export class DialogDataComponent implements OnInit {

  likes: number;
  commText: string;
  allComments: any;
  allLikes: any;
  user: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private afs: AngularFirestore,
    private _pS: PostService,
    private _uS: UserService
  ) {
    this._uS.getProfileInfo().subscribe(res => {
      this.user = res;
    });
   }

  ngOnInit() {
    this.allComments = this._pS.getAllComments(this.data.postId).valueChanges();
    this._pS.getAllLikes(this.data.postId).valueChanges().subscribe(res => {
      this.allLikes = res.length;
    });
  }

  commentSend() {
    this._pS.addComment(this.data.postId, this.data.userId, this.commText, this.user.displayName);
    this.commText = '';
  }

  likeSend() {
    this.afs.collection('likes', ref => ref.where('post_id', '==', `${this.data.postId}`)).snapshotChanges().map((res) => {
      res.map(re => {
        console.log(re);
      });
    });
    this._pS.addLike(this.data.postId, this.data.userId);
  }
}
