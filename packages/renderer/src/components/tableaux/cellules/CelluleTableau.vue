<template>
  <cellule-horo-datage
    v-if="catégorieFinale === 'horoDatage'"
    :val="val"
    :editable="editable"
    @modifiee="({val}) => modifiée({val})"
  />
  <cellule-chaine-non-traductible
    v-else-if="catégorieFinale === 'chaîneNonTraductible'"
    :val="val"
    :editable="editable"
    @modifiee="({val}) => modifiée({val})"
  />
  <cellule-booleenne
    v-else-if="catégorieFinale === 'booléen'"
    :val="val"
    :editable="editable"
    @modifiee="({val}) => modifiée({val})"
  />
  <cellule-numerique
    v-else-if="catégorieFinale === 'numérique'"
    :val="val"
    :editable="editable"
    @modifiee="({val}) => modifiée({val})"
  />
  <cellule-audio
    v-else-if="catégorieFinale === 'audio'"
    :val="val"
    :editable="editable"
    @modifiee="({val}) => modifiée({val})"
  />
  <cellule-image
    v-else-if="catégorieFinale === 'image'" 
    :val="val"
    :editable="editable"
    @modifiee="({val}) => modifiée({val})"
  />
  <cellule-video
    v-else-if="catégorieFinale === 'vidéo'" 
    :val="val"
    :editable="editable"
    @modifiee="({val}) => modifiée({val})"
  />
  <cellule-fichier
    v-else-if="catégorieFinale === 'fichier'"
    :val="val"
    :editable="editable"
    @modifiee="({val}) => modifiée({val})"
  />
  <cellule-geo-json
    v-else-if="catégorieFinale === 'géojson'"
    :val="val"
    :editable="editable"
    @modifiee="({val}) => modifiée({val})"
  />
  <cellule-intervale-temps
    v-else-if="catégorieFinale === 'intervaleTemps'"
    :val="val"
    :editable="editable"
    @modifiee="({val}) => modifiée({val})"
  />
  <cellule-chaine
    v-else-if="catégorieFinale === 'chaîne'"
    :val="val"
    :editable="editable"
    @modifiee="({val}) => modifiée({val})"
  />
  <span v-else>{{ val }}</span>
</template>
<script setup lang="ts">
import type { types, variables } from '@constl/ipa';
import { computed } from 'vue';

import { devinerCatégorie } from '@constl/utils-ipa';

import CelluleHoroDatage from './CelluleHoroDatage.vue';
import CelluleChaineNonTraductible from './CelluleChaîneNonTraductible.vue';
import CelluleBooleenne from './CelluleBooléenne.vue';
import CelluleNumerique from './CelluleNumérique.vue';
import CelluleAudio from './CelluleAudio.vue';
import CelluleFichier from './CelluleFichier.vue';
import CelluleImage from './CelluleImage.vue';
import CelluleVideo from './CelluleVidéo.vue';
import CelluleGeoJson from './CelluleGéoJson.vue';
import CelluleChaine from './CelluleChaîne.vue';
import CelluleIntervaleTemps from './CelluleIntervaleTemps.vue';

const props = defineProps<{
    categorie?: variables.catégorieBaseVariables;
    val: types.élémentsBd;
    editable: boolean;
}>();
const émettre = defineEmits<{
  (é: 'modifiee', args: {val?: types.élémentsBd | File}): void;
}>();

const catégorieFinale = computed<variables.catégorieBaseVariables|undefined>(()=>{
    if (props.categorie) return props.categorie;
    else return devinerCatégorie(props.val);
});

// Modifications
const modifiée = ({val}: {val?: types.élémentsBd | File}) => {
  émettre('modifiee', {val});
};
</script>