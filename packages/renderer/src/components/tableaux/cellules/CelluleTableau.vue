<template>
  <cellule-horo-datage
    v-if="catégorieFinale === 'horoDatage'"
    :val="val"
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
  />
  <cellule-image
    v-else-if="catégorieFinale === 'image'" 
    :val="val"
  />
  <cellule-video
    v-else-if="catégorieFinale === 'vidéo'" 
    :val="val"
  />
  <cellule-fichier
    v-else-if="catégorieFinale === 'fichier'"
    :val="val"
    :editable="editable"
  />
  <cellule-geo-json
    v-else-if="catégorieFinale === 'géojson'"
    :val="val"
  />
  <cellule-intervale-temps
    v-else-if="catégorieFinale === 'intervaleTemps'"
    :val="val"
  />
  <cellule-chaine
    v-else-if="catégorieFinale === 'chaîne'"
    :val="val"
  />
  <span v-else>{{ val }}</span>
</template>
<script setup lang="ts">
import type { types, variables } from '@constl/ipa';
import { computed } from 'vue';

import { cidValide } from '@constl/utils-ipa';
import { adresseOrbiteValide, formatsFichiers } from '/@/components/utils';

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

import gjv from 'geojson-validation';

const props = defineProps<{
    categorie?: variables.catégorieBaseVariables;
    val: types.élémentsBd;
    editable: boolean;
}>();
const émettre = defineEmits<{
  (é: 'modifiee', args: {val?: types.élémentsBd}): void;
}>();

const catégorieFinale = computed<variables.catégorieBaseVariables|undefined>(()=>{
    if (props.categorie) return props.categorie;
    else {
        if (typeof props.val === 'boolean') return 'booléen';
        else if (typeof props.val === 'string') {
            try {
                const [id, fichier] = props.val.split('/');
                if (cidValide(id)) {
                    const ext = fichier.split('.').pop();
                    if (ext && formatsFichiers.images.includes(ext)) return 'image';
                    else if (ext && formatsFichiers.vidéo.includes(ext)) return 'vidéo';
                    else if (ext && formatsFichiers.audio.includes(ext)) return 'audio';
                    else if (ext) return 'fichier';
                }
            }
            catch {
                // Rien à faire
            }
            return adresseOrbiteValide(props.val) ? 'chaîne' : 'chaîneNonTraductible';
        } else if (typeof props.val === 'number') {
            if (props.val > 100000000000) {
                return 'horoDatage';
            } else {
                return 'numérique';
            }
        } else if (Array.isArray(props.val)) {
            if (props.val.length === 2 && props.val.every(x=>typeof x === 'number' && x > 100000000000)) {
                return 'intervaleTemps';
            } else {
                return undefined;
            }
        } else if (gjv.valid(props.val)) {
            return 'géojson';
        }
        return undefined;
    }
});

// Modifications
const modifiée = ({val}: {val?: types.élémentsBd}) => {
  émettre('modifiee', {val});
};
</script>