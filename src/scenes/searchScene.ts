/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import { Markup, Scenes } from 'telegraf';
import Bot from '../types/bot';

export default class SearchScene {
  private static ACTIONS = {
    findByCountry: 'FIND_BY_COUNTRY',
    findBySurname: 'FIND_BY_NAME',
    findByTitle: 'FIND_BY_BOOK_TITLE',
    findByTag: 'FIND_BY_TAG',
    exitFromSearch: 'EXIT_FROM_SEARCH',
  }

  static FILTER_BUTTONS = [
    [Markup.button.callback('👉 Поиск по странам', SearchScene.ACTIONS.findByCountry)],
    [Markup.button.callback('👉 Поиск по фамилии', SearchScene.ACTIONS.findBySurname)],
    [Markup.button.callback('👉 Поиск по названию книги', SearchScene.ACTIONS.findByTitle)],
    [Markup.button.callback('👉 Поиск по ключевому слову', SearchScene.ACTIONS.findByTag)],
  ]

  static EXIT_BUTTON = [Markup.button.callback('Выйти из поиска', SearchScene.ACTIONS.exitFromSearch)]

  static init(): Scenes.BaseScene<Bot.IContext> {
    const scene = new Scenes.BaseScene<Bot.IContext>('search');

    scene.enter(async (ctx) => {
      ctx.reply('📚 Выберите фильтр: ',
        Markup.inlineKeyboard([...SearchScene.FILTER_BUTTONS, SearchScene.EXIT_BUTTON]));

      // ctx.contextProp = 'just prop';
      // ctx.session.sessionProp = 'session session prop';
      // ctx.scene.session.sceneSessionProp = 321;

      // console.log(ctx.contextProp);
      // console.log(ctx.session.sessionProp);
      // console.log(ctx.scene.session.sceneSessionProp);
    });

    scene.action(SearchScene.ACTIONS.exitFromSearch, async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);

      ctx.scene.enter('start');
    });

    scene.action(SearchScene.ACTIONS.findByCountry, (ctx) => {
      ctx.scene.enter('countrySearch');
    });

    scene.action(SearchScene.ACTIONS.findBySurname, async (ctx) => {
      ctx.scene.enter('nameSearch');
    });

    scene.action(SearchScene.ACTIONS.findByTitle, (ctx) => {
      ctx.scene.enter('titleSearch');
    });

    return scene;
  }
}
