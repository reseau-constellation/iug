<template>
  <v-list-item>
    <v-list-item-subtitle>
      {{ nomLangue }}
    </v-list-item-subtitle>
    <v-divider class="my-1" />
    {{ traduc }}
    <v-list-item-action>
      <v-spacer />
      <v-btn
        icon="mdi-content-copy"
        variant="flat"
        @click="() => émettre('suggerer')"
      ></v-btn>
    </v-list-item-action>
  </v-list-item>
</template>
<script setup lang="ts">
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';

const props = defineProps<{traduc: string; lng: string}>();
const émettre = defineEmits<{
  (é: 'suggerer'): void;
}>();

const {கிடைக்கும்_மொழிகளை_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {மொழியின்_பெயர்} = கிடைக்கும்_மொழிகளை_பயன்படுத்து({});

const nomLangue = மொழியின்_பெயர்(computed(() => props.lng));
</script>
