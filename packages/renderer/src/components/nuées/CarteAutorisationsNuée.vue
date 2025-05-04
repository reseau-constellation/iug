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
          {{ t('nuées.autorisations.carte.titre') }}
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
        <p class="mt-2 font-weight-bold">{{ t('nuées.autorisations.philosophie') }}</p>
        <v-divider />
        <v-radio-group v-model="autorisation">
          <v-radio
            value="CJPI"
            class="my-2"
          >
            <template #label>
              <div>
                <p>{{ t('nuées.nouvelle.parInvitation') }}</p>
                <p class="text-disabled">
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
                <p>{{ t('nuées.nouvelle.ouverteÀTous') }}</p>
                <p class="text-disabled">
                  {{ t('nuées.nouvelle.indiceOuverteÀTous') }}
                </p>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
        <p class="mt-2 font-weight-bold">{{ t('nuées.autorisations.modération') }}</p>
        <v-divider />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <btn-annuler @click="dialogue = false" />
        <btn-sauvegarder
          :actif="modifié"
          @click="() => sauvegarder()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import BtnAnnuler from '/@/components/communs/BtnAnnuler.vue';
import BtnSauvegarder from '/@/components/communs/BtnSauvegarder.vue';

import {suivre} from '@constl/vue';
import {watchEffect} from 'vue';
import {utiliserConstellation} from '../utils';

const props = defineProps<{idNuee: string}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();
const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);

// Autorisation
const autorisationNuée = suivre(constl.nuées.suivrePhilosophieAutorisation, {
  idNuée: computed(() => props.idNuee),
});
const autorisation = ref(autorisationNuée.value);
watchEffect(() => {
  autorisation.value = autorisationNuée.value;
});

// Sauvegarde
const modifié = computed(() => autorisation.value !== autorisationNuée.value);
const sauvegarder = () => {};
</script>
