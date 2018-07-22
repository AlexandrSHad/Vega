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
  allVehicles: Vehicle[] = [];
  vehicles: Vehicle[] = [];
  filter: any = {};

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.vehicleService.getMakes()
      .subscribe(makes => this.makes = makes);

    this.vehicleService.getVehicles()
      .subscribe(vehicles => this.vehicles = this.allVehicles = vehicles);
  }

  onFilterChange() {
    var vehicles = this.allVehicles;

    if (this.filter.makeId)
      vehicles = vehicles.filter(v => v.make.id == this.filter.makeId);

    // if you need filtering by a few parameters you could add it here
    // if (this.filter.modelId)
    //   vehicles = vehicles.filter(v => v.model.id == this.filter.modelId);

    this.vehicles = vehicles;
  }

  resetFilter() {
    this.filter = {};
    this.onFilterChange();
  }
}
