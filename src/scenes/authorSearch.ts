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

  static authorButtons(list?): Array<string> {
    const arrayButtons = [];

    this.list.forEach((element) => {
      arrayButtons.push(`${element.name.first} ${element.name.second}`);
    });

    return arrayButtons;
  }

  static hearings(scene: Scenes.BaseScene<Bot.IContext>) {
    // this.authorButtons().forEach((el) => {
    //   scene.hears(el, (ctx) => { ctx.reply('heard u'); });
    // });
    this.list.forEach((el) => {
      scene.hears(`${el.name.first} ${el.name.second}`, (ctx) => {
        ctx.session.authorId = el.id;
        ctx.reply(`Author ID: ${el.id}`);
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
      console.log(authorSearch.list);
      ctx.reply('Выберите автора из меню', Markup.keyboard(authorSearch.authorButtons(authorSearch.list)).oneTime());
    });

    // scene.on('text', (ctx) => {
    //   ctx.scene.reenter();
    // });

    // scene.on('message', (ctx) => {
    //   ctx.reply('Выберите автора из списка');
    // });

    return scene;
  }
}
