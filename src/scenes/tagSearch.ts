/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import { Markup, Scenes } from 'telegraf';
import api from '../api';
import Bot from '../types/bot';
import { tag } from '../interfaces/baseObj';

export default class tagSearch {
  static list: Array<tag>

  static BUTTONS(): Array<string> {
    const arrayButtons: Array<string> = [];

    this.list.forEach((element) => {
      arrayButtons.push(`${element.name}`);
    });

    return arrayButtons;
  }

  static hearings(scene: Scenes.BaseScene<Bot.IContext>) {
    this.list.forEach((el) => {
      scene.hears(`${el.name}`, async (ctx) => {
        ctx.session.tagId = el.id;

        await ctx.deleteMessage(ctx.update.message.message_id);

        await ctx.deleteMessage(ctx.session.prevMessage);

        ctx.scene.enter('bookSearch');
      });
    });
  }

  static init(): Scenes.BaseScene<Bot.IContext> {
    const scene = new Scenes.BaseScene<Bot.IContext>('tagSearch');

    scene.enter(async (ctx) => {
      try {
        this.list = await api.getTags();
      } catch (error) {
        ctx.reply('Что-то не так с базой данных');
        ctx.scene.enter('start');
        throw new Error(error);
      }

      tagSearch.hearings(scene);

      ctx.session.prevMessage = (await ctx.reply('Выберите ключевое слово из меню', Markup.keyboard(tagSearch.BUTTONS()).oneTime())).message_id;
    });

    return scene;
  }
}
