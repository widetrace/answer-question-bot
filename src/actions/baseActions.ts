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
      this.onCommands();
    } catch (err) {
      throw new Error(err);
    }
  }

  private onStart(): void {
    this.bot.start(async (ctx) => {
      await ctx.reply('Hello from base command');
    });
  }

  private onCommands(): void {
    this.bot.command('test1', async (ctx) => {
      ctx.session.sessionProp = 'test';
      ctx.scene.enter('search');
      console.log(ctx.session.sessionProp);
    });
    this.bot.command('test2', (ctx) => {
      ctx.scene.enter('random');
      console.log(ctx.session.sessionProp);
    });
  }
}
