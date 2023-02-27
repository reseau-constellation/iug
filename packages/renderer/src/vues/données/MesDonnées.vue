<template>
  <div class="text-center">
    <TitrePage
      :titre="t('pages.mesDonnées.titre')"
      :image="imgDonnées"
    />
    <v-chip-group
      v-model="typeDonnées"
      color="primary"
      mandatory
    >
      <v-chip
        v-for="item in itemsTypesDonnées"
        :key="item.clef"
        class="mx-2"
        variant="outlined"
        :prepend-icon="item.icône"
      >
        {{ item.texte }}
      </v-chip>
    </v-chip-group>

    <v-window v-model="typeDonnées">
      <v-window-item :key="0">
        <v-card>
          <v-card-text>
            <v-list class="text-start">
              <NouveauMotClef>
                <template #activator="{props}">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon>mdi-plus</v-icon>
                    </template>
                    <v-list-item-title>
                      {{ t('pages.mesDonnées.nouveauMotClef') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider class="mb-2" />
                </template>
              </NouveauMotClef>
              <ItemMotClef
                v-for="motClef in mesMotsClefs"
                :id="motClef"
                :key="motClef"
              />
            </v-list>
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item :key="1">
        <v-card>
          <v-card-text>
            <v-list class="text-start">
              <NouvelleVariable>
                <template #activator="{props}">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon>mdi-plus</v-icon>
                    </template>
                    <v-list-item-title>
                      {{ t('pages.mesDonnées.nouvelleVariable') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider />
                </template>
              </NouvelleVariable>
            </v-list>
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item :key="2">
        <v-card>
          <v-card-text>
            <v-list class="text-start">
              <NouvelleBd>
                <template #activator="{props}">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon>mdi-plus</v-icon>
                    </template>
                    <v-list-item-title>
                      {{ t('pages.mesDonnées.nouvelleBd') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider />
                </template>
              </NouvelleBd>
            </v-list>
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item :key="3">
        <v-card>
          <v-card-text>
            <v-list class="text-start">
              <NouveauProjet>
                <template #activator="{props}">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon>mdi-plus</v-icon>
                    </template>
                    <v-list-item-title>
                      {{ t('pages.mesDonnées.nouveauProjet') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider />
                </template>
              </NouveauProjet>
            </v-list>
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item :key="4">
        <v-card>
          <v-card-text>
            <v-list class="text-start">
              <NouvelleNuée>
                <template #activator="{props}">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon>mdi-plus</v-icon>
                    </template>
                    <v-list-item-title>
                      {{ t('pages.mesDonnées.nouvelleNuée') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider />
                </template>
              </NouvelleNuée>
            </v-list>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import {ref, inject, onMounted, onUnmounted} from 'vue';

import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {schémaFonctionOublier} from '@constl/ipa/dist/src/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserImagesDéco} from '/@/composables/images';

import TitrePage from '../../components/communs/TitrePage.vue';
import NouvelleBd from '/@/components/bds/NouvelleBd.vue';
import NouveauMotClef from '/@/components/motsClefs/NouveauMotClef.vue';
import NouvelleNuée from '/@/components/nuées/NouvelleNuée.vue';
import NouveauProjet from '/@/components/projets/NouveauProjet.vue';
import NouvelleVariable from '/@/components/variables/NouvelleVariable.vue';
import ItemMotClef from '/@/components/motsClefs/ItemMotClef.vue';

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const {obtImageDéco} = utiliserImagesDéco();

const imgDonnées = obtImageDéco('logoBD');

// Sélection
const typeDonnées = ref(0);
const itemsTypesDonnées: {icône: string; texte: string; clef: string}[] = [
  {
    icône: 'mdi-key',
    texte: t('pages.mesDonnées.motsClefs'),
    clef: 'motsClefs',
  },
  {
    icône: 'mdi-variable',
    texte: t('pages.mesDonnées.variables'),
    clef: 'variables',
  },
  {
    icône: 'mdi-database-outline',
    texte: t('pages.mesDonnées.bds'),
    clef: 'bds',
  },
  {
    icône: 'mdi-folder-outline',
    texte: t('pages.mesDonnées.projets'),
    clef: 'projets',
  },
  {
    icône: 'mdi-bird',
    texte: t('pages.mesDonnées.nuées'),
    clef: 'nuées',
  },
];

// Mots-clefs
const mesMotsClefs = ref<string[]>();
let oublierMesMotsClefs: schémaFonctionOublier | undefined = undefined;
onMounted(async () => {
  oublierMesMotsClefs = await constl?.motsClefs?.suivreMotsClefs({
    f: x => (mesMotsClefs.value = x),
  });
});
onUnmounted(async () => {
  if (oublierMesMotsClefs) await oublierMesMotsClefs();
});
</script>
