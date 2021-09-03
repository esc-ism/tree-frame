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

export interface Handler {
    listeners: Listeners;

    listen: (doListen: boolean) => void;
}
