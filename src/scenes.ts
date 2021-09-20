/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import SearchScene from './scenes/searchScene';
import RandomScene from './scenes/randomScene';
import StartScene from './scenes/startScene';
import CountrySearch from './scenes/countrySearch';

const scenes = [StartScene.init(), SearchScene.init(), RandomScene.init(), CountrySearch.init()];

export default scenes;
