import paperDefinition from './data/papers.json';

/**
 * Paper definitions retrieve from a configuration.
 */
export const papers: Paper[] = paperDefinition;

/**
 * Definition of paper size.
 */
export type PageSize = {
    /**
     * Width of the paper.
     */
    width: number;
    /**
     * Height of the paper.
     */
    height: number;
}

/**
 * Definition of a paper.
 */
export type Paper = {
    /**
     * Identifier of paper.
     * 
     * @example ```A4```
     */
    id: string;
    /**
     * Dimensions in metric system.
     */
    metric: PageSize;
    /**
     * Dimensions in imperial system.
     */
    imperial: PageSize;
    /**
     * Height-to-width aspect ratio.
     */
    aspectRatio: number;
}