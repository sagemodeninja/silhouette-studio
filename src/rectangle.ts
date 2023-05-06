export class Rectangle {
    public top: number;
    public right: number;
    public bottom: number;
    public left: number;
    public width: number;
    public height: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.top = x;
        this.right = x + w;
        this.left = y;
        this.bottom = y + h;
        this.width = w;
        this.height = h;
    }
}