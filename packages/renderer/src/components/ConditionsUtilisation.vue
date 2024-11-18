<template>
  <v-card
    flat
    class="px-5 text-justify"
  >
    <template v-for="(c, i) in conditions">
      <div
        v-if="c.genre === 'p' || c.genre === 't'"
        :key="i"
        :class="c.genre === 't' ? 'text-h6' : ''"
        v-html="compilerMarkdown(t(`conditions.${c.texte}`))"
      />
      <span
        v-else-if="c.genre === 'b'"
        :key="i"
      >
        <v-checkbox
          v-model="acceptées"
          :label="t('conditions.jaccepte')"
          @change="() => accepter()"
        />
        <v-btn
          color="primary"
          tiled
          outlined
          small
          class="mb-5"
          @click="$router.push('/accueil')"
        >
          {{ t("conditions.retour") }}
        </v-btn>
      </span>
    </template>
  </v-card>
</template>
<script setup lang="ts">
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserÉtatConditions} from '/@/état/conditions';
import { ref, watchEffect } from 'vue';
import  {compilerMarkdown} from '/@/utils';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const état = utiliserÉtatConditions();
const étatAcceptées = ref(état.acceptées);

const acceptées = ref(false);
watchEffect(()=>{
  acceptées.value = étatAcceptées.value;
});

const accepter = () => {
    état.acceptées = true;
  };
const conditions = [
        {
          genre: 'p',
          texte: 'p0_1',
        },
        {
          genre: 'p',
          texte: 'p0_2',
        },
        {
          genre: 'p',
          texte: 'p0_3',
        },
        {
          genre: 'b',
        },
        {
          genre: 't',
          texte: 't1',
        },
        {
          genre: 'p',
          texte: 'p1_1',
        },
        {
          genre: 'p',
          texte: 'p1_2',
        },
        {
          genre: 't',
          texte: 't2',
        },
        {
          genre: 'p',
          texte: 'p2_1',
        },
        {
          genre: 'p',
          texte: 'p2_2',
        },
        {
          genre: 'p',
          texte: 'p2_3',
        },
        {
          genre: 't',
          texte: 't3',
        },
        {
          genre: 'p',
          texte: 'p3_1',
        },
        {
          genre: 'p',
          texte: 'p3_2',
        },
        {
          genre: 'p',
          texte: 'p3_3',
        },
        {
          genre: 't',
          texte: 't4',
        },
        {
          genre: 'p',
          texte: 'p4_1',
        },
        {
          genre: 'p',
          texte: 'p4_2',
        },
      ];

</script>
