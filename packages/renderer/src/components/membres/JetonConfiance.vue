<template>
  <v-dialog
    v-if="id !== monCompte"
    v-model="dialogue"
  >
    <template #activator="{props: propsActivateur}">
      <v-chip
        v-bind="propsActivateur"
        label
        variant="outlined"
        size="small"
      >
        <template #prepend>
          <v-icon
            :color="couleurIcône"
            start
          >
            {{ icône }}
          </v-icon>
        </template>
        {{ messageConfiance }}
      </v-chip>
    </template>
    <v-card
      :width="mdAndUp ? 500 : 300"
      class="mx-auto"
    >
      <v-card-item>
        <v-card-title>
          {{ t('membres.confiance.titreCarte') }}
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <p class="my-2">
          <jeton-membre :compte="id" />
        </p>
        <v-radio-group
          v-model="statutRelationSélectionné"
          label="இந்த பயனாளருக்கு எந்த நம்பிக்கை கொடுக்க விரும்புகிறீர்கள்?"
        >
          <v-radio
            value="inconnu"
            class="my-2"
          >
            <template #label>
              <div>
                <p class="font-weight-bold">{{ t('membres.confiance.inconnu') }}</p>
                <p class="text-medium-emphasis text-caption">
                  {{ t('membres.confiance.indiceInconnu') }}
                </p>
              </div>
            </template>
          </v-radio>
          <v-radio
            value="fiable"
            class="my-2"
          >
            <template #label>
              <div>
                <p class="font-weight-bold">{{ t('membres.confiance.faireConfiance') }}</p>
                <p class="text-medium-emphasis text-caption">
                  {{ t('membres.confiance.indiceFaireConfiance') }}
                </p>
              </div>
            </template>
          </v-radio>
          <v-radio
            value="bloquéPublique"
            class="my-2"
          >
            <template #label>
              <div>
                <p class="font-weight-bold">{{ t('membres.confiance.bloquerPublique') }}</p>
                <p class="text-medium-emphasis text-caption">
                  {{ t('membres.confiance.indiceBloquerPublique') }}
                </p>
              </div>
            </template>
          </v-radio>
          <v-radio
            value="bloquéPrivé"
            class="my-2"
          >
            <template #label>
              <div>
                <p class="font-weight-bold">{{ t('membres.confiance.bloquerPrivé') }}</p>
                <p class="text-medium-emphasis text-caption">
                  {{ t('membres.confiance.indiceBloquerPrivé') }}
                </p>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-card-text>
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
  <v-chip
    v-else
    label
    variant="outlined"
    size="small"
  >
    <template #prepend>
      <v-icon
        :color="couleurIcône"
        start
      >
        {{ icône }}
      </v-icon>
    </template>
    {{ messageConfiance }}
  </v-chip>
</template>

<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {infoBloqué} from '@constl/ipa/dist/src/reseau';

import {computed, inject, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';
import JetonMembre from './JetonMembre.vue';

import {enregistrerÉcoute} from '/@/composables/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const props = defineProps<{
  id: string;
}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

// Mon compte
const monCompte = ref<string>();
enregistrerÉcoute(constl?.suivreIdBdCompte({f: id => (monCompte.value = id)}));

// Confiance
const confiance = ref(0);
enregistrerÉcoute(
  constl?.réseau?.suivreConfianceMonRéseauPourMembre({
    idBdCompte: props.id,
    f: x => (confiance.value = x),
    profondeur: 5,
  }),
);

// Message
const messageConfiance = computed(() => {
  if (confiance.value < 0) {
    return t('membres.confiance.bloqué');
  } else if (confiance.value === 0) {
    return t('membres.confiance.inconnu');
  } else if (confiance.value < 0.33) {
    return t('membres.confiance.peuDinteraction');
  } else if (confiance.value < 0.67) {
    return t('membres.confiance.interactionMoyenne');
  } else if (confiance.value < 1) {
    return t('membres.confiance.beaucoupDinteraction');
  } else if (confiance.value === 1) {
    return props.id === monCompte.value ? t('membres.moi') : t('membres.confiance.connaissance');
  } else {
    return '';
  }
});

// Icône
const icône = computed(() => {
  if (confiance.value < 0) {
    return 'mdi-cancel';
  } else {
    return props.id === monCompte.value ? 'mdi-check' : 'mdi-hands-pray';
  }
});
const couleurIcône = computed(() => {
  if (confiance.value < 0) {
    return 'error';
  } else if (confiance.value === 1) {
    return 'success';
  } else {
    return `rgba(22, 151, 246, ${0.1 + confiance.value * 0.9})`;
  }
});

// Statut relation
const fiables = ref<string[]>();
const bloqués = ref<infoBloqué[]>();
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
