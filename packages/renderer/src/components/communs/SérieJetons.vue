<template>
  <span>
    <span
      v-for="item in visibles"
      :key="item.id"
    >
      <slot
        name="jeton"
        v-bind="item"
      ></slot>
    </span>

    <v-menu v-if="extras.length">
      <template #activator="{props: propsMenu}">
        <v-chip
          v-bind="propsMenu"
          variant="outlined"
          class="me-2 mb-2"
        >
          <v-icon start>mdi-plus</v-icon>
          {{ nExtrasFormatté }}
        </v-chip>
      </template>
      <v-list>
        <li
          v-for="item in extras"
          :key="item.id"
        >
          <slot
            name="itemListe"
            v-bind="item"
          ></slot>
        </li>
      </v-list>
    </v-menu>
  </span>
</template>
<script setup lang="ts">
import {computed} from 'vue';
import {எண்களைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

type TypeItemSérie = {[clef: string]: unknown} & {id: string};
const props = defineProps<{nMax: number; items?: (TypeItemSérie | string)[]}>();

const {எண்ணை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

// Logique générale
const itemiser = (item: string | TypeItemSérie): TypeItemSérie => {
  return typeof item === 'string' ? {id: item} : item;
};

// https://vuejs.org/guide/components/slots.html#fancy-list-example
const visibles = computed<TypeItemSérie[]>(() => {
  return props.items?.slice(0, props.nMax).map(itemiser) || [];
});
const extras = computed<TypeItemSérie[]>(() => {
  return props.items?.slice(props.nMax).map(itemiser) || [];
});
const nExtras = computed(() => {
  return extras.value.length;
});
const nExtrasFormatté = எண்ணை_வடிவூட்டு(nExtras);
</script>
