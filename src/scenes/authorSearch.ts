/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import { Markup, Scenes } from 'telegraf';
import axios from 'axios';
import Bot from '../types/bot';
import { author } from '../interfaces/baseObj';

export default class authorSearch {
  static list: Array<author>

  static authorButtons(): Array<string> {
    const arrayButtons = [];

    this.list.forEach((element) => {
      arrayButtons.push(`${element.name.first} ${element.name.second}`);
    });

    return arrayButtons;
  }

  static hearings(scene: Scenes.BaseScene<Bot.IContext>) {
    this.list.forEach((el) => {
      scene.hears(`${el.name.first} ${el.name.second}`, async (ctx) => {
        ctx.session.authorId = el.id;

        await ctx.deleteMessage(ctx.update.message.message_id);

        await ctx.deleteMessage(ctx.session.prevMessage);

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

      ctx.session.prevMessage = (await ctx.reply('Выберите автора из меню', Markup.keyboard(authorSearch.authorButtons()).oneTime())).message_id;
    });

    return scene;
  }
}
