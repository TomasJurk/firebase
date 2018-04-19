import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { PostService } from '../_services/post.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  picture: any;
  constructor(
    private _pS: PostService,
    private _auth: AuthService
  ) { }

  ngOnInit() {
  }

  detectFile(event: Event) {
    const selectedFile = (event.target as HTMLInputElement).files;
    const files = selectedFile;
    if (!files || files.length === 0) {
      console.log('no files found');
      return;
    }
    this._auth.user.subscribe(user => {
      this._pS.createPostPicture(user.uid).then(data => {
        this._pS.uploadPicture(files[0], data.id);
        this.picture = this._pS.getOnePost(data.id).valueChanges();
      });
    });

  }

}
