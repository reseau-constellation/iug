<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>

    <v-card
      class="mx-auto"
      :min-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex align-center">
          {{ t(titreCarte) }}
          <v-spacer />
          <v-btn
            variant="flat"
            size="small"
            icon="mdi-close"
            @click="fermer"
          />
        </v-card-title>
        <v-card-subtitle> {{ t(sousTitreCarte) }} </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <v-window
          v-model="étape"
          style="overflow-y: scroll"
        >
          <v-window-item :key="0">
            <liste-noms
              :texte-aucun-nom="t('communs.texteAucunNom')"
              :indice-langue="t('communs.indiceLangue')"
              :etiquette-nom="t('communs.étiquetteNom')"
              :indice-nom="t('nuées.nouvelle.texteIndiceNom')"
              :noms-initiaux="noms"
              :autorisation-modification="true"
              @ajuster-noms="ajusterNoms"
            />
          </v-window-item>
          <v-window-item :key="1">
            <liste-noms
              :texte-aucun-nom="t('nuées.nouvelle.texteAucuneDescription')"
              :indice-langue="t('communs.indiceLangue')"
              :etiquette-nom="t('nuées.nouvelle.texteÉtiquetteDescription')"
              :indice-nom="t('nuées.nouvelle.texteIndiceDescription')"
              :noms-initiaux="descriptions"
              :autorisation-modification="true"
              longue
              @ajuster-noms="ajusterDescriptions"
            />
          </v-window-item>
          <v-window-item :key="2">
            <v-radio-group v-model="autorisation">
              <v-radio
                value="CJPI"
                class="my-2"
              >
                <template #label>
                  <div>
                    <p class="font-weight-bold">{{ t('nuées.nouvelle.parInvitation') }}</p>
                    <p class="text-medium-emphasis text-caption">
                      {{ t('nuées.nouvelle.indiceParInvitation') }}
                    </p>
                  </div>
                </template>
              </v-radio>
              <v-radio
                value="IJPC"
                class="my-2"
              >
                <template #label>
                  <div>
                    <p class="font-weight-bold">{{ t('nuées.nouvelle.ouverteÀTous') }}</p>
                    <p class="text-medium-emphasis text-caption">
                      {{ t('nuées.nouvelle.indiceOuverteÀTous') }}
                    </p>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </v-window-item>
          <v-window-item :key="3">
            <v-list>
              <nouveau-tableau
                :importation-permise="false"
                @sauvegarder="ajouterTableau"
              >
                <template #activator="{props: propsActivateur}">
                  <v-list-item
                    v-bind="propsActivateur"
                    :title="t('nuées.nouvelle.ajoutTableau')"
                    prepend-icon="mdi-plus"
                  >
                  </v-list-item>
                </template>
              </nouveau-tableau>
              <ItemSpecificationTableau
                v-for="tbl in tableaux"
                :key="tbl.clef"
                :clef="tbl.clef"
                :noms="tbl.noms"
                :colonnes="tbl.cols"
                modification-permise
                @modifier-noms="noms => modifierNomsTableau({clefTableau: tbl.clef, noms})"
                @nouvelle-colonne="
                  col =>
                    ajouterColonneTableau({
                      clefTableau: tbl.clef,
                      idVariable: col.idVariable,
                      index: col.index,
                      règles: col.règles,
                    })
                "
                @effacer-colonne="
                  idColonne => effacerColonneTableau({clefTableau: tbl.clef, idColonne})
                "
                @effacer-tableau="() => effacerTableau(tbl.clef)"
              />
            </v-list>
          </v-window-item>
          <v-window-item :key="4">
            <div class="text-center">
              <v-btn
                class="mt-3"
                variant="outlined"
                :loading="enCréation"
                @click="() => créerNuée()"
              >
                {{ t('nuées.nouvelle.texteBtnCréation') }}
              </v-btn>
              <v-checkbox
                v-model="ouvrirAprèsCréation"
                class="mx-auto"
                color="primary"
                :label="t('nuées.nouvelle.ouvrirAprèsCréation')"
              >
              </v-checkbox>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions>
        <btn-retour
          :visible="retourActif.visible"
          :actif="retourActif.actif"
          @retour="retour"
        />
        <v-spacer></v-spacer>
        <btn-suivant
          :visible="suivantActif.visible"
          :actif="suivantActif.actif"
          @suivant="suivant"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {type tableaux as tblx, type valid} from '@constl/ipa';

import {v4 as uuidv4} from 'uuid';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref} from 'vue';
import {useRouter} from 'vue-router';
import {useDisplay} from 'vuetify';
import ListeNoms from '../communs/listeNoms/ListeNoms.vue';
import NouveauTableau from '../tableaux/NouveauTableau.vue';
import BtnRetour from '/@/components/communs/BtnRetour.vue';
import BtnSuivant from '/@/components/communs/BtnSuivant.vue';
import ItemSpecificationTableau from '/@/components/tableaux/ItemSpécificationTableau.vue';
import {utiliserConstellation} from '/@/components/utils';

const {mdAndUp} = useDisplay();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const router = useRouter();

const émettre = defineEmits<{(é: 'nouvelle', id: string): void}>();

