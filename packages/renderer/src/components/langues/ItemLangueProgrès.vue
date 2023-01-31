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
    <v-list-item-title>{{ nomLangue }}</v-list-item-title>
    <template #append>
      <v-icon
        v-if="progrèsPourcentage === 1"
        color="primary"
      >
        mdi-check-circle
      </v-icon>
      <v-progress-circular
        v-else
        :value="progrèsPourcentage * 100"
        size="20"
        rotate="270"
        color="primary"
      ></v-progress-circular>
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import {computed} from 'vue';
import {utiliserLangues} from '/@/composables/langues';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
const props = defineProps<{code: string; selectionnee: boolean}>();

const {utiliserProgrèsLangue} = கிளிமூக்கை_உபயோகி();
const {progrèsLangue} = utiliserProgrèsLangue({
  மொழி: props.code,
  வகை: 'சாபி',
});
const progrèsPourcentage = computed(() => {
  console.log(progrèsLangue.value);
  return (progrèsLangue.value?.அங்கீகரிக்கப்பட்டவை || 0) / (progrèsLangue.value?.மொத்தம் || 0);
});
const {utiliserNomLangue, utiliserLangueSélectionnée} = utiliserLangues();
const nomLangue = computed<string>(() => {
  return utiliserNomLangue(props.code).value || props.code;
});

const langueSélectionnée = utiliserLangueSélectionnée();
const sélectionnerCetteLangue = () => {
  langueSélectionnée.value = props.code;
};
</script>
