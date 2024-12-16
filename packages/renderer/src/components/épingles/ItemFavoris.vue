<template>
  <item-favoris-variable
    v-if="epingle.épingle.type === 'variable'"
    :epingle="{idObjet: epingle.idObjet, épingle: epingle.épingle}"
  />
  <item-favoris-motclef
    v-if="epingle.épingle.type === 'motClef'"
    :epingle="{idObjet: epingle.idObjet, épingle: epingle.épingle}"
  />
  <item-favoris-bd
    v-else-if="epingle.épingle.type === 'bd'"
    :epingle="{idObjet: epingle.idObjet, épingle: epingle.épingle}"
  />
  <item-favoris-projet
    v-else-if="epingle.épingle.type === 'projet'"
    :epingle="{idObjet: epingle.idObjet, épingle: epingle.épingle}"
  />
  <item-favoris-nuee
    v-else-if="epingle.épingle.type === 'nuée'"
    :epingle="{idObjet: epingle.idObjet, épingle: epingle.épingle}"
  />
</template>

<script setup lang="ts">
import type {favoris} from '@constl/ipa';

import ItemFavorisVariable from './ItemFavorisVariable.vue';
import ItemFavorisMotclef from './ItemFavorisMotClef.vue';
import ItemFavorisBd from './ItemFavorisBd.vue';
import ItemFavorisProjet from './ItemFavorisProjet.vue';
import ItemFavorisNuee from './ItemFavorisNuée.vue';

defineProps<{epingle: favoris.ÉpingleFavorisAvecId}>();

</script>
