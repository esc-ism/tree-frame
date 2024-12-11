import start from '../modal';
import getConfig from './examples';

// Show an example tree when not used as an iFrame
getConfig().then(({default: config}) => start(config, document.body, window));
