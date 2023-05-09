import '/public/fonts/segoe-ui-variable/segoe-ui-variable.css';
import '/public/css/app.css';

import {
    provideFluentDesignSystem,
    baseLayerLuminance,
    StandardLuminance,
    neutralLayer2,
    fillColor,
    fluentAnchor,
    neutralLayer3
} from '@fluentui/web-components';
import { MenuBar } from './menu-bar';
import { Project } from './project';
import { ProjectEditor } from './project-editor';
import { ProjectCanvas } from './project-canvas';
import { FileHandler } from './file-handler';
import { KeyboardEventHandler } from './keyboard-event-handler';

const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
baseLayerLuminance.withDefault(prefersDarkMode ? StandardLuminance.DarkMode : StandardLuminance.LightMode);

provideFluentDesignSystem()
    .register(
        fluentAnchor(),
    );

class SilhouetteStudioTool {
    private _app: HTMLDivElement;
    private _title: HTMLSpanElement;

    private _menuBar: MenuBar;
    private _project: Project;
    private _editor: ProjectEditor;
    private _canvas: ProjectCanvas;

    constructor() {
        this._app = document.getElementById('app') as HTMLDivElement;
        this._title = document.getElementById('project_title');

        this._menuBar = new MenuBar();
        this._editor = new ProjectEditor();
        this._canvas = new ProjectCanvas();

        this.addEventListeners();
        this.setDesignTokens();
    }

    private addEventListeners() {
        this._menuBar.oninvoke(action => this.handleActions(action));
        document.addEventListener('keydown', e => this.handleKeyboard(e));
    }

    private handleKeyboard(e: KeyboardEvent) {
        const resolvedAction = KeyboardEventHandler.resolve(e);

        if (resolvedAction == 'import_image' && !this._project)
            return;

        this.handleActions(resolvedAction);
    }

    private handleActions(action: string) {
        if (action == 'new')
        {
            this._project = new Project();
            this.loadProject();
        }

        if (action == 'open' || action == 'import_image')
            this.openFile(action);

        if (action == 'save')
            this._project.save();

        if (action == 'export_as_image')
            this._canvas.export();
    }

    private async openFile(action: string) {
        const handle = await FileHandler.open(action);

        if (action === 'import_image')
        {
            this._project.import(handle);
            return;
        }
        
        this._project = await Project.open(handle);
        this.loadProject();
    }

    private loadProject() {
        this._editor.register(this._project);
        this._canvas.register(this._project);
        
        this._project.changeTracker.subscribe(['save_state'], () => this.updateState());
        this.updateState();
    }

    private updateState() {
        this._title.innerText = this._project.title;
        this._title.classList.toggle('unsaved', !this._project.saved);
        this._app.classList.toggle('no-project', !this._project);
    }

    private setDesignTokens() {
        const header = document.querySelector('header');
        const propertiesSection = document.getElementById('properties_section') as HTMLDivElement;

        fillColor.setValueFor(header, neutralLayer2);
        fillColor.setValueFor(propertiesSection, neutralLayer3);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SilhouetteStudioTool();
});