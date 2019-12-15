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
        return pin.disks[pin.disks.length - 1] === this;
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

    public static createElement(index: number, height: number, width: number, left: number, color: string) {
        let element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.bottom = `${index*height}px`;
        element.style.left = `${left}px`
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
}