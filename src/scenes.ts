/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import SearchScene from './scenes/searchScene';
import RandomScene from './scenes/randomScene';
import StartScene from './scenes/startScene';
import CountrySearch from './scenes/countrySearch';
import AuthorSearch from './scenes/authorSearch';

const scenes = [
  StartScene.init(),
  SearchScene.init(),
  RandomScene.init(),
  CountrySearch.init(),
  AuthorSearch.init(),
];

export default scenes;
