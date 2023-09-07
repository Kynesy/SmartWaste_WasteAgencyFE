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

  @ViewChild(MapComponent) mapComponent!: MapComponent;
  selectedBin: Bin | undefined;
  binEntities: Bin[] = [];
  routingSolution: any;
  binsToUnload!: Bin[] | void;
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

  async findPath() {
    this.routingSolution = await this.mapComponent.findOptimalPath().catch(error => {
      console.error("Error getting path: " + error);
    });
    if(this.routingSolution){
      this.binsToUnload = this.routingSolution.path;
      this.timeToUnload = this.routingSolution.time;
      this.enableUnload = true;
    }
  }

  binsUnloaded() {
    this.mapComponent.removePath();
    this.enableUnload = false;
    this.binsToUnload = undefined;

    this.ngOnInit();
  }
  
  formatTime(seconds: number): string {
    const minutes = Math.floor(Math.round(seconds) / 60);
    const remainingSeconds = Math.round(seconds) - minutes * 60;
    return `${minutes} mins ${remainingSeconds} secs`;
  }
}
