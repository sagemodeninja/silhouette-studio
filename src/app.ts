import {provideFluentDesignSystem, baseLayerLuminance, StandardLuminance, neutralLayer2, fillColor, neutralLayer1, fluentButton, fluentAnchoredRegion, fluentMenu, fluentMenuItem, fluentDivider, MenuItem, fluentAccordion, fluentAccordionItem, fluentSelect, fluentOption, neutralLayer3, density, Button, designUnit, Menu, fluentToolbar, AnchoredRegion, fluentAnchor, bodyFont, typeRampBaseFontSize} from '@fluentui/web-components';
import '/public/fonts/segoe-ui-variable/segoe-ui-variable.css';
import '/public/css/app.css';

import { ProjectEditor } from './project-editor';
import { ProjectCanvas } from './preview-canvas';
import { Project } from './project';

baseLayerLuminance.withDefault(StandardLuminance.DarkMode);

provideFluentDesignSystem()
    .register(
        fluentButton(),
        fluentAnchoredRegion(),
        fluentMenu(),
        fluentMenuItem(),
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
    private _editor: ProjectEditor;
    private _previewCanvas: ProjectCanvas;
    private _fileInput: HTMLInputElement;
    private _fileMenuButton: Button;
    private _fileMenu: AnchoredRegion;

    constructor() {
        const project = new Project();

        this._project = project;
        this._editor = new ProjectEditor(project);
        this._previewCanvas = new ProjectCanvas(project);
        this._fileMenuButton = document.getElementById('file_menu_button') as Button;
        this._fileMenu = document.getElementById('file_menu') as AnchoredRegion;

        // TODO: Refactor
        this._fileInput = document.createElement('input');
        this._fileInput.type = 'file';
        this._fileInput.accept = '.studio4,.jpg,.jpeg,.png';

        const menus = document.getElementsByClassName('menu');
        const menuItems = Array.from(menus).reduce((acc, curr) => {
            const items = curr.getElementsByTagName('fluent-menu-item');
            return acc.concat(Array.from(items));
        }, []);

        menuItems.forEach(i => {
            i.addEventListener('click', () => {
                switch(i.dataset.action) {
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
            });
        });

        this.setDesignTokens();
        this.addEventListeners();
    }

    addEventListeners() {
        document.addEventListener('keydown', e => this.onKeyDown(e));
        document.addEventListener('click', () => {
            this._fileMenu.remove();
            this._menuVisible = false;
        });
        this._fileMenuButton.addEventListener('click', e => this.toggleMenu(e));
        this._editor.addEventListener('change', () => this._previewCanvas.update());
    }

    private _menuVisible: boolean = true;
    private toggleMenu(event: Event) {
        this._menuVisible = !this._menuVisible;
        
        if (!this._menuVisible)
        {
            this._fileMenu.remove();
            return;
        }
        
        event.stopPropagation();
        document.body.append(this._fileMenu);
    }

    onKeyDown(event: KeyboardEvent) {
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
        const fileButton = document.getElementById('file_menu_button') as Button;

        designUnit.setValueFor(fileButton, 2.5);
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