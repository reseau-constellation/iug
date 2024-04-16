<template>
  <carte-tableau
    :noms="{}"
    :descriptions="{}"
    :permission-modifier="false"
    @sauvegarder="changements => sauvegarder(changements)"
    @effacer="() => effacerTableau()"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
  </carte-tableau>
</template>
<script setup lang="ts">
import {constellation} from '../utils';

import CarteTableau from './CarteTableau.vue';

const props = defineProps<{idTableau: string; idBd: string}>();

const constl = constellation();

// Contrôles
const sauvegarder = async ({
  noms,
}: {
  noms?: {[langue: string]: string};
  descrs?: {[langue: string]: string};
}) => {
  const ajoutNoms = noms
    ? constl.tableaux.sauvegarderNomsTableau({idTableau: props.idTableau, noms})
    : undefined;
  await Promise.all([ajoutNoms]);
};
const effacerTableau = async () => {
  await constl.bds.effacerTableauBd({idBd: props.idBd, idTableau: props.idTableau});
};
</script>
