import { Component, OnInit } from '@angular/core';
import { PostService } from '../_services/post.service';
import { MatDialog } from '@angular/material';
import { DialogDataComponent } from '../dialog-data/dialog-data.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  posts: any;
  constructor(
    private _pS: PostService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.posts = this._pS.getAllPosts();
  }

  openDialog(post) {
    this.dialog.open(DialogDataComponent, {
      data: {
        description: post.description,
        imgUrl: post.photoURL,
        imgName: post.imageName,
        postId: post.id,
        userId: post.user_uid,
        user: post.user
      }
    });
  }

}