const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = ['noms', 'descriptions', 'autorisation', 'tableaux', 'confirmation'] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return 'nuées.nouvelle.titreNoms';
    case 'descriptions':
      return 'nuées.nouvelle.titreDescriptions';
    case 'autorisation':
      return 'nuées.nouvelle.titreAutorisation';
    case 'tableaux':
      return 'nuées.nouvelle.titreTableaux';
    case 'confirmation':
      return 'nuées.nouvelle.titreConfirmation';
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return 'nuées.nouvelle.sousTitreNoms';
    case 'descriptions':
      return 'nuées.nouvelle.sousTitreDescriptions';
    case 'autorisation':
      return 'nuées.nouvelle.sousTitreAutorisation';
    case 'tableaux':
      return 'nuées.nouvelle.sousTitreTableaux';
    case 'confirmation':
      return 'nuées.nouvelle.sousTitreConfirmation';
    default:
      return '';
  }
});

const retour = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      étape.value--;
      break;
  }
};

const suivant = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      étape.value++;
      break;
  }
};

const suivantActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return {actif: !!Object.keys(noms.value).length, visible: true};
    case 'autorisation':
      return {actif: autorisation.value !== undefined, visible: true};
    case 'confirmation':
      return {actif: false, visible: false};
    default:
      return {actif: true, visible: true};
  }
});

const retourActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return {actif: false, visible: false};
    case 'confirmation':
      return {actif: !enCréation.value, visible: true};
    default:
      return {actif: true, visible: true};
  }
});

// Noms
const noms = ref<{[lng: string]: string}>({});
const ajusterNoms = (nms: {[lng: string]: string}) => {
  noms.value = nms;
};

// Descriptions
const descriptions = ref<{[lng: string]: string}>({});
const ajusterDescriptions = (desrc: {[lng: string]: string}) => {
  descriptions.value = desrc;
};

// Autorisation
const autorisation = ref<'CJPI' | 'IJPC'>('IJPC');

// Tableaux
const tableaux = ref<
  {
    clef: string;
    noms: {[langue: string]: string};
    cols: {
      info: tblx.InfoCol;
      règles: valid.règleVariable[];
    }[];
  }[]
>([]);

const ajouterTableau = ({
  noms,
  cols,
}: {
  noms: {[langue: string]: string};
  cols: {info: tblx.InfoCol; règles: valid.règleVariable[]}[];
}) => {
  tableaux.value = [...tableaux.value, {clef: uuidv4(), noms, cols}];
};

const effacerTableau = (clef: string) => {
  tableaux.value = tableaux.value.filter(t => t.clef !== clef);
};

const modifierNomsTableau = ({
  clefTableau,
  noms,
}: {
  clefTableau: string;
  noms: {[langue: string]: string};
}) => {
  tableaux.value = tableaux.value.map(t => {
    return t.clef === clefTableau ? {...t, noms} : t;
  });
};

// Colonnes tableaux
const ajouterColonneTableau = ({
  clefTableau,
  idVariable,
  index,
  règles,
}: {
  clefTableau: string;
  idVariable: string;
  index?: boolean;
  règles: valid.règleVariable[];
}) => {
  const nouvelleColonne = {
    id: uuidv4(),
    variable: idVariable,
    index,
  };
  tableaux.value = tableaux.value.map(t => {
    return t.clef === clefTableau
      ? {clef: t.clef, noms: t.noms, cols: [...t.cols, {info: nouvelleColonne, règles}]}
      : t;
  });
};

const effacerColonneTableau = ({
  clefTableau,
  idColonne,
}: {
  clefTableau: string;
  idColonne: string;
}) => {
  tableaux.value = tableaux.value.map(t => {
    return t.clef === clefTableau
      ? {clef: t.clef, noms: t.noms, cols: t.cols.filter(c => c.info.id !== idColonne)}
      : t;
  });
};

// Création
const ouvrirAprèsCréation = ref(true);

const enCréation = ref(false);

const créerNuée = async () => {
  enCréation.value = true;

  const idNuée = await constl.nuées.créerNuée({
    autorisation: autorisation.value,
  });
  if (!idNuée) throw new Error('Nuée non créée.');

  await constl.nuées.sauvegarderNomsNuée({
    idNuée,
    noms: Object.fromEntries(Object.entries(noms.value)),
  });
  await constl.nuées.sauvegarderDescriptionsNuée({
    idNuée,
    descriptions: Object.fromEntries(Object.entries(descriptions.value)),
  });

  // Ajouter les tableaux
  for (const tbl of tableaux.value) {
    const idTableau = await constl.nuées.ajouterTableauNuée({
      idNuée,
      clefTableau: tbl.clef,
    });
    if (!idTableau) return;

    await constl.nuées.sauvegarderNomsTableauNuée({
      idTableau,
      noms: tbl.noms,
    });

    // Ajouter les colonnes
    for (const col of tbl.cols) {
      const idColonne = col.info.id;
      await constl.nuées.ajouterColonneTableauNuée({
        idTableau,
        idVariable: col.info.variable,
        idColonne,
      });
      if (col.info.index)
        await constl.nuées.changerColIndexTableauNuée({
          idTableau,
          idColonne,
          val: col.info.index,
        });

      // Ajotuer les règles colonne
      for (const règle of col.règles) {
        await constl.nuées.ajouterRègleTableauNuée({
          idTableau,
          idColonne,
          règle,
        });
      }
    }
  }

  émettre('nouvelle', idNuée);

  fermer();

  if (ouvrirAprèsCréation.value)
    router.push(encodeURI(`/données/nuée/${encodeURIComponent(idNuée)}`));
};

// Fermer
const fermer = () => {
  noms.value = {};
  descriptions.value = {};
  autorisation.value = 'IJPC';
  tableaux.value = [];

  étape.value = 0;
  dialogue.value = false;
  enCréation.value = false;
};
</script>
