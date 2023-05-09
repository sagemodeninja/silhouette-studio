type ChangeTrackerNotificationCallback = (property: string) => void;

type ChangeTrackerNotificationSubscriber = {
    trackedEvents: string[],
    callback: ChangeTrackerNotificationCallback;
}

/**
 * Middleware for notifying and subscribing to change events.
 */
export class ChangeTracker {
    private _subscribers: ChangeTrackerNotificationSubscriber[] = [];

    /**
     * Notifies the tracker that an event has occurred.
     * 
     * @param event Identifier of the event.
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