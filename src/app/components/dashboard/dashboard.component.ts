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
    this.mapComponent.findOptimalPath();
    this.enableUnload = true;
  }

  unloadBins() {
    var binsToUnload: Bin[] | undefined = this.mapComponent.removePath();
    this.enableUnload = false;
    
    if (binsToUnload) {
      binsToUnload.forEach((bin: Bin) => {
        this.binService.unloadBin(bin.id).subscribe(
          () => {
            console.log('Bin unloaded successfully:', bin.id);
          },
          (error: any) => {
            console.error('Error unloading bin:', bin.id, error);
          }
        );
      });
    }

    this.ngOnInit();
  }
}
