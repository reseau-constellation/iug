<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 600 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex align-center">
          {{ t('conditions.entête') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          />
        </v-card-title>
        <v-divider />
      </v-card-item>
      <v-card-text style="overflow-y: scroll">
        <vue-markdown
          v-for="c in conditions"
          :key="c.clef"
          :source="t(`conditions.${c.clef}`) || ''"
          :class="'text-justify ' + (c.titre ? 'text-h6 mt-2' : 'mt-1')"
        />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-checkbox
          v-model="acceptées"
          hide-details
          color="primary"
          :label="t('conditions.jaccepte')"
          @change="() => changerAcceptation()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';
import {utiliserÉtatConditions} from '/@/état/conditions';
import VueMarkdown from 'vue-markdown-render';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();
const état = utiliserÉtatConditions();
const étatAcceptées = ref(état.acceptées);

const dialogue = ref(false);

const acceptées = ref(false);
watchEffect(() => {
  acceptées.value = étatAcceptées.value;
});

const changerAcceptation = () => {
  if (acceptées.value) état.accepter();
  else état.refuser();
  if (acceptées.value) {
    dialogue.value = false;
  }
};
const conditions: {
  clef: string;
  titre?: boolean;
}[] = [
  {
    clef: 'p0_1',
  },
  {
    clef: 'p0_2',
  },
  {
    clef: 'p0_3',
  },
  {
    titre: true,
    clef: 't1',
  },
  {
    clef: 'p1_1',
  },
  {
    clef: 'p1_2',
  },
  {
    titre: true,
    clef: 't2',
  },
  {
    clef: 'p2_1',
  },
  {
    clef: 'p2_2',
  },
  {
    clef: 'p2_3',
  },
  {
    titre: true,
    clef: 't3',
  },
  {
    clef: 'p3_1',
  },
  {
    clef: 'p3_2',
  },
  {
    clef: 'p3_3',
  },
  {
    titre: true,
    clef: 't4',
  },
  {
    clef: 'p4_1',
  },
  {
    clef: 'p4_2',
  },
];
</script>
