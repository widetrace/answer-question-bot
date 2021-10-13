/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

// Сделать:
//  * Изменить запрос книги -- если в переменной уже есть список, то не загружать его снова

import axios from 'axios';
import { Markup, Scenes } from 'telegraf';
import api from '../api';
import Bot from '../types/bot';
import { book } from '../interfaces/baseObj';

// Максимум не включается, минимум включается
function getRandomInt(min: number, max: number) {
  const minNumber = Math.ceil(min);
  const maxNumber = Math.floor(max);
  return Math.floor(Math.random() * (maxNumber - minNumber)) + minNumber;
}

export default class RandomBook {
  static list: Array<book>

  private static ACTIONS = {
    anotherOne: 'ONE_MORE_BOOK',
    exitOnMain: 'EXIT_FROM_RANDOM',
  }

  static ONE_MORE_BUTTON = [Markup.button.callback('🎲 Другую книгу', RandomBook.ACTIONS.anotherOne)];

  static EXIT_BUTTON = [Markup.button.callback('⬅️ Выход', RandomBook.ACTIONS.exitOnMain)];

  static init(): Scenes.BaseScene<Bot.IContext> {
    const scene = new Scenes.BaseScene<Bot.IContext>('random');

    scene.enter(async (ctx) => {
      let counter = 2;
      const bookEmoji = '📗';

      const { message_id: sceneEnterMsgId } = await ctx.reply('Выбираем книгу');

      const { message_id: msgId } = await ctx.reply(bookEmoji);

      const timerId = setInterval(() => {
        if (counter > 3) {
          counter = 1;
        }
        ctx.telegram.editMessageText(ctx.chat.id, msgId, undefined, bookEmoji.repeat(counter));
        counter += 1;
      }, 1500);

      setTimeout(async () => {
        clearInterval(timerId);

        this.list = await api.getAllBooks();

        const bookId = getRandomInt(0, this.list.length);

        ctx.deleteMessage(msgId);
        ctx.deleteMessage(sceneEnterMsgId);

        ctx.reply(`Выбранная книга ---> ${this.list[bookId].name}`, Markup
          .inlineKeyboard([RandomBook.ONE_MORE_BUTTON, RandomBook.EXIT_BUTTON]));
      }, 3500);
    });

    scene.action(RandomBook.ACTIONS.anotherOne, async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
      ctx.scene.reenter();
    });

    scene.action(RandomBook.ACTIONS.exitOnMain, async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
      ctx.scene.enter('start');
    });

    return scene;
  }
}
