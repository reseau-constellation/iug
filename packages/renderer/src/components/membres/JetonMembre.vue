<template>
  <v-chip
    variant="outlined"
    class="me-2 mb-2"
  >
    <image-profil
      :id="compte"
      start
    />
    {{ nomTraduit || t('communs.anonyme') }}
    <template #append>
      <v-tooltip
        :text="t(messageConfiance)"
        location="bottom"
      >
        <template #activator="{props: propsActivateur}">
          <v-icon
            v-bind="propsActivateur"
            :color="couleurIcône"
            size="small"
            end
          >
            {{ icône }}
          </v-icon>
        </template>
      </v-tooltip>

      <slot name="post"></slot>
    </template>
  </v-chip>
</template>

<script setup lang="ts">
import {computed} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {constellation, suivre} from '/@/components/utils';
import ImageProfil from '/@/components/communs/ImageProfil.vue';

const props = defineProps<{compte: string}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Nom d'utilisatrice
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = suivre(constl.profil.suivreNoms, {idCompte: props.compte}, {});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Mon compte
const monCompte = suivre(constl.suivreIdCompte);

// Confiance
const confiance = suivre(
  constl.réseau.suivreConfianceMonRéseauPourMembre,
  {idCompte: props.compte, profondeur: 5},
  0,
);

const messageConfiance = computed(() => {
  if (confiance.value < 0) {
    return 'membres.confiance.bloqué';
  } else if (confiance.value === 0) {
    return 'membres.confiance.inconnu';
  } else if (confiance.value < 0.33) {
    return 'membres.confiance.peuDinteraction';
  } else if (confiance.value < 0.67) {
    return 'membres.confiance.interactionMoyenne';
  } else if (confiance.value < 1) {
    return 'membres.confiance.beaucoupDinteraction';
  } else if (confiance.value === 1) {
    return props.compte === monCompte.value
      ? t('membres.moi')
      : t('membres.confiance.connaissance');
  } else {
    return '';
  }
});

// Icône
const icône = computed(() => {
  if (confiance.value < 0) {
    return 'mdi-cancel';
  } else {
    return props.compte === monCompte.value ? 'mdi-check' : 'mdi-hands-pray';
  }
});
const couleurIcône = computed(() => {
  if (confiance.value < 0) {
    return 'error';
  } else if (confiance.value === 1) {
    return 'success';
  } else {
    return `rgba(22, 151, 246, ${0.1 + confiance.value * 0.9})`;
  }
});
</script>
