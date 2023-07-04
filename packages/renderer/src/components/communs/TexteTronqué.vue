<template>
  <span>{{ texteTronqué }}</span>
</template>
<script setup lang="ts">
import {computed} from 'vue';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const props = defineProps<{texte: string; longueurMax: number}>();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const texteTronqué = computed(() => {
  if ([...props.texte].length > props.longueurMax) {
    return (
      props.texte.slice(0, Math.max(props.longueurMax - 3, 3)) + t('communs.troisPetitsPoints')
    );
  } else {
    return props.texte;
  }
});
</script>
