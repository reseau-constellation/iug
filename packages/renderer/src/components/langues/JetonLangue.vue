<template>
  <v-chip
    variant="outlined"
    size="small"
  >
    {{ nom || code }}

    <template #append>
      <v-icon
        v-if="progrèsPourcentage === 1"
        end
        color="primary"
      >
        mdi-check-circle
      </v-icon>
      <v-icon
        v-else
        end
      >
        <v-progress-circular
          :model-value="progrèsPourcentage * 100"
          size="15"
          color="primary"
        ></v-progress-circular>
      </v-icon>
    </template>
  </v-chip>
</template>
<script setup lang="ts">
import {
  கிடைக்கும்_மொழிகளைப்_பயன்படுத்து,
  மொழி_முன்னேற்றத்தைப்_பயன்படுத்து,
} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';

const props = defineProps<{code: string}>();

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
const nom = மொழியின்_பெயர்(props.code);
</script>
