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
        this._menuBar.oninvoke(action => this.handleActions(action));

        document.addEventListener('keydown', e => this.handleKeyboard(e));

        this._editor.addEventListener('change', () => this._previewCanvas.update());
    }

    private handleKeyboard(e: KeyboardEvent) {
        const resolvedAction = KeyboardEventHandler.resolve(e);

        if (resolvedAction)
            this.handleActions(resolvedAction);
    }

    private handleActions(action: string) {
        switch(action) {
            case 'open':
                this._project.open('project');
                break;
            case 'import_image':
                this._project.open('image');
                break;
            case 'save':
                this._project.save();
                break;
            case 'export_as_image':
                this._project.export();
                break;
        }
    }

    private setDesignTokens() {
        const propertiesSection = document.getElementById('properties_section') as HTMLDivElement;

        fillColor.setValueFor(propertiesSection, neutralLayer2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SilhouetteStudioTool();
});