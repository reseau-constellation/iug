import {type Ref} from 'vue';
import type {types, Constellation} from '@constl/ipa';
import type {கிளிமூக்கு as கிளிமூக்கு_வகை} from '@lassi-js/kilimukku';
import type {Nuchabäl} from 'nuchabal';

import EventEmitter, {once} from 'events';
import {inject, onMounted, onUnmounted, ref, watch, watchEffect} from 'vue';

export const utiliserConstellation = (): Constellation => {
  const constl = inject<Constellation>('constl');
  if (constl) return constl;
  throw new Error("Constellation n'est pas trouvable.");
};

export const கிளிமூக்கு = (): கிளிமூக்கு_வகை => {
  const kilimukku = inject<கிளிமூக்கு_வகை>('கிளிமூக்கு');
  if (kilimukku) return kilimukku;
  throw new Error("Kilimukku n'est pas trouvable.");
};

export const utiliserNuchabäl = (): Nuchabäl => {
  const nuchabäl = inject<Nuchabäl>("nuch'ab'äl");
  if (nuchabäl) return nuchabäl;
  throw new Error("Nuchab'äl n'est pas trouvable.");
};


export const enregistrerÉcoute = <
  T extends
    | types.schémaFonctionOublier
    | types.schémaRetourFonctionRechercheParProfondeur
    | types.schémaRetourFonctionRechercheParN,
>(
  promesseÉcoute?: Promise<T>,
): Promise<T | undefined> => {
  let fOublier: types.schémaFonctionOublier | undefined = undefined;

  const événements = new EventEmitter();
  let résultat: T | undefined;
  const promesseRetour = new Promise<T | undefined>(résoudre => {
    once(événements, 'prêt').then(() => {
      résoudre(résultat);
    });
  });

  onMounted(async () => {
    résultat = await promesseÉcoute;
    if (résultat instanceof Function) {
      fOublier = résultat;
    } else {
      fOublier = résultat?.fOublier;
    }
    événements.emit('prêt');
  });
  onUnmounted(async () => {
    if (fOublier) await fOublier();
  });

  return promesseRetour;
};

export class MultiChercheur {
  nOuProfondeur: Ref<number>;
  fOublierRecherche?: types.schémaFonctionOublier;

  constructor() {
    this.nOuProfondeur = ref(10);
    onUnmounted(async () => {
      if (this.fOublierRecherche) await this.fOublierRecherche();
    });
  }
  async lancerRecherche<T>({
    requête,
    réfRésultat,
    fRecherche,
    fRechercheDéfaut,
  }: {
    requête: Ref<T | undefined>;
    réfRésultat: Ref;
    fRecherche: ({
      requête,
      nOuProfondeur,
      réfRésultat,
    }: {
      requête: T;
      nOuProfondeur: number;
      réfRésultat: Ref;
    }) => Promise<
      | types.schémaRetourFonctionRechercheParN
      | types.schémaRetourFonctionRechercheParProfondeur
      | undefined
    >;
    fRechercheDéfaut?: ({
      nOuProfondeur,
      réfRésultat,
    }: {
      nOuProfondeur: number;
      réfRésultat: Ref;
    }) => Promise<
      | types.schémaRetourFonctionRechercheParN
      | types.schémaRetourFonctionRechercheParProfondeur
      | undefined
    >;
  }): Promise<void> {
    if (this.fOublierRecherche) {
      await this.fOublierRecherche();
      this.fOublierRecherche = undefined;
    }

    let fOublierRecherche: types.schémaFonctionOublier | undefined = undefined;
    let fChangerNOuProfondeur: (n: number) => Promise<void>;

    const vérifierSiParProfondeur = (
      x: types.schémaRetourFonctionRechercheParN | types.schémaRetourFonctionRechercheParProfondeur,
    ): x is types.schémaRetourFonctionRechercheParProfondeur => {
      // @ts-expect-error Je ne sais pas comment faire ça
      return !!x['fChangerProfondeur'];
    };

    const lancerRecherche = async () => {
      if (fOublierRecherche) await fOublierRecherche();
      if (requête.value) {
        const retour = await fRecherche({
          requête: requête.value,
          nOuProfondeur: this.nOuProfondeur.value,
          réfRésultat,
        });

        if (retour) {
          fOublierRecherche = retour.fOublier;
          fChangerNOuProfondeur = vérifierSiParProfondeur(retour)
            ? retour.fChangerProfondeur
            : retour.fChangerN;
        }
      } else {
        if (fRechercheDéfaut) {
          const retour = await fRechercheDéfaut({
            nOuProfondeur: this.nOuProfondeur.value,
            réfRésultat,
          });

          if (retour) {
            fOublierRecherche = retour.fOublier;
            fChangerNOuProfondeur = vérifierSiParProfondeur(retour)
              ? retour.fChangerProfondeur
              : retour.fChangerN;
          }
        } else {
          réfRésultat.value = [];
        }
      }
    };

    watch(requête, lancerRecherche);
    lancerRecherche();
    watchEffect(async () => {
      if (fChangerNOuProfondeur) fChangerNOuProfondeur(this.nOuProfondeur.value);
    });

    this.fOublierRecherche = fOublierRecherche;
  }
}

export const icôneObjet = (typeObjet?: string): string | undefined => {
  switch (typeObjet) {
    case 'motClef':
      return 'mdi-key';
    case 'tableau':
      return 'mdi-table';
    case 'bd':
      return 'mdi-database-outline';
    case 'projet':
      return 'mdi-folder-outline';
    case 'nuée':
      return 'mdi-account-group-outline';
  }
};

export const détecterLangue = async ({texte}: {texte: string}) => {
  const {francAll: francAllMin} = await import('franc-min');
  const résultatMin = francAllMin(texte)[0];
  if (résultatMin[1] > 0.9 && résultatMin[0] !== 'und') return résultatMin[0];

  const {francAll} = await import('franc');
  const résultat = francAll(texte)[0];
  if (résultat[1] > 0.9 && résultat[0] !== 'und') return résultat[0];

  const {francAll: francAllAll} = await import('franc-all');
  const résultatAll = francAllAll(texte)[0];
  if (résultatAll[1] > 0.9 && résultatAll[0] !== 'und') return résultatAll[0];
};


export const icôneStatut = (statut: 'active' | 'obsolète' | 'jouet' | 'interne') => {
  switch (statut) {
    case 'active':
      return 'mdi-check';
    case 'obsolète':
      return 'mdi-alert-outline';
    case 'jouet':
      return 'mdi-teddy-bear';
    case 'interne':
      return 'mdi-xml';
    default:
      break;
  }
};