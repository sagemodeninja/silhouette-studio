import * as saveAs from 'file-saver';
import { Rectangle } from './rectangle';
import { Project } from './project';
import * as papers from './data/papers.json';

const A4_ASPECT_RATIO = 1.414; // ISO 216
const ZOOM_FACTOR = 0.5;
const MM_IN_INCHES = 25.4;

export class ProjectCanvas {
    private _project: Project;
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _workArea: Rectangle;

    constructor(project: Project) {
        this._project = project;
        this._canvas = document.getElementById('preview_canvas') as HTMLCanvasElement;
        this._context = this._canvas.getContext('2d');

        this.setup();
        this.addEventListeners();
    }

    public update() {
        if (!this._project) return;

        this.clear();

        const workArea = this._workArea;
        const properties = this._project.properties;
        const pageSetup = this._project.pageSetup;
        
        const image = new Image();

        const clientWidth = workArea.width;
        const clientHeight = workArea.height;
        const width = Math.round(properties.imageWidth * pageSetup.pixelPerInch);
        const height = Math.round(properties.imageHeight * pageSetup.pixelPerInch);
        const minumumSpace = 0.1 * pageSetup.pixelPerInch;
    
        image.src = this._project.source;
        image.onload = () => {
            const rectangles = this.distributeRectangles(clientWidth, clientHeight, width, height, minumumSpace);

            rectangles.forEach(rect => {
                const x = workArea.left + rect.x;
                const y = workArea.top + rect.y;
                this._context.drawImage(image, x, y, width, height);
            });
        };
    }

    private distributeRectangles(containerWidth: number, containerHeight: number, rectangleWidth: number, rectangleHeight: number, minSpacing: number): {x: number, y: number}[] {
        const result: {x: number, y: number}[] = [];
        
        const numColumns = Math.floor((containerWidth + minSpacing) / (rectangleWidth + minSpacing));
        const numRows = Math.floor((containerHeight + minSpacing) / (rectangleHeight + minSpacing));
        const spacingX = (containerWidth - (numColumns * rectangleWidth)) / (numColumns + 1);
        const spacingY = (containerHeight - (numRows * rectangleHeight)) / (numRows + 1);
        
        for (let row = 0; row < numRows; row++) {
            for (let column = 0; column < numColumns; column++) {
            const x = spacingX + (column * (rectangleWidth + spacingX));
            const y = spacingY + (row * (rectangleHeight + spacingY));
            result.push({x, y});
            }
        }
        
        return result;
    }

    public export() {
        const dataURL = this._canvas.toDataURL();
        saveAs(dataURL, `test-out.png`);
    }

    private setup() {
        this.scale();
        this.clear();
        this.calculateWorkArea();
    }

    private addEventListeners() {
        this._project.addEventListener('load', () => this.update());
    }

    private scale() {
        const container = this._canvas.parentElement as HTMLDivElement;
        const containerWidth = container.getBoundingClientRect().width;
        
        const pageSetup = this._project.pageSetup;
        const paper = Array.from(papers).find(p => p.id == pageSetup.size);
        const size = paper.metric;

        const canvasWidth = Math.round(containerWidth * ZOOM_FACTOR);
        const canvasHeight = Math.round(canvasWidth * A4_ASPECT_RATIO);
        const renderWidth = Math.round(pageSetup.pixelPerInch * size.width / MM_IN_INCHES);
        const renderHeight = Math.round(pageSetup.pixelPerInch * size.height / MM_IN_INCHES);

        this._canvas.width = renderWidth;
        this._canvas.height = renderHeight;
        this._canvas.style.width = canvasWidth + 'px';
        this._canvas.style.height = canvasHeight + 'px';
    }

    private clear() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._context.fillStyle = '#fff';
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }

    private calculateWorkArea() {
        const resolution = this._project.pageSetup.pixelPerInch;
        const cutBorderSize = 0.059 * resolution;
        const width = this._canvas.width - (cutBorderSize * 2);
        const height = this._canvas.height - (cutBorderSize * 2);
        this._workArea = new Rectangle(cutBorderSize, cutBorderSize, width, height);
    }
}