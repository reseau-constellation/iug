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
        <v-card-title class="d-flex">
          <ImageProfil :id="id" />
          <span class="mx-4">{{ nomTraduit || t('membres.anonyme') }}</span>
          <JetonConfiance
            v-if="mdAndUp"
            :id="id"
            style-jeton="jeton"
          />
          <v-spacer />
          <LienObjet :id="id" />
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
        <v-skeleton-loader
          v-if="!contacts"
          type="chip@3"
        />
        <span v-else-if="contacts.length">
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
          class="text-center text-disabled"
        >
          {{ t('membres.aucunContact') }}
        </p>
        <division-carte
          :titre="t('membres.bds')"
          :en-attente="!bdsMembre"
        />
        <v-skeleton-loader
          v-if="!bdsMembre"
          type="chip@3"
        />
        <SérieJetons
          v-else-if="bdsMembre.length"
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
          class="text-center text-disabled"
        >
          {{ t('membres.aucuneBd') }}
        </p>

        <division-carte
          :titre="t('membres.projets')"
          :en-attente="!projetsMembre"
        />
        <v-skeleton-loader
          v-if="!projetsMembre"
          type="chip@3"
        />
        <SérieJetons
          v-else-if="projetsMembre.length"
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
          class="text-center text-disabled"
        >
          {{ t('membres.aucunProjet') }}
        </p>

        <division-carte
          :titre="t('membres.nuées')"
          :en-attente="!nuéesMembre"
        />
        <v-skeleton-loader
          v-if="!nuéesMembre"
          type="chip@3"
        />
        <SérieJetons
          v-else-if="nuéesMembre.length"
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
          class="text-center text-disabled"
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
import {suivre} from '@constl/vue';
import {ref} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '/@/components/utils';

import {useDisplay} from 'vuetify';
import CarteBd from '../bds/CarteBd.vue';
import DivisionCarte from '../communs/DivisionCarte.vue';
import ImageProfil from '../communs/ImageProfil.vue';
import LienObjet from '../communs/LienObjet.vue';
import JetonConfiance from './JetonConfiance.vue';
import JetonContactMembre from './JetonContactMembre.vue';
import MenuContactMembre from './MenuContactMembre.vue';
import ItemBd from '/@/components/bds/ItemBd.vue';
import JetonBd from '/@/components/bds/JetonBd.vue';
import SérieJetons from '/@/components/communs/SérieJetons.vue';
import ItemNuée from '/@/components/nuées/ItemNuée.vue';
import JetonNuée from '/@/components/nuées/JetonNuée.vue';
import ItemProjet from '/@/components/projets/ItemProjet.vue';
import JetonProjet from '/@/components/projets/JetonProjet.vue';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

// Nom
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = suivre(constl.profil.suivreNoms, {idCompte: props.id});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Contacts
const contacts = suivre(constl.profil.suivreContacts, {idCompte: props.id});

// Bds
const bdsMembre = suivre(constl.réseau.suivreBdsMembre, {idCompte: props.id});

// Projets
const projetsMembre = suivre(constl.réseau.suivreProjetsMembre, {idCompte: props.id});

// Nuées
const nuéesMembre = suivre(constl.réseau.suivreNuéesMembre, {idCompte: props.id});
</script>
