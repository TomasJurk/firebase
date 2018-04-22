import { Component, OnInit } from '@angular/core';
import { PostService } from '../_services/post.service';
import { UserService } from '../_services/user.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  posts: any;
  id: string;
  constructor(
    private _pS: PostService,
    private _uS: UserService
  ) { }

  ngOnInit() {
    this._uS.getProfileInfo().subscribe(user => {
      if (user) {
        this.id = user.uid
        this.posts = this._pS.getAllPosts(this.id).valueChanges();
      }
    });
  }

}
