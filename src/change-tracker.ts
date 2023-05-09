type ChangeTrackerNotificationCallback = (property: string) => void;

type ChangeTrackerNotificationSubscriber = {
    trackedEvents: string[],
    callback: ChangeTrackerNotificationCallback;
}

/**
 * Represents a change tracker.
 */
export class ChangeTracker {
    private _subscribers: ChangeTrackerNotificationSubscriber[] = [];

    /**
     * Notifies the tracker that a change has occurred.
     * 
     * @param event The name of the property that was changed.
     */
    public notify(event: string) {
        const targets = this._subscribers.filter(s => {
            return s.trackedEvents.includes('*') || s.trackedEvents.includes(event);
        });

        targets.forEach(s => s.callback(event));
    }

    /**
     * Subscibe for event notifications.
     * 
     * @param trackedEvents
     * List of events to subscribe.
     * Use the ```*``` wildcard to subscribe to all events.
     * 
     * @param callback Function called when a change has occured.
     */
    public subscribe(trackedEvents: string[], callback: ChangeTrackerNotificationCallback) {
        const subscriber = {
            trackedEvents: trackedEvents,
            callback: callback
        };

        this._subscribers.push(subscriber);
    }
}