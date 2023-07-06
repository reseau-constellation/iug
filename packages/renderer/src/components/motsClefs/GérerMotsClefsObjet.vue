<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <v-chip
        v-bind="propsActivateur"
        class="mb-2 me-2"
        variant="outlined"
        prepend-icon="mdi-pencil-outline"
        size="small"
      >
        {{ t('motsClefs.gérerMotsClefsObjet') }}
      </v-chip>
    </template>
    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title>{{ t('motsClefs.gérerMotsClefsObjet.titreCarte') }}</v-card-title>
      </v-card-item>
      <v-card-text>
        <v-dialog v-model="dialogueAjout">
          <template #activator="{props: propsActivateurAjout}">
            <v-chip
              v-bind="propsActivateurAjout"
              variant="outlined"
              prepend-icon="mdi-plus"
            >
              {{ t('motsClefs.ajouterÀObjet') }}
            </v-chip>
          </template>
          <v-card
            class="mx-auto"
            :max-width="mdAndUp ? 500 : 300"
          >
            <v-card-text>
              <v-text-field
                v-model="requèteRecherche"
                variant="outlined"
              >
              </v-text-field>
              <v-select
                v-model="motClefSélectionné"
                :items="résultatRechercheMotsClefs"
                variant="outlined"
              >
                <template #selection="{item}">
                  <jeton-mot-clef :id="item.value" />
                </template>
                <template #item="{item, props: propsItemSelect}">
                  <item-mot-clef
                    v-bind="propsItemSelect"
                    :id="item.value"
                  />
                </template>
              </v-select>
              <nouveau-mot-clef>
                <v-btn> {{ t('motsClefs.nouveauMotClef') }} </v-btn>
              </nouveau-mot-clef>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="() => ajouter(motClefSélectionné)">
                {{ t('communs.sauvegarder') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <item-mot-clef
          v-for="m in finaux"
          :id="m"
          :key="m"
          :effacable="true"
          @effacer="effacer"
        ></item-mot-clef>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="sauvegarder"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {inject, onUnmounted, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

import type {client} from '@constl/ipa';
import type {utils} from '@constl/ipa';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import ItemMotClef from './ItemMotClef.vue';
import JetonMotClef from './JetonMotClef.vue';
import NouveauMotClef from './NouveauMotClef.vue';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {mdAndUp} = useDisplay();

const props = defineProps<{originaux: string[]}>();
const émettre = defineEmits<{(é: 'sauvegarder', motsClefs: string[]): void}>();

const constl = inject<client.ClientConstellation>('constl');

// Navigation
const dialogue = ref(false);
const dialogueAjout = ref(false);

// Logique générale
const finaux = ref(props.originaux);
const effacer = (idMotClef: string) => {
  finaux.value = finaux.value.filter(m => m !== idMotClef);
};
const ajouter = (idMotClef?: string) => {
  if (idMotClef) finaux.value.push(idMotClef);
};
const sauvegarder = () => {
  émettre('sauvegarder', finaux.value);
};

// Ajout de mots-clef
const motClefSélectionné = ref<string>();
const requèteRecherche = ref<string>();
const résultatRechercheMotsClefs = ref<utils.résultatRecherche<utils.infoRésultatTexte>[]>();

let fOublierRecherche: utils.schémaFonctionOublier | undefined = undefined;

watchEffect(async () => {
  if (fOublierRecherche) await fOublierRecherche();

  if (requèteRecherche.value) {
    const retour = await constl?.recherche?.rechercherMotClefSelonTexte({
      texte: requèteRecherche.value,
      f: x => (résultatRechercheMotsClefs.value = x),
      nRésultatsDésirés: 10,
    });

    if (retour) fOublierRecherche = retour.fOublier;
  } else {
    résultatRechercheMotsClefs.value = [];
  }
});

onUnmounted(async () => {
  if (fOublierRecherche) await fOublierRecherche();
});
</script>
