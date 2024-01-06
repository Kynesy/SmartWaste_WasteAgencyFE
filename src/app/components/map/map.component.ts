import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import * as Leaflet from 'leaflet';
import 'leaflet-routing-machine';

import { Bin } from 'src/app/models/bin';
import { MapService } from 'src/app/services/map.service';
import { ToastService } from 'src/app/services/toast.service';
import { TspSolver } from 'src/app/utils/TspSolverBridge';
import { TspSolverService } from 'src/app/utils/tsp-solver.service';

Leaflet.Icon.Default.imagePath = 'assets/';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent {
  @Input() bins: Bin[] = [];
  @Output() selectedBin = new EventEmitter<Bin>();
  @Output() selectedCoords = new EventEmitter<{ lat: number, lng: number }>();
  binsToUnload: Bin[] = [];

  // Marker per i bidoni pieni
  redBin = new Leaflet.Icon({
    iconUrl: 'assets/redBin.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [1, -34],
  });

  // Marker per i bidoni semivuoti
  orangeBin = new Leaflet.Icon({
    iconUrl: 'assets/orangeBin.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [1, -34],
  });

  // Marker per i bidoni vuoti
  greenBin = new Leaflet.Icon({
    iconUrl: 'assets/greenBin.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [1, -34],
  });


  // Marker per i nuovi bin
  blueMarker = new Leaflet.Icon({
    iconUrl: 'assets/blueMarker.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'assets/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
  });

  private pathPolyline: Leaflet.Polyline | null = null;
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 15,
    center: { lat: 40.3539, lng: 18.1750 }
  }

  constructor(private mapService: MapService, private tspSolverService: TspSolverService, private toastService: ToastService) { }

  // Callback quando la mappa è pronta
  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.displayAllBins();
  }

  // Callback quando si fa clic sulla mappa
  mapClicked($event: any) {
    this.selectedCoords.emit({ lat: $event.latlng.lat, lng: $event.latlng.lng })
  }

  // Callback quando si fa clic su un marker
  markerClicked($event: any, index: number) {
    this.selectedBin.emit(this.bins[index]);
  }

  // Callback per il rilevamento dei cambiamenti negli input
  ngOnChanges(changes: SimpleChanges) {
    if (changes['bins']) {
      this.clearMarkers();
      if (this.bins && this.bins.length > 0) {
        this.displayAllBins();
        this.map.setZoomAround({lat: 40.3539, lng: 18.1750}, 14);
      }
    }
  }

  // Rimuove tutti i marker dalla mappa
  clearMarkers() {
    for (const marker of this.markers) {
      marker.removeFrom(this.map);
    }
    this.markers = [];
  }

  // Visualizza tutti i bidoni sulla mappa
  displayAllBins() {
    for (let index = 0; index < this.bins.length; index++) {
      const tmpBin = this.bins[index];
      const marker = this.generateBinMarker(tmpBin, index);

      const copyButton = `<button class="btn btn-outline-primary btn-sm copy">Copy Info</button>`;
      const popupContent = `<b>Bin ID:</b> ${tmpBin.id}<br><b>Capacity:</b> ${tmpBin.capacity}<br>${copyButton}`;
      
      marker.addTo(this.map).bindPopup(popupContent).on("popupopen", (event) => {
        const popup = event.target.getPopup();
        const button = popup.getElement().querySelector(".copy");
        if (button) {
          button.addEventListener("click", () => this.copyBinInfo(tmpBin.id, tmpBin.latitude, tmpBin.longitude, tmpBin.capacity));
        }
      });
      this.map.panTo({ lat: tmpBin.latitude, lng: tmpBin.longitude });
      this.markers.push(marker)
    }
  }

  copyBinInfo(id: string, lat: number, lng: number, capacity: number) {
    const formattedLat = lat.toFixed(2).replace('.', ',');
    const formattedLng = lng.toFixed(2).replace('.', ',');
    const binInfo = `${id} ${formattedLat} ${formattedLng} ${capacity}`;
    const el = document.createElement('textarea');
    el.value = binInfo;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Bin information copied to clipboard!');
  }
  

  // Genera un marker per un bidone
  generateBinMarker(tmpBin: any, index: number) {
    var tmpIcon: any | undefined;

    switch (tmpBin.alertLevel) {
      case 0:
        tmpIcon = this.greenBin;
        break;
      case 1:
        tmpIcon = this.orangeBin;
        break;
      case 2:
        tmpIcon = this.redBin;
        break;
      default:
        tmpIcon = this.blueMarker;
        break;
    }

    return Leaflet.marker({ lat: tmpBin.latitude, lng: tmpBin.longitude }, { icon: tmpIcon, draggable: false })
      .on('click', (event) => this.markerClicked(event, index))
  }

  // Genera un marker sulla mappa
  generateMarker(lat: number, long: number) {
    const lastMarker = this.markers[this.markers.length - 1];

    if (lastMarker && lastMarker.options.icon === this.blueMarker) {
      this.markers.pop();
      this.map.removeLayer(lastMarker);
    }

    const marker = Leaflet.marker({ lat: lat, lng: long }, { icon: this.blueMarker, draggable: false });
    marker.addTo(this.map).bindPopup(`<b>Lat: </b>${lat}<br><b>Long: </b>${long}`);
    this.map.panTo({ lat: lat, lng: long });
    this.markers.push(marker);
  }

  // Trova il percorso ottimale sulla mappa
  findOptimalPath(): Promise<any> {
    var alertBins: Bin[] | undefined;
    // seleziono i bidoni con capienza minore del 50%
    alertBins = this.bins.filter(bin => bin.alertLevel === 1 || bin.alertLevel === 2);

    // estraggo le coordinate dei bidoni
    const locations: number[][] = alertBins.map(bin => [bin.longitude, bin.latitude]);

    return new Promise((resolve, reject) => {
      if (alertBins!.length < 1) {
        this.toastService.showErrorToast("Not enought full bins to create a path");
        reject('There are not enough bins with alert level 1 or 2 to calculate a path.');
        
      } else {
        // ottengo la matrice dei costi dal servizio
        this.mapService.calculateDistanceMatrix(locations).subscribe((response: any) => {
          const durationsMatrix = response.durations;

          // calcolo la soluzione ottimale
          const tspSolver: TspSolver = this.tspSolverService.getSolver();
          const routingSolution = tspSolver.findOptimalSolution(durationsMatrix);

          // riordino i cestini secondo la soluzione ottimale
          for (var i = 0; i < routingSolution.path.length; i++) {
            this.binsToUnload.push(alertBins![routingSolution.path[i]]);
          }

          this.showPath();
          resolve({ "path": this.binsToUnload, "time": routingSolution.distance });
        });
      }
    })
  }

  // Mostra il percorso sulla mappa
  showPath() {
    if (this.pathPolyline) {
      this.map.removeLayer(this.pathPolyline);
    }

    const pathCoordinates: Leaflet.LatLngExpression[] = this.binsToUnload.map(bin => {
      return [bin.latitude, bin.longitude]; // Si presume che bin.latitude e bin.longitude siano numeri
    });

    // Crea e aggiunge la nuova polilinea
    this.pathPolyline = Leaflet.polyline(pathCoordinates, { color: 'blue' }).addTo(this.map);

    // Facoltativamente, è possibile adattare i limiti della mappa alla polilinea
    this.map.fitBounds(this.pathPolyline.getBounds());
  }

  // Rimuove il percorso dalla mappa
  removePath() {
    if (this.pathPolyline) {
      this.map.removeLayer(this.pathPolyline);
      this.binsToUnload = [];
      this.displayAllBins();
    }
  }

}
