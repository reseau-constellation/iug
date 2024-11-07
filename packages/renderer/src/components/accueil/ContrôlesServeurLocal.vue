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
        <v-card-title class="d-flex">
          {{ t('connectivité.serveurLocal.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          />
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <v-switch v-model="choixActif" />
        <v-text-input v-model="choixPort" />
        <v-textarea
          v-if="codeSecret"
          :value="codeSecret"
          disabled
          append-inner-icon="mdi-content-copy"
          @click:inner-icon="() => copier(codeSecret || '')"
        >
        </v-textarea>
        <v-btn
          :loading="miseÀJourEnCours"
          :disabled="choixPort === port"
          @click="() => mettrePortÀJour()"
        />
        <v-list>
          <v-list-item
            v-for="r in requêtes"
            :key="r"
          >
            {{ r }}
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserServeurLocalConstellation} from '/@/components/utils';
import {copier} from '/@/utils';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

const serveurLocal = utiliserServeurLocalConstellation();

// Navigation
const dialogue = ref(false);

// Serveur local - statut
const statut = suivre(serveurLocal.suivreÉtatServeur);
const codeSecret = computed(() =>
  statut.value?.état === 'actif' ? statut.value.détails.codeSecret : undefined,
);
const port = computed(() =>
  statut.value?.état === 'actif' ? statut.value.détails.port : undefined,
);

const choixActif = ref(statut.value?.état === 'actif');
watchEffect(() => (choixActif.value = statut.value?.état === 'actif'));
const choixPort = ref(port.value);
watchEffect(() => (choixPort.value = port.value));

const miseÀJourEnCours = ref(false);
const mettrePortÀJour = async () => {
  miseÀJourEnCours.value = true;
  await serveurLocal.initialiser(choixPort.value);
  miseÀJourEnCours.value = false;
};

// Serveur local - requêtes
const requêtes = suivre(serveurLocal.suivreRequêtesAuthServeur);
</script>
