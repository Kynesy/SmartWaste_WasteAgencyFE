import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent implements OnInit, OnDestroy {
  show = false;
  userID: string = "";
  user: User = {
    id: "",
    name: "",
    surname: "",
    email: "",
    bdate: ""
  };
  isEditMode: any;
  selectedDate: any;

  constructor(public authService: AuthService, private userService: UserService, private toastService: ToastService) { }

  async ngOnInit(): Promise<void> {
    await this.getUserID();
  }

  async getUserID() {
    await this.authService.user$.subscribe(
      (profile) => {
        var profileJson = JSON.stringify(profile, null, 2);
        const profileData = JSON.parse(profileJson || "");
        const subField = profileData['sub'] || '';
        const subParts = subField.split('|');

        if (subParts.length === 2 && subParts[0] === 'auth0') {
          this.userID = subParts[1];
          this.loadUser();
        } else {
          console.error("Invalid sub field format");
        }
      },
      (error) => {
        console.error("Error while getting user profile: ", error);
      }
    );
  }

  loadUser() {
    this.userService.getUser(this.userID).subscribe(
      (user) => {
        this.user = user;
        this.selectedDate = user.bdate;
      },
      (error) => {
        console.error("Error loading user: ", error);
      }
    );
  }

  updateUser() {
    this.user.id = this.userID;
    this.updateSelectedDate();
    this.userService.updateUser(this.user).subscribe(
      (response) => {
        this.loadUser(); // Reload the user data after update
        this.show = true;
        this.toastService.showSuccessToast('User data updated with success.');
        setTimeout(() => {
          this.show = false;
        }, 3000); // Hide after 3 seconds
      },
      (error) => {
        this.toastService.showErrorToast('Error while updating user data.');
        console.error("Error updating user: ", error);
      }
    );
  }

  ngOnDestroy(): void {
		this.toastService.clear();
	}

  updateSelectedDate(): void {
    if (this.selectedDate) {
      const selectedDateStr = `${this.selectedDate.year}-${this.selectedDate.month}-${this.selectedDate.day}`;
      this.user.bdate = selectedDateStr;
    }
  }

}
