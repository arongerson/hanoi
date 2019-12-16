import { Component, Inject, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DiskCountService } from '../../models/services/disk-count.service';
import { UtilService } from '../../models/services/util.service';

export interface DialogData {
  moves: number;
  optimalMoves: number;
  totalTime: string;
}
import { Hanoi} from '../../models/hanoi';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  hanoi: Hanoi;
  showMenu = false;

  constructor(
    public dialog: MatDialog,
    private diskCountService: DiskCountService,
    private util: UtilService
  ) {}

  openDialog(moves: number, optimalMoves: number, totalTime: string): void {
    const dialogRef = this.dialog.open(GameOverDialog, {
      panelClass: 'custom-dialog-container',
      data: { moves: moves, optimalMoves: optimalMoves, totalTime: totalTime }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.restart();
    });
  }

  ngOnInit() {
    this.hanoi = new Hanoi(this, this.diskCountService, this.util);
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

  simulate() {
    console.log('simulating...');
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
