<template>
  <v-list-item @click="() => émettre('suggerer')">
    <v-list-item-subtitle>
      {{ nomLangue }}
    </v-list-item-subtitle>
    <v-divider class="my-1" />
    {{ traduc }}
  </v-list-item>
</template>
<script setup lang="ts">
import {கிடைக்கும்_மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';

const props = defineProps<{traduc: string; lng: string}>();
const émettre = defineEmits<{
  (é: 'suggerer'): void;
}>();

const {மொழியின்_பெயர்} = கிடைக்கும்_மொழிகளைப்_பயன்படுத்து();

const nomLangue = மொழியின்_பெயர்(computed(() => props.lng));
</script>
