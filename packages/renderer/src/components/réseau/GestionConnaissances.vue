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
          {{ t('réseau.connaissances.titreCarte') }}
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <v-tabs v-model="onglet">
          <v-tab
            value="confiance"
            append-icon="mdi-hands-pray"
          >
            {{ t('membres.confiance.membresDeConfiance') }}
          </v-tab>
          <v-tab
            value="bloqué"
            append-icon="mdi-cancel"
          >
            {{ t('membres.confiance.membresBloqués') }}
          </v-tab>
        </v-tabs>
        <v-window v-model="onglet">
          <v-window-item value="confiance">
            <v-list>
              <selecteur-membre
                :multiples="true"
                :interdits="idMonCompte ? [idMonCompte] : []"
                :originales="confiance?.map(c => c.idCompte)"
                @selectionnee="ids => (nouvellesDeConfiance = ids)"
              >
              </selecteur-membre>
              <item-membre
                v-for="c in confiance"
                :key="c.idCompte"
                :compte="c.idCompte"
                montrer-anonymes
              >
                <template #append>
                  <v-btn
                    icon="mdi-delete"
                    @click="() => nePlusFaireConfiance(c.idCompte)"
                  />
                </template>
              </item-membre>
            </v-list>
          </v-window-item>
          <v-window-item value="bloqué">
            <v-list>
              <selecteur-membre
                :multiples="false"
                :interdits="idMonCompte ? [idMonCompte] : []"
                :originales="bloqués?.map(c => c.idCompte)"
                @selectionnee="ids => (nouvellesBloquées = ids)"
              >
              </selecteur-membre>
              <v-checkbox
                v-model="bloquerNouveauxPrivé"
                color="primary"
              >
                <template #label>
                  {{ t('membres.confiance.bloquerPrivé') }}
                  <v-tooltip location="bottom">
                    <template #activator="{props: propsActivateur}">
                      <v-icon
                        v-bind="propsActivateur"
                        icon="mdi-information-outline"
                        end
                      />
                    </template>
                    {{ t('membres.confiance.indiceBloquerPrivé') }}
                  </v-tooltip>
                </template>
              </v-checkbox>
              <item-membre
                v-for="b in bloqués"
                :key="b.idCompte"
                :compte="b.idCompte"
                montrer-anonymes
              >
                <template #append>
                  <v-switch
                    :label="t('privé')"
                    :value="b.privé"
                    @update:model-value="
                      b.privé ? bloquerPublique(b.idCompte) : bloquerPrivé(b.idCompte)
                    "
                  />
                  <v-btn
                    icon="mdi-delete"
                    @click="() => débloquer(b.idCompte)"
                  />
                </template>
              </item-membre>
            </v-list>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="outlined"
          @click="fermer"
        >
          {{ t('communs.annuler') }}
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          append-icon="mdi-check"
          @click="sauvegarder"
        >
          {{ t('communs.sauvegarder') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {ref} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {useDisplay} from 'vuetify/lib/framework.mjs';
import ItemMembre from '../membres/ItemMembre.vue';
import {utiliserConstellation} from '../utils';
import SelecteurMembre from '/@/components/membres/SélecteurMembre.vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

const constl = utiliserConstellation();

const dialogue = ref(false);
const onglet = ref<'confiance' | 'bloqué'>();

const idMonCompte = suivre(constl.suivreIdCompte, {});
const confiance = suivre(constl.réseau.suivreRelationsImmédiates, {});
const bloqués = suivre(constl.réseau.suivreBloqués, {});

const nouvellesDeConfiance = ref<string[]>([]);
const nouvellesBloquées = ref<string[]>([]);
const bloquerNouveauxPrivé = ref(false);

const débloquer = async (idCompte: string) => {
  constl.réseau.débloquerMembre({idCompte});
};

const bloquerPrivé = async (idCompte: string) => {
  constl.réseau.bloquerMembre({idCompte, privé: true});
};

const bloquerPublique = async (idCompte: string) => {
  constl.réseau.bloquerMembre({idCompte, privé: false});
};

const nePlusFaireConfiance = async (idCompte: string) => {
  constl.réseau.nePlusFaireConfianceAuMembre({idCompte});
};

const sauvegarder = async () => {
  await Promise.all(
    nouvellesDeConfiance.value.map(c => constl.réseau.faireConfianceAuMembre({idCompte: c})),
  );
  await Promise.all(
    nouvellesBloquées.value.map(b =>
      constl.réseau.bloquerMembre({idCompte: b, privé: bloquerNouveauxPrivé.value}),
    ),
  );
};

const fermer = () => {
  nouvellesDeConfiance.value = [];
  nouvellesBloquées.value = [];
  dialogue.value = false;
};
</script>
