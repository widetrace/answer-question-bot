/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Telegraf, Markup } from 'telegraf';
import TgBot from '../index';
import Bot from '../types/bot';

export default class BaseAction {
  private readonly bot: Telegraf<Bot.IContext>;

  private static ACTIONS = {
    search: 'SEARCH',
    random: 'RANDOM',
  }

  static SEARCH_BUTTON = [Markup.button.callback('Поиск', BaseAction.ACTIONS.search)]

  static RANDOM_BUTTON = [Markup.button.callback('Случайная книга', BaseAction.ACTIONS.random)]

  constructor() {
    this.bot = TgBot.bot;

    this.registerBaseCommands()
      .then();
  }

  private async registerBaseCommands(): Promise<void> {
    try {
      this.onStart();
      this.onActions();
      this.onCommands();
    } catch (err) {
      throw new Error(err);
    }
  }

  private onStart(): void {
    this.bot.start(async (ctx) => {
      ctx.session.sessionProp = 'test';
      await ctx.reply('Добро пожаловать!', Markup
        .inlineKeyboard([BaseAction.SEARCH_BUTTON, BaseAction.RANDOM_BUTTON]));
    });
  }

  private onCommands(): void {
    this.bot.command('test1', async (ctx) => {
      ctx.scene.enter('search');
      console.log(ctx.session.sessionProp);
    });
    this.bot.command('test2', (ctx) => {
      ctx.scene.enter('random');
      console.log(ctx.session.sessionProp);
    });
  }

  private onActions(): void {
    this.bot.action(BaseAction.ACTIONS.search, (ctx) => {
      console.log(ctx.session.sessionProp);
      ctx.reply('Начинаем поиск');
    });

    this.bot.action(BaseAction.ACTIONS.random, (ctx) => {
      ctx.reply('Ищем случайную книгу');
    });
  }
}
