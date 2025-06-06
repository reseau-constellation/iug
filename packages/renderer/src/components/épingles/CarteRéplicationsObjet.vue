<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      :max-width="mdAndUp ? 700 : 300"
      class="mx-auto"
    >
      <v-card-item>
        <v-card-title class="d-flex align-center">
          {{ t('réplications.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            variant="flat"
            size="small"
            @click="dialogue = false"
          />
        </v-card-title>
        <v-card-subtitle class="d-flex">
          {{ t('réplications.sousTitre') }}
        </v-card-subtitle>
      </v-card-item>
      <v-divider />
      <v-card-text style="overflow-y: scroll">
        <v-list>
          <p class="mb-0 text-h6">
            {{ t('réplications.répliquéPar') }}
          </p>
          <v-list-group>
            <template #activator="{props: propsActivateur}">
              <v-list-item
                v-bind="propsActivateur"
                lines="two"
              >
                <template #prepend>
                  <v-avatar class="text-h3">{{ nDispositifsFormatté }}</v-avatar>
                </template>
                <v-list-item-title>
                  {{ t('réplications.dispositifs', nDispositifs) }}
                  <v-icon end>mdi-monitor-cellphone</v-icon>
                </v-list-item-title>
                <v-list-item-subtitle class="text-success font-weight-bold">
                  {{ t('réplications.enLigne', {n: nDispositifsEnLigne}) }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-list-group>
          <p class="mb-0 text-h6">
            {{ t('réplications.représentant') }}
          </p>
          <v-list-group>
            <template #activator="{props: propsActivateur}">
              <v-list-item
                v-bind="propsActivateur"
                lines="two"
              >
                <template
                  v-if="membres"
                  #prepend
                >
                  <v-avatar class="text-h3">
                    {{ nMembresFormatté }}
                  </v-avatar>
                </template>
                <v-list-item-title>
                  {{ t('réplications.membres') }}
                  <v-icon
                    icon="mdi-account"
                    end
                  />
                </v-list-item-title>
                <v-list-item-subtitle
                  v-if="membresEnLigne"
                  class="text-success font-weight-bold"
                >
                  {{ t('réplications.enLigne', {n: nMembresEnLigne}) }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>
            <item-membre
              v-for="m in membres"
              :key="m.infoMembre.idCompte"
              :compte="m.infoMembre.idCompte"
              :montrer-anonymes="true"
            />
          </v-list-group>
        </v-list>
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
import {rechercher} from '@constl/vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '../utils';

import {எண்களைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import ItemMembre from '/@/components/membres/ItemMembre.vue';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();
const {எண்ணை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);

// Réplications
const {résultats: réplications} = rechercher(constl.réseau.suivreRéplications, {
  idObjet: computed(() => props.id),
  profondeur: 10,
});

const dispositifs = computed(() => {
  return réplications.value?.dispositifs;
});
const nDispositifs = computed(() => dispositifs.value?.length || 0);
const nDispositifsFormatté = எண்ணை_வடிவூட்டு(nDispositifs);

const dispositifsEnLigne = computed(() => {
  return réplications.value?.dispositifs.filter(x => !x.dispositif.vuÀ);
});
const nDispositifsEnLigne = computed(() => dispositifsEnLigne.value?.length || 0);

const membres = computed(() => {
  return réplications.value?.membres;
});
const nMembres = computed(() => membres.value?.length || 0);
const nMembresFormatté = எண்ணை_வடிவூட்டு(nMembres);

const membresEnLigne = computed(() => {
  return réplications.value?.membres.filter(x => !x.vuÀ);
});
const nMembresEnLigne = computed(() => membresEnLigne.value?.length || 0);
</script>
