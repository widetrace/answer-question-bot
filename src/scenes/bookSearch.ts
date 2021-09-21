/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import { Markup, Scenes } from 'telegraf';
import axios from 'axios';
import Bot from '../types/bot';

interface book {
  id: number,
  name: string,
  short: string,
  author: number,
}

export default class bookSearch {
  static list: Array<book>

  static buttons(): Array<string> {
    const arrayButtons = [];

    this.list.forEach((element) => {
      arrayButtons.push(element.name);
    });

    return arrayButtons;
  }

  static hearings(scene: Scenes.BaseScene<Bot.IContext>) {
    this.list.forEach((el) => {
      scene.hears(el.name, (ctx) => {
        ctx.reply(el.short);
      });
    });
  }

  static init(): Scenes.BaseScene<Bot.IContext> {
    const scene = new Scenes.BaseScene<Bot.IContext>('bookSearch');

    scene.enter(async (ctx) => {
      try {
        bookSearch.list = (await axios.get(`http://localhost:3000/books?author=${ctx.session.authorId}`)).data;
      } catch (error) {
        ctx.reply('Что-то не так с базой данных');
        ctx.scene.enter('start');
        throw new Error(error);
      }

      bookSearch.hearings(scene);

      ctx.reply('Выберите автора из меню', Markup.keyboard(bookSearch.buttons()).oneTime());
    });

    return scene;
  }
}
