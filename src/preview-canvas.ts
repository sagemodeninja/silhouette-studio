import * as saveAs from 'file-saver';
import { Properties } from "./properties";
import { Rectangle } from './rectangle';

const A4_WIDTH_INCHES = 8.268;
const A4_HEIGHT_INCHES = 11.693;
const A4_ASPECT_RATIO = 1.414; // ISO 216
const ZOOM_FACTOR = 0.5;
const SCREEN_DPI = 96;
const OUTPUT_DPI = 300;

export class PreviewCanvas {
    private _source: string;
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _workArea: Rectangle;

    constructor() {
        this._canvas = document.getElementById('preview_canvas') as HTMLCanvasElement;
        this._context = this._canvas.getContext('2d');

        this.scale();
        this.clear();
        
        const cutBorderSize = 0.059 * SCREEN_DPI;
        const width = this._canvas.width - (cutBorderSize * 2);
        const height = this._canvas.height - (cutBorderSize * 2);
        this._workArea = new Rectangle(cutBorderSize, cutBorderSize, width, height);
    }

    public setup(source: string) {
        this._source = source;
    }

    public update(properties: Properties) {
        if (!this._source) return;

        this.clear();

        const image = new Image();
        const width = properties.imageWidth * SCREEN_DPI;
        const height = properties.imageHeight * SCREEN_DPI;
    
        image.src = this._source;
        image.onload = () => {
            const workArea = this._workArea;
            const columns = Math.floor(workArea.width / width);
            const rows = Math.floor(workArea.height / height);
            const horizontalSpace = workArea.width - (columns * width);
            const verticalSpace = workArea.height - (rows * height);
            const horizontalSpacing = horizontalSpace / (columns - 1);
            const verticalSpacing = verticalSpace / (rows - 1);
            const offsetWidth = width + horizontalSpacing;
            const offsetHeight = height + verticalSpacing;

            console.log(width, height);

            for(let row=0; row<rows;row++) {
                const top = workArea.top + (offsetHeight * row);
                for(let column=0; column<columns;column++) {
                    const left = workArea.left + (offsetWidth * column);
                    this._context.drawImage(image, left, top, width, height);
                }
            }
        };
    }

    public export() {
        const outputCanvas = document.createElement('canvas');
        const outputContext = outputCanvas.getContext('2d');
        const outputWidth = Math.round(A4_WIDTH_INCHES * OUTPUT_DPI);
        const outputHeight = Math.round(A4_HEIGHT_INCHES * OUTPUT_DPI);

        outputCanvas.width = outputWidth;
        outputCanvas.height = outputHeight;

        outputContext.drawImage(this._canvas, 0, 0, outputWidth, outputHeight);
        
        const dataURL = outputCanvas.toDataURL();
        saveAs(dataURL, `test-out.png`);
    }

    private scale() {
        const container = this._canvas.parentElement as HTMLDivElement;
        const containerWidth = container.getBoundingClientRect().width;
        const canvasWidth = Math.round(containerWidth * ZOOM_FACTOR);
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