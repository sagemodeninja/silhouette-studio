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
        const columnCount = Math.floor(clientWidth / (width + minumumSpace));
        const rowCount = Math.floor(clientHeight / (height + minumumSpace));
        
        const availableWidth = clientWidth - (width * columnCount) + minumumSpace;
        const availableHeight = clientHeight - (height * rowCount);

        const horizontalSpace = availableWidth / (columnCount + 1);
        const verticalSpace = availableHeight / (rowCount + 1);

        const offsetWidth = width + horizontalSpace;
        const offsetHeight = height + verticalSpace;
        const offsetTop = horizontalSpace / 2;
        const offsetLeft = verticalSpace / 2;
    
        image.src = this._project.source;
        image.onload = () => {

            for(let row=0; row<rowCount; row++) {
                const top = workArea.top + offsetTop + (offsetHeight * row);
                for(let column=0; column<columnCount; column++) {
                    const left = workArea.left + offsetLeft + (offsetWidth * column);
                    this._context.drawImage(image, left, top, width, height);
                }
            }
        };
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