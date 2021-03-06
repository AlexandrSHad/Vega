import { AuthService } from './services/auth.service';
import { PhotoService } from './services/photo.service';
import { AppErrorHandler } from './app.error-handler';
import { ErrorHandler, Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, BrowserXhr } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ToastyModule } from 'ng2-toasty';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';
import { VehicleService } from './services/vehicle.service';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { PaginationComponent } from './components/shared/pagination.component';
import { VehicleViewComponent } from './components/vehicle-view/vehicle-view.component';
import { ProgressService, BrowserXhrWithProgress } from './services/progress.service';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AuthGuard } from './services/auth-guard.service';
import { AuthAdminGuard } from './services/auth-admin-guard';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        VehicleFormComponent,
        VehicleListComponent,
        PaginationComponent,
        VehicleViewComponent,
        AdminPanelComponent,
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
            { path: 'vehicles/new', component: VehicleFormComponent, canActivate: [ AuthGuard ] },
            { path: 'vehicles/:id', component: VehicleViewComponent },
            { path: 'vehicles/edit/:id', component: VehicleFormComponent, canActivate: [ AuthGuard ] },
                { path: 'vehicles', component: VehicleListComponent },
                { path: 'admin', component: AdminPanelComponent, canActivate: [ AuthAdminGuard ] },
                { path: 'home', component: HomeComponent },
                { path: 'counter', component: CounterComponent },
                { path: 'fetch-data', component: FetchDataComponent },
                { path: '**', redirectTo: 'home' }
            ],
            //{ enableTracing: true } // <-- debugging purposes only - to debug route determination
        ),
        JwtModule.forRoot({
          config: {
            tokenGetter: () => localStorage.getItem('access_token'),
            // whitelistedDomains: ['localhost:5000'],
            // blacklistedRoutes: ['shad-vega.eu.auth0.com']
          }
        }),
        ToastyModule.forRoot(),
    ],
    providers: [
        { provide: ErrorHandler, useClass: AppErrorHandler },
        { provide: BrowserXhr, useClass: BrowserXhrWithProgress },
        AuthGuard,
        AuthAdminGuard,
        AuthService,
        PhotoService,
        ProgressService,
        VehicleService,
    ]
})
export class AppModuleShared {

    constructor(private authService: AuthService) {

        authService.handleAuthentication();

    }

}
