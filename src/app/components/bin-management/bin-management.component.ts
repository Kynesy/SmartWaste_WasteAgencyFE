import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { last } from 'rxjs';
import { Bin } from 'src/app/models/bin';
import { BinService } from 'src/app/services/bin.service';

@Component({
  selector: 'app-bin-management',
  templateUrl: './bin-management.component.html',
  styleUrls: ['./bin-management.component.scss']
})
export class BinManagementComponent implements OnInit{
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  showAddBin = false;
  showDeleteBin = false;
  selectedPosition: { lat: number; lng: number; } | undefined
  selectedBin: Bin | undefined;
  binEntities: Bin[] = []

  constructor(private ngZone: NgZone, private binService: BinService){}

  ngOnInit(): void {
      this.binEntities = this.binService.getAllBins();
  }

  toggleAddBin() {
    this.showAddBin = !this.showAddBin;
    this.showDeleteBin = false; // Close the other collapsible
  }

  toggleDeleteBin() {
    this.showDeleteBin = !this.showDeleteBin;
    this.showAddBin = false; // Close the other collapsible
  }

  handleSelectedCoords(position: { lat: number; lng: number; }) {
    this.selectedPosition = position;
    this.mapComponent.generateMarker(position.lat, position.lng);
  }

  handleSelectedBin(bin: Bin) {
    console.log("UPDATE");
    this.ngZone.run(() => {
      this.selectedBin = bin;
    });
  }
}
