type ChangeTrackerNotificationCallback = (property: string) => void;

/**
 * Represents a change tracker.
 */
export class ChangeTracker {
    private _subscribers: ChangeTrackerNotificationCallback[] = [];

    /**
     * Notifies the tracker that a change has occurred.
     * 
     * @param property The name of the property that was changed.
     */
    public notify(property: string) {
        this._subscribers.forEach(callback => callback(property));
    }

    /**
     * Subscibe for tracked changes notification.
     * 
     * @param callback Function called when a change has occured.
     */
    public subscribe(callback: ChangeTrackerNotificationCallback) {
        this._subscribers.push(callback);
    }
}