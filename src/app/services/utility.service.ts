import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  covertDateFormat(dateToConvert: any) {
    var convertedDate = new Date(dateToConvert),
    month = ("0" + (convertedDate.getMonth() + 1)).slice(-2),
    day = ("0" + (convertedDate.getDate())).slice(-2);
    return [convertedDate.getFullYear(), month, day].join("-");
  }

  dateDifference(oldDate: any) {
    oldDate = Date.parse(oldDate);
    let diffInSeconds = Math.floor(Date.now() - oldDate) / 1000;
    let result;

    if(diffInSeconds >= 60) {
      result = ( diffInSeconds / 60 );

      if(result >=60) {
        result = result / 60;

        if(result >= 24) {
          result = result / 24;
          result = Math.floor(result);
          let suffix = result === 1 ? ' day' : ' days';
          return (result + suffix);
        }

        result = Math.floor(result);
        let suffix = result === 1 ? ' hour' : ' hours';
        return (result + suffix);
      }

      result = Math.floor(result);
      let suffix = result === 1 ? ' minute' : ' minutes';
      return (result + suffix);
    }

    diffInSeconds = Math.floor(diffInSeconds);
    let suffix = result === 1 ? ' sec' : ' secs';
    return (result + suffix);
  }

}
