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
    } catch (err) {
      throw new Error(err);
    }
  }

  private onStart(): void {
    this.bot.start(async (ctx) => {
      await ctx.reply('Hello from base command');
    });
  }
}
