import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import * as Leaflet from 'leaflet';
import 'leaflet-routing-machine';

import { Bin } from 'src/app/models/bin';
import { MapService } from 'src/app/services/map.service';

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
  alertBins: Bin[] | undefined;

  redBin = new Leaflet.Icon({
    iconUrl: 'assets/redBin.png', // Path to your custom marker icon
    iconSize: [30, 30], // Size of the icon image
    iconAnchor: [15, 15], // Point of the icon which corresponds to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  });

  orangeBin = new Leaflet.Icon({
    iconUrl: 'assets/orangeBin.png', // Path to your custom marker icon
    iconSize: [30, 30], // Size of the icon image
    iconAnchor: [15, 15], // Point of the icon which corresponds to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  });

  greenBin = new Leaflet.Icon({
    iconUrl: 'assets/greenBin.png', // Path to your custom marker icon
    iconSize: [30, 30], // Size of the icon image
    iconAnchor: [15, 15], // Point of the icon which corresponds to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  });

  blueMarker = new Leaflet.Icon({
    iconUrl: 'assets/blueMarker.png', // Path to your custom marker icon
    iconSize: [25, 41], // Size of the icon image
    iconAnchor: [12, 41], // Point of the icon which corresponds to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
    shadowUrl: 'assets/marker-shadow.png', // Path to the shadow image (optional)
    shadowSize: [41, 41], // Size of the shadow image (optional)
    shadowAnchor: [12, 41] // Point of the shadow image which corresponds to marker's location (optional)
  });
  
  private polyline: Leaflet.Polyline | null = null;
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 15,
    center: { lat: 40.3539, lng: 18.1750 } // Lecce, Italy coordinates
  }

  constructor(private mapService: MapService){}

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.initMarkers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bins']) {
      this.clearMarkers();
      if (this.bins && this.bins.length > 0) {
        this.initMarkers();
      }
    }
  }

  clearMarkers() {
    for (const marker of this.markers) {
      marker.removeFrom(this.map);
    }
    this.markers = [];
  }
  
  initMarkers() {
    for (let index = 0; index < this.bins.length; index++) {
      const tmpBin = this.bins[index];
      const marker = this.generateBin(tmpBin, index);
      marker.addTo(this.map).bindPopup(`<b>Bin ID: </b>${tmpBin.id}<br><b>Capacity: </b>${tmpBin.capacity}`);
      this.map.panTo({ lat: tmpBin.latitude, lng: tmpBin.longitude});
      this.markers.push(marker)
    }
  }

  generateBin(tmpBin: any, index: number) {
    var tmpIcon: any | undefined;

    switch(tmpBin.alertLevel){
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

    return Leaflet.marker({ lat: tmpBin.latitude, lng: tmpBin.longitude}, {icon: tmpIcon, draggable: false })
      .on('click', (event) => this.markerClicked(event, index))
  }

  mapClicked($event: any) {
    this.selectedCoords.emit({ lat: $event.latlng.lat, lng: $event.latlng.lng })
  }

  markerClicked($event: any, index: number) {
    this.selectedBin.emit(this.bins[index]);
  }

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

  findOptimalPath() {
    this.alertBins = this.bins.filter(bin => bin.alertLevel === 1 || bin.alertLevel === 2);
  
    if (this.alertBins.length < 1) {
      console.log('There are not enough bins with alert level 1 or 2 to calculate a path.');
      return;
    }
  
    const locations: number[][] = this.alertBins.map(bin => [bin.longitude, bin.latitude]);
  
    this.mapService.calculateDistanceMatrix(locations).subscribe((response: any) => {
      const snappedDistances = response.destinations.map((dest: { snapped_distance: any; }) => dest.snapped_distance);
      const pathIndices = this.calculateOptimalPath(response.durations);
  
      const pathCoordinates = pathIndices.map((index, i) => {
        const snappedDist = snappedDistances[i];
        const snappedCoord = locations[index];
        return Leaflet.latLng(snappedCoord[1], snappedCoord[0]);
      });
      
      
      if (this.polyline) {
        this.map.removeLayer(this.polyline);
      }
  
      // Create and add the new polyline
      this.polyline = Leaflet.polyline(pathCoordinates, { color: 'blue' }).addTo(this.map);
      this.map.fitBounds(this.polyline.getBounds());
  
    });
  }
  
  calculateOptimalPath(distances: number[][]) {
    const n = distances.length;
    let unvisited = Array.from({ length: n }, (_, i) => i);
    let pathIndices: number[] = [];
    let currIndex = 0;
  
    while (unvisited.length > 0) {
      pathIndices.push(currIndex);
      unvisited = unvisited.filter(index => index !== currIndex);
      if (unvisited.length > 0) {
        currIndex = this.findClosestNeighbor(currIndex, unvisited, distances);
      }
    }
  
    return pathIndices;
  }
  
  findClosestNeighbor(currIndex: number, unvisited: number[], distances: number[][]) {
    const neighbors = unvisited.map(index => ({ index, distance: distances[currIndex][index] }));
    neighbors.sort((a, b) => a.distance - b.distance);
    return neighbors[0].index;
  }
  
  removePath(): Bin[] | undefined{
    if (this.polyline) {
      this.map.removeLayer(this.polyline);
      this.initMarkers();
    }
    
    return this.alertBins;
  }
  
}