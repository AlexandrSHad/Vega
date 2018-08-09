import { Vehicle } from './../model/vehicle/vehicle';
import { SaveVehicle } from './../model/vehicle/saveVehicle';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'

@Injectable()
export class VehicleService {
  
  private readonly vehiclesEndpoint = '/api/vehicles';

  constructor(private http: HttpClient) { }
  
  getMakes() {
    return this.http.get<any[]>('/api/makes');
  }
  
  getFeatures() {
    return this.http.get<any[]>("/api/features");
  }
  
  create(vehicle: SaveVehicle) {
    return this.http.post(this.vehiclesEndpoint, vehicle);
  }
  
  getVehicle(id: any) {
    return this.http.get<Vehicle>(this.vehiclesEndpoint + "/" + id);
  }

  getVehicles(filter: any) {
    return this.http.get<Vehicle[]>(this.vehiclesEndpoint + "?" + this.toQueryString(filter));
  }
  
  update(vehicle: SaveVehicle) {
    return this.http.put(this.vehiclesEndpoint + "/" + vehicle.id, vehicle);
  }

  delete(id: any) {
    return this.http.delete(this.vehiclesEndpoint + "/" + id);
  }
  
  private toQueryString(obj: any) {
    var params = [];

    for (var property in obj) {
      var value = obj[property];

      if (value != null && value != undefined)
        params.push(encodeURIComponent(property) + '=' + encodeURIComponent(value));
    }

    return params.join('&');
  }
}
