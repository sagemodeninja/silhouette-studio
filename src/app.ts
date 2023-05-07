import {provideFluentDesignSystem, fluentNumberField, baseLayerLuminance, StandardLuminance, neutralLayer2, fillColor, neutralLayer1, fluentButton, fluentAnchoredRegion, fluentMenu, fluentMenuItem, fluentDivider, AnchoredRegion, MenuItem, neutralLayer3} from '@fluentui/web-components';
import '/public/fonts/segoe-ui-variable/segoe-ui-variable.css';
import '/public/css/app.css';

import { PropertiesEditor } from './properties-editor';
import { PreviewCanvas } from './preview-canvas';
import { Project } from './project';

baseLayerLuminance.withDefault(StandardLuminance.DarkMode);

provideFluentDesignSystem()
    .register(
        fluentNumberField(),
        fluentButton(),
        fluentAnchoredRegion(),
        fluentMenu(), 
        fluentMenuItem(),
        fluentDivider()
    );

class SilhouetteStudioTool {
    public context: CanvasRenderingContext2D;
    public propertiesSection: HTMLDivElement;

    
    private _project: Project;
    private _propertiesEditor: PropertiesEditor;
    private _previewCanvas: PreviewCanvas;
    private _fileInput: HTMLInputElement;
    private _exportMenuItem: MenuItem;

    constructor() {
        this._project = new Project();
        this._propertiesEditor = new PropertiesEditor();
        this._previewCanvas = new PreviewCanvas();
        this._exportMenuItem = document.getElementById('export_menu_item') as MenuItem;

        // TODO: Refactor
        this._fileInput = document.createElement('input');
        this._fileInput.type = 'file';
        this._fileInput.accept = '.studio4,.jpg,.jpeg,.png';

        this.setDesignTokens();
        this.addEventListeners();
    }

    addEventListeners() {
        document.addEventListener('keydown', e => this.onKeyDown(e));
        
        this._project.addEventListener('load', () => {
            this._propertiesEditor.open(this._project.properties);
            this._previewCanvas.setup(this._project.source);
            this._previewCanvas.update(this._project.properties);
        });

        this._propertiesEditor.subscribeNotifications(props => this._previewCanvas.update(props));
        this._fileInput.addEventListener('change', () => this.openProject());
        this._exportMenuItem.addEventListener('click', () => this.exportProject());
    }

    onKeyDown(event: KeyboardEvent) {
        const control = event.ctrlKey || event.metaKey;

        const isMacOrIOS = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform); 
        const shift = 
        
        if (control && event.shiftKey && event.code == 'KeyO')
        {
            event.preventDefault();
            console.log(1);
        }

        if ((event.ctrlKey || event.metaKey) && (event.key == 'o' || event.key == 's'))
        {
            event.preventDefault();
            event.stopPropagation();

            console.log('!');

            switch(event.key) {
                case 'o':
                    this._fileInput.click();
                    break;
                case 's':
                    this._project.save();
                    break;
            }
        }
    }

    private async openProject() {
        const file = this._fileInput.files[0];
        this._project.open(file);
    }

    exportProject() {
        this._previewCanvas.export();
    }

    private setDesignTokens() {
        const header = document.getElementsByTagName('header')[0];
        const propertiesSection = document.getElementById('properties_section') as HTMLDivElement;
        const previewSection = document.getElementById('preview_section') as HTMLDivElement;

        fillColor.setValueFor(header, neutralLayer1);
        fillColor.setValueFor(propertiesSection, neutralLayer2);
        fillColor.setValueFor(previewSection, neutralLayer1);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SilhouetteStudioTool();
});