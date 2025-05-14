<template>
  <div class="text-center">
    <TitrePage
      :titre="t('pages.mesDonnées.titre')"
      :image="imgDonnées"
    />
    <v-container class="pt-0">
      <v-card variant="flat">
        <v-card-text class="pt-0">
          <v-text-field
            v-model="requête"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            clearable
            color="primary"
            :loading="onTravaille"
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
              {{ t(item.texte) }}
            </v-chip>
          </v-chip-group>

          <v-window v-model="typeDonnées">
            <v-window-item :key="0">
              <v-list class="text-start">
                <NouveauMotClef>
                  <template #activateur="{props}">
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
                <CarteMotClef
                  v-for="motClef in mesMotsClefs"
                  :id="motClef"
                  :key="motClef"
                >
                  <template #activateur="{props}">
                    <ItemMotClef
                      v-bind="props"
                      :id="motClef"
                    />
                  </template>
                </CarteMotClef>
              </v-list>
            </v-window-item>
            <v-window-item :key="1">
              <v-card>
                <v-card-text>
                  <v-list class="text-start">
                    <NouvelleVariable>
                      <template #activateur="{props}">
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
                    <CarteVariable
                      v-for="variable in mesVariables"
                      :id="variable"
                      :key="variable"
                    >
                      <template #activateur="{props}">
                        <ItemVariable
                          v-bind="props"
                          :id="variable"
                        />
                      </template>
                    </CarteVariable>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-window-item>
            <v-window-item :key="2">
              <v-card>
                <v-card-text>
                  <v-list class="text-start">
                    <NouvelleBd>
                      <template #activateur="{props}">
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
                    <CarteBd
                      v-for="bd in résultatsRechercheBds"
                      :id="bd.id"
                      :key="bd.id"
                    >
                      <template #activateur="{props}">
                        <ResultatRechercheBd
                          v-bind="props"
                          :résultat="bd"
                        />
                      </template>
                    </CarteBd>
                    <v-skeleton-loader
                      v-if="onTravaille && !résultatsRechercheBds?.length"
                      type="list-item-two-line@4"
                    />
                  </v-list>
                </v-card-text>
              </v-card>
            </v-window-item>
            <v-window-item :key="3">
              <v-card>
                <v-card-text>
                  <v-list class="text-start">
                    <NouveauProjet>
                      <template #activateur="{props}">
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
                    <CarteProjet
                      v-for="projet in mesProjets"
                      :id="projet"
                      :key="projet"
                    >
                      <template #activateur="{props: propsActivateur}">
                        <ItemProjet
                          v-bind="propsActivateur"
                          :id="projet"
                        />
                      </template>
                    </CarteProjet>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-window-item>
            <v-window-item :key="4">
              <v-card>
                <v-card-text>
                  <v-list class="text-start">
                    <nouvelle-nuee>
                      <template #activateur="{props}">
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
                    </nouvelle-nuee>
                    <carte-nuee
                      v-for="nuée in mesNuées"
                      :id="nuée"
                      :key="nuée"
                    >
                      <template #activateur="{props}">
                        <item-nuee
                          v-bind="props"
                          :id="nuée"
                        />
                      </template>
                    </carte-nuee>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import {rechercher, suivre} from '@constl/vue';
import {ref} from 'vue';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserImagesDéco} from '/@/composables/images';

import CarteBd from '/@/components/bds/CarteBd.vue';
import NouvelleBd from '/@/components/bds/NouvelleBd.vue';
import TitrePage from '/@/components/communs/TitrePage.vue';
import CarteMotClef from '/@/components/motsClefs/CarteMotClef.vue';
import ItemMotClef from '/@/components/motsClefs/ItemMotClef.vue';
import NouveauMotClef from '/@/components/motsClefs/NouveauMotClef.vue';
import CarteNuee from '/@/components/nuées/CarteNuée.vue';
import ItemNuee from '/@/components/nuées/ItemNuée.vue';
import NouvelleNuee from '/@/components/nuées/NouvelleNuée.vue';
import CarteProjet from '/@/components/projets/CarteProjet.vue';
import ItemProjet from '/@/components/projets/ItemProjet.vue';
import NouveauProjet from '/@/components/projets/NouveauProjet.vue';
import ResultatRechercheBd from '/@/components/recherche/RésultatRechercheBd.vue';
import {utiliserConstellation} from '/@/components/utils';
import CarteVariable from '/@/components/variables/CarteVariable.vue';
import ItemVariable from '/@/components/variables/ItemVariable.vue';
import NouvelleVariable from '/@/components/variables/NouvelleVariable.vue';

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const {obtImageDéco} = utiliserImagesDéco();

const imgDonnées = obtImageDéco('logoBD');

// Sélection
const itemsTypesDonnées: {icône: string; texte: string; clef: string}[] = [
  {
    icône: 'mdi-key',
    texte: 'pages.mesDonnées.motsClefs',
    clef: 'motsClefs',
  },
  {
    icône: 'mdi-variable',
    texte: 'pages.mesDonnées.variables',
    clef: 'variables',
  },
  {
    icône: 'mdi-database-outline',
    texte: 'pages.mesDonnées.bds',
    clef: 'bds',
  },
  {
    icône: 'mdi-folder-outline',
    texte: 'pages.mesDonnées.projets',
    clef: 'projets',
  },
  {
    icône: 'mdi-account-group-outline',
    texte: 'pages.mesDonnées.nuées',
    clef: 'nuées',
  },
];
const typeDonnées = ref(itemsTypesDonnées.findIndex(x => x.clef === 'bds'));

// Mots-clefs
const mesMotsClefs = suivre(constl.motsClefs.suivreMotsClefs);

// Variables
const mesVariables = suivre(constl.variables.suivreVariables);

// Projets
const mesProjets = suivre(constl.projets.suivreProjets);

// Nuées
const mesNuées = suivre(constl.nuées.suivreNuées);

// Recherche
const requête = ref('');
const {résultats: résultatsRechercheBds, onTravaille} = rechercher(
  constl.recherche.rechercherBdsSelonTexte,
  {
    texte: requête,
    toutLeRéseau: false,
  },
);
</script>
