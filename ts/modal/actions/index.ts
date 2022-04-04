import mountCloser from './close';
import mountLabelToggle from './labels';
import mountLeafToggle from './leaves';
import mountStyler from './style';

import type Root from '../tree/nodes/root';

import type {Child} from '../../validation/types';

export default function mount(root: Root, style?: Child) {
    mountCloser(root);
    mountLabelToggle();
    mountLeafToggle();
    mountStyler(style);
}
