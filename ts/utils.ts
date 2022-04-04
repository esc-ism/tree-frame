export function addTrackedChild(parent: HTMLElement, child: HTMLElement, index, tracker: Array<HTMLElement>) {
    tracker[index] = child;

    for (let i = index + 1; i < tracker.length; ++i) {
        const sibling = tracker[i];

        if (sibling) {
            parent.insertBefore(child, sibling);

            return;
        }
    }

    parent.appendChild(child);
}
