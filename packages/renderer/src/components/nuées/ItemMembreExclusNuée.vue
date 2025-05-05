<template>
  <item-membre
    :compte="idCompte"
    montrer-anonymes
  >
    <template #fin>
      <v-btn
        icon="mdi-cancel"
        size="small"
        variant="flat"
        @click="()=>émettre('effacer', idCompte)"
      />
    </template>
  </item-membre>
</template>
<script setup lang="ts">
import ItemMembre from '/@/components/membres/ItemMembre.vue';

defineProps<{idCompte: string}>();
const émettre = defineEmits<{
  (é: 'effacer', id: string): void
}>();
</script>