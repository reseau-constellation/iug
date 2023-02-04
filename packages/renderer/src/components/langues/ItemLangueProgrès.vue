<template>
  <v-list-item @click="() => sélectionnerCetteLangue()">
    <template #prepend>
      <v-icon
        v-if="selectionnee"
        color="primary"
      >
        mdi-check-bold
      </v-icon>
    </template>
    <v-list-item-title>{{ nom || code }}</v-list-item-title>
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
import {computed} from 'vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
const props = defineProps<{code: string; selectionnee: boolean}>();

const {கிடைக்கும்_மொழிகளை_பயன்படுத்து, மொழி_முன்னேற்றத்தை_பயன்படுத்து} = கிளிமூக்கை_உபயோகி();
const {nomLangue} = கிடைக்கும்_மொழிகளை_பயன்படுத்து();

const {மொழி_முன்னேற்றம்} = மொழி_முன்னேற்றத்தை_பயன்படுத்து({
  மொழி: props.code,
  வகை: 'வார்த்தை',
});
const progrèsPourcentage = computed(() => {
  return (
    (மொழி_முன்னேற்றம்.value?.அங்கீகரிக்கப்பட்டவை || 0) / (மொழி_முன்னேற்றம்.value?.மொத்தம் || 0)
  );
});
const nom = nomLangue(props.code).value;

const {choisirLangues} = utiliserLangues();
const sélectionnerCetteLangue = () => {
  choisirLangues(props.code);
};
</script>
