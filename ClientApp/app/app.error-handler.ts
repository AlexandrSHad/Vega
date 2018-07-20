import { ErrorHandler, Inject, NgZone, isDevMode } from "@angular/core";
import { ToastyService } from "ng2-toasty";

export class AppErrorHandler implements ErrorHandler {
    
    constructor(
        @Inject(NgZone) private ngZone: NgZone,
        @Inject(ToastyService) private toastyService: ToastyService) { }

    handleError(error: any): void {
        if (!isDevMode())
        {
            // you can add logging errors to the specific service (like sentry.io or other)
            //Raven.captureException(error.originalError || error);
        }
        else
            console.error("An unexpected error happened: ", error);
        
        this.ngZone.run(() => {
            if (window !== undefined) {
                this.toastyService.error({
                    title: 'Error',
                    msg: 'An unexpected error happened.',
                    theme: 'bootstrap',
                    showClose: true,
                    timeout: 5000,
                });
            }
        });
    }

}
