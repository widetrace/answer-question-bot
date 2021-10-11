/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import axios from 'axios';
import { author, book, country } from '../interfaces/baseObj';

interface getBookData {
  authorId: number,
  tagId: number
}

class API {
  readonly LINK = 'http://localhost:3000/';

  async getAuthors(countryId: number): Promise<Array<author>> {
    let result;
    try {
      result = (await axios.get(`${this.LINK}authors?country=${countryId}`)).data;
    } catch (err) {
      throw new Error(err);
    }

    return result;
  }

  async getBooks(data: getBookData): Promise<Array<book>> {
    let result: Array<book>;
    let url = `${this.LINK}books`;

    const { authorId, tagId } = data;

    if (authorId) {
      url += `?author=${authorId}`;
    } else {
      url += `?tag=${tagId}`;
    }

    try {
      result = (await axios.get(url)).data;
    } catch (err) {
      throw new Error(err);
    }

    return result;
  }

  async getCountries(): Promise<Array<country>> {
    let result;

    try {
      result = (await axios.get(`${this.LINK}countries`)).data;
    } catch (err) {
      throw new Error(err);
    }

    return result;
  }
}

const botAPI = new API();

export default botAPI;
