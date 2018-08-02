import { ToastyService } from 'ng2-toasty';
import { PhotoService } from './../../services/photo.service';
import { VehicleService } from './../../services/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-vehicle-view',
  templateUrl: './vehicle-view.component.html',
  styleUrls: ['./vehicle-view.component.css']
})
export class VehicleViewComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef = new ElementRef({});
  vehicleId: number = 0;
  vehicle: any;
  photos: any[] = [];
  progress: any;

  constructor(
    private zone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private progressService: ProgressService,
    private vehicleService: VehicleService,
    private photoService: PhotoService,
    private toastyService: ToastyService,
  ) {
    this.route.params.subscribe(p => {
      this.vehicleId = +p['id'];
      if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
        this.router.navigate(['/vehicles']);
      }
    });
  }

  ngOnInit() {
    this.photoService.getVehiclePhotos(this.vehicleId)
      .subscribe(photos => this.photos = photos);

    this.vehicleService.getVehicle(this.vehicleId)
      .subscribe(
        v => this.vehicle = v,
        err => {
          if (err.status == 404) {
            this.router.navigate(['/vehicles']);
            return;
          }
        }
      );
  }

  delete() {
    if (confirm('Are you sure?')) {
      this.vehicleService.delete(this.vehicle.id)
        .subscribe(
          x => this.router.navigate(['/vehicles']),
          err => console.log(err)
        );
    }
  }

  uploadPhoto() {
    this.progressService.startTracking()
      .subscribe(
        progress => {
          this.zone.run(() => this.progress = progress);
          console.log(progress);
        },
        undefined,
        () => { this.progress = null; }
      );

    var file = this.fileInput.nativeElement.files[0];
    this.fileInput.nativeElement.value = '';

    this.photoService.upload(this.vehicleId, file)
      .subscribe(photo => {
        this.photos.push(photo);
      },
      err => {
        this.toastyService.error({
          title: 'Error',
          msg: err.text(),
          theme: 'bootstrap',
          showClose: true,
          timeout: 5000,
        });
      });
  }

}
