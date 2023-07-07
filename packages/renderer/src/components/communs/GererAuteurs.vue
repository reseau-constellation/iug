<template>
  <v-dialog
    v-model="dialogue"
    :max-width="mdAndUp ? 500 : 300"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card>
      <v-card-item>
        <v-card-title>
          {{ t('auteurs.carteGérer.titre') }}
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
              v-model="requèteRecherche"
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
        <v-btn
          variant="flat"
          @click="fermer"
        >
          {{ t('communs.fermer') }} <v-icon end>mdi-close</v-icon>
        </v-btn>
        <v-btn
          variant="outlined"
          color="primary"
          :disabled="!sélectionnés.length"
          @click="() => émettre('sauvegarder')"
        >
          {{ t('communs.sauvegarder') }} <v-icon end>mdi-check</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {client, utils} from '@constl/ipa';
import type {Ref} from 'vue';

import {inject, ref, computed} from 'vue';
import {useDisplay} from 'vuetify';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {enregistrerRecherche} from '/@/components/utils';

import JetonMembre from '/@/components/membres/JetonMembre.vue';
import DivisionCarte from './DivisionCarte.vue';
import RésultatRechercheProfil from '../recherche/RésultatRechercheProfil.vue';

const props = defineProps<{auteurs: utils.infoAuteur[] | undefined}>();
const émettre = defineEmits<{
  (é: 'sauvegarder'): void;
}>();

const {mdAndUp} = useDisplay();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const constl = inject<client.ClientConstellation>('constl');

// Navigation
const dialogue = ref(false);
const fermer = () => {
  dialogue.value = false;
};

// Options
const ajouterCommeModérateur = ref(false);

// Membres
const membres = ref<utils.résultatRecherche<utils.infoRésultatTexte>[]>();
const requèteRecherche = ref<string>();
enregistrerRecherche({
  requète: requèteRecherche,
  réfRésultat: membres,
  fRecherche: async ({
    requète,
    nOuProfondeur,
    réfRésultat,
  }: {
    requète: string;
    nOuProfondeur: number;
    réfRésultat: Ref<utils.résultatRecherche<utils.infoRésultatTexte>[] | undefined>;
  }) =>
    constl?.recherche?.rechercherProfilSelonTexte({
      texte: requète,
      nRésultatsDésirés: nOuProfondeur,
      f: x =>
        (réfRésultat.value = x.sort((a, b) =>
          a.résultatObjectif.score > b.résultatObjectif.score
            ? -1
            : a.résultatObjectif.score < b.résultatObjectif.score
            ? 1
            : 0,
        )),
    }),
  fRechercheDéfaut: async ({
    nOuProfondeur,
    réfRésultat,
  }: {
    nOuProfondeur: number;
    réfRésultat: Ref<utils.résultatRecherche<utils.infoRésultat>[] | undefined>;
  }) =>
    constl?.réseau?.rechercherMembres({
      nRésultatsDésirés: nOuProfondeur,
      f: x =>
        (réfRésultat.value = x.sort((a, b) =>
          a.résultatObjectif.score > b.résultatObjectif.score
            ? -1
            : a.résultatObjectif.score < b.résultatObjectif.score
            ? 1
            : 0,
        )),
    }),
});
const membresDisponibles = computed(() => {
  return membres.value?.filter(m => {
    if (sélectionnés.value.includes(m.id)) return false;

    if (ajouterCommeModérateur.value) {
      return !(props.auteurs?.find(x => x.idBdCompte === m.id)?.rôle === 'MODÉRATEUR');
    } else {
      return !props.auteurs?.map(a => a.idBdCompte).includes(m.id);
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
