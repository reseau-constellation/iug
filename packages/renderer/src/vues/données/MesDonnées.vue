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
            v-model="texteRecherche"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
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
                <CarteMotClef
                  v-for="motClef in mesMotsClefs"
                  :id="motClef"
                  :key="motClef"
                >
                  <template #activator="{props}">
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
                    <CarteVariable
                      v-for="variable in mesVariables"
                      :id="variable"
                      :key="variable"
                    >
                      <template #activator="{props}">
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
                    <CarteBd
                      v-for="bd in mesBds"
                      :id="bd"
                      :key="bd"
                    >
                      <template #activator="{props}">
                        <ItemBd
                          v-bind="props"
                          :id="bd"
                        />
                      </template>
                    </CarteBd>
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
                    <CarteProjet
                      v-for="projet in mesProjets"
                      :id="projet"
                      :key="projet"
                    >
                      <template #activator="{props}">
                        <ItemProjet
                          v-bind="props"
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
                    <CarteNuée
                      v-for="nuée in mesNuées"
                      :id="nuée"
                      :key="nuée"
                    >
                      <template #activator="{props}">
                        <ItemNuée
                          v-bind="props"
                          :id="nuée"
                        />
                      </template>
                    </CarteNuée>
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
import {ref, inject} from 'vue';

import type {client, utils} from '@constl/ipa';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserImagesDéco} from '/@/composables/images';

import TitrePage from '../../components/communs/TitrePage.vue';
import NouvelleBd from '/@/components/bds/NouvelleBd.vue';
import NouveauMotClef from '/@/components/motsClefs/NouveauMotClef.vue';
import NouvelleNuée from '/@/components/nuées/NouvelleNuée.vue';
import NouveauProjet from '/@/components/projets/NouveauProjet.vue';
import NouvelleVariable from '/@/components/variables/NouvelleVariable.vue';
import ItemMotClef from '/@/components/motsClefs/ItemMotClef.vue';
import {enregistrerRecherche, enregistrerÉcoute} from '/@/components/utils';
import CarteMotClef from '/@/components/motsClefs/CarteMotClef.vue';
import CarteVariable from '/@/components/variables/CarteVariable.vue';
import ItemVariable from '/@/components/variables/ItemVariable.vue';
import CarteBd from '/@/components/bds/CarteBd.vue';
import ItemBd from '/@/components/bds/ItemBd.vue';
import CarteProjet from '/@/components/projets/CarteProjet.vue';
import ItemProjet from '/@/components/projets/ItemProjet.vue';
import CarteNuée from '/@/components/nuées/CarteNuée.vue';
import ItemNuée from '/@/components/nuées/ItemNuée.vue';

const constl = inject<client.ClientConstellation>('constl');

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
    icône: 'mdi-account-group-outline',
    texte: t('pages.mesDonnées.nuées'),
    clef: 'nuées',
  },
];

// Mots-clefs
const mesMotsClefs = ref<string[]>();
enregistrerÉcoute(
  constl?.motsClefs?.suivreMotsClefs({
    f: x => (mesMotsClefs.value = x),
  }),
);

// Variables
const mesVariables = ref<string[]>();
enregistrerÉcoute(
  constl?.variables?.suivreVariables({
    f: x => (mesVariables.value = x),
  }),
);

// Bds
const mesBds = ref<string[]>();
enregistrerÉcoute(
  constl?.bds?.suivreBds({
    f: x => (mesBds.value = x),
  }),
);

// Projets
const mesProjets = ref<string[]>();
enregistrerÉcoute(
  constl?.projets?.suivreProjets({
    f: x => (mesProjets.value = x),
  }),
);

// Nuées
const mesNuées = ref<string[]>();
enregistrerÉcoute(
  constl?.nuées?.suivreNuées({
    f: x => (mesNuées.value = x),
  }),
);

// Recherche
const texteRecherche = ref<string>();
const résulatsRecherche =
  ref<
    utils.résultatRecherche<
      utils.infoRésultatTexte | utils.infoRésultatRecherche<utils.infoRésultatTexte>
    >[]
  >();
enregistrerRecherche({
  requète: texteRecherche,
  réfRésultat: résulatsRecherche,
  fRecherche: async ({requète, nOuProfondeur, réfRésultat}) => {
    return await constl?.recherche?.rechercherBdSelonTexte({
      texte: requète,
      f: x => (réfRésultat.value = x),
      nRésultatsDésirés: nOuProfondeur,
    });
  },
});
</script>
