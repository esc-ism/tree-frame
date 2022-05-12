export default function getConfig() {
    switch (Math.floor(Math.random() * 3)) {
        case 0:
            return import('./faves');

        case 1:
            return import('./places');

        default:
            return import('./riddle');
    }
}
