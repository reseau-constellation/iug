<template>
  <v-list-item>
    <template #prepend>
      <v-icon
        v-if="selectionnee"
        color="primary"
      >
        mdi-check-bold
      </v-icon>
    </template>

    <template #title>
      {{ nom || code }}
    </template>

    <template #append>
      <v-icon
        v-if="progrèsPourcentage === 1"
        color="primary"
      >
        mdi-check-circle
      </v-icon>
      <v-progress-circular
        v-else
        :model-value="progrèsPourcentage * 100"
        size="20"
        color="primary"
      ></v-progress-circular>
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import {
  கிடைக்கும்_மொழிகளைப்_பயன்படுத்து,
  மொழி_முன்னேற்றத்தைப்_பயன்படுத்து,
} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
const props = defineProps<{code: string; selectionnee: boolean}>();

const {மொழியின்_பெயர்} = கிடைக்கும்_மொழிகளைப்_பயன்படுத்து();

const {மொழி_முன்னேற்றம்} = மொழி_முன்னேற்றத்தைப்_பயன்படுத்து({
  மொழி: computed(() => props.code),
  வகை: 'வார்த்தை',
});
const progrèsPourcentage = computed(() => {
  return (
    (மொழி_முன்னேற்றம்.value?.அங்கீகரிக்கப்பட்டவை || 0) / (மொழி_முன்னேற்றம்.value?.மொத்தம் || 0)
  );
});
const nom = மொழியின்_பெயர்(computed(() => props.code));
</script>
