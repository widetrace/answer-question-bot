/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Telegraf } from 'telegraf';
import TgBot from '../index';
import Bot from '../types/bot';

export default class BaseAction {
  private readonly bot: Telegraf<Bot.IContext>;

  constructor() {
    this.bot = TgBot.bot;

    this.registerBaseCommands()
      .then();
  }

  private async registerBaseCommands(): Promise<void> {
    try {
      this.onStart();
      // this.onActions();
      // this.onCommands();
    } catch (err) {
      throw new Error(err);
    }
  }

  private onStart(): void {
    this.bot.start(async (ctx) => {
      ctx.reply('Добро пожаловать!');
      ctx.scene.enter('start');
    });
  }

  private onCommands(): void {
    this.bot.command('test1', async (ctx) => {
      console.log(ctx.session.sessionProp);
    });
    this.bot.command('test2', (ctx) => {
      ctx.scene.enter('random');
      console.log(ctx.session.sessionProp);
    });
  }

  // private onActions(): void {
  //   this.bot.action(BaseAction.ACTIONS.search, (ctx) => {
  //     ctx.scene.enter('search');
  //   });

  //   this.bot.action(BaseAction.ACTIONS.random, (ctx) => {
  //     ctx.reply('Ищем случайную книгу');
  //   });
  // }
}
