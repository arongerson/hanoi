import { Component, Inject, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  moves: number;
  optimalMoves: number;
}
import { Hanoi} from '../../models/model';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  hanoi: Hanoi;
  showMenu = false;

  constructor(public dialog: MatDialog) {}

  openDialog(moves: number, optimalMoves: number): void {
    const dialogRef = this.dialog.open(GameOverDialog, {
      panelClass: 'custom-dialog-container',
      data: {moves: moves, optimalMoves: optimalMoves}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.restart();
    });
  }

  ngOnInit() {
    this.hanoi = new Hanoi(this);
    this.hanoi.init();
  }

  ngAfterViewInit() {
    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.hanoi.updateView();
  }

  getTimeElapsed() {
    return this.hanoi.timeElapsed;
  }

  getNumberOfMoves() {
    return this.hanoi.numberOfMoves;
  }

  restart() {
    this.hanoi.restart();
  }

  addDisk() {
    this.hanoi.addDisk();
  }

  removeDisk() {
    this.hanoi.removeDisk();
  }

}

@Component({
  selector: 'game-over-dialog',
  templateUrl: 'game-over-dialog.html',
})
export class GameOverDialog {

  constructor(
    public dialogRef: MatDialogRef<GameOverDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
