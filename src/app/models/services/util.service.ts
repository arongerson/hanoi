import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  getHourMinSec(startTime: number) {
    let millis = Date.now() - startTime;
    let seconds = Math.round(millis / 1000);
    let secondsElapsed = seconds % 60;
    let minutes = Math.floor(seconds / 60);
    let minutesElapsed = minutes % 60;
    let hoursElapsed = Math.floor(minutes / 60);
    return [hoursElapsed, minutesElapsed, secondsElapsed];
  }

  formatTime(value: number) {
    if (value < 10) {
        return `0${value}`;
    }
    return value;
  }

  formatTotatlTime(times: number[]): string {
    let hours = this.formatTimeToText(times[0], 'hour');
    let minutes = this.formatTimeToText(times[1], 'minute');
    let seconds = this.formatTimeToText(times[2], 'second');
    return `${hours}${minutes}${seconds}`;
  }

  private formatTimeToText(value: number, text: string) {
    if (value > 0) {
      text = value > 1 ? text + 's' : text;
      return `${value} ${text} `;
    }
    return '';
  }
}
