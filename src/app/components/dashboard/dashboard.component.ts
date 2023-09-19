import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Bin } from 'src/app/models/bin';
import { BinService } from 'src/app/services/bin.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  timeToUnload: any;

  constructor(private ngZone: NgZone, private binService: BinService) {}

  // Riferimento al componente della mappa
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  
  // Bidone selezionato
  selectedBin: Bin | undefined;
  
  // Lista dei bidoni nell'app
  binEntities: Bin[] = [];
  
  // Soluzione di routing per il percorso ottimale
  routingSolution: any;
  
  // Lista dei bidoni da scaricare
  binsToUnload!: Bin[] | void;
  
  // Abilita o disabilita il caricamento
  enableUnload: boolean = false;

  ngOnInit(): void {
    // Recupera tutti i bidoni dal servizio
    this.binService.getAllBins().subscribe(
      (bins: Bin[]) => {
        this.binEntities = bins;
      },
      (error: any) => {
        console.error('Error retrieving bins:', error);
      }
    );
  }

  // Gestisce la selezione di un bidone
  handleSelectedBin(bin: Bin) {
    this.ngZone.run(() => {
      this.selectedBin = bin;
    });
  }

  // Trova il percorso ottimale sulla mappa
  async findPath() {
    this.routingSolution = await this.mapComponent.findOptimalPath().catch(error => {
      console.error("Error getting path: " + error);
    });
    if (this.routingSolution) {
      this.binsToUnload = this.routingSolution.path;
      this.timeToUnload = this.routingSolution.time;
      this.enableUnload = true;
    }
  }

  // Gestisce lo scarico dei bidoni
  binsUnloaded() {
    this.mapComponent.removePath();
    this.enableUnload = false;
    this.binsToUnload = undefined;

    // Aggiorna la lista dei bidoni dopo lo scarico
    this.ngOnInit();
  }
  
  // Formatta il tempo in minuti e secondi
  formatTime(seconds: number): string {
    const minutes = Math.floor(Math.round(seconds) / 60);
    const remainingSeconds = Math.round(seconds) - minutes * 60;
    return `${minutes} mins ${remainingSeconds} secs`;
  }
}
