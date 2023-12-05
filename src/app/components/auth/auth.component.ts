import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LogInResponse } from 'src/app/models/log-in-response';
import { SignUpResponse } from 'src/app/models/sign-up-response';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  showLogIn: boolean | undefined = true;
  showSignUp: boolean | undefined;
  username: string = '';
  email: string = '';
  password: string = '';
  role='OPERATOR';
  showPassword: boolean = false;

  constructor(private toastService: ToastService, private authService: AuthService, private storageService: SessionStorageService, private userService: UserService, private router: Router){}

  async signUp() {
    if (this.isValidForm()) {
      try {
        const response = await this.authService.signUp(this.username, this.email, this.password, this.role).toPromise();
        if (response) {
          const signUpResponse: SignUpResponse = response as SignUpResponse;
          const user: User ={
            id: signUpResponse.id,
            username: this.username,
            email: this.email,
            role: this.role,
            name: '',
            surname: '',
            bdate: ''
          };

          await this.logIn();

          this.userService.createUser(user).subscribe(
            () => {
              console.log("User created successfully");
            },
            (error) => {
              console.error("Error creating user: ", error);
              this.toastService.showErrorToast(error.error['message']);
            }
          );

        } else {
          console.error('Sign-up response is undefined');
          this.toastService.showErrorToast("Sign Up Error");
          this.storageService.logOutUser();
        }
      } catch (error:any) {
        console.error('Error occurred during sign in:', error);
        this.toastService.showErrorToast(error.error['message']);
        this.storageService.logOutUser();
      }
    } else {
      console.log('Form is invalid');
      this.toastService.showErrorToast("Errore: Campi non compilati");
    }
  }
  

  async logIn() {
    if (this.isValidForm()) {
      try {
        const response = await this.authService.logIn(this.username, this.password).toPromise();
        if (response) {
          const logInResponse: LogInResponse = response as LogInResponse;
          console.log('Log In Successful');
          this.toastService.showSuccessToast('Log In Successful');

          this.storageService.logInUser(logInResponse);
          this.router.navigate(['/', 'home']);
        } else {
          console.error('Log In response is undefined');
          this.toastService.showErrorToast("Log in Error");
          this.storageService.logOutUser();
        }
      } catch (error) {
        console.error('Error occurred during Log In:', error);
        this.toastService.showErrorToast("Log in Error");
        this.storageService.logOutUser();
      }
    } else {
      this.toastService.showErrorToast("Log in Error");
      console.log('Form is invalid');
    }

  }

  createUser(user: User){
    this.userService.createUser(user);
  }

  isValidForm() {
    if(this.showLogIn){
      return this.username && this.password;
    }else{
      return this.username && this.email && this.password;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
