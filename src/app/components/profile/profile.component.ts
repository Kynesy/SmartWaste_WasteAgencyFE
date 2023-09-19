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
  show = false; // Variabile per mostrare/nascondere un messaggio
  userID: string = ""; // ID dell'utente autenticato
  user: User = {
    id: "",
    name: "",
    surname: "",
    email: "",
    bdate: ""
  }; // Dati dell'utente
  isEditMode: any; // Variabile per la modalità di modifica
  selectedDate: any; // Data selezionata

  constructor(public authService: AuthService, private userService: UserService, private toastService: ToastService) { }

  async ngOnInit(): Promise<void> {
    await this.getUserID();
  }

  // Ottiene l'ID dell'utente autenticato dal profilo
  async getUserID() {
    await this.authService.user$.subscribe(
      (profile) => {
        var profileJson = JSON.stringify(profile, null, 2);
        const profileData = JSON.parse(profileJson || "");
        const subField = profileData['sub'] || '';
        const subParts = subField.split('|');

        if (subParts.length === 2 && subParts[0] === 'auth0') {
          this.userID = subParts[1]; // Estrae l'ID dall'oggetto del profilo
          this.loadUser(); // Carica i dati dell'utente dal servizio
        } else {
          console.error("Invalid sub field format");
        }
      },
      (error) => {
        console.error("Error while getting user profile: ", error);
      }
    );
  }

  // Carica i dati dell'utente dal servizio
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

  // Aggiorna i dati dell'utente
  updateUser() {
    this.user.id = this.userID; // Imposta l'ID dell'utente
    this.updateSelectedDate(); // Aggiorna la data selezionata
    this.userService.updateUser(this.user).subscribe(
      (response) => {
        this.loadUser(); // Ricarica i dati dell'utente dopo l'aggiornamento
        this.show = true; // Mostra un messaggio di successo
        this.toastService.showSuccessToast('User data updated with success.');
        setTimeout(() => {
          this.show = false; // Nascondi il messaggio dopo 3 secondi
        }, 3000);
      },
      (error) => {
        this.toastService.showErrorToast('Error while updating user data.'); // Mostra un messaggio di errore
        console.error("Error updating user: ", error);
      }
    );
  }

  ngOnDestroy(): void {
    this.toastService.clear(); // Cancella i messaggi di tostatura quando il componente viene distrutto
  }

  // Aggiorna la data nell'oggetto dell'utente
  updateSelectedDate(): void {
    if (this.selectedDate) {
      const selectedDateStr = `${this.selectedDate.year}-${this.selectedDate.month}-${this.selectedDate.day}`;
      this.user.bdate = selectedDateStr;
    }
  }

}
