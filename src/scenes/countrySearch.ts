/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import { Markup, Scenes } from 'telegraf';
import axios from 'axios';
import Bot from '../types/bot';

export default class countrySearch {
  static countriesList;

  static init(): Scenes.BaseScene<Bot.IContext> {
    const scene = new Scenes.BaseScene<Bot.IContext>('countrySearch');
    scene.enter(async (ctx) => {
      try {
        countrySearch.countriesList = (await axios.get('http://localhost:3000/countries')).data;
      } catch (error) {
        ctx.reply('Что-то не так с базой данных');
        ctx.scene.enter('start');
        throw new Error(error);
      }
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
      ctx.reply('Введите название страны');
    });

    scene.on('text', (ctx) => {
      const countryNames = countrySearch.countriesList.map((country) => country.name);

      countryNames.includes(ctx.message.text.toLowerCase())
        ? ctx.reply('Страна такая есть')
        : ctx.reply('Такой страны нет');
    });

    scene.on('message', (ctx) => {
      ctx.reply('Введите название страны корректно');
    });

    return scene;
  }
}
