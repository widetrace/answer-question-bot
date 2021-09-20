/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import SearchScene from './scenes/searchScene';
import RandomScene from './scenes/randomScene';
import StartScene from './scenes/startScene';

const scenes = [StartScene.init(), SearchScene.init(), RandomScene.init()];

export default scenes;
