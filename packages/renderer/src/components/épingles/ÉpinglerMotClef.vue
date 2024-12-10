<template>
  <v-dialog
    v-model="dialogue"
    :max-width="mdAndUp ? 500 : 300"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card>
      <v-card-item>
        <v-card-title class="d-flex">
          {{ t('épingler.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="fermer"
          >
          </v-btn>
        </v-card-title>
      </v-card-item>
      <v-divider />
      <v-card-text style="overflow-y: scroll">
        <v-select
          v-model="sélectionBase"
          :items="optionsÉpingle"
          item-value="valeur"
        >
          <template #selection="{item}">
            {{ item.raw.titre }}
          </template>
          <template #item="{item, props: propsItem}">
            <v-list-item
              v-bind="propsItem"
              :title="item.raw.titre"
              :subtitle="item.raw.sousTitre"
              :prepend-icon="item.raw.icône"
            />
          </template>
        </v-select>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          @click="fermer"
        >
          {{ t('communs.fermer') }}
          <v-icon
            icon="mdi-close"
            end
          />
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          :loading="enProgrès"
          :disabled="!prêtÀÉpingler || !valeursChangées"
          @click="() => épingler()"
        >
          {{ t('communs.sauvegarder') }}
          <v-icon
            icon="mdi-check"
            end
          />
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {type favoris} from '@constl/ipa';

import {suivre} from '@constl/vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '/@/components/utils';
import { isEqual } from 'lodash-es';


const props = defineProps<{idMotClef: string}>();


const constl = utiliserConstellation();

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Navigation
const dialogue = ref(false);

// Épingle actuelle
const épingle = suivre(constl.motsClefs.suivreÉpingleMotClef, {idMotClef: props.idMotClef});

// Options
const sélectionBase = ref<'AUCUN' | 'TOUS' | 'INSTALLÉ' | 'SPÉCIFIQUES'>('AUCUN');
const dispositifsSpécifiquesBase = ref<string[]>();
const dispositifsBase = computed(()=>{
  if (sélectionBase.value === 'SPÉCIFIQUES') return dispositifsSpécifiquesBase.value;
  else return sélectionBase.value;
});
const optionsÉpingle: {
  titre: string;
  sousTitre: string;
  icône: string;
  valeur: 'AUCUN' | 'TOUS' | 'INSTALLÉ' | 'SPÉCIFIQUES';
}[] = [
  {
    titre: t('épingler.aucun'),
    sousTitre: t('épingler.indiceAucun'),
    icône: 'mdi-cancel',
    valeur: 'AUCUN',
  },
  {
    titre: t('épingler.tous'),
    sousTitre: t('épingler.indiceTous'),
    icône: 'mdi-devices',
    valeur: 'TOUS',
  },
  {
    titre: t('épingler.installé'),
    sousTitre: t('épingler.indiceInstallé'),
    icône: 'mdi-monitor',
    valeur: 'INSTALLÉ',
  },
  {
    titre: t('épingler.dispositifsSpécifiques'),
    sousTitre: t('épingler.indiceDispositifsSpécifiques'),
    icône: 'mdi-monitor-cellphone-star',
    valeur: 'SPÉCIFIQUES',
  },
];


// Sauvegarder
const prêtÀÉpingler = computed(() => {
  return dispositifsBase.value !== undefined;
});

const valeursChangées = computed<boolean>(() => {
  if (!épingle.value) return true;
  const {base} = épingle.value;
  const dispositifsChangés = Array.isArray(base)
    ? !isEqual(new Set(base), new Set(dispositifsSpécifiquesBase.value))
    : base !== sélectionBase.value;
  
  return dispositifsChangés;
});

const enProgrès = ref(false);
const épingler = async () => {
  enProgrès.value = true;

  if (dispositifsBase.value && dispositifsBase.value !== 'AUCUN') {
    const épingle: favoris.ÉpingleMotClef = {
      type: 'motClef',
      base: dispositifsBase.value,
    };
    await constl.motsClefs.épinglerMotClef({
      idMotClef: props.idMotClef,
      options: épingle,
    });

  } else {
    await désépingler();
  }
  fermer();
};
const désépingler = async () => {
  await constl.favoris.désépinglerFavori({idObjet: props.idMotClef});
};


// Fermer
const fermer = () => {
  dialogue.value = false;
  enProgrès.value = false;
};

</script>