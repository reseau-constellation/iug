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
import ItemInfoMettreAJour from './ItemInfoMettreÀJour.vue';
import ItemInfoProtegerDonnees from './ItemInfoProtégerDonnées.vue';
import ItemInfoTelecharger from './ItemInfoTélécharger.vue';
import ItemInfoUtilisationMemoire from './ItemInfoUtilisationMémoire.vue';
import type {
  InfoAvecId,
  InfoInstaller,
  InfoMettreÀJour,
  InfoProtégerDonnnées,
  InfoUtilisationMémoire,
} from '/@/état/infos';

defineProps<{
  info: InfoAvecId;
}>();
</script>
