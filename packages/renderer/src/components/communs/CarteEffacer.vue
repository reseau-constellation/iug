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
          <span class="text-error">
            {{ titre || t('effacer.titre') }}
          </span>
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          ></v-btn>
        </v-card-title>
      </v-card-item>
      <v-divider></v-divider>
      <v-card-text>
        <span class="text-error font-weight-bold">{{ t('effacer.avertissement') }}</span>
        {{ explication || t('effacer.explication') }}
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          @click="dialogue = false"
        >
          {{ t('communs.annuler') }}
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          append-icon="mdi-delete"
          @click="effacer"
        >
          {{ t('effacer.effacer') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useDisplay} from 'vuetify';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const {mdAndUp} = useDisplay();

defineProps<{titre?: string; explication?: string}>();
const émettre = defineEmits<{
  (é: 'effacer'): void;
}>();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Navigation
const dialogue = ref(false);

const effacer = () => {
  émettre('effacer');
  dialogue.value = false;
};
</script>
