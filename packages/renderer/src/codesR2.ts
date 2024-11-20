import type {JSONSchemaType} from 'ajv';
import { multiaddr } from '@multiformats/multiaddr';
import { isLoopbackAddr } from 'is-loopback-addr';

export type CodeR2 = CodeR2Connexion | CodeR2AjoutDispositif; 

export type CodeR2Connexion = {
  type: 'connexion';
  adresses: string[];
}

export const schémaCodeR2Connexion: JSONSchemaType<CodeR2Connexion> = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'connexion',
    },
    adresses: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: ['type', 'adresses'],
};

export type CodeR2AjoutDispositif = {
  type: 'ajout dispositif';
  idCompte: string;
  codeSecret: string;
  adresses?: string[];
}

export const schémaCodeR2AjoutDispositif: JSONSchemaType<CodeR2AjoutDispositif> = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'ajout dispositif',
    },
    idCompte: {
      type: 'string',
    },
    codeSecret: {
      type: 'string',
    },
    adresses: {
      type: 'array',
      items: {
        type: 'string',
      },
      nullable: true,
    },
  },
  required: ['type', 'idCompte', 'codeSecret'],
};

export const comprimerAdresses = ({adresses, exclureLocales}: {adresses: string[], exclureLocales: boolean}): string[] => {
  if (exclureLocales) {
    adresses = adresses.filter(a=>!isLoopbackAddr(multiaddr(a).nodeAddress().address));
  }
  return adresses;
};