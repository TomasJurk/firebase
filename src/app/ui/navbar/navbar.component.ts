import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { AuthGuard } from '../../core/auth.guard';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user$: any;

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit() {
  }

  signOut() {
    this.auth.logOut();
  }

}
