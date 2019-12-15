import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Pin, Disk } from '../../models/model';

const DESIRED_DISK_MIN_SIZE = 40;
const DISK_MIN_SIZE = 20;
const DESIRED_MIN_OFFSET = 20;
const EXTRA_SMALL_OFFSET = 10;
const INDEX_ATTRIBUTE = "index";
const OFFSET_X_ATTR = 'offsetX';
const OFFSET_Y_ATTR = 'offsetY';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  canvas: HTMLElement;
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
  canvasHeight: number;
  pinWidth: number;

  numberOfDisks = 10;
  active: boolean;
  element: any;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.canvas = document.getElementById('canvas');
    this.createPins();
    this.createDisks();
    this.addEventListeners();
    this.updateView();
  }

  createPins() {
    this.pinA = new Pin('A', 0, document.getElementById('pinA'));
    this.pinB = new Pin('B', 1, document.getElementById('pinB'));
    this.pinC = new Pin('C', 2, document.getElementById('pinC'));
  }

  createDisks() {
    let width = this.sectionWidth;
    let diskWidthOffset = this.getDiskWidthOffset();
    let height = 30;
    for (let i = 0; i < this.numberOfDisks; i++) {
      let left = (this.sectionWidth - width) / 2;
      let diskElement = Disk.createElement(i, height, width, left, this.colors[i]);
      let disk = new Disk(i,this. pinA, diskElement);
      this.disks.push(disk);
      this.canvas.appendChild(diskElement);
      width -= diskWidthOffset;
    }
  }

  mouseDown = (e) => {
    if (this.isDraggable(e.target)) {
      this.element = e.target;
      if (e.type === "touchstart") {
        this.initialX = e.touches[0].clientX - parseFloat(this.element.getAttribute(OFFSET_X_ATTR));
        this.initialY = e.touches[0].clientY - parseFloat(this.element.getAttribute(OFFSET_Y_ATTR));
      } else {
        this.initialX = e.clientX - parseFloat(this.element.getAttribute(OFFSET_X_ATTR));
        this.initialY = e.clientY - parseFloat(this.element.getAttribute(OFFSET_Y_ATTR));
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
      this.element.setAttribute(OFFSET_X_ATTR, this.currentX.toString());
      this.element.setAttribute(OFFSET_Y_ATTR, this.currentY.toString());
      this.setTranslate(this.currentX, this.currentY, this.element);
    }
  }

  mouseUp = (e) => {
    if (this.element !== undefined && this.element !== null) {
      this.active = false;
      this.initialX = this.currentX;
      this.initialY = this.currentY;
      let disk = this.getDisk(this.element);
      this.updateDiskPin(disk);
      this.element = null;
    }
  }

  updateDiskPin(disk) {
    disk.updateDiskCenter(disk.element);
    let nextPin = this.getNextPin(disk);
    if (nextPin === null || disk.isSamePin(nextPin)) {
      console.log('no changes');
    } else {
      console.log(nextPin.name);
    }
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
    }
  }

  getNextPin(disk: Disk) {
    if (this.isDiskInPin(this.pinA, disk)) {
      return this.pinA;
    } else if (this.isDiskInPin(this.pinB, disk)) {
      return this.pinB;
    } if (this.isDiskInPin(this.pinC, disk)) {
      return this.pinC;
    } 
    return null;
  }

  isDiskInPin(pin: Pin, disk: Disk) {
    let xDistance = disk.calculateXDistanceDiskToPin(pin);
    let yDistance = disk.calculateYDistanceDiskToPin(pin);
    return xDistance < this.sectionWidth/2 && yDistance < this.canvasHeight/2;
  }

  isDraggable(element) {
    let disk = this.getDisk(element);
    return this.isDisk(element) && disk.isOnTopOfStack();
  }

  getDisk(element) {
    let index = parseInt(element.getAttribute(INDEX_ATTRIBUTE));
    return this.disks[index];
  }

  isDisk(element) {
    let index =  element.getAttribute(INDEX_ATTRIBUTE);
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
  
  updatePinSectionCenters() {
    let canvasRect = this.canvas.getBoundingClientRect();
    let yCenter = canvasRect.top + (canvasRect.height/2);
    this.pinA.updateCenter(yCenter);
    this.pinB.updateCenter(yCenter);
    this.pinC.updateCenter(yCenter);
  }

  updateCanvasDimensions() {
    this.canvasHeight = this.canvas.offsetHeight;
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateView();
  }
  
  updateView() {
    this.updateCanvasDimensions();
    this.updatePinPosition();
    this.updatePinSectionCenters();
  }

}
