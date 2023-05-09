import { Builder, Parser } from 'xml2js';
import { Properties } from './properties';
import { PageSetup } from './page-setup';
import { ChangeTracker } from './change-tracker';
import { projectFileOptions } from './file-handler';

export class Project extends EventTarget {
    private _fileHandle: any;

    public changeTracker: ChangeTracker;
    public local: boolean;
    public saved: boolean;

    public title: string;
    /**
     * The media source.
     */
    public source: string;
    /**
     * Properties that affects the state of the project.
     */
    public properties: Properties;
    /**
     * Configurations for the working page or area.
     */
    public pageSetup: PageSetup;

    constructor(local: boolean) {
        super();

        this.title = 'Untitled';
        this.properties = {
            imageWidth: 1,
            imageHeight: 1,
            minSpacing: 0.1,
            showCutBorder: true
        };
        this.pageSetup = PageSetup.default;
        this.changeTracker = new ChangeTracker();

        // States
        this.local = local;
        this.saved = local;

        this.addEventListeners();
    }

    public static async open(handle: any): Promise<Project> {
        const file = await handle.getFile();
        const content = await file.text();

        return new Promise((resolve, reject) => {
            const options = {
                explicitArray: false,
                explicitRoot: false,
            };
            
            new Parser(options).parseString(content, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
    
                const properties = result.properties;
                const pageSetup = result.pageSetup;
                const project = new Project(true);
    
                project.title = result.title;
                project.source = result.source;
                project.properties = {
                    imageWidth: parseFloat(properties.imageWidth),
                    imageHeight: parseFloat(properties.imageHeight),
                    minSpacing: parseFloat(properties.minSpacing),
                    showCutBorder: properties.showCutBorder,
                };
                project.pageSetup = new PageSetup(pageSetup.size);
                project.pageSetup.orientation = pageSetup.orientation;
                project.pageSetup.pixelPerInch = pageSetup.pixelPerInch;

                resolve(project);
            });
        });
    }

    /**
     * Import image.
     * 
     * @param handle File handle used to retrieve image content.
     */
    public async import(handle: any) {
        const file = await handle.getFile();
        const reader = new FileReader();

        reader.onload = () => {
            this.source = reader.result.toString();
            this.saved = false;

            this.changeTracker.notify('save_state');
            this.changeTracker.notify('source');
        }
        
        reader.readAsDataURL(file);
    }

    public async save() {
        const options = {rootName:'project'};
        const builder = new Builder(options);
        const content = {
            title: this.title,
            source: this.source,
            properties: this.properties,
            pageSetup: this.pageSetup
        };

        if (!this.local)
            this._fileHandle = await window.showSaveFilePicker(projectFileOptions);

        const writable = await this._fileHandle.createWritable();
        const xml = builder.buildObject(content);
        const file = new Blob([xml], {type: 'text/xml;charset=utf-8'});

        await writable.write(file)
        await writable.close();
        
        this.local = true;
        this.saved = true;
        this.changeTracker.notify('save_state');
    }

    public export() {
        // Not implemented!
    }

    private addEventListeners() {
        this.changeTracker.subscribe(prop => {
            if (prop === 'save_state')
                return;

            this.saved = false;
            this.changeTracker.notify('save_state');
        });
    }
}

// TODO: Remove if official support comes.
declare const window: Window &
typeof globalThis & {
    showOpenFilePicker: any,
    showSaveFilePicker: any,
}