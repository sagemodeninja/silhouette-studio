import {provideFluentDesignSystem, fluentNumberField, baseLayerLuminance, StandardLuminance, neutralLayer2, fillColor, neutralLayer1} from '@fluentui/web-components';
import '/public/fonts/segoe-ui-variable/segoe-ui-variable.css';
import '/public/css/app.css';

import { PropertiesEditor } from './properties-editor';
import { PreviewCanvas } from './preview-canvas';

baseLayerLuminance.withDefault(StandardLuminance.DarkMode);

provideFluentDesignSystem()
    .register(fluentNumberField());

const A4_WIDTH_INCHES = 8.268;
const A4_HEIGHT_INCHES = 11.693;
const OUTPUT_DPI = 300;

class SilhouetteStudioTool {
    public canvas: HTMLCanvasElement;
    public downloadButton: HTMLButtonElement;
    public context: CanvasRenderingContext2D;
    public propertiesSection: HTMLDivElement;

    private _propertiesEditor: PropertiesEditor;
    private _canvas: PreviewCanvas;

    constructor() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.downloadButton = document.getElementById('download_button') as HTMLButtonElement;
        
        this._propertiesEditor = new PropertiesEditor();
        this._canvas = new PreviewCanvas();

        this.setDesignTokens();
        this.addEventListeners();
    }

    addEventListeners() {
        this._propertiesEditor.subscribeNotifications(props => this._canvas.update(props));
        this.downloadButton.addEventListener('click', () => this.saveOutput());
    }

    saveOutput() {
        const outputCanvas = document.createElement('canvas');
        const outputContext = outputCanvas.getContext('2d');
        const outputWidth = Math.round(A4_WIDTH_INCHES * OUTPUT_DPI);
        const outputHeight = Math.round(A4_HEIGHT_INCHES * OUTPUT_DPI);

        outputCanvas.width = outputWidth;
        outputCanvas.height = outputHeight;

        outputContext.drawImage(this.canvas, 0, 0, outputWidth, outputHeight);
        
        const dataURL = outputCanvas.toDataURL();
        const downloadLink = document.createElement('a');

        downloadLink.setAttribute('download', 'my-canvas.png');
        downloadLink.setAttribute('href', dataURL);
        downloadLink.click();
    }

    private setDesignTokens() {
        const propertiesSection = document.getElementById('properties_section') as HTMLDivElement;
        const previewSection = document.getElementById('preview_section') as HTMLDivElement;

        fillColor.setValueFor(propertiesSection, neutralLayer1);
        fillColor.setValueFor(previewSection, neutralLayer2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SilhouetteStudioTool();
});