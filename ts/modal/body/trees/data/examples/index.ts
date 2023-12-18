export default function getConfig() {
    switch (Math.floor(Math.random() * 2)) {
        case 0:
            return import('./faves');

        default:
            return import('./places');

        // default:
        //     return import('./riddle');
    }
}
