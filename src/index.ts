/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { Scenes, session, Telegraf } from 'telegraf';
import SearchScene from './scenes/searchScene';
import Bot from './types/bot';
import BaseActions from './actions/baseActions';

// import testScene from './scenes/testScene';

const token = '1848068511:AAEDicoBS_NTNLjGCDhDjDzaGgwzOl6YXDs';
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!');
}

export default class TelegramBot {
  static bot: Telegraf<Bot.IContext> = new Telegraf<Bot.IContext>(<string>token);

  private baseActions: BaseActions | undefined;

  constructor() {
    try {
      this.init();
    } catch (err) {
      throw new Error(err);
    }
  }

  private async init(): Promise<void> {
    try {
      this.registerScenes();
      this.registerActions();

      await TelegramBot.bot.launch()
        .then(async () => {
          // if (!process.env.DEBUG_MODE || process.env.DEBUG_MODE !== 'true') {
          //   // await TelegramBot.bot.telegram
          //   //   .sendMessage(<string>process.env.TG_USER_ID, 'Я готов к работе 🙃');
          // }
        });
    } catch (err) {
      throw new Error(err);
    }
  }

  private registerScenes = (): void => {
    const stage = new Scenes.Stage<Bot.IContext>([SearchScene.search()]);
    TelegramBot.bot.use(session());
    TelegramBot.bot.use(stage.middleware());
    TelegramBot.bot.use((ctx, next) => {
      // eslint-disable-next-line no-param-reassign
      ctx.contextProp ??= '';
      // eslint-disable-next-line no-param-reassign
      ctx.session.sessionProp ??= '';
      // eslint-disable-next-line no-param-reassign
      ctx.scene.session.sceneSessionProp ??= 0;

      return next();
    });
  }

  private registerActions = (): void => {
    this.baseActions = new BaseActions();
  }
}

new TelegramBot();
