/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import { Markup, Scenes } from 'telegraf';
import api from '../api';
import Bot from '../types/bot';
import { book } from '../interfaces/baseObj';

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
      let bookSearch: Array<book>;

      await ctx.deleteMessage(ctx.session.prevMessage);

      try {
        bookSearch = await api.getByTitle(ctx.message.text);
      } catch (err) {
        ctx.scene.enter('start');
        throw new Error(err);
      }

      if (!bookSearch.length) {
        ctx.reply('Такой книги нет, или название неверно',
          Markup.inlineKeyboard(titleSearch.BUTTONS));
      } else {
        ctx.reply(bookSearch[0].short, Markup.inlineKeyboard(titleSearch.BUTTONS));
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
