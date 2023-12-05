import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  show = false; // Variabile per mostrare/nascondere un messaggio
  userID: string | null = "";
  user: User = {
    id: "",
    name: "",
    surname: "",
    email: "",
    bdate: "",
    username: '',
    role: ''
  };
  isEditMode: any;
  selectedDate: any;
  role: string | undefined;

  constructor(private storageService: SessionStorageService, private userService: UserService, private toastService: ToastService) { }

  ngOnInit(): void {
    if(this.storageService.isUserLogged()){
      this.user.username = this.storageService.getData("username")!;
      this.user.email = this.storageService.getData("email")!;
      this.role = this.storageService.getData("role")!;
      this.userID = this.storageService.getData("id")!;
      this.user.id = this.userID!;
      this.loadUser();
    }
  }


  // Carica i dati dell'utente dal servizio
  loadUser() {
    this.userService.getUser(this.user.id).subscribe(
      (userData) => {
        this.user.bdate = userData.bdate;
        this.user.surname = userData.surname;
        this.user.name = userData.name;
      },
      (error) => {
        console.error("Error loading user: ", error);
      }
    );  
  }

  // Aggiorna i dati dell'utente
  updateUser() {
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
