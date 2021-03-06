import {
    INDEX_ATTRIBUTE,
    OFFSET_X_ATTR,
    OFFSET_Y_ATTR
} from './constants';

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
        this.element.addEventListener('mouseover', this.mouseOver, false);
        this.element.addEventListener('mouseleave', this.mouseLeave, false);
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
        element.setAttribute(INDEX_ATTRIBUTE, index.toString());
        element.setAttribute(OFFSET_X_ATTR, '0');
        element.setAttribute(OFFSET_Y_ATTR, '0');
        return element;
    }

    mouseOver = (e) => {
        if (this.isOnTopOfStack()) {
            this.element.style.cursor = 'move';
            this.element.style.boxShadow = '0 0 10px 0px black';
        } else {
            this.element.style.cursor = 'not-allowed';
        }
    };

    mouseLeave = (e) => {
        this.element.style.cursor = 'default';
        this.element.style.boxShadow = 'none';
    };
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