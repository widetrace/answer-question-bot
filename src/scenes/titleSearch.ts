/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import axios from 'axios';
import { Markup, Scenes } from 'telegraf';
import Bot from '../types/bot';

interface bookObj {
  id: number,
  name: string,
  short: string,
  author: number,
}

export default class titleSearch {
  private static ACTIONS = {
    findAnotherOne: 'FIND_ANOTHER_TITLE',
    exitOnMain: 'EXIT_FROM_TITLE_SEARCH',
  }

  static BUTTONS = [
    [Markup.button.callback('Найти книгу по названию', titleSearch.ACTIONS.findAnotherOne)],
    [Markup.button.callback('Вернуться на главную', titleSearch.ACTIONS.exitOnMain)],
  ]

  static init(): Scenes.BaseScene<Bot.IContext> {
    const scene = new Scenes.BaseScene<Bot.IContext>('titleSearch');

    scene.enter(async (ctx) => {
      ({ message_id: ctx.session.prevMessage } = await ctx.reply('Введите название книги'));
    });

    scene.on('text', async (ctx) => {
      let book: Array<bookObj>;

      await ctx.deleteMessage(ctx.session.prevMessage);

      try {
        book = (await axios.get(encodeURI(`http://localhost:3000/books?name=${ctx.message.text}`))).data;
      } catch (err) {
        ctx.scene.enter('start');
        throw new Error(err);
      }

      if (!book.length) {
        ctx.reply('Такой книги нет, или название неверно',
          Markup.inlineKeyboard(titleSearch.BUTTONS));
      } else {
        ctx.reply(book[0].short, Markup.inlineKeyboard(titleSearch.BUTTONS));
      }

      ctx.deleteMessage(ctx.message.message_id);
    });

    scene.action(titleSearch.ACTIONS.findAnotherOne, async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);

      ctx.scene.reenter();
    });

    scene.action(titleSearch.ACTIONS.exitOnMain, async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);

      ctx.scene.enter('start');
    });

    return scene;
  }
}
