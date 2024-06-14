<template>
  <template v-if="editable">
    <v-file-input 
      v-model="sélectionFichier"
      variant="outlined"
      density="compact"
      clearable
      hide-details    
    />
  </template>
  <template v-else-if="valValide">
    <v-chip
      label
      density="compact"
      size="small"
      prepend-icon="mdi-paperclip"
    >
      <TexteTronque
        :texte="valValide.fichier"
        :longueur-max="20"
      />
      <v-icon
        icon="mdi-download"
        @click="()=>télécharger()"
      />
    </v-chip>
  </template>
</template>
<script setup lang="ts">
import type { types } from '@constl/ipa';

import { computed, ref } from 'vue';
import TexteTronque from '/@/components/communs/TexteTronqué.vue';
import { constellation, idcEtExt } from '/@/components/utils';
import saveAs from 'file-saver';

const props = defineProps<{val?: types.élémentsBd, editable: boolean}>();
defineEmits<{(é: 'modifiee', args: {val?: File}): void;}>();

const constl = constellation();

const valValide = computed(()=>{
  if (typeof props.val === 'string') {
    return idcEtExt(props.val);
  }
  return undefined;
});

const sélectionFichier = ref<File>();

const télécharger = async () => {
  // Télécharger le document nouvellement ajouté si disponible ; sinon, télécharger la valeur originale.
  if (sélectionFichier.value) {
    saveAs(sélectionFichier.value);
  } else if (valValide.value) {
    const donnéesFichier = await constl.obtFichierSFIP({id: valValide.value.id});
    if (donnéesFichier) {
      saveAs(new Blob([donnéesFichier]), valValide.value.fichier);
    }
  }
};
</script>
