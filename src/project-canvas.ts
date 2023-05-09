import * as saveAs from 'file-saver';
import { Rectangle } from './rectangle';
import { Project } from './project';
import { PageOrientation, PageSetup } from './page-setup';

const ZOOM_FACTOR = 0.5;
const MM_IN_INCHES = 25.4;

export class ProjectCanvas {
    private _project: Project;
    private _image: HTMLImageElement;
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _workArea: Rectangle;

    constructor() {
        this._canvas = document.getElementById('preview_canvas') as HTMLCanvasElement;
        this._context = this._canvas.getContext('2d');
    }

    public register(project: Project) {
        this._project = project;
        this._image = null;

        // React to changes in the project
        const events = ['source', 'properties', 'page_setup'];
        this._project.changeTracker.subscribe(events, e => this.draw(e));

        this.draw('load');
    }

    public export() {
        const dataURL = this._canvas.toDataURL();
        saveAs(dataURL, `test-out.png`);
    }

    private setup() {
        this.setupCanvas();
        this.calculateWorkArea();
        this.clear();
    }
    
    private draw(event: string) {
        if (event == 'page_setup' || event == 'load')
            this.setup();
        else
            this.clear();

        if (!this._project.source)
            return;

        const workArea = this._workArea;
        const properties = this._project.properties;
        const pageSetup = this._project.pageSetup;

        const clientWidth = workArea.width;
        const clientHeight = workArea.height;

        const width = Math.round(properties.imageWidth * pageSetup.pixelPerInch);
        const height = Math.round(properties.imageHeight * pageSetup.pixelPerInch);
        const minumumSpace = properties.minSpacing * pageSetup.pixelPerInch;
        
        const rectangles = this.distributeRectangles(clientWidth, clientHeight, width, height, minumumSpace);

        if (!this._image || event === 'source')
        {
            this._image = new Image();

            this._image.src = this._project.source;

            this._image.onload = () => {
                rectangles.forEach(rect => {
                    const x = workArea.left + rect.x;
                    const y = workArea.top + rect.y;
                    this._context.drawImage(this._image, x, y, width, height);
                });
            }

            return;
        }
    
        rectangles.forEach(rect => {
            const x = workArea.left + rect.x;
            const y = workArea.top + rect.y;
            this._context.drawImage(this._image, x, y, width, height);
        });
    }

    private setupCanvas() {
        const pageSetup = this._project?.pageSetup ?? PageSetup.default;
        const paper = pageSetup.paper;
        const containerWidth = this._canvas.parentElement.offsetWidth;

        const renderMainLength = Math.round(pageSetup.pixelPerInch * paper.metric.width / MM_IN_INCHES);
        const renderCrossLength = Math.round(pageSetup.pixelPerInch * paper.metric.height / MM_IN_INCHES);
        const canvasWidth = Math.round(containerWidth * ZOOM_FACTOR);
        const canvasHeight = Math.round(canvasWidth / ((pageSetup.orientation + 1) / paper.aspectRatio));

        const portrait = pageSetup.orientation === PageOrientation.Portrait;
        this._canvas.width = portrait ? renderMainLength : renderCrossLength;
        this._canvas.height = portrait ? renderCrossLength : renderMainLength;
        this._canvas.style.width = canvasWidth + 'px';
        this._canvas.style.height = canvasHeight + 'px';
    }

    private calculateWorkArea() {
        const pageSetup = this._project?.pageSetup ?? PageSetup.default;
        const resolution = pageSetup.pixelPerInch;
        const cutBorderSize = 0.059 * resolution;
        const width = this._canvas.width - (cutBorderSize * 2);
        const height = this._canvas.height - (cutBorderSize * 2);

        this._workArea = new Rectangle(cutBorderSize, cutBorderSize, width, height);
    }

    private clear() {
        this._context.fillStyle = '#fff';
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
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
}