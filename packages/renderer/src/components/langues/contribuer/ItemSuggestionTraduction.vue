<template>
  <v-list-item
    lines="three"
    @click="utiliser"
  >
    <v-list-item-title class="d-flex">
      <carte-membre :id="suggestion.பங்கேற்பாளர்">
        <template #activator="{props: propsActivateur}">
          <span v-bind="propsActivateur">
            <image-profil :id="suggestion.பங்கேற்பாளர்" />
            <span class="mx-3">{{ nomCompte }}</span>
          </span>
        </template>
      </carte-membre>

      <span class="ms-auto">
        {{ suggestion.பரிந்துரை.தேதி?.toLocaleDateString() }}
      </span>
    </v-list-item-title>
    <v-divider class="my-2" />
    {{ suggestion.பரிந்துரை.மொழிபெயர்ப்பு }}

    <v-list-item-action v-if="autorisé">
      <v-spacer />
      <v-btn
        icon
        variant="flat"
        size="small"
        @click.stop="effacer"
      >
        <v-icon color="error">mdi-delete</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>
<script setup lang="ts">
import type {பிணையம்_மொழிபெயர்ப்பு_பரிந்துரை_வகை} from '@lassi-js/kilimukku';

import {computed} from 'vue';

import {utiliserConstellation, suivre} from '/@/components/utils';
import ImageProfil from '/@/components/communs/ImageProfil.vue';
import CarteMembre from '/@/components/membres/CarteMembre.vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{suggestion: பிணையம்_மொழிபெயர்ப்பு_பரிந்துரை_வகை}>();
const émettre = defineEmits<{
  (e: 'utiliser'): void;
  (e: 'effacer'): void;
}>();

const constl = utiliserConstellation();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Noms du compte
const nomsCompte = suivre(constl.profil.suivreNoms, {idCompte: props.suggestion.பங்கேற்பாளர்});
const nomCompte = அகராதியிலிருந்து_மொழிபெயர்ப்பு(nomsCompte);

// Actions
const utiliser = () => {
  émettre('utiliser');
};
const effacer = () => {
  émettre('effacer');
};

// Autorisations
const monCompte = suivre(constl.suivreIdCompte);
const autorisé = computed(() => {
  return props.suggestion.பங்கேற்பாளர் === monCompte.value;
});
</script>
