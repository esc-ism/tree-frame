import {TITLE_CONTAINER_ID, TITLE_ID} from './consts';
import generateCSS from './css';

export default function generate(title: string) {
    generateCSS();

    const titleContainer = document.createElement('span');
    const titleElement = document.createElement('span');

    titleContainer.id = TITLE_CONTAINER_ID;

    titleElement.id = TITLE_ID;
    titleElement.innerText = title;
    // In case the text is too long to fit
    titleElement.title = title;

    titleContainer.append(titleElement);

    return titleContainer;
}
