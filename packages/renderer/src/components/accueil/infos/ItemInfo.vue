<template>
  <item-info-telecharger
    v-if="info.info.type === 'installer'"
    :info="info as InfoAvecId<InfoInstaller>"
  />
  <item-info-mettre-a-jour
    v-else-if="info.info.type === 'mettreÀJour'"
    :info="info as InfoAvecId<InfoMettreÀJour>"
  />
  <item-info-proteger-donnees
    v-else-if="info.info.type === 'protégerDonnées'"
    :info="info as InfoAvecId<InfoProtégerDonnnées>"
  />
  <item-info-utilisation-memoire
    v-else-if="info.info.type === 'utilisationMémoire'"
    :info="info as InfoAvecId<InfoUtilisationMémoire>"
  />
</template>
<script setup lang="ts">
import type {
  InfoAvecId,
  InfoMettreÀJour,
  InfoInstaller,
  InfoProtégerDonnnées,
  InfoUtilisationMémoire,
} from '/@/état/infos';
import ItemInfoTelecharger from './ItemInfoTélécharger.vue';
import ItemInfoMettreAJour from './ItemInfoMettreÀJour.vue';
import ItemInfoProtegerDonnees from './ItemInfoProtégerDonnées.vue';
import ItemInfoUtilisationMemoire from './ItemInfoUtilisationMémoire.vue';

defineProps<{
  info: InfoAvecId;
}>();
</script>
