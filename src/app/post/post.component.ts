import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { PostService } from '../_services/post.service';
import { AuthService } from '../core/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  description: string;
  post: any = {
    'photoURL': ''
  };
  id: string;
  constructor(
    private _pS: PostService,
    private _auth: AuthService,
    private router: Router,
    private _aR: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this._aR.snapshot.params['id'];
    if (this.id) {
      this._pS.getOnePost(this.id).valueChanges().subscribe(post => {
        this.post = post;
      });
    } else {
      this.createPost();
    }
  }

  createPost() {
    this._auth.user.subscribe(user => {
      this._pS.createPostPicture(user.uid).then(post => {
        return this.router.navigate(['post', post.id]);
      });
    });
  }

  detectFile(event: Event) {
    const selectedFile = (event.target as HTMLInputElement).files;
    const files = selectedFile;
    if (!files || files.length === 0) {
      console.log('no files found');
      return;
    }
    this._pS.uploadPicture(files[0], this.id);
    event.target['value'] = '';
  }

  deletePhoto() {
    this._pS.deletePhoto(this.id, this.post.imageName);
  }

  addDescription() {
    this._pS.addDescription(this.id, this.description);
    console.log('Description uploaded');
    this.description = '';
  }

  addPost() {
    this._pS.addPost(this.id);
    this.router.navigate(['dashboard']);
  }
}
