import {
    provideFluentDesignSystem,
    baseLayerLuminance,
    StandardLuminance,
    neutralLayer2,
    fillColor,
    fluentAnchor
} from '@fluentui/web-components';
import { MenuBar } from './menu-bar';
import { Project } from './project';
import { ProjectEditor } from './project-editor';
import { ProjectCanvas } from './preview-canvas';
import { KeyboardEventHandler } from './keyboard-event-handler';
import '/public/fonts/segoe-ui-variable/segoe-ui-variable.css';
import '/public/css/app.css';
import { FileHandler } from './file-handler';

baseLayerLuminance.withDefault(StandardLuminance.DarkMode);

provideFluentDesignSystem()
    .register(
        fluentAnchor(),
    );

class SilhouetteStudioTool {
    public context: CanvasRenderingContext2D;
    public propertiesSection: HTMLDivElement;

    private _project: Project;
    private _menuBar: MenuBar;
    private _editor: ProjectEditor;
    private _previewCanvas: ProjectCanvas;
    private _app: HTMLDivElement;
    private _projectTitle: HTMLSpanElement;

    constructor() {
        this._menuBar = new MenuBar();
        this._editor = new ProjectEditor();
        this._previewCanvas = new ProjectCanvas();
        this._app = document.getElementById('app') as HTMLDivElement;
        this._projectTitle = document.getElementById('project_title');

        this.setDesignTokens();
        this.addEventListeners();
    }

    private addEventListeners() {
        this._menuBar.oninvoke(action => this.handleActions(action));
        document.addEventListener('keydown', e => this.handleKeyboard(e));
    }

    private handleKeyboard(e: KeyboardEvent) {
        const resolvedAction = KeyboardEventHandler.resolve(e);

        if (resolvedAction && !(resolvedAction === 'import_image' && !this._project))
            this.handleActions(resolvedAction);
    }

    private handleActions(action: string) {
        switch(action) {
            case 'open':
            case 'import_image':
                this.openFile(action);
                break;
            case 'new':
                this._project = new Project(false);
                this._project.changeTracker.subscribe(p => this.updateTitle(p));
                this.loadProject();
                break;
            case 'save':
                this._project.save();
                break;
            case 'export_as_image':
                this._previewCanvas.export();
                break;
        }
    }

    private async openFile(action: string) {
        const handle = await FileHandler.open(action);

        if (action === 'import_image')
        {
            this._project.import(handle);
            return;
        }
        
        this._project = await Project.open(handle);
        this._project.changeTracker.subscribe(p => this.updateTitle(p));
        this.loadProject();
    }

    private loadProject() {
        this._app.classList.toggle('no-project', false);
        this._editor.register(this._project);
        this._previewCanvas.register(this._project);

        this.updateTitle();
    }

    private updateTitle(state?: string) {
        if (state && !(state === 'title' || state === 'save_state'))
            return;

        this._projectTitle.innerText = this._project.title;
        this._projectTitle.classList.toggle('unsaved', !this._project.saved);
    }

    private setDesignTokens() {
        const propertiesSection = document.getElementById('properties_section') as HTMLDivElement;

        fillColor.setValueFor(propertiesSection, neutralLayer2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SilhouetteStudioTool();
});