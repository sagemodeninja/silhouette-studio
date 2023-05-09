export class Properties {
    imageWidth: number;
    imageHeight: number;
    minSpacing: number;
    showCutBorder: boolean;
    
    /**
    * Gets deafult properties.
    */
    static get default(): Properties {
        return {
            imageWidth: 1,
            imageHeight: 1,
            minSpacing: 0.1,
            showCutBorder: true
        };
    }
};