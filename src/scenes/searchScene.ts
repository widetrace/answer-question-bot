/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import { Markup, Scenes } from 'telegraf';
import Bot from '../types/bot';

export default class SearchScene {
  private static ACTIONS = {
    findByCountry: 'FIND_BY_COUNTRY',
    exitFromSearch: 'EXIT_FROM_SEARCH',
  }

  static search(): Scenes.BaseScene<Bot.IContext> {
    const scene = new Scenes.BaseScene<Bot.IContext>('search');

    scene.enter((ctx) => {
      console.log('PROPS from search');

      ctx.contextProp = 'just prop';
      ctx.session.sessionProp = 'session session prop';
      ctx.scene.session.sceneSessionProp = 321;

      console.log(ctx.contextProp);
      console.log(ctx.session.sessionProp);
      console.log(ctx.scene.session.sceneSessionProp);

      ctx.reply('Hello from find scene');
    });

    return scene;
  }
}
