import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Bin } from 'src/app/models/bin';
import { BinService } from 'src/app/services/bin.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  constructor(private ngZone: NgZone, private binService: BinService){}

  @ViewChild(MapComponent) mapComponent!: MapComponent;
  selectedBin: Bin | undefined
  binEntities: Bin[] = [];
  enableUnload: boolean = false;

  ngOnInit(): void {
      this.binEntities = this.binService.getAllBins();
  }

  handleSelectedBin(bin: Bin) {
    console.log("UPDATE");
    this.ngZone.run(() => {
      this.selectedBin = bin;
    });
  }

  findPath(){
    this.mapComponent.findOptimalPath();
    this.enableUnload = true;
  }

  unloadBins(){
    this.mapComponent.removePath();
    this.enableUnload = false;
  }
}
