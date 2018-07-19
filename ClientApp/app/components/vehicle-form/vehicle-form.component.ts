import { Component, OnInit } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { VehicleService } from './../services/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {

  makes: any[] = [];
  models: any[] = [];
  features: any[] = [];
  vehicle: any = {
    features: [],
    contact: {},
  };
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private toastyService: ToastyService ) {

      route.params.subscribe(p => {
        this.vehicle.id = +p['id'];
      });

    }

  ngOnInit() {
    
    var sources = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures(),
    ];

    if (this.vehicle.id)
      sources.push(this.vehicleService.getVehicle(this.vehicle.id));

    Observable.forkJoin(sources).subscribe(data => {
      this.makes = data[0];
      this.features = data[1];

      if (this.vehicle.id)
        this.vehicle = data[2];
    }, err => {
      if (err.status == 404)
        this.router.navigate(['/home']);
        // in real app you can use something like ['/not-found'] route and appropriate component
        // this will work only for getVehicle(), beacouse only from there we could get 404 error
    });

  }
  
  onMakeChenge() {
    var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
    delete this.vehicle.modelId;
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
    this.vehicleService.create(this.vehicle)
      .subscribe(x => console.log(x));
  }

}
