<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateurDialogue}">
      <v-tooltip
        :text="t('motsClefs.éditeurMotsClefs.indice')"
        location="bottom"
      >
        <template #activator="{props: propsActivateurIndice}">
          <v-btn
            v-bind="{...propsActivateurDialogue, ...propsActivateurIndice}"
            class="mb-2"
            variant="flat"
            icon="mdi-pencil-outline"
            size="small"
          />
        </template>
      </v-tooltip>
    </template>

    <v-card
      class="mx-auto"
      :min-width="mdAndUp ? 750 : 300"
    >
      <v-card-item>
        <v-card-title>{{ t('motsClefs.éditeurMotsClefs.titre') }}</v-card-title>
      </v-card-item>
      <v-card-text>
        <SelecteurMotClef
          multiples
          :originaux="originaux"
          @selectionnee="ids => sélectionner(ids)"
        />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <btn-annuler @click="fermer" />
        <btn-sauvegarder
          :actif="modifiés"
          @click="() => sauvegarder()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import SelecteurMotClef from '/@/components/motsClefs/SélecteurMotClef.vue';

import BtnAnnuler from '/@/components/communs/BtnAnnuler.vue';
import BtnSauvegarder from '/@/components/communs/BtnSauvegarder.vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

const props = defineProps<{originaux: string[]}>();
const émettre = defineEmits<{(é: 'sauvegarder', motsClefs: string[]): void}>();

// Navigation
const dialogue = ref(false);

// Logique générale
const sélectionnés = ref<string[]>(props.originaux);
const sélectionner = (ids: string[]) => (sélectionnés.value = ids);

const modifiés = computed(() => sélectionnés.value !== props.originaux);

const sauvegarder = () => {
  émettre('sauvegarder', sélectionnés.value);
  dialogue.value = false;
};
const fermer = () => {
  sélectionnés.value = props.originaux;
  dialogue.value = false;
};
</script>
