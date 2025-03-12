import type {client as typeClient} from '@constl/ipa';
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
  simuler: (client: MockedClass<typeof typeClient.Constellation>) => void,
) => {
  const Client = vi.fn() as unknown as MockedClass<typeof typeClient.Constellation>;
  simuler(Client);
  const client = new Client();
  return {
    install: (appli: App) => {
      appli.config.globalProperties.$constl = client;
      appli.provide('constl', client);
    },
  };
};

export const substitionsJSDOM = () => {
  vi.stubGlobal('URL', { createObjectURL: (x: unknown) => `${x instanceof Blob ? 'blob' : 'file'}:monURL` });
  vi.stubGlobal('localStorage', {
    getItem: () => undefined,
    setItem: () => {},
    removeItem: () => {},
  });
};
