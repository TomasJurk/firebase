import { Component, OnInit } from '@angular/core';
import { PostService } from '../_services/post.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  posts: any;
  constructor(
    private _pS: PostService
  ) { }

  ngOnInit() {
    this.posts = this._pS.getAllPosts().valueChanges();
  }

}
