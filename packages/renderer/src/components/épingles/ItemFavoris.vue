<template>
  <v-list-item>
    <template #prepend>
      <v-icon>{{ icôneTypeItem }}</v-icon>
    </template>
    <v-list-item-title>
      <TexteTronqué
        :texte="nomTraduit || epingle.idObjet"
        :longueur-max="30"
      />
    </v-list-item-title>
    <v-list-item-action>
      <CarteEpingler :id="epingle.idObjet">
        <template #activator="{props: propsActivateurCarteÉpingle}">
          <v-tooltip
            v-bind="propsActivateurCarteÉpingle"
            open-delay="200"
            location="bottom"
          >
            <template #activator="{props: propsActivateurIndice}">
              <v-btn
                v-bind="propsActivateurIndice"
                :icon="épinglé && épinglé.bd ? 'mdi-pin' : 'mdi-pin-outline'"
              />
            </template>
            {{ t(épinglé && épinglé.bd ? 'favoris.indiceÉpinglé' : 'favoris.indiceNonÉpinglé') }}
          </v-tooltip>
        </template>
      </CarteEpingler>
      <CarteEffacer @effacer="effacerFavoris">
        <template #activator="{props: propsActivateurCarteEffacer}">
          <v-tooltip
            v-bind="propsActivateurCarteEffacer"
            open-delay="200"
            location="bottom"
          >
            <template #activator="{props: propsActivateurIndiceEffacer}">
              <v-btn
                v-bind="propsActivateurIndiceEffacer"
                icon="mdi-delete"
                color="error"
              />
            </template>
            <span>{{ t('favoris.effacer.indiceEffacer') }}</span>
          </v-tooltip>
        </template>
      </CarteEffacer>
    </v-list-item-action>
  </v-list-item>
</template>

<script setup lang="ts">
import type {favoris} from '@constl/ipa';
import type {ClientConstellation} from '@constl/ipa';

import {inject, ref} from 'vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {enregistrerÉcoute} from '../utils';
import TexteTronqué from '../communs/TexteTronqué.vue';
import CarteEpingler from './CarteÉpingler.vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import CarteEffacer from '../communs/CarteEffacer.vue';
import {computed} from 'vue';

const props = defineProps<{epingle: favoris.ÉlémentFavorisAvecObjet}>();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const constl = inject<ClientConstellation>('constl');

// Noms objet
const noms = ref<{[langue: string]: string}>({});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

enregistrerÉcoute(
  constl?.motsClefs.suivreNomsMotClef({
    idMotClef: props.epingle.idObjet,
    f: x => (noms.value = x),
  }),
); // Solution temporaire pour Constellation qui ne sait pas de quel type est l'objet

// Type objet
const typeObjet = ref<'motClef' | 'variable' | 'bd' | 'projet' | 'nuée'>();
enregistrerÉcoute(
  constl?.suivreTypeObjet({
    idObjet: props.epingle.idObjet,
    f: x => (typeObjet.value = x),
  }),
);
const icôneTypeItem = computed(() => {
  switch (typeObjet.value) {
    case 'bd':
      return 'mdi-database';
    case 'motClef':
      return 'mdi-key';
    case 'variable':
      return 'mdi-variable';
    case 'projet':
      return 'mdi-folder-outline';
    case 'nuée':
      return 'mdi-account-group-outline';
    default:
      return 'mdi-pin-outline';
  }
});

// Épingle
const épinglé = ref<favoris.épingleDispositif>();
enregistrerÉcoute(
  constl?.favoris.suivreEstÉpingléSurDispositif({
    idObjet: props.epingle.idObjet,
    f: x => (épinglé.value = x),
  }),
);

// Contrôle
const effacerFavoris = async () => {
  await constl?.favoris.désépinglerFavori({idObjet: props.epingle.idObjet});
};
</script>
