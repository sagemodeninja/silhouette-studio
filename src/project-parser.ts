import { Parser } from 'xml2js';
import { Project } from './project';

export class ProjectParser {
    static parse(file: File): Promise<Project> {
        const parser = new Parser({explicitArray: false});
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.readAsText(file);
            reader.onload = (event) => {
                const xml = event.target.result;
    
                parser.parseString(xml, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const project = new Project();
                    const root = result.root;

                    project.title = root.title;
                    project.source =  {
                        data: root.source.data,
                        width: parseFloat(root.source.width),
                        height: parseFloat(root.source.height),
                    };

                    resolve(project);
                });
            }
        });
    }
}