/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import SearchScene from './scenes/searchScene';
import StartScene from './scenes/startScene';

import CountrySearch from './scenes/countrySearch';
import AuthorSearch from './scenes/authorSearch';
import BookSearch from './scenes/bookSearch';
import TitleSearch from './scenes/titleSearch';
import NameSearch from './scenes/nameSearch';

import RandomBook from './scenes/randomBook';

const scenes = [
  StartScene.init(),
  SearchScene.init(),
  CountrySearch.init(),
  AuthorSearch.init(),
  NameSearch.init(),
  BookSearch.init(),
  TitleSearch.init(),
  RandomBook.init(),
];

export default scenes;
