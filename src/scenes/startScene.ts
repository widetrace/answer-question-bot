/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import { Markup, Scenes } from 'telegraf';
import Bot from '../types/bot';

export default class StartScene {
  private static ACTIONS = {
    search: 'START_SEARCH_SCENE',
    random: 'FIND_RANDOM_BOOK',
  }

  static SEARCH_BUTTON = [Markup.button.callback('🔎 Поиск', StartScene.ACTIONS.search)]

  static RANDOM_BUTTON = [Markup.button.callback('🎲 Случайная книга', StartScene.ACTIONS.random)]

  static init(): Scenes.BaseScene<Bot.IContext> {
    const scene = new Scenes.BaseScene<Bot.IContext>('start');

    scene.enter(async (ctx) => {
      ({ message_id: ctx.session.prevMessage } = await ctx.reply('Выберите действие:', Markup
        .inlineKeyboard([StartScene.SEARCH_BUTTON, StartScene.RANDOM_BUTTON])));
    });

    scene.action(StartScene.ACTIONS.search, async (ctx) => {
      await ctx.deleteMessage(ctx.session.prevMessage);

      ctx.scene.enter('search');
    });

    scene.action(StartScene.ACTIONS.random, async (ctx) => {
      await ctx.deleteMessage(ctx.session.prevMessage);

      ctx.scene.enter('random');
    });

    return scene;
  }
}
