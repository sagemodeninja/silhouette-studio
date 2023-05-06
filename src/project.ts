import { SourceImage } from './source-image';
import { Builder } from 'xml2js';
import { saveAs } from 'file-saver';
import { ProjectParser } from './project-parser';

export class Project {
    public title: string;
    public source: SourceImage;

    constructor() {
        this.source = new SourceImage();
        this.source.data = 'sample';
        this.source.width = 1.5;
        this.source.height = 1;
    }

    static open(file: File) {
        const ext = file.name.split('.').pop();

        switch(ext) {
            case 'studio4':
                return ProjectParser.parse(file);
            default:
                return this.createProject(file);
        }
    }

    private static createProject(file: File) {
        const project = new Project();

        project.title = file.name.split('.')[0];
        project.source = {
            data: URL.createObjectURL(file),
            width: 1.5,
            height: 1.5,
        };

        return project;
    }

    public save() {
        const builder = new Builder();
        const xml = builder.buildObject(this);

        const file = new Blob([xml], {type: 'text/xml;charset=utf-8'});
        saveAs(file, 'myFile.studio4');
    }
}