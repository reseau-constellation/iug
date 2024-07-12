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
        <v-card-title>{{ t('bds.statut.carte.titre') }}</v-card-title>
      </v-card-item>
      <v-card-text>
        <choisir-statut
          :initial="statutChoisi"
          @choisir="stt => (statutChoisi = stt)"
        >
          <template #sélecteur="{choisirNouvelle}">
            <selecteur-bd
              :multiples="false"
              @selectionnee="ids => choisirNouvelle(ids[0])"
            />
          </template>
        </choisir-statut>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="!modifié"
          :loading="enModification"
          variant="flat"
          color="primary"
          @click="sauvegarder"
        >
          {{ t('communs.sauvegarder') }}
        </v-btn>
        <v-btn
          variant="flat"
          append-icon="mdi-close"
          @click="dialogue = false"
        >
          {{ t('communs.fermer') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import type {types} from '@constl/ipa';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {watchEffect} from 'vue';
import {utiliserConstellation} from '../utils';
import SelecteurBd from './SélecteurBd.vue';
import ChoisirStatut from '/@/components/communs/ChoisirStatut.vue';

const props = defineProps<{idBd: string}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);

// Statut
const statut = suivre(constl.bds.suivreStatutBd, {idBd: props.idBd});
const statutChoisi = ref<types.schémaStatut>();
watchEffect(() => {
  statutChoisi.value = statut.value;
});
const modifié = computed(() => {
  return (
    statut.value?.statut !== statutChoisi.value?.statut ||
    statut.value?.idNouvelle !== statutChoisi.value?.idNouvelle
  );
});
const enModification = ref(false);
const sauvegarder = async () => {
  enModification.value = true;
  if (statutChoisi.value)
    await constl.bds.changerStatutBd({
      idBd: props.idBd,
      statut: statutChoisi.value,
    });
  enModification.value = false;
  dialogue.value = false;
};
</script>
