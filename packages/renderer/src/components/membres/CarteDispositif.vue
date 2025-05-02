<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsDialogue}">
      <slot
        name="activator"
        v-bind="{props: propsDialogue}"
      />
    </template>
    <v-card
      :max-width="mdAndUp ? 500 : 300"
      class="mx-auto"
    >
      <v-card-item>
        <v-card-title>
          {{ t('dispositifs.titreCarte') }}
        </v-card-title>
      </v-card-item>
      <v-card-text style="overflow-y: scroll">
        <v-select
          v-model="typeDispositifChoisi"
          :items="typesDispositifsPossibles"
          chips
        >
          <template #item="{item}">
            <v-list-item
              :prepend-icon="obtIcôneDispositifDeType(item.value)"
              :title="item.value"
            />
          </template>
          <template #selection="{item}">
            <v-chip :prepend-icon="obtIcôneDispositifDeType(item.value)">{{ item.value }}</v-chip>
          </template>
        </v-select>
        <v-input v-model="nomDispositifChoisi" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="flat"
          @click="dialogue = false"
        >
          {{ t('communs.fermer') }} <v-icon end>mdi-close</v-icon>
        </v-btn>
        <v-btn
          variant="outlined"
          color="primary"
          :disabled="changé"
          :loading="enModification"
          @click="sauvegarder"
        >
          {{ t('communs.sauvegarder') }} <v-icon end>mdi-check</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ref} from 'vue';
import {useDisplay} from 'vuetify';

import {computed, watchEffect} from 'vue';
import {utiliserConstellation} from '../utils';
import {obtIcôneDispositifDeType, utiliserNomEtTypeDispositif} from './utils';

const props = defineProps<{idDispositif: string; idCompte?: string}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

// Nom et type actuels
const {nomDispositif, typeDispositif} = utiliserNomEtTypeDispositif({
  idDispositif: computed(() => props.idDispositif),
  idCompte: computed(() => props.idCompte),
});
watchEffect(() => {
  typeDispositifChoisi.value = typeDispositif.value;
});
watchEffect(() => {
  nomDispositifChoisi.value = nomDispositif.value;
});

// Type dispositif
const typeDispositifChoisi = ref(typeDispositif.value);
const typesDispositifsPossibles = ['téléphone', 'navigateur', 'tablette', 'ordinateur', 'serveur'];

// Nom dispositif
const nomDispositifChoisi = ref(nomDispositif.value);

// Sauvegarder
const changé = computed(() => {
  return (
    typeDispositifChoisi.value === typeDispositif.value &&
    nomDispositifChoisi.value === nomDispositif.value
  );
});
const enModification = ref(false);
const sauvegarder = async () => {
  if (!nomDispositifChoisi.value || !typeDispositifChoisi.value) return; // À faire: permettre d'effacer le nom ou le type
  enModification.value = true;
  await constl.nommerDispositif({
    idDispositif: props.idDispositif,
    nom: nomDispositifChoisi.value,
    type: typeDispositifChoisi.value,
  });
  enModification.value = false;
};
</script>
