import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{
  constructor(public authService: AuthService) {}
  
  role: string | null = null

  ngOnInit(): void {
      this.authService.user$.subscribe(
        (profile) => {
          if( profile && profile['role']){
            this.role = profile['role'];
          }
        }
      )
  }
}
