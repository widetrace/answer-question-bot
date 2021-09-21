/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import SearchScene from './scenes/searchScene';
import RandomScene from './scenes/randomScene';
import StartScene from './scenes/startScene';

import CountrySearch from './scenes/countrySearch';
import AuthorSearch from './scenes/authorSearch';
import BookSearch from './scenes/bookSearch';

const scenes = [
  StartScene.init(),
  SearchScene.init(),
  RandomScene.init(),
  CountrySearch.init(),
  AuthorSearch.init(),
  BookSearch.init(),
];

export default scenes;
