<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      :max-width="mdAndUp ? 700 : 300"
      class="mx-auto"
    >
      <v-card-item>
        <v-card-title class="d-flex">
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
              <span v-bind="propsActivateur">
                {{ nom || t('communs.baseCarteObjet.sansNom') }}
                <v-btn
                  :icon="monAutorisation ? 'mdi-pencil' : 'mdi-earth'"
                  variant="flat"
                  size="small"
                ></v-btn>
              </span>
            </template>
          </DialogueNoms>
          <v-spacer />
          <lien-objet :id="id" />
          <v-btn
            icon
            variant="flat"
            size="small"
          >
            <v-icon>mdi-dots-horizontal</v-icon>
            <v-menu activator="parent">
              <v-list>
                <carte-copier @copier="copier">
                  <template #activator="{props: propsActivateur}">
                    <v-list-item
                      v-bind="propsActivateur"
                      prepend-icon="mdi-content-copy"
                    >
                      <v-list-item-title>{{ t('communs.copier') }}</v-list-item-title>
                    </v-list-item>
                  </template>
                </carte-copier>
                <CarteEpingler :id="id">
                  <template #activator="{props: propsActivateur}">
                    <v-list-item
                      v-bind="propsActivateur"
                      prepend-icon="mdi-pin"
                    >
                      <template #prepend>
                        <IcôneEpingle :id="id"></IcôneEpingle>
                      </template>
                      <v-list-item-title>{{ t('communs.épingler') }}</v-list-item-title>
                    </v-list-item>
                  </template>
                </CarteEpingler>
                <carte-effacer
                  v-if="monAutorisation"
                  @effacer="effacer"
                >
                  <template #activator="{props: propsActivateur}">
                    <v-list-item v-bind="propsActivateur">
                      <template #prepend>
                        <v-icon
                          icon="mdi-delete"
                          color="error"
                        />
                      </template>
                      <v-list-item-title>{{ t('communs.effacer') }}</v-list-item-title>
                    </v-list-item>
                  </template>
                </carte-effacer>
              </v-list>
            </v-menu>
          </v-btn>
        </v-card-title>
      </v-card-item>
      <v-card-text style="overflow-y: scroll">
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
              :icon="monAutorisation ? 'mdi-pencil' : 'mdi-earth'"
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
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type {client, utils} from '@constl/ipa';

import {computed, ref, inject} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';

import {useDisplay} from 'vuetify';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import CarteEpingler from '/@/components/épingles/CarteÉpingler.vue';
import IcôneEpingle from '/@/components/épingles/IcôneÉpingle.vue';

import DivisionCarte from './DivisionCarte.vue';
import GererAuteurs from './GererAuteurs.vue';
import AuteursObjet from './AuteursObjet.vue';
import DialogueNoms from './listeNoms/DialogueNoms.vue';
import LienObjet from './LienObjet.vue';
import CarteCopier from './CarteCopier.vue';
import CarteEffacer from './CarteEffacer.vue';

const props = defineProps<{
  id: string;
  noms: {[langue: string]: string};
  descriptions: {[langue: string]: string};
  auteurs?: utils.infoAuteur[];
}>();
const émettre = defineEmits<{
  (é: 'ajusterNoms', noms: {[lng: string]: string}): void;
  (é: 'ajusterDescriptions', noms: {[lng: string]: string}): void;
  (é: 'effacer'): void;
  (é: 'copier'): void;
}>();

const constl = inject<client.ClientConstellation>('constl');

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

// Effacer objet
const effacer = async () => {
  émettre('effacer');
  dialogue.value = false;
};

// Copier objet
const copier = async () => {
  émettre('copier');
  dialogue.value = false;
};
</script>
