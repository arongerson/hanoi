import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';

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
    let width = this.getInitialDiskWidth();
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
      width -= 20;
    }
  }

  getInitialDiskWidth() {
    return this.sectionWidth - 40;
  }

  updateWidth() {
    this. sectionWidth = this.sectionA.offsetWidth;
    this.pinWidth = this.pinA.offsetWidth;
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
