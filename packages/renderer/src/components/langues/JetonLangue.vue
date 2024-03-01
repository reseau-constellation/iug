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
import {computed} from 'vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{code: string}>();

const {கிடைக்கும்_மொழிகளை_பயன்படுத்து, மொழி_முன்னேற்றத்தை_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {மொழியின்_பெயர்} = கிடைக்கும்_மொழிகளை_பயன்படுத்து();

const {மொழி_முன்னேற்றம்} = மொழி_முன்னேற்றத்தை_பயன்படுத்து({
  மொழி: props.code,
  வகை: 'வார்த்தை',
});
const progrèsPourcentage = computed(() => {
  return (
    (மொழி_முன்னேற்றம்.value?.அங்கீகரிக்கப்பட்டவை || 0) / (மொழி_முன்னேற்றம்.value?.மொத்தம் || 0)
  );
});
const nom = மொழியின்_பெயர்(props.code);
</script>
