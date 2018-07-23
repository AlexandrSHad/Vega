import { KeyValuePair } from './../../model/keyValuePair';
import { VehicleService } from './../../services/vehicle.service';
import { Vehicle } from './../../model/vehicle/vehicle';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  makes: KeyValuePair[] = [];
  vehicles: Vehicle[] = [];
  filter: any = {};

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.vehicleService.getMakes()
      .subscribe(makes => this.makes = makes);

    this.populateVehicles();
  }
  
  onFilterChange() {
    this.populateVehicles();
  }
  
  resetFilter() {
    this.filter = {};
    this.onFilterChange();
  }
  
  private populateVehicles() {
    this.vehicleService.getVehicles(this.filter)
      .subscribe(vehicles => this.vehicles = vehicles);
  }
}
