<template>
  <v-navigation-drawer
    expand-on-hover
    permanent
    rail
  >
    <v-list>
      <v-list-item
        :title="nomTraduit"
        @click="$router.push({path: '/compte'})"
      >
        <template #prepend>
          <image-profil />
        </template>
        <template #subtitle>
          <v-icon start>{{ icôneDispositif }}</v-icon>
          <TexteTronque
            :texte="nomDispositif || t('dispositifs.sansNom')"
            :longueur-max="20"
          />
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list
      density="compact"
      class="align-start"
      nav
    >
      <v-list-item
        v-for="lien in liens"
        :key="lien.chemin"
        :prepend-icon="lien.icône"
        :title="lien.texte"
        @click="$router.push(encodeURI(lien.chemin))"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import {inject, ref, onMounted, computed} from 'vue';
import type {client} from '@constl/ipa';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {enregistrerÉcoute} from '/@/components/utils';
import ImageProfil from './communs/ImageProfil.vue';
import {obtIcôneDispositifDeType, utiliserNomEtTypeDispositif} from './membres/utils';
import TexteTronque from './communs/TexteTronqué.vue';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const constl = inject<client.ClientConstellation>('constl');

// Nom d'utilisatrice
const {traduireNom} = utiliserLangues();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.profil?.suivreNoms({
    f: x => (noms.value = x),
  }),
);

// Dispositif
const idDispositif = ref<string>();
onMounted(async () => {
  idDispositif.value = await constl?.obtIdOrbite();
});
const {nomDispositif, typeDispositif} = utiliserNomEtTypeDispositif({
  idDispositif: idDispositif,
});
const icôneDispositif = computed(() => obtIcôneDispositifDeType(typeDispositif.value));

// Liens navigation
const liens: {icône: string; chemin: string; texte: string}[] = [
  {
    icône: 'mdi-home',
    texte: t('navigation.accueil'),
    chemin: '/',
  },

  {
    icône: 'mdi-database',
    texte: t('navigation.données'),
    chemin: '/données',
  },

  {
    icône: 'mdi-pin',
    texte: t('navigation.favoris'),
    chemin: '/favoris',
  },

  {
    icône: 'mdi-magnify',
    texte: t('navigation.recherche'),
    chemin: '/recherche',
  },

  {
    icône: 'mdi-lightning-bolt',
    texte: t('navigation.automatisations'),
    chemin: '/automatisations',
  },

  {
    icône: 'mdi-bug',
    texte: t('navigation.signalements'),
    chemin: '/signalements',
  },
];
</script>
