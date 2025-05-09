<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      :max-width="mdAndUp ? 500 : 300"
      class="mx-auto"
    >
      <v-card-item>
        <v-card-title>
          {{ t('membres.confiance.titreCarte') }}
        </v-card-title>
      </v-card-item>
      <v-card-text style="overflow-y: scroll">
        <p class="my-2">
          <jeton-membre :compte="id" />
        </p>
        {{ t('membres.confiance.question') }}
        <v-radio-group v-model="statutRelationSélectionné">
          <v-radio
            value="inconnu"
            class="my-2"
          >
            <template #label>
              <div>
                <p class="font-weight-bold">
                  <v-icon
                    icon="mdi-account-question-outline"
                    start
                    size="small"
                  ></v-icon>
                  {{ t('membres.confiance.inconnu') }}
                </p>
                <p class="text-medium-emphasis text-caption">
                  {{ t('membres.confiance.indiceInconnu') }}
                </p>
              </div>
            </template>
          </v-radio>
          <v-radio
            value="fiable"
            class="my-2"
            color="success"
          >
            <template #label>
              <div>
                <p class="font-weight-bold">
                  <v-icon
                    icon="mdi-account-check"
                    color="success"
                    start
                    size="small"
                  />
                  {{ t('membres.confiance.faireConfiance') }}
                </p>
                <p class="text-medium-emphasis text-caption">
                  {{ t('membres.confiance.indiceFaireConfiance') }}
                </p>
              </div>
            </template>
          </v-radio>
          <v-radio
            value="bloquéPublique"
            class="my-2"
            color="error"
          >
            <template #label>
              <div>
                <p class="font-weight-bold">
                  <v-icon
                    icon="mdi-account-cancel"
                    color="error"
                    size="small"
                    start
                  />
                  {{ t('membres.confiance.bloquerPublique') }}
                </p>
                <p class="text-medium-emphasis text-caption">
                  {{ t('membres.confiance.indiceBloquerPublique') }}
                </p>
              </div>
            </template>
          </v-radio>
          <v-radio
            value="bloquéPrivé"
            class="my-2"
            color="error"
          >
            <template #label>
              <div>
                <p class="font-weight-bold">
                  <v-icon
                    icon="mdi-account-cancel-outline"
                    color="error"
                    start
                    size="small"
                  />
                  {{ t('membres.confiance.bloquerPrivé') }}
                </p>
                <p class="text-medium-emphasis text-caption">
                  {{ t('membres.confiance.indiceBloquerPrivé') }}
                </p>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />

        <btn-annuler @click="dialogue = false" />
        <btn-sauvegarder
          :actif="statutRelation !== statutRelationSélectionné"
          @click="() => sauvegarder()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

import {utiliserConstellation} from '/@/components/utils';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import JetonMembre from './JetonMembre.vue';

import BtnAnnuler from '/@/components/communs/BtnAnnuler.vue';
import BtnSauvegarder from '/@/components/communs/BtnSauvegarder.vue';

const props = defineProps<{
  id: string;
}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

// Statut relation
const fiables = suivre(constl.réseau.suivreFiables);
const bloqués = suivre(constl.réseau.suivreBloqués);

const statutRelation = computed<'fiable' | 'bloquéPrivé' | 'bloquéPublique' | 'inconnu'>(() => {
  if (fiables.value?.includes(props.id)) {
    return 'fiable';
  } else {
    const bloqué = bloqués.value?.find(b => b.idCompte === props.id);
    if (bloqué) return bloqué.privé ? 'bloquéPrivé' : 'bloquéPublique';
    return 'inconnu';
  }
});
const statutRelationSélectionné = ref(statutRelation.value);
watchEffect(() => {
  statutRelationSélectionné.value = statutRelation.value;
});

const sauvegarder = async () => {
  switch (statutRelationSélectionné.value) {
    case 'fiable':
      await constl.réseau.faireConfianceAuMembre({idCompte: props.id});
      break;
    case 'bloquéPublique':
    case 'bloquéPrivé':
      await constl.réseau.bloquerMembre({
        idCompte: props.id,
        privé: statutRelationSélectionné.value === 'bloquéPrivé',
      });
      break;
    case 'inconnu':
      if (statutRelation.value === 'fiable') {
        await constl.réseau.nePlusFaireConfianceAuMembre({
          idCompte: props.id,
        });
      } else {
        await constl.réseau.débloquerMembre({
          idCompte: props.id,
        });
      }
      break;
    default:
      break;
  }
};
</script>
