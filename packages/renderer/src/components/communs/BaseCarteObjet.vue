<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      :max-width="mdAndUp ? 700 : smAndUp ? 500 : 300"
      class="mx-auto"
    >
      <v-card-item>
        <v-card-title class="d-flex">
          <v-avatar
            v-if="icone"
            class="mx-2"
            :icon="icone"
          ></v-avatar>
          <v-avatar
            v-else-if="image"
            class="mx-2"
          >
            <v-img :src="image" />
          </v-avatar>
          <DialogueNoms
            :indice-nom="t('objet.indiceNom')"
            :etiquette-nom="t('objet.étiquetteNom')"
            :indice-langue="t('objet.indiceLangue')"
            :texte-aucun-nom="t('objet.texteAucunNom')"
            :noms-initiaux="noms"
            :titre="t('objet.titreDialogueNoms')"
            :sous-titre="t('objet.sousTitreDialogueNoms')"
            :autorisation-modification="!!monAutorisation"
            @ajuster-noms="nms => émettre('ajusterNoms', nms)"
          >
            <template #activator="{props: propsActivateur}">
              <span
                v-bind="propsActivateur"
                class="text-h5"
              >
                <span v-if="noms">
                  {{ nom || t('communs.baseCarteObjet.sansNom') }}
                  <v-btn
                    :icon="monAutorisation ? 'mdi-pencil' : 'mdi-earth'"
                    variant="flat"
                    size="small"
                  ></v-btn>
                </span>
                <v-skeleton-loader
                  v-else
                  type="list-item"
                />
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
                <slot
                  name="epingler"
                  :activateur="ItemListeIconeEpingler"
                  :epingle="épinglé"
                >
                </slot>
                <CarteEpingler
                  :id="id"
                  :option-fichiers="fichiersEpinglables"
                >
                  <template #activator="{props: propsActivateur}">
                    <v-list-item v-bind="propsActivateur">
                      <template #prepend>
                        <IconeEpingle :id="id" />
                      </template>
                      <v-list-item-title>
                        {{ épinglé ? t('épingler.épinglé') : t('épingler.épingler') }}
                      </v-list-item-title>
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
        <span
          v-if="descriptions"
          :class="{'text-disabled': !description}"
        >
          {{ description || t('communs.baseCarteObjet.sansDescription') }}
        </span>
        <v-skeleton-loader
          v-else
          type="list-item"
        />
        <DialogueNoms
          :etiquette-nom="t('objet.étiquetteDescription')"
          :indice-nom="t('objet.indiceDescription')"
          :indice-langue="t('objet.indiceLangue')"
          :texte-aucun-nom="t('objet.texteAucuneDescription')"
          :noms-initiaux="descriptions"
          :titre="t('objet.titreDialogueDescriptions')"
          :sous-titre="t('objet.sousTitreDialogueDescriptions')"
          :autorisation-modification="!!monAutorisation"
          longue
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
          :id="id"
          :auteurs="auteurs"
          :permission-moderateur="monAutorisation === 'MODÉRATEUR'"
        >
          <template #activator="{props: propsActivateurAuteurs}">
            <v-chip
              v-bind="propsActivateurAuteurs"
              class="me-2"
              variant="outlined"
              prepend-icon="mdi-plus"
              size="small"
              label
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
        <slot name="pied"></slot>

        <v-btn
          v-if="sauvegardePossible && monAutorisation"
          variant="flat"
          color="primary"
          @click="sauvegarder"
        >
          {{ t('communs.sauvegarder') }}
        </v-btn>
        <v-btn
          variant="flat"
          append-icon="mdi-close"
          @click="dialogue = false"
        >
          {{ t('communs.fermer') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type {types} from '@constl/ipa';

import {suivre} from '@constl/vue';
import {computed, ref} from 'vue';

import {utiliserConstellation} from '/@/components/utils';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {useDisplay} from 'vuetify';

import IconeEpingle from '/@/components/épingles/IcôneÉpingle.vue';
import ItemListeIconeEpingler from '/@/components/épingles/ItemListeIcôneÉpingler.vue';

import AuteursObjet from './AuteursObjet.vue';
import CarteCopier from './CarteCopier.vue';
import CarteEffacer from './CarteEffacer.vue';
import DivisionCarte from './DivisionCarte.vue';
import GererAuteurs from './GererAuteurs.vue';
import LienObjet from './LienObjet.vue';
import DialogueNoms from './listeNoms/DialogueNoms.vue';

const props = defineProps<{
  id: string;
  noms?: {[langue: string]: string};
  descriptions?: {[langue: string]: string};
  image?: string | null;
  icone?: string;
  fichiersEpinglables: boolean;
  auteurs?: types.infoAuteur[];
  sauvegardePossible?: boolean;
}>();
const émettre = defineEmits<{
  (é: 'ajusterNoms', noms: {[lng: string]: string}): void;
  (é: 'ajusterDescriptions', noms: {[lng: string]: string}): void;
  (é: 'effacer'): void;
  (é: 'copier'): void;
  (é: 'sauvegarder'): void;
}>();

const constl = utiliserConstellation();

const {mdAndUp, smAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Navigation
const dialogue = ref(false);

// Autorisation
const monAutorisation = suivre(constl.suivrePermission, {idObjet: computed(() => props.id)});

// Nom
const nom = அகராதியிலிருந்து_மொழிபெயர்ப்பு(computed(() => props.noms));

// Description
const description = அகராதியிலிருந்து_மொழிபெயர்ப்பு(computed(() => props.descriptions));

// Épingles
const statutFavoris = suivre(constl.favoris.suivreÉtatFavori, {idObjet: computed(() => props.id)});
const épinglé = computed(() => !!statutFavoris.value);

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

// Sauvegarder
const sauvegarder = async () => {
  émettre('sauvegarder');
  dialogue.value = false;
};
</script>
