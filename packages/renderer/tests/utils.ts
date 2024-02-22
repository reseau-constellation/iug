import type {ClientConstellation} from '@constl/ipa/dist/client';
import {type MockedClass, vi} from 'vitest';
import type {App} from 'vue';

export const attendreQue = (f: () => boolean): Promise<void> => {
  return new Promise(résoudre => {
    if (f()) résoudre();
    const oublier = setInterval(() => {
      if (f()) {
        clearInterval(oublier);
        résoudre();
      }
    }, 100);
  });
};

export const fausseConstellation = (
  simuler: (client: MockedClass<typeof ClientConstellation>) => void,
) => {
  const Client = vi.fn() as unknown as MockedClass<typeof ClientConstellation>;
  simuler(Client);
  const client = new Client();
  return {
    install: (app: App) => {
      app.config.globalProperties.$constl = client;
      app.provide('constl', client);
    },
  };
};
