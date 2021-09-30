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

  private static ACTIONS = {
    chooseBook: 'CHOOSE_ANOTHER_BOOK',
    exitOMain: 'EXIT_FROM_BOOK_SEARCH',
  }

  static CHOOSE_BOOK_BUTTON = [Markup.button.callback('Выбрать другую книгу', bookSearch.ACTIONS.chooseBook)];

  static EXIT_BUTTON = [Markup.button.callback('Выход', bookSearch.ACTIONS.exitOMain)];

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
      try {
        bookSearch.list = (await axios.get(`http://localhost:3000/books?author=${ctx.session.authorId}`)).data;
      } catch (error) {
        ctx.reply('Что-то не так с базой данных');
        ctx.scene.enter('start');
        throw new Error(error);
      }

      bookSearch.hearings(scene);

      ctx.session.prevMessage = (await ctx.reply('Выберите книгу из меню', Markup.keyboard(bookSearch.buttons()).oneTime())).message_id;
    });

    scene.action(bookSearch.ACTIONS.chooseBook, (ctx) => {
      ctx.scene.reenter();
    });

    scene.action(bookSearch.ACTIONS.exitOMain, async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
      ctx.scene.enter('start');
    });

    return scene;
  }
}
