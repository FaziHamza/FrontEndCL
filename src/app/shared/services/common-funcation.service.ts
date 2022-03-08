import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { OrganizationConfigurationDto } from '../models/organization';
import { timeInOutDto } from '../models/timesheet';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionService {

   constructor(public http: HttpClient) { }

  public getDayNameByDayId(day) {
    switch (day) {
      case 1:
        day = "M";
        return day;
      case 2:
        day = "T";
        return day;
      case 3:
        day = "W";
        return day;
      case 4:
        day = "T";
        return day;
      case 5:
        day = "F";
        return day;
      case 6:
        day = "S";
        return day;
      case 7:
        day = "S";
        return day;
    }
  }
  public getFullDayNameByDayId(day) {
    switch (day) {
      case 1:
        day = "Monday";
        return day;
      case 2:
        day = "Thusday";
        return day;
      case 3:
        day = "Wednesday";
        return day;
      case 4:
        day = "Thuresday";
        return day;
      case 5:
        day = "Friday";
        return day;
      case 6:
        day = "Saturday";
        return day;
      case 7:
        day = "Sunday";
        return day;
    }
  }
  getCurrentTime() {
    var today = new Date();
    var h = today.getHours().toString().length == 1 ? '0' + today.getHours() : today.getHours().toString();
    var t = today.getMinutes().toString().length == 1 ? '0' + today.getMinutes() : today.getMinutes().toString();;
    var getTime = h + ":" + t;
    return getTime;
  }

  getSytemInfo():Observable<timeInOutDto>{
    return this.http.get<any>('https://geolocation-db.com/json/')
  }


  public getTime(date) {
    if (date)
      return date.split('T')[1];
    else
      null;
  }
  public getTimeWithOutSecond(date) {
    if (date)
      return date.split('T')[1].slice(0,-3);
    else
      null;
  }

  sortDays(i, days): [] {
    let weeks = [];

    weeks.push(days[i]);

    for (let a = i + 1; a < days.length; a++) {
      if (a != i) {
        weeks.push(days[a]);
      }
    }
    for (let a = 0; a < i; a++) {
      if (a != i) {
        days[a].isStartingDay = false;
        weeks.push(days[a]);
      }
    }
    days = weeks;
    return days;
  }
  public getYear() {
    var dt = new Date();
    return dt.getFullYear();
  }
  public getJobId() {
    var currentOrgaization = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' ? null : localStorage.getItem("currentOrgaization"));
    if (currentOrgaization.jobDto != null || typeof currentOrgaization.jobDto != null) {
      return currentOrgaization.jobDto.jobId;
    }
  }
  public getOrganizationConfig(): OrganizationConfigurationDto {
    var currentOrgaization = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' ? null : localStorage.getItem("currentOrgaization"));
    if (currentOrgaization.organizationConfigurationDto != null || typeof currentOrgaization.organizationConfigurationDto != null) {
      return currentOrgaization.organizationConfigurationDto;
    }
  }

  public setDateFormat(date, format) {
    // let d = new Date(2010, 7, 5);
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    return (`${ye}${format}${mo}${format}${da}`);
  }

  public getFirstLatterAfetrSpace(str): string {
    var matches = str.toLocaleUpperCase().match(/\b(\w)/g); // ['J','S','O','N']
    var acronym = matches.join(''); // JSON
    return acronym.slice(0, 2);
  }
  public hoursToTimeconvert(num) {
    var hours = Math.floor(num / 60);
    var minutes = num % 60;
    return hours + ":" + minutes;
  }
  public hoursToTimeConvertforDb(num) {
    var hours = Math.floor(num / 60);
    var minutes = num % 60;
    return parseFloat(hours + "." + minutes);
  }
  public getBrowser() {
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
        return {name:'IE',version:(tem[1]||'')};
        }   
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR|Edge\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }   
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
      name: M[0]+M[1],
    };
    
 }

}
