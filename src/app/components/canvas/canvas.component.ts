import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

const DESIRED_DISK_MIN_SIZE = 40;
const DISK_MIN_SIZE = 20;
const DESIRED_MIN_OFFSET = 20;
const EXTRA_SMALL_OFFSET = 10;

export interface Disk {
  index: number;
  pin: Pin;
  element: HTMLElement;
}

export interface Pin {
  name: string;
  index: number;
  element: HTMLElement;
  disks: Disk[];
}


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  sectionA: HTMLElement;
  sectionB: HTMLElement;
  sectionC: HTMLElement;
  canvas: any;

  pinA: Pin;
  pinB: Pin;
  pinC: Pin;

  currentX: number;
  currentY: number;
  initialX: number;
  initialY: number;
  xOffset: number = 0;
  yOffset: number = 0;

  disks: Disk[] = [];

  colors: string[] = [
        'brown', 'crimson', 'darkcyan', 'darkgoldenrod', 'darkmagenta' ,
        'dodgerblue', 'goldenrod', 'indigo', 'lawngreen', 'lightcoral'
  ]

  sectionWidth: number;
  canvasWidth: number;
  pinWidth: number;

  numberOfDisks = 10;
  active: boolean;
  element: any;

  constructor() { }

  ngOnInit() {
    this.getElements();
    this.align();
  }

  ngAfterViewInit() {
    this.canvas = document.getElementById('canvas');
    this.createPins();
    this.updateWidth();
    this.updatePinPosition();
    this.createDisks();
    this.addEventListeners();
  }

  createPins() {
    this.pinA = {name: 'A', index: 0, element: document.getElementById('pinA'), disks: []};
    this.pinB = {name: 'B', index: 1, element: document.getElementById('pinB'), disks: []};
    this.pinC = {name: 'C', index: 2, element: document.getElementById('pinC'), disks: []};
  }

  createDisks() {
    let width = this.sectionWidth;
    let diskWidthOffset = this.getDiskWidthOffset();
    let height = 30;
    for (let i = 0; i < this.numberOfDisks; i++) {
      let element = document.createElement('div');
      element.style.position = 'absolute';
      element.style.bottom = `${i*height}px`;
      // element.draggable = true;
      element.style.left = `${(this.sectionWidth - width) / 2}px`
      element.style.height = `${height}px`;
      element.style.width = `${width}px`;
      element.style.backgroundColor = this.colors[i];
      element.style.border = 'solid 1px black';
      element.setAttribute('diskIndex', i.toString());
      element.setAttribute('diskOffsetX', '0');
      element.setAttribute('diskOffsetY', '0');
      let disk = {index: i, element: element, pin: this.pinA};
      this.pinA.disks.push(disk);
      this.disks.push(disk);
      this.canvas.appendChild(element);
      // update dimensions
      width -= diskWidthOffset;
    }
  }

  mouseDown = (e) => {
    if (this.isDisk(e.target)) {
      this.element = e.target;
      if (e.type === "touchstart") {
        this.initialX = e.touches[0].clientX - parseFloat(this.element.getAttribute('diskOffsetX'));
        this.initialY = e.touches[0].clientY - parseFloat(this.element.getAttribute('diskOffsetY'));
      } else {
        this.initialX = e.clientX - parseFloat(this.element.getAttribute('diskOffsetX'));
        this.initialY = e.clientY - parseFloat(this.element.getAttribute('diskOffsetY'));
      }
      this.active = true;
    }
  }

  mouseMove = (e) => {
    if (this.active) {
      e.preventDefault();
      if (e.type === "touchmove") {
        this.currentX = e.touches[0].clientX - this.initialX;
        this.currentY = e.touches[0].clientY - this.initialY;
      } else {
        this.currentX = e.clientX - this.initialX;
        this.currentY = e.clientY - this.initialY;
      }

      this.xOffset = this.currentX;
      this.yOffset = this.currentY;
      this.element.setAttribute('diskOffsetX', this.currentX.toString());
      this.element.setAttribute('diskOffsetY', this.currentY.toString());
      this.setTranslate(this.currentX, this.currentY, this.element);
    }
  }

  mouseUp = (e) => {
    this.active = false;
    this.element = null;
    this.initialX = this.currentX;
    this.initialY = this.currentY;
  }

  addEventListeners() {
    // mouse listeners
    this.canvas.addEventListener('mousedown', this.mouseDown, false);
    this.canvas.addEventListener('mousemove', this.mouseMove, false);
    this.canvas.addEventListener('mouseup', this.mouseUp, false);
    // touch listeners
    this.canvas.addEventListener('touchstart', this.mouseDown, false);
    this.canvas.addEventListener('touchmove', this.mouseMove, false);
    this.canvas.addEventListener('touchend', this.mouseUp, false);
  }

  setTranslate(xPos, yPos, element) {
    if (this.element && this.isDisk(this.element)) {
      element.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
      // element.style.left = xPos + 'px';
      // element.style.top = yPos + 'px';
    }
  }

  isDisk(element) {
    let index =  element.getAttribute('diskIndex');
    console.log(index);
    return index !== null;
  }

  updateDiskWidth() {
    let width = this.sectionWidth;
    let diskWidthOffset = this.getDiskWidthOffset();
    for (let disk of this.disks) {
      disk.element.style.width = `${width}px`;
      width -= diskWidthOffset;
    }
  }

  updateWidth() {
    this.canvasWidth = this.canvas.offsetWidth;
    this.sectionWidth = this.canvasWidth / 3;
    this.pinWidth = this.pinA.element.offsetWidth;
    this.updateDiskWidth();
  }

  updatePinPosition() {
    let offset = (this.sectionWidth - this.pinWidth) / 2;
    this.pinA.element.style.left = `${this.sectionWidth * this.pinA.index + offset}px`;
    this.pinB.element.style.left = `${this.sectionWidth * this.pinB.index + offset}px`;
    this.pinC.element.style.left = `${this.sectionWidth * this.pinC.index + offset}px`;
    for (let disk of this.disks) {
      disk.element.style.left = `${(this.sectionWidth - disk.element.offsetWidth)/ 2}px`;
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
