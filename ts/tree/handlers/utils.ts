export function handleDragOver(isDroppable, event) {
    event.stopPropagation();

    if (isDroppable) {
        event.preventDefault(); // Allow dropping
        event.dataTransfer.dropEffect = 'move'; // Style drag cursor
    }
}

class Listener {
    element;
    event;
    callback;

    constructor(element, event, callback) {
        this.element = element;
        this.event = event;
        this.callback = callback;

        this.start();
    }

    start() {
        this.element.addEventListener(this.event, this.callback);
    }

    stop() {
        this.element.removeEventListener(this.event, this.callback);
    }
}

export class Listeners {
    listeners: Array<Listener> = [];

    add(element, event, callback) {
        this.listeners.push(new Listener(element, event, callback));
    }

    clear() {
        for (const listener of this.listeners) {
            listener.stop();
        }

        this.listeners.length = 0;
    }
}

export abstract class EventCounter {
    private count: number = 0;

    protected abstract isDroppable: boolean;

    reset() {
        this.count = 0;
    }

    registerEnter(event) {
        event.stopPropagation();

        if (this.count++ === 0) {
            this.onEnter();
        }
    }

    registerExit(event) {
        handleDragOver(this.isDroppable, event)

        if (this.count-- === 1) {
            this.onExit();
        }
    }

    abstract onEnter();

    abstract onExit();
}
