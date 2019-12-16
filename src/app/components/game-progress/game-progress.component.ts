import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-progress',
  templateUrl: './game-progress.component.html',
  styleUrls: ['./game-progress.component.scss']
})
export class GameProgressComponent implements OnInit {

  @Input()
  timeElapsed = '00:00:00';

  @Input()
  numberOfMoves = 10;

  @Output() 
  restartEvent = new EventEmitter();

  @Output() 
  simulateEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  restart() {
    this.restartEvent.emit();
  }

  simulate() {
    this.simulateEvent.emit();
  }

}
