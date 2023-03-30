<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      :width="mdAndUp ? 500 : 300"
      class="mx-auto"
    >
      <v-card-item>
        <v-card-title>
          {{ nom || t('communs.baseCarteObjet.sansNom') }}
          <DialogueNoms
            :indice-nom="t('objet.indiceNom')"
            :indice-langue="t('objet.indiceLangue')"
            :texte-aucun-nom="t('objet.texteAucunNom')"
            :noms-initiaux="noms"
            :titre="t('objet.titreDialogueNoms')"
            :sous-titre="t('objet.sousTitreDialogueNoms')"
            :autorisation-modification="!!monAutorisation"
            @ajuster-noms="nms => émettre('ajusterNoms', nms)"
          >
            <template #activator="{props: propsActivateur}">
              <v-btn
                v-bind="propsActivateur"
                :icon="monAutorisation ? 'mdi-pencil' : 'mdi-dots-horizontal'"
                variant="flat"
                size="small"
              ></v-btn>
            </template>
          </DialogueNoms>
          <lien-objet :id="id" />
        </v-card-title>
      </v-card-item>
      <v-card-text style="overflow-y: auto">
        <division-carte
          :titre="t('communs.baseCarteObjet.description')"
          :en-attente="!descriptions"
        />
        <span :class="{'text-disabled': !description}">{{
          description || t('communs.baseCarteObjet.sansDescription')
        }}</span>
        <DialogueNoms
          :indice-nom="t('objet.indiceDescription')"
          :indice-langue="t('objet.indiceLangue')"
          :texte-aucun-nom="t('objet.texteAucuneDescription')"
          :noms-initiaux="descriptions"
          :titre="t('objet.titreDialogueDescriptions')"
          :sous-titre="t('objet.sousTitreDialogueDescriptions')"
          :autorisation-modification="!!monAutorisation"
          @ajuster-noms="descrs => émettre('ajusterDescriptions', descrs)"
        >
          <template #activator="{props: propsActivateur}">
            <v-btn
              v-bind="propsActivateur"
              :icon="monAutorisation ? 'mdi-pencil' : 'mdi-dots-horizontal'"
              variant="flat"
              size="small"
            ></v-btn>
          </template>
        </DialogueNoms>

        <division-carte
          :titre="t('communs.baseCarteObjet.auteurs')"
          :en-attente="!auteurs"
        />
        <auteurs-objet :auteurs="auteurs" />
        <gerer-auteurs
          v-if="monAutorisation === 'MODÉRATEUR'"
          :auteurs="auteurs"
        >
          <template #activator="{props: propsActivateurAuteurs}">
            <v-chip
              v-bind="propsActivateurAuteurs"
              variant="outlined"
              prepend-icon="mdi-plus"
              class="me-2 mb-2"
            >
              {{ t('communs.baseCarteObjet.ajouterAuteur') }}
            </v-chip>
          </template>
        </gerer-auteurs>

        <slot></slot>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="flat"
          @click="dialogue = false"
        >
          {{ t('communs.fermer') }} <v-icon end>mdi-close</v-icon>
        </v-btn>
        <v-btn
          v-if="monAutorisation"
          variant="outlined"
          color="primary"
          @click="() => émettre('sauvegarder')"
        >
          {{ t('communs.sauvegarder') }} <v-icon end>mdi-check</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {infoAuteur} from '@constl/ipa/dist/src/utils';

import {computed, ref, inject} from 'vue';
import {enregistrerÉcoute} from '/@/composables/utils';

import {utiliserLangues} from '/@/plugins/localisation/localisation';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {useDisplay} from 'vuetify';
import DivisionCarte from './DivisionCarte.vue';
import GererAuteurs from './GererAuteurs.vue';
import AuteursObjet from './AuteursObjet.vue';
import DialogueNoms from './listeNoms/DialogueNoms.vue';
import LienObjet from './LienObjet.vue';

const props = defineProps<{
  id: string;
  noms: {[langue: string]: string};
  descriptions: {[langue: string]: string};
  auteurs?: infoAuteur[];
}>();
const émettre = defineEmits<{
  (é: 'ajusterNoms', noms: {[lng: string]: string}): void;
  (é: 'ajusterDescriptions', noms: {[lng: string]: string}): void;
  (é: 'sauvegarder'): void;
}>();

const constl = inject<ClientConstellation>('constl');

const {mdAndUp} = useDisplay();
const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {traduireNom} = utiliserLangues();

// Navigation
const dialogue = ref(false);

// Autorisation
const monAutorisation = ref<'MODÉRATEUR' | 'MEMBRE' | undefined>();
enregistrerÉcoute(
  constl?.suivrePermission({
    idObjet: props.id,
    f: x => (monAutorisation.value = x),
  }),
);

// Nom
const nom = traduireNom(computed(() => props.noms));

// Description
const description = traduireNom(computed(() => props.descriptions));
</script>
