import { Component, OnInit } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { VehicleService } from './../../services/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/defaultIfEmpty';
import { SaveVehicle } from './../../model/vehicle/saveVehicle';
import { Vehicle } from './../../model/vehicle/vehicle';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {

  makes: any[] = [];
  models: any[] = [];
  features: any[] = [];
  vehicle: SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    features: [],
    contact: {
      name: '',
      phone: '',
      email: '',
    },
  };
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private toastyService: ToastyService ) {

      route.params.subscribe(p => {
        this.vehicle.id = +p['id'] || 0;
      });

    }

  ngOnInit() {
    
    Observable.forkJoin(
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures(),
      this.vehicle.id ? this.vehicleService.getVehicle(this.vehicle.id) : Observable.empty<Vehicle>().defaultIfEmpty()
    )
    .subscribe((data) => {
      const [makes, features, vehicle] = data;
      this.makes = makes;
      this.features = features;

      if (this.vehicle.id) {
        this.setVehicle(vehicle);
        this.populateModels();
      }
    }, err => {
      if (err.status == 404)
        this.router.navigate(['/home']);
        // in real app you can use something like ['/not-found'] route and appropriate component
        // this will work only for getVehicle(), beacouse only from there we could get 404 error
    });

  }
  
  private setVehicle(v: Vehicle) {
    this.vehicle.id = v.id;
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.contact = v.contact;
    this.vehicle.features = v.features.map(f => f.id);
  }

  onMakeChenge() {
    this.populateModels();

    delete this.vehicle.modelId;
  }

  private populateModels() {
    var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }

  onFeatureToggle(featureId: number, $event: any) {
    if ($event.target.checked)
      this.vehicle.features.push(featureId);
    else {
      var index = this.vehicle.features.indexOf(featureId);
      this.vehicle.features.splice(index, 1);
    }
  }

  submit( ) {
    var result$ = (this.vehicle.id) ?
      this.vehicleService.update(this.vehicle) :
      this.vehicleService.create(this.vehicle);

    result$.subscribe(x => {
      this.toastyService.success({
        title: 'Success',
        msg: 'The vehicle was successfully saved.',
        theme: 'bootstrap',
        showClose: true,
        timeout: 5000
      });
    });
  }

  delete() {
    if (confirm('Are you shure?')) {
      this.vehicleService.delete(this.vehicle.id)
        .subscribe(x => {
          this.router.navigate(['/home']);
        });
    }
  }

}
