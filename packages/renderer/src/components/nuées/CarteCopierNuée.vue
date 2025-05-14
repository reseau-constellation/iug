<template>
  <v-dialog
    v-model="dialogue"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      />
    </template>
    <v-card
      class="mx-auto"
      :width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex align-center">
          {{ t('nuées.copier.titre') }} 
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
        <v-radio-group v-model="typeCopie">
          <v-radio
            value="indépendante"
            class="my-2"
          >
            <template #label>
              <div>
                <p class="font-weight-bold">{{ t('nuées.copier.indépendante') }}</p>
                <p class="text-medium-emphasis text-caption">
                  {{ t('nuées.copier.indiceIndépendante') }}
                </p>
              </div>
            </template>
          </v-radio>
          <v-radio
            value="dépendante"
            class="my-2"
          >
            <template #label>
              <div>
                <p class="font-weight-bold">{{ t('nuées.copier.dépendante') }}</p>
                <p class="text-medium-emphasis text-caption">
                  {{ t('nuées.copier.indiceDépendante') }}
                </p>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
        <v-checkbox
          v-model="ouvrirCopie"
          color="primary"
          :label="t('nuées.copier.ouvrirCopie')"
        ></v-checkbox>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <btn-sauvegarder
          actif
          :en-attente="copieEnCours"
          @click="() => copier()"
        />
        <btn-annuler @click="dialogue = false" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useDisplay} from 'vuetify';
import {utiliserConstellation} from '../utils';
import { மொழியாக்கத்தைப்_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import BtnAnnuler from '/@/components/communs/BtnAnnuler.vue';
import BtnSauvegarder from '/@/components/communs/BtnSauvegarder.vue';
import {useRouter} from 'vue-router';


const props = defineProps<{idNuee: string}>();
const routeur = useRouter();
const {mdAndUp} = useDisplay();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();


// Navigation
const dialogue = ref(false);

// Copier
const copieEnCours = ref(false);

const typeCopie = ref<'indépendante' | 'dépendante'>('dépendante');
const ouvrirCopie = ref(true);
const copier = async () => {
  copieEnCours.value = true;
  const idCopie = typeCopie.value === 'indépendante' ?
  await constl.nuées.copierNuée({ idNuée: props.idNuee}) : await constl.nuées.créerNuée({nuéeParent: props.idNuee});
  copieEnCours.value = false;
  dialogue.value=false;
  if (ouvrirCopie.value) {
    routeur.push(encodeURI(`/données/nuée/${encodeURIComponent(idCopie)}`));
  }
};
</script>
