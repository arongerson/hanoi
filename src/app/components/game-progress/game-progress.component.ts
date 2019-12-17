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
  numberOfMoves = 0;

  @Input()
  simulating: boolean;

  @Output() 
  restartEvent = new EventEmitter();

  @Output() 
  simulateEvent = new EventEmitter();

  @Output() 
  instructionsEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  restart() {
    this.restartEvent.emit();
  }

  simulate() {
    this.simulateEvent.emit();
  }

  instructions() {
    this.instructionsEvent.emit();
  }

}
