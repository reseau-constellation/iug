<template>
  <span>
    <li
      v-for="item in visibles"
      :key="item.id"
    >
      <slot
        name="jeton"
        v-bind="item"
      ></slot>
    </li>

    <v-menu v-if="extras.length">
      <template #activator="{props}">
        <v-chip v-bind="props"><v-icon>mdi-plus</v-icon></v-chip>
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

type TypeItemSérie = {[clef: string]: unknown} & {id: string};
const props = defineProps<{nMax: number; items: (TypeItemSérie | string)[]}>();

const itemiser = (item: string | TypeItemSérie): TypeItemSérie => {
  return typeof item === 'string' ? {id: item} : item;
};

// https://vuejs.org/guide/components/slots.html#fancy-list-example
const visibles = computed<TypeItemSérie[]>(() => {
  return props.items.slice(0, props.nMax).map(itemiser);
});
const extras = computed<TypeItemSérie[]>(() => {
  return props.items.slice(props.nMax).map(itemiser);
});
</script>
