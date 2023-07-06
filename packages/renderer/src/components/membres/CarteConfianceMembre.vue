<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
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
        <v-btn
          variant="flat"
          @click="dialogue = false"
        >
          {{ t('communs.fermer') }} <v-icon end>mdi-close</v-icon>
        </v-btn>
        <v-btn
          variant="outlined"
          color="primary"
          :disabled="statutRelation === statutRelationSélectionné"
          @click="sauvegarder"
        >
          {{ t('communs.sauvegarder') }} <v-icon end>mdi-check</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {réseau} from '@constl/ipa';
import type {client} from '@constl/ipa';

import {computed, inject, ref, watchEffect} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';

import {useDisplay} from 'vuetify';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import JetonMembre from './JetonMembre.vue';

const props = defineProps<{
  id: string;
}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

// Statut relation
const fiables = ref<string[]>();
const bloqués = ref<réseau.infoBloqué[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreBloqués({
    f: x => (bloqués.value = x),
  }),
);
enregistrerÉcoute(
  constl?.réseau?.suivreFiables({
    f: x => (fiables.value = x),
  }),
);

const statutRelation = computed<'fiable' | 'bloquéPrivé' | 'bloquéPublique' | 'inconnu'>(() => {
  if (fiables.value?.includes(props.id)) {
    return 'fiable';
  } else {
    const bloqué = bloqués.value?.find(b => b.idBdCompte === props.id);
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
      await constl?.réseau?.faireConfianceAuMembre({idBdCompte: props.id});
      break;
    case 'bloquéPublique':
    case 'bloquéPrivé':
      await constl?.réseau?.bloquerMembre({
        idBdCompte: props.id,
        privé: statutRelationSélectionné.value === 'bloquéPrivé',
      });
      break;
    case 'inconnu':
      if (statutRelation.value === 'fiable') {
        await constl?.réseau?.nePlusFaireConfianceAuMembre({
          idBdCompte: props.id,
        });
      } else {
        await constl?.réseau?.débloquerMembre({
          idBdCompte: props.id,
        });
      }
      break;
    default:
      break;
  }
};
</script>
