<template>
  <div class="text-center">
    <LogoAnimé
      :t="t"
      :largeur="400"
    />
    <h1>Constellation</h1>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';

import LogoAnimé from '/@/components/LogoAnimé.vue';
const t = ref(0);

onMounted(() => {
  const annuler = setInterval(() => {
    t.value += 0.001;
    if (t.value >= 1) clearInterval(annuler);
  }, 10);
});
</script>
