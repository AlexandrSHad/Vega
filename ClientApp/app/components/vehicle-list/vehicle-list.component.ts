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
  query: any = {};

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
    this.query = {};
    this.onFilterChange();
  }
  
  sortBy(columnName: string) {
    if (this.query.sortBy === columnName) {
      this.query.isSortAscending = !this.query.isSortAscending;
    } else {
      this.query.sortBy = columnName;
      this.query.isSortAscending = true;
    }

    this.populateVehicles();
  }

  private populateVehicles() {
    this.vehicleService.getVehicles(this.query)
      .subscribe(vehicles => this.vehicles = vehicles);
  }
}
