import { type SessionStorage, type Session as CfSession, createWorkersKVSessionStorage } from '@remix-run/cloudflare';

export class SessionKv<Data, FlashData> {
  #sessionStorage: SessionStorage<Data, FlashData>;

  constructor(name: string, kvStore: KVNamespace, sessionSecret: string, hostUrl: string, nodeEnv: string) {
    this.#sessionStorage = createWorkersKVSessionStorage({
      kv: kvStore,
      cookie: {
        name: name,
        // domain: hostUrl,
        httpOnly: true,
        maxAge: 60,
        path: '/',
        sameSite: 'lax',
        secrets: [sessionSecret],
        secure: nodeEnv === 'PROD' || nodeEnv === 'TEST',
      },
    });
  }

  async getSession(cookieHeader: string) {
    return await this.#sessionStorage.getSession(cookieHeader);
  }

  async commitSession(session: CfSession<Data, FlashData>) {
    return await this.#sessionStorage.commitSession(session);
  }

  async destroySession(session: CfSession<Data, FlashData>) {
    return await this.#sessionStorage.destroySession(session);
  }
}
