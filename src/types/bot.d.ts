import { Context, Scenes } from 'telegraf';

declare namespace Bot {
  interface ISceneSession extends Scenes.SceneSessionData {
    sceneSessionProp: number
  }

  interface ISession extends Scenes.SceneSession<ISceneSession> {
    sessionProp: string,
    prevMessage: number,
    countryId: number,
    authorId: number,
    tagId: number
  }

  interface IContext extends Context {
    contextProp: string
    session: ISession
    scene: Scenes.SceneContextScene<IContext, ISceneSession>
  }
}

export default Bot;
