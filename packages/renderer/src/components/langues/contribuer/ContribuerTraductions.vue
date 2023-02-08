<template>
  <v-dialog>
    <template #activator="{props}">
      <slot
        name="activator"
        v-bind="{props}"
      ></slot>
    </template>

    <v-card
      class="mx-auto"
      :width="mdAndUp ? 750 : 300"
    >
      <v-card-item>
        <v-card-title>{{ $t('languesInterface.dialogueContribuer.titre') }}</v-card-title>
        <v-card-subtitle>{{ $t('languesInterface.dialogueContribuer.sousTitre') }}</v-card-subtitle>
      </v-card-item>

      <v-card-text>
        <v-autocomplete
          v-model="langueSource"
          variant="outlined"
          :items="codesLanguesDisponibles"
          :label="$t('languesInterface.dialogueContribuer.langueSource')"
        >
          <template #item="{item, props}">
            <ItemLangueProgrès
              v-bind="props"
              :code="item.value"
              :selectionnee="false"
            ></ItemLangueProgrès>
          </template>
          <template #selection="{item}">
            <JetonLangue :code="item.value" />
          </template>
        </v-autocomplete>
        <v-select
          v-model="langueCible"
          variant="outlined"
          :items="codesLanguesDisponibles"
          :label="$t('languesInterface.dialogueContribuer.langueCible')"
        >
          <template #item="{item, props}">
            <ItemLangueProgrès
              v-bind="props"
              :code="item.value"
              :selectionnee="false"
            ></ItemLangueProgrès>
          </template>
          <template #selection="{item}">
            <JetonLangue :code="item.value" />
          </template>
        </v-select>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {useDisplay} from 'vuetify';
import { utiliserLangues }  from '/@/plugins/localisation/localisation';


import ItemLangueProgrès from '/@/components/langues/ItemLangueProgrès.vue';
import JetonLangue from '/@/components/langues/JetonLangue.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import { ref } from 'vue';

const {mdAndUp} = useDisplay();
const { langue } = utiliserLangues();

const {useI18n, கிடைக்கும்_மொழிகளை_பயன்படுத்து} = கிளிமூக்கை_உபயோகி();
const {$t} = useI18n();

const {codesLanguesDisponibles} = கிடைக்கும்_மொழிகளை_பயன்படுத்து();

// Contrôles
const langueSource = ref(langue.value);
const langueCible = ref<string>();


</script>
