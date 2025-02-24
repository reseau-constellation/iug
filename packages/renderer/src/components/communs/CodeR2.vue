<template>
  <qrcode-vue
    v-bind="propsCode"
    :value="texteComprimé"
  />
</template>
<script setup lang="ts">
import {fromByteArray} from 'base64-js';
import {gzipSync} from 'fflate';
import QrcodeVue from 'qrcode.vue';
import {computed} from 'vue';

const props = defineProps<{
  valeur: string | undefined;
  propsCode?: Omit<InstanceType<typeof QrcodeVue>['$props'], 'value'>;
}>();

const texteComprimé = computed(() =>
  props.valeur
    ? fromByteArray(gzipSync(new TextEncoder().encode(props.valeur))).toString()
    : undefined,
);
</script>
