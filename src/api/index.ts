/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import axios from 'axios';
import { author } from '../interfaces/baseObj';

class API {
  readonly LINK = 'http://localhost:3000/';

  async getAuthors(countryId): Promise<Array<author>> {
    let result;
    try {
      result = (await axios.get(`${this.LINK}authors?country=${countryId}`)).data;
    } catch (err) {
      result = [false];
      throw new Error(err);
    }

    return result;
  }
}

const botAPI = new API();

export default botAPI;
