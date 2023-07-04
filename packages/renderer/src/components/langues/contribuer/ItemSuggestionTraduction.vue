<template>
  <v-list-item
    lines="three"
    @click="utiliser"
  >
    <template #prepend>
      <carte-membre :id="compte">
        <template #activator="{props: propsActivateur}">
          <image-profil
            v-bind="propsActivateur"
            :id="compte"
          />
        </template>
      </carte-membre>
    </template>
    <v-list-item-subtitle>
      {{ suggestion.பரிந்துரை.தேதி?.toLocaleDateString() }}
    </v-list-item-subtitle>
    <v-divider class="my-2" />
    {{ suggestion.பரிந்துரை.மொழிபெயர்ப்பு.repeat(52) }}

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
import type {client} from '@constl/ipa';
import type {பிணையம்_மொழிபெயர்ப்பு_பரிந்துரை_வகை} from '/@/plugins/kilimukku/கிளிமூக்கு';

import {computed, inject, ref} from 'vue';

import {enregistrerÉcoute} from '/@/components/utils';
import ImageProfil from '../../communs/ImageProfil.vue';
import CarteMembre from '../../membres/CarteMembre.vue';

const props = defineProps<{suggestion: பிணையம்_மொழிபெயர்ப்பு_பரிந்துரை_வகை; compte: string}>();
const émettre = defineEmits<{
  (e: 'utiliser'): void;
  (e: 'effacer'): void;
}>();

const constl = inject<client.ClientConstellation>('constl');

// Actions
const utiliser = () => {
  émettre('utiliser');
};
const effacer = () => {
  émettre('effacer');
};

// Autorisations
const monCompte = ref<string>();
enregistrerÉcoute(
  constl?.suivreIdBdCompte({
    f: id => (monCompte.value = id),
  }),
);
const autorisé = computed(() => {
  return props.compte === monCompte.value;
});
</script>
