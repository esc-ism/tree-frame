import {MODAL_BACKGROUND_ID, MODAL_ID} from './consts';

type Selector = string;
export type Selectors = Selector | Array<Selector>;

type Style = [string, string];
export type Styles = Style | Array<Style>;

export function generateStylesheet(): CSSStyleSheet {
    const wrapper = document.createElement('style');

    document.head.appendChild(wrapper);

    return wrapper.sheet;
}

const STYLESHEET = generateStylesheet();

function isStyle(candidate): candidate is Style {
    return candidate.length > 0 && typeof candidate[0] === 'string';
}

function getStyleString([property, value]) {
    return `${property}:${value};`;
}

export function getRuleString(selectors: Selectors, rules: Style | Array<Style>) {
    const styleString: string = isStyle(rules) ? getStyleString(rules) : rules.map(getStyleString).join('');
    const selectorString = typeof selectors === 'string' ? selectors : selectors.join(',');

    return `${selectorString}{${styleString}}`;
}

export function addRule(selectors: Selectors, styles: Styles, stylesheet = STYLESHEET) {
    stylesheet.insertRule(getRuleString(selectors, styles));
}

export default function generate() {
    addRule(`#${MODAL_BACKGROUND_ID}`, [
        ['position', 'fixed'],
        ['left', '0'],
        ['top', '0'],
        ['width', '100%'],
        ['height', '100%'],

        ['background-color', '#0003'],
    ]);

    addRule(`#${MODAL_ID}`, [
        ['position', 'relative'],
        ['margin', '12vh auto'],
        ['padding', '0'],
        ['width', '80%'],

        ['font-family', 'Tahoma, Geneva, sans-serif'],
        ['outline', 'var(--borderModal) solid 2px'],
        ['box-shadow', '1px 1px 10px 4px #00000015, 0 0 30px 10px #00000065'],
    ]);
}
