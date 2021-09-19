/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import { Context, Markup, Scenes } from 'telegraf';
import Bot from '../types/bot';

export default class RandomScene {
  private static ACTIONS = {
    findByCountry: 'FIND_BY_COUNTRY',
    exitFromSearch: 'EXIT_FROM_SEARCH',
  }

  static search(): Scenes.BaseScene<Bot.IContext> {
    const scene = new Scenes.BaseScene<Bot.IContext>('random');

    scene.enter((ctx) => {
      console.log('PROPS from random');

      console.log(ctx.contextProp);
      console.log(ctx.session.sessionProp);
      console.log(ctx.scene.session.sceneSessionProp);

      ctx.reply('Hello from find scene');
    });

    return scene;
  }
}
