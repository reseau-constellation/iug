<template>
  <v-container :class="{'mt-3': true, 'pb-0': !!image, 'text-center': true}">
    <h1 :class="[mdAndUp ? 'text-h2' : 'text-h3']">
      {{ titre }}
    </h1>

    <v-img
      v-if="image"
      :class="{
        'my-6': true,
        'mx-auto': true,
        'rounded-circle': imageRonde,
        'border-thin': imageRonde,
      }"
      :width="mdAndUp ? 275 : 175"
      :height="mdAndUp ? 275 : 175"
      :src="image"
    >
    </v-img>
    <h2
      v-if="sousTitre"
      :class="['mb-5', mdAndUp ? 'text-h4' : 'text-h5']"
    >
      {{ sousTitre }}
    </h2>
  </v-container>
</template>

<script setup lang="ts">
import {useDisplay} from 'vuetify';

defineProps({
  titre: {type: String, required: true},
  sousTitre: {type: String, default: ''},
  image: {type: String, default: undefined},
  imageRonde: {type: Boolean, default: true},
});

const {mdAndUp} = useDisplay();
</script>
