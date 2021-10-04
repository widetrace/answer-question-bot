/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import { Scenes } from 'telegraf';
import Bot from '../types/bot';

export default class titleSearch {
  static init(): Scenes.BaseScene<Bot.IContext> {
    const scene = new Scenes.BaseScene<Bot.IContext>('titleSearch');

    scene.enter((ctx) => {
      console.log('touch');
      ctx.scene.enter('start');
    });

    return scene;
  }
}
