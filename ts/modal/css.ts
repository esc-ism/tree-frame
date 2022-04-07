import {MODAL_BACKGROUND_ID, MODAL_ID, STYLESHEET} from './consts';

type Selector = string;
type Selectors = Selector | Array<Selector>;

type Style = [string, string];
type Styles = Style | Array<Style>;

function isStyle(candidate): candidate is Style {
    return candidate.length > 0 && typeof candidate[0] === 'string';
}

export function getRuleString(selectors: Selectors, rules: Style | Array<Style>) {
    const toStyleString = ([property, value]) => `${property}:${value};`;
    const styleString: string = isStyle(rules) ? toStyleString(rules) : rules.map(toStyleString).join('');
    const selectorString = typeof selectors === 'string' ? selectors : selectors.join(',');

    return `${selectorString}{${styleString}}`;
}

export function addRule(selectors: Selectors, styles: Styles) {
    STYLESHEET.insertRule(getRuleString(selectors, styles));
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

        ['background', 'var(--base)'],
        ['color', 'var(--contrast)'],
        ['font-family', 'Tahoma, Geneva, sans-serif'],
        ['outline', 'white solid 2px'],
        ['box-shadow', '1px 1px 10px 4px #00000015, 0 0 30px 10px #00000065'],
    ]);
}
