<template>
  <v-dialog
    v-model="dialogue"
    :max-width="mdAndUp ? 500 : 300"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card>
      <v-card-item>
        <v-card-title class="d-flex align-center">
          {{ t('auteurs.carteGérer.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          />
        </v-card-title>
        <v-card-subtitle>
          {{ t('auteurs.carteGérer.sousTitre') }}
        </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <v-menu>
          <template #activator="{props: propsActivateur}">
            <v-text-field
              v-bind="propsActivateur"
              v-model="requête"
              hide-details
              variant="outlined"
              density="compact"
            ></v-text-field>
          </template>
          <v-list>
            <v-list-item v-if="!membresDisponibles?.length">
              <v-list-item-title>
                {{ t('auteurs.carteGérer.aucunRésultat') }}
              </v-list-item-title>
            </v-list-item>
            <résultat-recherche-profil
              v-for="m in membresDisponibles"
              :key="m.id"
              :résultat="m"
              @click="() => sélectionner(m.id)"
            />
          </v-list>
        </v-menu>
        <division-carte
          :titre="t('auteurs.carteGérer.nouveaux')"
          :en-attente="false"
        />
        <jeton-membre
          v-for="s in sélectionnés"
          :key="s"
          :compte="s"
        >
          <template #post>
            <v-btn
              icon="mdi-close"
              variant="flat"
              size="x-small"
              @click="() => désélectionner(s)"
            ></v-btn>
          </template>
        </jeton-membre>
        <v-checkbox
          v-model="ajouterCommeModérateur"
          color="primary"
          :label="t('auteurs.carteGérer.ajouterCommeModérateur')"
        ></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-spacer />

        <btn-annuler @click="fermer" />
        <btn-sauvegarder
          :actif="sélectionnés.length > 0"
          @click="() => émettre('sauvegarder')"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {rechercher} from '@constl/vue';
import {computed, ref} from 'vue';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {useDisplay} from 'vuetify';
import {utiliserConstellation} from '/@/components/utils';

import DivisionCarte from './DivisionCarte.vue';
import JetonMembre from '/@/components/membres/JetonMembre.vue';
import RésultatRechercheProfil from '/@/components/recherche/RésultatRechercheProfil.vue';

import BtnAnnuler from '/@/components/communs/BtnAnnuler.vue';
import BtnSauvegarder from '/@/components/communs/BtnSauvegarder.vue';

const props = defineProps<{
  id: string;
  auteurs: types.infoAuteur[] | undefined;
  permissionModerateur: boolean;
}>();
const émettre = defineEmits<{
  (é: 'sauvegarder'): void;
}>();

const {mdAndUp} = useDisplay();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);
const fermer = () => {
  dialogue.value = false;
};

// Options
const ajouterCommeModérateur = ref(false);

// Membres
const requête = ref<string>();
const {résultats: membres} = rechercher(constl.recherche.rechercherProfilsSelonTexte, {
  texte: requête,
});
const membresOrdonnées = computed(() => {
  const listeMembres = membres.value;
  if (!listeMembres) return undefined;
  return listeMembres.sort((a, b) =>
    a.résultatObjectif.score > b.résultatObjectif.score
      ? -1
      : a.résultatObjectif.score < b.résultatObjectif.score
        ? 1
        : 0,
  );
});

const membresDisponibles = computed(() => {
  return membresOrdonnées.value?.filter(m => {
    if (sélectionnés.value.includes(m.id)) return false;

    if (ajouterCommeModérateur.value) {
      return !(props.auteurs?.find(x => x.idCompte === m.id)?.rôle === 'MODÉRATEUR');
    } else {
      return !props.auteurs?.map(a => a.idCompte).includes(m.id);
    }
  });
});

// Ajouts
const sélectionnés = ref<string[]>([]);
const sélectionner = (id: string) => {
  sélectionnés.value = [...sélectionnés.value, id];
};
const désélectionner = (id: string) => {
  sélectionnés.value = sélectionnés.value.filter(x => x !== id);
};
</script>
