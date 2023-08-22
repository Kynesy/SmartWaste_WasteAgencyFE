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
export class BinManagementComponent implements OnInit{
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  showAddBin = false;
  showDeleteBin = false;
  selectedPosition: { lat: number; lng: number; } | undefined
  selectedBin: Bin | undefined;
  binEntities: Bin[] = []

  constructor(private ngZone: NgZone, private binService: BinService, private toastService: ToastService){}

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
    this.ngZone.run(() => {
      this.selectedBin = bin;
    });
  }

  deleteBin() {
    if(this.selectedBin){
      this.binService.deleteBin(this.selectedBin.id).subscribe(
        (response) => {
          this.ngOnInit();
          this.toastService.showSuccessToast('Bin deleted with success.');
        },
        (error) => {
          this.toastService.showErrorToast('Error  bin.');
          console.error("Error updating user: ", error);
        }
      );
    }
  }
  
  createBin() {
    if(this.selectedPosition){
      var bin: Bin = {
        id: '',
        latitude: this.selectedPosition.lat,
        longitude: this.selectedPosition.lng,
        capacity: 100,
        sortedWaste: 0,
        unsortedWaste: 0,
        alertLevel: 0
      }
      this.binService.createBin(bin).subscribe(
        (response) => {
          this.ngOnInit();
          this.toastService.showSuccessToast('Bin created with success.');
        },
        (error) => {
          this.toastService.showErrorToast('Error creating bin.');
          console.error("Error updating user: ", error);
        }
      );
    }
  }
}
