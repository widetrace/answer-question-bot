/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import { Scenes } from 'telegraf';
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

      ({ message_id: ctx.session.prevMessage } = await ctx.reply('Введите название страны'));
    });

    scene.on('text', (ctx) => {
      const countryNames = countrySearch.countriesList.map((country) => country.name);

      if (countryNames.includes(ctx.message.text.toLowerCase())) {
        ctx.deleteMessage(ctx.session.prevMessage);

        ({ message_id: ctx.session.prevMessage } = ctx.message);

        ({ id: ctx.session.countryId } = countrySearch.countriesList
          .find((el) => el.name === ctx.message.text.toLowerCase()));

        ctx.scene.enter('authorSearch');
      } else {
        ctx.reply('Такой страны нет');
        ctx.scene.reenter();
      }
    });

    scene.on('message', (ctx) => {
      ctx.reply('Введите название страны корректно');
    });

    return scene;
  }
}
