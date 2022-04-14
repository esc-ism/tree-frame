export default function getConfig() {
    const poolSize = 3;
    const index = Math.floor(Math.random() / (1 / poolSize));

    switch (index) {
        case 0:
            return import('./faves');

        case 1:
            return import('./places');

        default:
            return import('./riddle');
    }
}
