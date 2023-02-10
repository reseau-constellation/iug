<template>
  <v-container class="mt-3 text-center">
    <h1 class="text-h2">
      {{ titre }}
    </h1>

    <v-avatar
      v-if="image && imageRonde"
      :size="mdAndUp ? 275 : 175"
      class="mb-3"
    >
      <v-img :src="image" />
    </v-avatar>
    <v-img
      v-else-if="image"
      :src="image"
      class="mb-3"
      contain
      height="175"
    />

    <h2 class="text-h4 mb-5">
      {{ sousTitre }}
    </h2>
  </v-container>
</template>

<script setup lang="ts">
import {useDisplay} from 'vuetify';

defineProps({
  titre: String,
  sousTitre: String,
  image: String,
  imageRonde: {type: Boolean, default: true},
});

const {mdAndUp} = useDisplay();
</script>
