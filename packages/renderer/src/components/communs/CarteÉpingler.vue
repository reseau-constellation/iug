<template>
  <v-dialog
    v-model="dialogue"
    :width="mdAndUp ? 500 : 300"
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
          {{ t('épingler.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="fermer"
          >
          </v-btn>
        </v-card-title>
      </v-card-item>
      <v-card-text style="overflow-y: scroll">
        <p class="mb-0 text-overline">
          {{ t('épingler.dispositifsÉpingle') }}
        </p>
        <v-radio-group v-model="typeDispositifs">
          <v-radio
            :label="t('épingler.AUCUN')"
            value="AUCUN"
          />
          <v-radio
            :label="t('épingler.TOUS')"
            value="TOUS"
          />
          <v-radio
            :label="t('épingler.INSTALLÉ')"
            value="INSTALLÉ"
          />
          <v-radio
            :label="t('épingler.dispositifsSpécifiques')"
            value="SPÉCIFIQUES"
          />
        </v-radio-group>
        <v-expand-transition>
          <v-autocomplete
            v-show="typeDispositifs === 'SPÉCIFIQUES'"
            v-model="dispositifsSpécifiques"
            :items="dispositifs || []"
            :disabled="!dispositifs"
            :loading="!dispositifs"
            density="compact"
            variant="outlined"
            multiple
            chips
            closable-chips
          >
            <template #chip="{ props, item }">
              <v-chip
                v-bind="props"
                :prepend-avatar="item"
                :text="item"
              ></v-chip>
            </template>

            <template #item="{ props, item }">
              <v-list-item
                v-bind="props"
                :prepend-avatar="item?.raw?.avatar"
                :title="item?.raw?.name"
                :subtitle="item?.raw?.group"
              ></v-list-item>
            </template>
          </v-autocomplete>
        </v-expand-transition>
        <span v-if="optionFichiers">
          <p class="mb-0 text-overline">
            {{ t('épingler.dispositifsÉpingleFichier') }}
          </p>
          <v-radio-group
            v-model="typeDispositifsFichiers"
            :disabled="typeDispositifs === 'AUCUN'"
          >
            <v-radio
              :label="t('épingler.AUCUN')"
              value="AUCUN"
            />
            <v-radio
              :label="t('épingler.TOUS')"
              value="TOUS"
            />
            <v-radio
              :label="t('épingler.INSTALLÉ')"
              value="INSTALLÉ"
            />
            <v-radio
              :label="t('épingler.dispositifsSpécifiques')"
              value="SPÉCIFIQUES"
            />
          </v-radio-group>
          <v-expand-transition>
            <v-autocomplete
              v-show="typeDispositifsFichiers === 'SPÉCIFIQUES'"
              v-model="dispositifsFichiersSpécifiques"
              :items="dispositifs"
              hide-details
              chips
              deletable-chips
              density="compact"
              variant="outlined"
              multiple
            />
          </v-expand-transition>
        </span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          @click="fermer"
        >
          {{ t('communs.fermer') }}
          <v-icon
            icon="mdi-close"
            end
          />
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          :loading="enProgrès"
          :disabled="!prêtÀÉpingler"
          @click="() => épingler()"
        >
          {{ t('communs.sauvegarder') }}
          <v-icon
            icon="mdi-check"
            end
          />
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';

import {inject, ref} from 'vue';
import {useDisplay} from 'vuetify';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {enregistrerÉcoute} from '/@/composables/utils';
import {computed} from 'vue';
import {type favoris} from '@constl/ipa';
import {watchEffect} from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  optionFichiers: {
    type: Boolean,
    default: true,
  },
});

const constl = inject<ClientConstellation>('constl');

const {mdAndUp} = useDisplay();
const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Navigation
const dialogue = ref(false);

// Options
const typeDispositifs = ref<'AUCUN' | 'TOUS' | 'INSTALLÉ' | 'SPÉCIFIQUES'>('TOUS');
const typeDispositifsFichiers = ref<'AUCUN' | 'TOUS' | 'INSTALLÉ' | 'SPÉCIFIQUES'>('INSTALLÉ');

const dispositifsSpécifiques = ref<string[]>([]);
const dispositifsFichiersSpécifiques = ref<string[]>([]);

// Dispositifs
const dispositifs = ref<string[]>();
enregistrerÉcoute(
  constl?.suivreDispositifs({
    f: x => (dispositifs.value = x),
  }),
);

// Statut favoris
const statutFavoris = ref();
enregistrerÉcoute(
  constl?.favoris?.suivreÉtatFavori({
    id: props.id,
    f: statut => (statutFavoris.value = statut),
  }),
);

watchEffect(() => {
  if (statutFavoris.value) {
    if (
      typeof statutFavoris.value.dispositifs === 'string' &&
      ['TOUS', 'INSTALLÉ', 'AUCUN'].includes(statutFavoris.value.dispositifs)
    ) {
      typeDispositifs.value = statutFavoris.value.dispositifs as 'TOUS' | 'AUCUN' | 'INSTALLÉ';
    } else {
      typeDispositifs.value = 'SPÉCIFIQUES';
      dispositifsSpécifiques.value =
        typeof statutFavoris.value.dispositifs === 'string'
          ? [statutFavoris.value.dispositifs]
          : statutFavoris.value.dispositifs;
    }

    if (
      typeof statutFavoris.value.dispositifsFichiers === 'string' &&
      ['TOUS', 'INSTALLÉ', 'AUCUN'].includes(statutFavoris.value.dispositifsFichiers)
    ) {
      typeDispositifsFichiers.value = statutFavoris.value.dispositifsFichiers as
        | 'TOUS'
        | 'AUCUN'
        | 'INSTALLÉ';
    } else if (statutFavoris.value.dispositifsFichiers) {
      typeDispositifsFichiers.value = 'SPÉCIFIQUES';
      dispositifsFichiersSpécifiques.value =
        typeof statutFavoris.value.dispositifsFichiers === 'string'
          ? [statutFavoris.value.dispositifsFichiers]
          : statutFavoris.value.dispositifsFichiers;
    } else {
      typeDispositifsFichiers.value = 'AUCUN';
    }
  } else {
    // On laisse typeDispositifsFichiers avec "INSTALLÉ" par défaut
    typeDispositifs.value = 'AUCUN';
    dispositifsSpécifiques.value = [];
    dispositifsFichiersSpécifiques.value = [];
  }
});

// Contrôles
const dispositifsSélectionnés = computed<favoris.typeDispositifs | undefined>(() => {
  if (typeDispositifs.value === 'AUCUN') return undefined;
  return typeDispositifs.value === 'SPÉCIFIQUES'
    ? dispositifsSpécifiques.value
    : typeDispositifs.value;
});
const dispositifsFichiers = computed<favoris.typeDispositifs | undefined>(() => {
  if (typeDispositifsFichiers.value === 'AUCUN') return undefined;
  return typeDispositifsFichiers.value === 'SPÉCIFIQUES'
    ? dispositifsFichiersSpécifiques.value
    : typeDispositifsFichiers.value;
});
const prêtÀÉpingler = computed<boolean>(() => {
  const dispositifsPrêts =
    typeDispositifs.value === 'SPÉCIFIQUES' ? !!dispositifsSpécifiques.value.length : true;
  const dispositifsFichiersPrêts =
    typeDispositifsFichiers.value === 'SPÉCIFIQUES'
      ? !!dispositifsFichiersSpécifiques.value.length
      : true;
  return dispositifsPrêts && dispositifsFichiersPrêts;
});

// Sauvegarder
const enProgrès = ref(false);
const épingler = async () => {
  enProgrès.value = true;

  if (dispositifsSélectionnés.value) {
    const épingle: {
      id: string;
      dispositifs: favoris.typeDispositifs;
      dispositifsFichiers?: favoris.typeDispositifs;
      récursif: boolean;
    } = {
      id: props.id,
      dispositifs: dispositifsSélectionnés.value,
      récursif: true,
    };
    if (dispositifsFichiers.value) épingle.dispositifsFichiers = dispositifsFichiers.value;

    await constl?.favoris?.épinglerFavori(épingle);
  } else {
    await désépingler();
  }
  fermer();
};
const désépingler = async () => {
  await constl?.favoris?.désépinglerFavori({id: props.id});
};

// Fermer
const fermer = () => {
  dialogue.value = false;
  enProgrès.value = false;
};
</script>
