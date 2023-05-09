import { Builder, Parser } from 'xml2js';
import { Properties } from './properties';
import { PageSetup } from './page-setup';
import { ChangeTracker } from './change-tracker';
import { FileHandler } from './file-handler';

export class Project {
    private _fileHandle: any;

    public changeTracker: ChangeTracker;
    public local: boolean;
    public saved: boolean;

    /**
     * Project title
     */
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

    constructor(handle?: any) {
        this.title = 'Untitled';
        this.source = null;
        this.properties = Properties.default;
        this.pageSetup = PageSetup.default;
        this.changeTracker = new ChangeTracker();

        // TODO: Refactor?
        // States
        this._fileHandle = handle;
        this.local = handle != null;
        this.saved = this.local;

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
                const project = new Project(handle);
    
                project.title = result.title;
                project.source = result.source;
                project.properties = {
                    imageWidth: parseFloat(properties.imageWidth),
                    imageHeight: parseFloat(properties.imageHeight),
                    minSpacing: parseFloat(properties.minSpacing),
                    showCutBorder: properties.showCutBorder == 'true',
                };
                project.pageSetup = new PageSetup(pageSetup.size);
                project.pageSetup.orientation = parseFloat(pageSetup.orientation);
                project.pageSetup.pixelPerInch = parseFloat(pageSetup.pixelPerInch);

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

        const xml = builder.buildObject(content);
        const file = new Blob([xml], {type: 'text/xml;charset=utf-8'});

        this._fileHandle = await FileHandler.save(this._fileHandle, file);
        
        this.local = true;
        this.saved = true;
        this.changeTracker.notify('save_state');
    }

    public export() {
        // Not implemented!
    }

    private addEventListeners() {
        this.changeTracker.subscribe(['*'], prop => {
            if (prop === 'save_state')
                return;

            this.saved = false;
            this.changeTracker.notify('save_state');
        });
    }
}