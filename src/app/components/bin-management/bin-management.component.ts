import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { Bin } from 'src/app/models/bin';
import { BinService } from 'src/app/services/bin.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-bin-management',
  templateUrl: './bin-management.component.html',
  styleUrls: ['./bin-management.component.scss']
})
export class BinManagementComponent implements OnInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  showAddBin = false;
  showDeleteBin = false;
  selectedPosition: { lat: number; lng: number; } | undefined;
  selectedBin: Bin | undefined;
  binEntities: Bin[] = [];

  constructor(private ngZone: NgZone, private binService: BinService, private toastService: ToastService) {}

  /**
   * Metodo chiamato quando il componente è inizializzato.
   * Recupera tutti i bidoni dal servizio e li memorizza nella lista binEntities.
   */
  ngOnInit(): void {
    this.binService.getAllBins().subscribe(
      (bins: Bin[]) => {
        this.binEntities = bins;
      },
      (error: any) => {
        console.error('Error retrieving bins:', error);
      }
    );
  }

  /**
   * Mostra o nasconde il componente per l'aggiunta di un bidone.
   */
  toggleAddBin() {
    this.showAddBin = !this.showAddBin;
    this.showDeleteBin = false; // Chiude l'altro componente collassabile
  }

  /**
   * Mostra o nasconde il componente per la cancellazione di un bidone.
   */
  toggleDeleteBin() {
    this.showDeleteBin = !this.showDeleteBin;
    this.showAddBin = false; // Chiude l'altro componente collassabile
  }

  /**
   * Gestisce la selezione delle coordinate sulla mappa.
   * @param {Object} position - Oggetto contenente le coordinate latitudine e longitudine.
   */
  handleSelectedCoords(position: { lat: number; lng: number; }) {
    this.selectedPosition = position;
    this.mapComponent.generateMarker(position.lat, position.lng);
  }

  /**
   * Gestisce la selezione di un bidone.
   * @param {Bin} bin - Il bidone selezionato.
   */
  handleSelectedBin(bin: Bin) {
    this.ngZone.run(() => {
      this.selectedBin = bin;
    });
  }

  /**
   * Cancella un bidone selezionato.
   */
  deleteBin() {
    if (this.selectedBin) {
      this.binService.deleteBin(this.selectedBin.id).subscribe(
        (response) => {
          this.ngOnInit(); // Aggiorna la lista dei bidoni dopo la cancellazione.
          this.toastService.showSuccessToast('Bin deleted with success.');
          this.selectedBin = undefined;
        },
        (error) => {
          this.toastService.showErrorToast('Error deleting bin.');
          console.error("Error deleting bin: ", error);
        }
      );
    }
  }

  /**
   * Crea un nuovo bidone con le coordinate selezionate.
   */
  createBin() {
    if (this.selectedPosition) {
      const bin: Bin = {
        id: '',
        latitude: this.selectedPosition.lat,
        longitude: this.selectedPosition.lng,
        capacity: 100,
        sortedWaste: 0,
        unsortedWaste: 0,
        alertLevel: 0
      };
      this.binService.createBin(bin).subscribe(
        (response) => {
          this.ngOnInit(); // Aggiorna la lista dei bidoni dopo la creazione.
          this.toastService.showSuccessToast('Bin created with success.');
        },
        (error) => {
          this.toastService.showErrorToast('Error creating bin.');
          console.error("Error creating bin: ", error);
        }
      );
    }
  }
}
