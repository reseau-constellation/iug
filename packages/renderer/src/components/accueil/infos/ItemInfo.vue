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
  <item-info-requetes-serveur-local
    v-else-if="info.info.type === 'requêteServeurLocal'"
    :info="info as InfoAvecId<InfoRequêtesServeurLocal>"
  />
</template>
<script setup lang="ts">
import ItemInfoMettreAJour from './ItemInfoMettreÀJour.vue';
import ItemInfoProtegerDonnees from './ItemInfoProtégerDonnées.vue';
import ItemInfoRequetesServeurLocal from './ItemInfoRequêtesServeurLocal.vue';
import ItemInfoTelecharger from './ItemInfoTélécharger.vue';
import ItemInfoUtilisationMemoire from './ItemInfoUtilisationMémoire.vue';
import type {
  InfoAvecId,
  InfoInstaller,
  InfoMettreÀJour,
  InfoProtégerDonnnées,
  InfoRequêtesServeurLocal,
  InfoUtilisationMémoire,
} from '/@/état/infos';

defineProps<{
  info: InfoAvecId;
}>();
</script>
