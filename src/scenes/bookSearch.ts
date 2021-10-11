/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import { Markup, Scenes } from 'telegraf';
import API from '../api';
import Bot from '../types/bot';
import { book } from '../interfaces/baseObj';

export default class bookSearch {
  static list: Array<book>

  private static ACTIONS = {
    chooseBook: 'CHOOSE_ANOTHER_BOOK',
    exitOnMain: 'EXIT_FROM_BOOK_SEARCH',
  }

  static CHOOSE_BOOK_BUTTON = [Markup.button.callback('Выбрать другую книгу', bookSearch.ACTIONS.chooseBook)];

  static EXIT_BUTTON = [Markup.button.callback('Выход', bookSearch.ACTIONS.exitOnMain)];

  static buttons(): Array<string> {
    const arrayButtons = [];

    this.list.forEach((element) => {
      arrayButtons.push(element.name);
    });

    return arrayButtons;
  }

  static bookButtons() {

  }

  static hearings(scene: Scenes.BaseScene<Bot.IContext>) {
    this.list.forEach((el) => {
      scene.hears(el.name, async (ctx) => {
        await ctx.deleteMessage(ctx.session.prevMessage);
        await ctx.deleteMessage(ctx.update.message.message_id);

        ctx.reply(el.short, Markup.inlineKeyboard(
          [
            bookSearch.CHOOSE_BOOK_BUTTON,
            bookSearch.EXIT_BUTTON,
          ],
        ));
      });
    });
  }

  static init(): Scenes.BaseScene<Bot.IContext> {
    const scene = new Scenes.BaseScene<Bot.IContext>('bookSearch');

    scene.enter(async (ctx) => {
      if (!ctx.session.authorId && !ctx.session.tagId) {
        ctx.scene.enter('start');
      }

      try {
        this.list = await API.getBooks({
          authorId: ctx.session.authorId,
          tagId: ctx.session.tagId,
        });
      } catch (error) {
        ctx.reply('Что-то не так с базой данных');
        ctx.scene.enter('start');
        throw new Error(error);
      }

      bookSearch.hearings(scene);

      ctx.session.prevMessage = (await ctx.reply('Выберите книгу из меню', Markup.keyboard(bookSearch.buttons()).oneTime())).message_id;
    });

    scene.action(bookSearch.ACTIONS.chooseBook, async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);

      ctx.scene.reenter();
    });

    scene.action(bookSearch.ACTIONS.exitOnMain, async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);

      ctx.scene.enter('start');
    });

    return scene;
  }
}
