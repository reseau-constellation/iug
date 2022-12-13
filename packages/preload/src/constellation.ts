import type { IpcRendererEvent } from 'electron';
import { ipcRenderer } from 'electron';

import type { proxy } from '@constl/ipa';

type messagePourServeur = messageInitServeur | messageFermerServeur

type messageInitServeur = {
    type: 'init',
    port?: number,
}

type messageFermerServeur = {
    type: 'fermer',
}

type messageDeServeur = {
    type: 'prêt',
    port: number,
}

export const attendreFenêtreAttachée = (): Promise<void> => {
    return new Promise<void>(
        résoudre => {  
            ipcRenderer.once('clientPrêt', () => résoudre());
        },
    );
};

export const messageÀConstellation = async (message: proxy.messages.MessagePourTravailleur) => {
    // Nécessaire parce que la fenêtre Électron peut être initialisée avant d'être connectée à Constellation
    await attendreFenêtreAttachée();
    ipcRenderer.send('pourClient', message);
};

export const écouterMessagesDeConstellation = (f: (message: proxy.messages.MessageDeTravailleur) => void): () => void => {
    const écouteur = (_event: IpcRendererEvent, ...args: [proxy.messages.MessageDeTravailleur]) => {
        f(...args);
      };
    ipcRenderer.on('deClient', écouteur);
    return () => ipcRenderer.off('deClient', écouteur);
};

export const messageÀServeurConstellation = (message: messagePourServeur) => {
    ipcRenderer.send('pourServeur', message);
};

export const écouterMessagesDeServeurConstellation = (f: (message: messageDeServeur) => void): (() => void) => {
    const écouteur = (_event: IpcRendererEvent, ...args: [messageDeServeur]) => {
        f(...args);
      };
    ipcRenderer.on('deServeur', écouteur);
    return () => ipcRenderer.off('deServeur', écouteur);
};
