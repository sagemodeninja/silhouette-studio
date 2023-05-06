import { Properties } from "./properties";

const A4_WIDTH_INCHES = 8.268;
const A4_HEIGHT_INCHES = 11.693;
const A4_ASPECT_RATIO = 1.414; // ISO 216
const ZOOM_FACTOR = 0.5;
const SCREEN_DPI = 96;
const OUTPUT_DPI = 300;

export class PreviewCanvas {
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;

    constructor() {
        this._canvas = document.getElementById('preview_canvas') as HTMLCanvasElement;
        this._context = this._canvas.getContext('2d');

        this.scale();
        this.clear();
    }

    update(properties: Properties) {
        this.clear();

        const image = new Image();
        const width = properties.imageWidth * SCREEN_DPI;
        const height = properties.imageHeight * SCREEN_DPI;
    
        image.src = properties.image;
        image.onload = () => {
            this._context.drawImage(image, 0, 0, width, height);
        };
    }

    private scale() {
        const container = this._canvas.parentElement as HTMLDivElement;
        const canvasWidth = Math.round(container.offsetWidth * ZOOM_FACTOR);
        const canvasHeight = Math.round(canvasWidth * A4_ASPECT_RATIO);
        const ratio = window.devicePixelRatio;

        this._canvas.width = canvasWidth * ratio;
        this._canvas.height = canvasHeight * ratio;
        this._canvas.style.width = canvasWidth + 'px';
        this._canvas.style.height = canvasHeight + 'px';

        this._context.scale(ratio, ratio);
    }

    private clear() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._context.fillStyle = '#fff';
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }
}