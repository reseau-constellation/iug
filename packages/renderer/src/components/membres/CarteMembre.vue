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
          <ImageProfil :id="id" />
          <span class="mx-4">{{ nomTraduit || t('communs.anonyme') }}</span>
          <JetonConfiance
            v-if="mdAndUp"
            :id="id"
            style-jeton="jeton"
          />
        </v-card-title>
      </v-card-item>
      <v-card-text style="overflow-y: scroll">
        <JetonConfiance
          v-if="!mdAndUp"
          :id="id"
          style-jeton="jeton"
        />
        <division-carte
          :titre="t('membres.contacts')"
          :en-attente="!contacts"
        />
        <span v-if="contacts">
          <menu-contact-membre
            v-for="{type, contact} in contacts"
            :key="type"
            :type="type"
            :contact="contact"
          >
            <template #activator="{props: propsActivateur}">
              <jeton-contact-membre
                v-bind="propsActivateur"
                :type="type"
                :contact="contact"
                size="small"
              />
            </template>
          </menu-contact-membre>
        </span>
        <p
          v-else
          class="text-disabled"
        >
          {{ t('membres.aucunContact') }}
        </p>
        <division-carte
          :titre="t('membres.bds')"
          :en-attente="!bdsMembre"
        />
        <SérieJetons
          v-if="bdsMembre?.length"
          :items="bdsMembre"
          :n-max="2"
        >
          <template #jeton="{id: idBd}">
            <CarteBd :id="idBd">
              <template #activator="{props: propsActivateur}">
                <JetonBd
                  v-bind="propsActivateur"
                  :id="idBd"
                />
              </template>
            </CarteBd>
          </template>
          <template #itemListe="{id: idBd}">
            <CarteBd :id="idBd">
              <template #activator="{props: propsActivateur}">
                <ItemBd
                  v-bind="propsActivateur"
                  :id="idBd"
                  :montrer-anonymes="true"
                />
              </template>
            </CarteBd>
          </template>
        </SérieJetons>
        <p
          v-else
          class="text-disabled"
        >
          {{ t('membres.aucuneBd') }}
        </p>

        <division-carte
          :titre="t('membres.projets')"
          :en-attente="!projetsMembre"
        />
        <SérieJetons
          v-if="projetsMembre?.length"
          :items="projetsMembre"
          :n-max="5"
        >
          <template #jeton="{id: idProjet}">
            <JetonProjet :id="idProjet" />
          </template>
          <template #itemListe="{id: idProjet}">
            <ItemProjet
              :id="idProjet"
              :montrer-anonymes="true"
            />
          </template>
        </SérieJetons>
        <p
          v-else
          class="text-disabled"
        >
          {{ t('membres.aucunProjet') }}
        </p>

        <division-carte
          :titre="t('membres.nuées')"
          :en-attente="!nuéesMembre"
        />
        <SérieJetons
          v-if="nuéesMembre?.length"
          :items="nuéesMembre"
          :n-max="5"
        >
          <template #jeton="{id: idNuée}">
            <JetonNuée :id="idNuée" />
          </template>
          <template #itemListe="{id: idNuée}">
            <ItemNuée
              :id="idNuée"
              :montrer-anonymes="true"
            />
          </template>
        </SérieJetons>
        <p
          v-else
          class="text-disabled"
        >
          {{ t('membres.aucuneNuée') }}
        </p>
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
import type {client} from '@constl/ipa';

import {ref, inject} from 'vue';

import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import SérieJetons from '/@/components/communs/SérieJetons.vue';
import ItemBd from '/@/components/bds/ItemBd.vue';
import JetonBd from '/@/components/bds/JetonBd.vue';
import JetonProjet from '/@/components/projets/JetonProjet.vue';
import ItemProjet from '/@/components/projets/ItemProjet.vue';
import JetonNuée from '/@/components/nuées/JetonNuée.vue';
import ItemNuée from '/@/components/nuées/ItemNuée.vue';
import ImageProfil from '../communs/ImageProfil.vue';
import {useDisplay} from 'vuetify/lib/framework.mjs';
import DivisionCarte from '../communs/DivisionCarte.vue';
import JetonConfiance from './JetonConfiance.vue';
import CarteBd from '../bds/CarteBd.vue';
import JetonContactMembre from './JetonContactMembre.vue';
import MenuContactMembre from './MenuContactMembre.vue';

const props = defineProps<{id: string}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

// Nom
const {traduireNom} = utiliserLangues();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.profil?.suivreNoms({
    f: x => (noms.value = x),
  }),
);

// Contacts
const contacts = ref<{type: string; contact: string}[]>();
enregistrerÉcoute(
  constl?.profil?.suivreContacts({
    f: x => (contacts.value = x),
  }),
);

// Bds
const bdsMembre = ref<string[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreBdsMembre({
    idCompte: props.id,
    f: bds => (bdsMembre.value = bds),
  }),
);

// Projets
const projetsMembre = ref<string[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreProjetsMembre({
    idCompte: props.id,
    f: projets => (projetsMembre.value = projets),
  }),
);

// Nuées
const nuéesMembre = ref<string[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreNuéesMembre({
    idCompte: props.id,
    f: nuées => (nuéesMembre.value = nuées),
  }),
);
</script>
