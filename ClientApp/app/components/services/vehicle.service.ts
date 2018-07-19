import { Http } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/map'

@Injectable()
export class VehicleService {
  
  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: Http) { }

  getMakes() {
    //return this.http.get('/api/makes')
    return this.http.get(`${ this.baseUrl.replace(/\/$/, "") }/api/makes/`)
      .map(res => res.json());
  }

  getFeatures() {
    return this.http.get(`${ this.baseUrl.replace(/\/$/, "") }/api/features`)
      .map(res => res.json());
  }
  
  create(vehicle: any) {
    return this.http.post("/api/vehicles", vehicle)
      .map(res => res.json());
  }

  getVehicle(id: number) {
    return this.http.get("/api/vehicles/" + id)
      .map(res => res.json());
  }

}
