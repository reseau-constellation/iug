<template>
  <template v-if="editable">
    <input
      ref="HTMLChoixFichier"
      type="file"
      style="display: none"
      :accept="accepter"
      @change="lorsqueFichierChoisi"
    />
    <v-chip
      v-if="sélectionFichier"
      label
      closable
      variant="outlined"
      :prepend-icon="icone || 'mdi-file-outline'"
      @click:close="() => effacerSélection()"
      @click="()=>ouvrirFenêtreChoisirFichier()"
    >
      <TexteTronque
        :texte="sélectionFichier.name"
        :longueur-max="20"
      />
    </v-chip>
    <v-chip
      v-else-if="valValide && sélectionFichier !== null"
      label
      size="small"
      variant="outlined"
      :prepend-icon="icone || 'mdi-file-outline'"
    >
      <TexteTronque
        :texte="valValide.fichier"
        :longueur-max="20"
      />
      <v-icon
        icon="mdi-close"  
        end
        @click="()=>effacerSélection()"
      />
    </v-chip>
    <v-btn
      v-else
      icon="mdi-upload"
      size="small"
      variant="flat"
      @click="()=>ouvrirFenêtreChoisirFichier()"
    />
  </template>
  <template v-else-if="valValide">
    <v-dialog v-model="dialogue">
      <template #activator="{props: propsActivateur}">
        <v-chip
          v-bind="propsActivateur"
          label
          size="small"
          variant="outlined"
          :prepend-icon="icone || 'mdi-file-outline'"
        >
          <TexteTronque
            :texte="valValide.fichier"
            :longueur-max="20"
          />
          <v-icon
            icon="mdi-download"
            end
            @click.stop="()=>télécharger()"
          />
        </v-chip>
      </template>
      <slot
        name="visualisation"
        :val-actuelle="valValide"
        :télécharger="télécharger"
        :fermer="()=>dialogue=false"
      >
        <v-card class="mx-auto">
          <v-card-item>
            <v-card-title>{{ valValide.fichier }}</v-card-title>
          </v-card-item>
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
              @click="()=>dialogue=false"
            />
          </v-card-actions>
        </v-card>
      </slot>
    </v-dialog>
  </template>
</template>
<script setup lang="ts">
import type { types } from '@constl/ipa';

import { computed, ref, watch } from 'vue';
import TexteTronque from '/@/components/communs/TexteTronqué.vue';
import { utiliserConstellation, idcEtExt } from '/@/components/utils';
import { itérableÀFlux, téléchargerFlux } from '/@/utils';
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';

const props = defineProps<{val?: types.élémentsBd, editable: boolean, icone?: string, accepter?: string}>();
const émettre = defineEmits<{(é: 'modifiee', args: {val?: File}): void;}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const valValide = computed(()=>{
  if (typeof props.val === 'string') {
    return idcEtExt(props.val);
  }
  return undefined;
});

// Choisir fichier
const sélectionFichier = ref<File|null>();

const HTMLChoixFichier = ref<HTMLInputElement>();
const ouvrirFenêtreChoisirFichier = () => {
  HTMLChoixFichier.value?.click();
};
const lorsqueFichierChoisi = async (): Promise<void> => {
  if (!HTMLChoixFichier.value?.files?.length) return;
  sélectionFichier.value = HTMLChoixFichier.value.files[0];
};

const effacerSélection = () => sélectionFichier.value = null;
  
watch(sélectionFichier, ()=>{
  émettre('modifiee', {val: sélectionFichier.value || undefined});
});

// Télécharger fichier
const télécharger = async () => {
  // Télécharger le document nouvellement ajouté si disponible ; sinon, télécharger la valeur originale.
  if (sélectionFichier.value) {
    téléchargerFlux({flux: new Blob([sélectionFichier.value]).stream(), nom: sélectionFichier.value.name});
  } else if (valValide.value) {
    const itérable = await constl.obtItérableAsyncSFIP({id: valValide.value.id});
    const flux = itérableÀFlux(itérable);
    téléchargerFlux({flux, nom: valValide.value.fichier});
  }
};

// Visualisation
const dialogue = ref(false);

</script>
