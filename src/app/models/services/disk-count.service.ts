import { Injectable } from '@angular/core';

const NUMBER_OF_DISKS_KEY = 'NUMBER_OF_DISKS';
const DEFAULT_NUMBER_OF_DISKS = 5;
const MIN_NUMBER_OF_DISKS = 3;
const MAX_NUMBER_OF_DISKS = 10;

@Injectable({
  providedIn: 'root'
})
export class DiskCountService {

  constructor() { }

  getNumberOfDisks(): number {
    let numberOfDisks = localStorage.getItem(NUMBER_OF_DISKS_KEY);
    if (numberOfDisks !== undefined && numberOfDisks !== null) {
        try {
            let number = parseInt(numberOfDisks);
            if (number >= MIN_NUMBER_OF_DISKS && number <= MAX_NUMBER_OF_DISKS) {
              return number;
            }
            return DEFAULT_NUMBER_OF_DISKS;
        } catch{
          return DEFAULT_NUMBER_OF_DISKS;
        }
    }
    return DEFAULT_NUMBER_OF_DISKS;
  }
  
  setNumberOfDisks(numberOfDisks: number) {
    localStorage.setItem(NUMBER_OF_DISKS_KEY, numberOfDisks.toString());
  }
}
