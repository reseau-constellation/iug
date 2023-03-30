<template>
  <v-dialog
    v-model="dialogue"
    :width="mdAndUp ? 500 : 300"
  >
    <template #activator="{props}">
      <slot
        name="activator"
        v-bind="{props}"
      ></slot>
    </template>
    <v-card>
      <v-card-item>
        <v-card-title>
          {{ t('auteurs.carteGérer.titre') }}
        </v-card-title>
        <v-card-subtitle>
          {{ t('auteurs.carteGérer.sousTitre') }}
        </v-card-subtitle>
      </v-card-item>
      <v-card-text> </v-card-text>
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
          @click="() => émettre('sauvegarder')"
        >
          {{ t('communs.sauvegarder') }} <v-icon end>mdi-check</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useDisplay} from 'vuetify';
import type {infoAuteur} from '@constl/ipa/dist/src/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

defineProps<{auteurs: infoAuteur[] | undefined}>();
const émettre = defineEmits<{
  (é: 'sauvegarder'): void;
}>();

const {mdAndUp} = useDisplay();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Navigation
const dialogue = ref(false);
</script>
