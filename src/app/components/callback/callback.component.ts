import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private userService: UserService) { }
  user: User = {
    id: '',
    name: '',
    surname: '',
    email: '',
    bdate: ''
  };
  profileJson: string | null = null;
  userExists: boolean = false; // Initialize user existence as false

  ngOnInit(): void {

    //ottieni l'access token
    this.authService.user$.subscribe(
      (profile) => {
        this.profileJson = JSON.stringify(profile, null, 2);
        this.createUserData(); //riempi la classe user

        // Check if the user exists
        this.userExist();
      },
      (error) => {
        console.error("Error while getting user profile: ", error);
      }
    );

    // Redirect to home
    this.router.navigate(['/']);
  }

  createUserData(): void {
    try {
      const profileData = JSON.parse(this.profileJson || "");
      const subField = profileData['sub'] || '';
      const subParts = subField.split('|');
  
      if (subParts.length === 2 && subParts[0] === 'auth0') {
        this.user.id = subParts[1];
      } else {
        console.error("Invalid sub field format");
      }
  
      this.user.email = profileData['email'] || '';
    } catch (error) {
      console.error("Error parsing profile JSON: ", error);
    }
  }
  

  userExist(): void {
    this.userService.existUser(this.user.email).subscribe(
      (exists) => {
        this.userExists = exists;
        if (!exists) {
          this.createUserAccount(); // Create the user account calling the service
        }
      },
      (error) => {
        console.error("Error checking user existence: ", error);
      }
    );
  }

  createUserAccount(): void {
    this.userService.createUser(this.user).subscribe(
      () => {
        console.log("User created successfully");
      },
      (error) => {
        console.error("Error creating user: ", error);
      }
    );
  }
}
