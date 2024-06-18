<template>
  <cellule-fichier
    :editable="editable"
    :val="val"
    icone="mdi-waveform"
    accepter="audio/*"
    @modifiee="({val}) => émettre('modifiee', {val})"
  >
    <template #visualisation="{fermer, télécharger}">
      <v-card class="mx-auto">
        <v-card-item>
          <v-card-title>{{ valValide?.fichier }}</v-card-title>
        </v-card-item>
        <v-card-text>
          <!-- @vue-expect-error Problème types avec video-player -->
          <video-player
            :src="{type: 'audio/mp3', src: srcVidéo}"
            controls
            audio-only-mode
            :width="500"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :text="t('communs.télécharger')"
            variant="outlined"
            append-icon="mdi-download"
            @click="()=>télécharger()"
          />
          <v-btn
            :text="t('communs.fermer')"
            variant="outlined"
            append-icon="mdi-close"
            @click="()=>fermer()"
          />
        </v-card-actions>
      </v-card>
    </template>
  </cellule-fichier>
</template>
<script setup lang="ts">
import type { types } from '@constl/ipa';

import CelluleFichier from './CelluleFichier.vue';
import { computed, ref, watchEffect } from 'vue';
import { constellation, idcEtExt } from '/@/components/utils';
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';

import { VideoPlayer } from '@videojs-player/vue';  
import 'video.js/dist/video-js.css';

const props = defineProps<{val?: types.élémentsBd, editable: boolean}>();
const émettre = defineEmits<{(é: 'modifiee', args: {val?: File}): void;}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// À faire - obtenir l'objet validé directement de CelluleFichier.vue
const valValide = computed(()=>{
  if (typeof props.val === 'string') {
    return idcEtExt(props.val);
  }
  return undefined;
});

// Vidéo
const srcVidéo = ref<string>();
watchEffect(async () => {
  if (!valValide.value) return undefined;
  const fichier = await constl.obtFichierSFIP({id: valValide.value?.id});
  if (fichier) {
    srcVidéo.value =  URL.createObjectURL(new Blob([fichier], { type: `video/${valValide.value.ext}`} ));
  } else {
    srcVidéo.value = undefined;
  }
});

</script>
