const DESIRED_DISK_MIN_SIZE = 40;
const DISK_MIN_SIZE = 20;
const DESIRED_MIN_OFFSET = 20;
const EXTRA_SMALL_OFFSET = 10;
const INDEX_ATTRIBUTE = "index";
const OFFSET_X_ATTR = 'offsetX';
const OFFSET_Y_ATTR = 'offsetY';

export class Disk {

    index: number;
    pin: Pin;
    element: HTMLElement;
    centerX: number;
    centerY: number;

    public constructor(index: number, pin: Pin, element: HTMLElement) {
        this.index = index;
        this.pin = pin;
        this.element = element;
        pin.disks.push(this);
    }

    updateDiskCenter() {
        let rect = this.element.getBoundingClientRect();
        this.centerX = rect.left + rect.width/2;
        this.centerY = rect.top + rect.height/2;
    }

    isOnTopOfStack() {
        let pin = this.pin;
        return pin.getTopDisk() === this;
    }

    calculateXDistanceDiskToPin(pin: Pin) {
        return Math.abs(pin.centerX - this.centerX);
    }

    calculateYDistanceDiskToPin(pin: Pin) {
        return Math.abs(pin.centerY - this.centerY);
    }

    isSamePin(pin: Pin) {
        return this.pin === pin;
    }

    isDiskMovable(nextPin: Pin) {
        let topDisk = nextPin.getTopDisk();
        return topDisk === null || this.isDiskSmaller(topDisk);
    }

    move(nextPin: Pin) {
        if (this.isDiskMovable(nextPin)) {
            this.pin.disks.pop();
            this.pin = nextPin;
            nextPin.disks.push(this);
            return true;
        }
        return false;
    }

    isDiskSmaller(disk: Disk) {
        // the disk with greater index is smaller
        // has to do with the way they are initially generated 
        return this.index > disk.index;
    }

    public static createElement(index: number, height: number, width: number, left: number, color: string) {
        let element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.bottom = `${index*height}px`;
        element.style.left = `${left}px`;
        element.style.height = `${height}px`;
        element.style.width = `${width}px`;
        element.style.backgroundColor = color;
        element.style.border = 'solid 1px black';
        element.setAttribute(INDEX_ATTRIBUTE, index.toString());
        element.setAttribute(OFFSET_X_ATTR, '0');
        element.setAttribute(OFFSET_Y_ATTR, '0');
        return element;
    }
}

export class Pin {
    name: string;
    index: number;
    element: HTMLElement;
    disks: Disk[];
    centerX: number;
    centerY: number;

    public constructor(name: string, index: number, element: HTMLElement) {
        this.index = index;
        this.name = name;
        this.element = element;
        this.disks = [];
    }

    updateCenter(yCenter: number) {
        let pinRect = this.element.getBoundingClientRect();
        this.centerX = pinRect.left + pinRect.width/2;
        this.centerY = yCenter;
    }

    getNumberOfDisks() {
        return this.disks.length;
    }

    getTopDisk() {
        let n = this.getNumberOfDisks();
        if (n === 0) {
            return null;
        }
        return this.disks[n - 1];
    }
}

export class Hanoi {

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
    numberOfMoves: number;
    timer: any;
    timeElapsed: string = '00:00:00';
    startTime: number;
    gameStarted : boolean = false;

    disks: Disk[] = [];

    colors: string[] = [
        'brown', 'crimson', 'darkcyan', 'darkgoldenrod', 'darkmagenta' ,
        'dodgerblue', 'goldenrod', 'indigo', 'lawngreen', 'lightcoral'
    ]

    sectionWidth: number;
    canvasWidth: number;
    canvasHeight: number;
    pinWidth: number;
    height: number = 30;

    numberOfDisks = 3;
    active: boolean;
    element: any;

    public constructor() {
    }

    init() {
        this.canvas = document.getElementById('canvas');
        this.createPins();
        this.createDisks();
        this.addEventListeners();
        this.updateView();
        this.clear();
    }

    createPins() {
        this.pinA = new Pin('A', 0, document.getElementById('pinA'));
        this.pinB = new Pin('B', 1, document.getElementById('pinB'));
        this.pinC = new Pin('C', 2, document.getElementById('pinC'));
    }
    
    createDisks() {
        let width = this.sectionWidth;
        let diskWidthOffset = this.getDiskWidthOffset();
        for (let i = 0; i < this.numberOfDisks; i++) {
          let left = (this.sectionWidth - width) / 2;
          let diskElement = Disk.createElement(i, this.height, width, left, this.colors[i]);
          let disk = new Disk(i,this. pinA, diskElement);
          this.disks.push(disk);
          this.canvas.appendChild(diskElement);
          width -= diskWidthOffset;
        }
    }
    
    mouseDown = (e) => {
        if (this.isDraggable(e.target)) {
            this.startTimer();
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
            if (this.isGameOver()) {
                this.setGameIsOver();
            }
            this.element = null;
        }
    }

    updateDiskPin(disk: Disk) {
        disk.updateDiskCenter();
        let nextPin = this.getNextPin(disk);
        if (nextPin === null || disk.isSamePin(nextPin)) {
            this.resetDiskPosition(disk);
        } else {
            if (disk.move(nextPin)) {
                this.numberOfMoves++;
                this.positionDisk(disk, nextPin);
            } else {
                this.resetDiskPosition(disk);
            }
        }
    }

    resetDiskPosition(disk: Disk) {
        disk.element.style.transform = `none`;
        this.element.setAttribute(OFFSET_X_ATTR, '0');
        this.element.setAttribute(OFFSET_Y_ATTR, '0');
    }

    positionDisk(disk: Disk, pin: Pin) {
        this.resetDiskPosition(disk);
        let left = pin.index * this.sectionWidth + (this.sectionWidth - disk.element.offsetWidth)/2;
        disk.element.style.left = `${left}px`;
        disk.element.style.bottom = `${(pin.getNumberOfDisks() - 1) * this.height}px`;
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
        return this.isDisk(element) && disk.isOnTopOfStack() && !this.isGameOver();
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
            let diskOffset = disk.pin.index * this.sectionWidth;
            let left = diskOffset + (this.sectionWidth - disk.element.offsetWidth)/ 2;
            disk.element.style.left = `${left}px`;
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

    setGameIsOver() {
        clearInterval(this.timer);
        this.gameStarted = false;
    }

    isGameOver() {
        return this.pinC.getNumberOfDisks() === this.numberOfDisks;
    }
    
    updateView() {
        this.updateCanvasDimensions();
        this.updatePinPosition();
        this.updatePinSectionCenters();
    }

    clear() {
        this.numberOfMoves = 0;
    }

    startTimer() {
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.startTime = Date.now();
            this.timer = setInterval(() => {
                let millis = Date.now() - this.startTime;
                let seconds = Math.round(millis / 1000);
                let secondsElapsed = seconds % 60;
                let minutes = Math.floor(seconds / 60);
                let minutesElapsed = minutes % 60;
                let hoursElapsed = Math.floor(minutes / 60);
                let formattedSeconds = this.formatTime(secondsElapsed);
                let formattedMins = this.formatTime(minutesElapsed);
                let formattedHours = this.formatTime(hoursElapsed);
                this.timeElapsed = `${formattedHours}:${formattedMins}:${formattedSeconds}`;
            }, 1000);
        }
    }

    formatTime(value: number) {
        if (value < 10) {
            return `0${value}`;
        }
        return value;
    }
}