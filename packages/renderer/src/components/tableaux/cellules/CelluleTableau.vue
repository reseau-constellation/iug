<template>
  <cellule-horo-datage
    v-if="catégorieFinale === 'horoDatage'"
    :val="val"
  />
  <cellule-chaine-non-traductible
    v-else-if="catégorieFinale === 'chaîneNonTraductible'"
    :val="val"
  />
  <cellule-booleenne
    v-else-if="catégorieFinale === 'booléen'"
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

import gjv from 'geojson-validation';

const props = defineProps<{
    categorie?: variables.catégorieBaseVariables;
    val: types.élémentsBd
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
</script>