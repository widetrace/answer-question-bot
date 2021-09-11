import { Markup, Scenes } from 'telegraf';
import Bot from '../types/bot';

export default class SearchScene {
  private static ACTIONS = {
    findByCountry: 'FIND_BY_COUNTRY',
    exitFromSearch: 'EXIT_FROM_SEARCH',
  }

  static search(): Scenes.BaseScene<Bot.IContext> {
    const scene = new Scenes.BaseScene<Bot.IContext>('search');

    scene.enter((ctx) => ctx.reply('Hello from find scene'));

    return scene;
  }
}
