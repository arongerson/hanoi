import { Component, OnInit, AfterViewInit } from '@angular/core';

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

    // get width
    let sectionWidth = this.sectionA.offsetWidth;
    let pinWidth = this.pinA.offsetWidth;
    let offset = (sectionWidth - pinWidth) / 2;

    // update pin position
    this.pinA.style.left = `${offset}px`;
    this.pinB.style.left = `${offset}px`;
    this.pinC.style.left = `${offset}px`;
    // console.log('width: ' + width + ' ' + JSON.stringify(this.sectionA.style.width));
  }

  getElements() {
    
  }

  align() {

  }

}
