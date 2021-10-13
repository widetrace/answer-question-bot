/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import { Scenes } from 'telegraf';
import api from '../api';
import Bot from '../types/bot';
import { author } from '../interfaces/baseObj';

export default class NameSearch {
  static list: Array<author>

  static authorButtons(): Array<string> {
    const arrayButtons = [];

    this.list.forEach((element) => {
      arrayButtons.push(`${element.name.first} ${element.name.second}`);
    });

    return arrayButtons;
  }

  static init(): Scenes.BaseScene<Bot.IContext> {
    const scene = new Scenes.BaseScene<Bot.IContext>('nameSearch');

    scene.enter(async (ctx) => {
      ctx.session.prevMessage = (await ctx.reply('Введите фамилию писателя')).message_id;
    });

    scene.on('text', async (ctx) => {
      try {
        this.list = await api.getAuthor(ctx.message.text);
      } catch (err) {
        ctx.reply('Что-то не так с базой данных');
        ctx.scene.enter('start');
        throw new Error(err);
      }

      if (this.list.length) {
        await ctx.deleteMessage(ctx.session.prevMessage);
        await ctx.deleteMessage(ctx.update.message.message_id);
        ctx.session.authorId = this.list[0].id;
        ctx.scene.enter('bookSearch');
      } else {
        ctx.reply('Введите другую фамилию, такой фамилии нет');
      }
    });

    return scene;
  }
}
