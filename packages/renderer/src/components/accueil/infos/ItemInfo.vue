<template>
  <item-info-telecharger
    v-if="info.info.type === 'installer'"
    :info="info as InfoAvecId<InfoInstaller>"
  >
    <v-btn
      icon="mdi-close"
      variant="flat"
      @click="() => émettre('fermer')"
    />
  </item-info-telecharger>
  <item-info-mettre-a-jour
    v-else-if="info.info.type === 'mettreÀJour'"
    :info="info as InfoAvecId<InfoMettreÀJour>"
  >
    <v-btn
      icon="mdi-close"
      variant="flat"
      @click="() => émettre('fermer')"
    />
  </item-info-mettre-a-jour>
</template>
<script setup lang="ts">
import type {InfoAvecId, InfoMettreÀJour, InfoInstaller} from '/@/état/infos';
import ItemInfoTelecharger from './ItemInfoTélécharger.vue';
import ItemInfoMettreAJour from './ItemInfoMettreÀJour.vue';

defineProps<{
  info: InfoAvecId;
}>();

const émettre = defineEmits<{
  (é: 'fermer'): void;
}>();
</script>
