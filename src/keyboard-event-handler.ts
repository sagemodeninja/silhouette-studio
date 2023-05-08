export class KeyboardEventHandler {
    /**
     * Resolve a keyboard event to a supported action.
     * 
     * @param e Keyboard event to resolve.
     * @returns Name of resolved action or `undefined`.
     */
    static resolve(e: KeyboardEvent): string {
        // Open
        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyO')
        {
            e.preventDefault();
            return 'open';
        }
        
        // Import Image
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyI')
        {
            e.preventDefault();
            return 'import_image';
        }

        // Save
        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS')
        {
            e.preventDefault();
            return 'save';
        }

        // Export as Image
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyE')
        {
            e.preventDefault();
            return 'export_as_image';
        }
    }
}