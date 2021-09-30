/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import { Scenes } from 'telegraf';
import axios from 'axios';
import Bot from '../types/bot';

function upperCaseFirstLetter(word: string): string {
  return word[0].toUpperCase() + word.substring(1).toLowerCase();
}

interface authorsList {
  id: number,
  name: {
    first: string,
    second: string,
  },
  country: number,
}

export default class NameSearch {
  static list: Array<authorsList>

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
      if (ctx.callbackQuery.message.message_id) {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
      }

      ctx.session.prevMessage = (await ctx.reply('Введите фамилию писателя')).message_id;
    });

    scene.on('text', async (ctx) => {
      const LINK = encodeURI(`http://localhost:3000/authors?name.second=${upperCaseFirstLetter(ctx.message.text)}`);

      try {
        this.list = (await axios.get(LINK)).data;
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
