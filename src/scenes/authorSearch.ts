/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import { Markup, Scenes } from 'telegraf';
import axios from 'axios';
import Bot from '../types/bot';

interface authorsList {
  id: number,
  name: {
    first: string,
    second: string,
  },
  country: number,
}

export default class authorSearch {
  static list: Array<authorsList>

  static authorButtons(): Array<string> {
    const arrayButtons = [];

    this.list.forEach((element) => {
      arrayButtons.push(`${element.name.first} ${element.name.second}`);
    });

    return arrayButtons;
  }

  static hearings(scene: Scenes.BaseScene<Bot.IContext>) {
    this.list.forEach((el) => {
      scene.hears(`${el.name.first} ${el.name.second}`, (ctx) => {
        ctx.session.authorId = el.id;
        ctx.scene.enter('bookSearch');
      });
    });
  }

  static init(): Scenes.BaseScene<Bot.IContext> {
    const scene = new Scenes.BaseScene<Bot.IContext>('authorSearch');

    scene.enter(async (ctx) => {
      try {
        authorSearch.list = (await axios.get(`http://localhost:3000/authors?country=${ctx.session.countryId}`)).data;
      } catch (error) {
        ctx.reply('Что-то не так с базой данных');
        ctx.scene.enter('start');
        throw new Error(error);
      }

      authorSearch.hearings(scene);

      await ctx.deleteMessage(ctx.session.prevMessage);

      ctx.reply('Выберите автора из меню', Markup.keyboard(authorSearch.authorButtons()).oneTime());
    });

    return scene;
  }
}
