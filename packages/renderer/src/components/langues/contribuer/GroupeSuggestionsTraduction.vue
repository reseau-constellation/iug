<template>
  <v-list-group>
    <template #activator="{props: propsActivateur}">
      <v-list-item v-bind="propsActivateur">
        <template #prepend>
          <v-avatar>{{ suggestions?.length }}</v-avatar>
        </template>
        <template #title>
          {{ t(clef) }}
          <v-chip
            class="ms-2"
            label
            variant="outlined"
            density="compact"
          >
            {{ nom }}
          </v-chip>
        </template>
        <template #subtitle>
          {{ clef }}
        </template>
      </v-list-item>
    </template>
    <v-list-item
      v-for="sugg in suggestions"
      :key="sugg.அடையாளம்"
      @click="() => {}"
    >
      <jeton-membre :compte="sugg.பங்கேற்பாளர்" />
      <v-chip
        class="ma-2"
        variant="outlined"
        density="compact"
        label
      >
        {{ sugg.பரிந்துரை.தேதி.toDateString() }}
      </v-chip>
      <v-divider class="my-2" />
      <div>
        {{ sugg.பரிந்துரை.மொழிபெயர்ப்பு }}
      </div>
      <br />
      <v-btn
        class="mb-2"
        variant="outlined"
        append-icon="mdi-check"
        @click="() => approuver(sugg)"
      >
        {{ t('kilimukku.approuver') }}
      </v-btn>
    </v-list-item>
  </v-list-group>
</template>
<script setup lang="ts">
import type {பிணையம்_மொழிபெயர்ப்பு_பரிந்துரை_வகை} from '@lassi-js/kilimukku';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {கிளிமூக்கு} from '/@/components/utils';

import JetonMembre from '/@/components/membres/JetonMembre.vue';

const props = defineProps<{
  clef: string;
  langue: string;
  suggestions: பிணையம்_மொழிபெயர்ப்பு_பரிந்துரை_வகை[];
}>();

const {கிடைக்கும்_மொழிகளை_பயன்படுத்து, மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {மொழியின்_பெயர்} = கிடைக்கும்_மொழிகளை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const கிளி = கிளிமூக்கு();

// Nom

const nom = மொழியின்_பெயர்(props.langue);

// Actions
const approuver = async (sugg: பிணையம்_மொழிபெயர்ப்பு_பரிந்துரை_வகை) => {
  await கிளி.அங்கீகரி({பரிந்துரை: sugg});
};
</script>
