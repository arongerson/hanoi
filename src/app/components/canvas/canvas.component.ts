import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Hanoi} from '../../models/model';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  hanoi: Hanoi;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.hanoi = new Hanoi();
    this.hanoi.init();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.hanoi.updateView();
  }

}
