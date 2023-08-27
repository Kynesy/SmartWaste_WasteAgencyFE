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

  constructor(private ngZone: NgZone, private binService: BinService) {}

  @ViewChild(MapComponent) mapComponent!: MapComponent;
  selectedBin: Bin | undefined;
  binEntities: Bin[] = [];
  binsToUnload: Bin[] | undefined;
  enableUnload: boolean = false;

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

  handleSelectedBin(bin: Bin) {
    this.ngZone.run(() => {
      this.selectedBin = bin;
    });
  }

  findPath() {
    this.binsToUnload = this.mapComponent.findOptimalPath();
    this.enableUnload = true;
  }

  binsUnloaded() {
    this.mapComponent.removePath();
    this.enableUnload = false;
    this.binsToUnload = undefined;


    this.ngOnInit();
  }
}
