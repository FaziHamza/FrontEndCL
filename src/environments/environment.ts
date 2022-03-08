// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    hmr: false,
    apiUrl: 'http://localhost:4000',
    serverApiUrl: 'https://localhost:44370',
    showLogs: true,
    logErrors: true,
    successMessage: "The operation has been completed successfully",
    errorMessage: "Sorry! Some exception has been occured, Please try again later.",
    blockUIMessage:"Saving Please Wait.",
    perDayhours:8


};

/*
 [routerLink]="'/timesheet/daily-activity/'+itm.timeSheetDailyActivityId+'/1'"
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
