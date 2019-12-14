import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';

const DESIRED_DISK_MIN_SIZE = 40;
const DISK_MIN_SIZE = 20;
const DESIRED_MIN_OFFSET = 20;
const EXTRA_SMALL_OFFSET = 10;


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  sectionA: HTMLElement;
  sectionB: HTMLElement;
  sectionC: HTMLElement;

  pinA: HTMLElement;
  pinB: HTMLElement;
  pinC: HTMLElement;

  disks: HTMLElement[] = [];

  colors: string[] = [
        'brown', 'crimson', 'darkcyan', 'darkgoldenrod', 'darkmagenta' ,
        'dodgerblue', 'goldenrod', 'indigo', 'lawngreen', 'lightcoral'
  ]

  sectionWidth: number;
  pinWidth: number;

  numberOfDisks = 10;

  constructor() { }

  ngOnInit() {
    this.getElements();
    this.align();
  }

  ngAfterViewInit() {
    // sections 
    this.sectionA = document.getElementById('secA');
    this.sectionB = document.getElementById('secB');
    this.sectionC = document.getElementById('secC');

    // pins
    this.pinA = document.getElementById('pinA');
    this.pinB = document.getElementById('pinB');
    this.pinC = document.getElementById('pinC');

    this.updateWidth();
    this.updatePinPosition();
    this.createDisks();
  }

  createDisks() {
    let width = this.sectionWidth;
    let diskWidthOffset = this.getDiskWidthOffset();
    let height = 30;
    for (let i = 0; i < this.numberOfDisks; i++) {
      let disk = document.createElement('div');
      disk.style.position = 'absolute';
      disk.style.bottom = `${i*height}px`;
      disk.style.left = `${(this.sectionWidth - width) / 2}px`
      disk.style.height = `${height}px`;
      disk.style.width = `${width}px`;
      disk.style.backgroundColor = this.colors[i];
      disk.style.border = 'solid 1px black';
      this.disks.push(disk);
      this.sectionA.appendChild(disk);
      // update dimensions
      width -= diskWidthOffset;
    }
  }

  updateDiskWidth() {
    let width = this.sectionWidth;
    let diskWidthOffset = this.getDiskWidthOffset();
    for (let disk of this.disks) {
      disk.style.width = `${width}px`;
      width -= diskWidthOffset;
    }
  }

  updateWidth() {
    this. sectionWidth = this.sectionA.offsetWidth;
    this.pinWidth = this.pinA.offsetWidth;
    this.updateDiskWidth();
  }

  updatePinPosition() {
    let offset = (this.sectionWidth - this.pinWidth) / 2;
    this.pinA.style.left = `${offset}px`;
    this.pinB.style.left = `${offset}px`;
    this.pinC.style.left = `${offset}px`;
    for (let disk of this.disks) {
      disk.style.left = `${(this.sectionWidth - disk.offsetWidth)/ 2}px`;
    }
  }

  getDiskWidthOffset() {
    let diskOffset = (this.sectionWidth - DESIRED_DISK_MIN_SIZE) / this.numberOfDisks;
    if (diskOffset >= DESIRED_MIN_OFFSET) {
      return diskOffset;
    } else {
      diskOffset = (this.sectionWidth - DISK_MIN_SIZE) / this.numberOfDisks;
      if (diskOffset >= DESIRED_MIN_OFFSET) {
        return diskOffset;
      } else {
        return EXTRA_SMALL_OFFSET;
      }
    } 
  }

  getElements() {
    
  }

  align() {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // event.target.innerWidth;
    this.updateWidth();
    this.updatePinPosition();
  }

}