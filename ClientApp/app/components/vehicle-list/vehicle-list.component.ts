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
  private readonly PAGE_SIZE = 3;
  makes: KeyValuePair[] = [];
  queryResult: any = {};
  query: any = {
    pageSize: this.PAGE_SIZE,
  };
  columns = [
    { title: 'Id', key: 'id' },
    { title: 'Make', key: 'make', isSortable: true },
    { title: 'Model', key: 'model', isSortable: true },
    { title: 'Contact Name', key: 'contactName', isSortable: true },
    { }
  ];

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.vehicleService.getMakes()
      .subscribe(makes => this.makes = makes);

    this.populateVehicles();
  }
  
  onFilterChange() {
    this.query.page = 1;
    this.populateVehicles();
  }
  
  resetFilter() {
    this.query = {
      page: 1,
      pageSize: this.PAGE_SIZE,
    };
    this.populateVehicles();
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

  onPageChanged(page: number) {
    this.query.page = page;
    this.populateVehicles();
  }

  private populateVehicles() {
    this.vehicleService.getVehicles(this.query)
      .subscribe(queryResult => this.queryResult = queryResult);
  }
}
