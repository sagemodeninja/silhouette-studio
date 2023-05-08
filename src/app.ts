import {provideFluentDesignSystem, baseLayerLuminance, StandardLuminance, neutralLayer2, fillColor, neutralLayer1, fluentButton, fluentAnchoredRegion, fluentDivider, fluentAccordion, fluentAccordionItem, neutralLayer3, fluentToolbar, fluentAnchor} from '@fluentui/web-components';
import '/public/fonts/segoe-ui-variable/segoe-ui-variable.css';
import '/public/css/app.css';

import { ProjectEditor } from './project-editor';
import { ProjectCanvas } from './preview-canvas';
import { Project } from './project';
import { MenuBar } from './menu-bar';

baseLayerLuminance.withDefault(StandardLuminance.DarkMode);

provideFluentDesignSystem()
    .register(
        fluentDivider(),
        fluentAccordion(),
        fluentAccordionItem(),
        fluentToolbar(),
        fluentAnchor(),
    );

class SilhouetteStudioTool {
    public context: CanvasRenderingContext2D;
    public propertiesSection: HTMLDivElement;

    private _project: Project;
    private _menuBar: MenuBar;
    private _editor: ProjectEditor;
    private _previewCanvas: ProjectCanvas;

    constructor() {
        const project = new Project();

        this._project = project;
        this._menuBar = new MenuBar();
        this._editor = new ProjectEditor(project);
        this._previewCanvas = new ProjectCanvas(project);

        this.setDesignTokens();
        this.addEventListeners();
    }

    private addEventListeners() {
        document.addEventListener('keydown', e => this.handleKeyDown(e));
        this._menuBar.oninvoke(action => this.handleActions(action));
        this._editor.addEventListener('change', () => this._previewCanvas.update());
    }

    private handleKeyDown(event: KeyboardEvent) {
        const control = event.ctrlKey || event.metaKey;

        if (control && (event.code == 'KeyO' || event.code == 'KeyS'))
        {
            event.preventDefault();

            switch(event.key) {
                case 'o':
                    this.openProject();
                    break;
                case 's':
                    this._project.save();
                    break;
            }
        }
    }

    private handleActions(action: string) {
        switch(action) {
            case 'open':
                this.openProject();
                break;
            case 'save':
                this._project.save();
                break;
            case 'export':
                this.exportProject();
                break;
        }
    }

    private async openProject() {
        const options = {
            types: [
                {
                    description: 'Silhouette Studio Tool Project',
                    accept: {
                        'application/octet-stream': ['.studio4']
                    }
                },
                {
                    description: 'Images',
                    accept: {
                        'image/jpeg': ['.jpeg', '.jpg'],
                        'image/png': ['.png']
                    },
                },
            ],
            excludeAcceptAllOption: true,
            multiple: false,
        };
        
        const fileHandle = await window.showOpenFilePicker(options);
        this._project.open(fileHandle);
    }

    exportProject() {
        this._previewCanvas.export();
    }

    private setDesignTokens() {
        const header = document.getElementsByTagName('header')[0];
        const propertiesSection = document.getElementById('properties_section') as HTMLDivElement;
        const previewSection = document.getElementById('preview_section') as HTMLDivElement;

        fillColor.setValueFor(header, neutralLayer1);
        fillColor.setValueFor(propertiesSection, neutralLayer3);
        fillColor.setValueFor(previewSection, neutralLayer2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SilhouetteStudioTool();
});

declare const window: Window &
typeof globalThis & {
    showOpenFilePicker: any
}