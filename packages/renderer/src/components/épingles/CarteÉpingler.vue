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
      <v-divider />
      <v-card-text style="overflow-y: scroll">
        <p class="mb-0 text-overline"> {{}} </p>
        <v-radio-group
          v-model="typeDispositifs"
          :label="t('épingler.dispositifsÉpingle')"
        >
          <v-radio
            :label="t('épingler.aucun')"
            value="AUCUN"
          />
          <v-radio
            :label="t('épingler.tous')"
            value="TOUS"
          />
          <v-radio
            :label="t('épingler.installé')"
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
            :label="t('épingler.indiceSélectionnerDispositif')"
            density="compact"
            variant="outlined"
            multiple
            chips
            closable-chips
          >
            <template #chip="{props: propsActivateur, item}">
              <jeton-dispositif
                v-bind="propsActivateur"
                :id-dispositif="item.title"
              />
            </template>

            <template #item="{props: propsActivateur, item}">
              <item-dispositif
                v-bind="propsActivateur"
                :id-dispositif="item.title"
              />
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
              :label="t('épingler.aucun')"
              value="AUCUN"
            />
            <v-radio
              :label="t('épingler.tous')"
              value="TOUS"
            />
            <v-radio
              :label="t('épingler.installé')"
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
              :label="t('épingler.indiceSélectionnerDispositif')"
              hide-details
              chips
              closable-chips
              density="compact"
              variant="outlined"
              multiple
            >
              <template #chip="{props: propsActivateur, item}">
                <jeton-dispositif
                  v-bind="propsActivateur"
                  :id-dispositif="item.title"
                />
              </template>

              <template #item="{props: propsActivateur, item}">
                <item-dispositif
                  v-bind="propsActivateur"
                  :id-dispositif="item.title"
                />
              </template>
            </v-autocomplete>
          </v-expand-transition>
        </span>
      </v-card-text>
      <v-divider />
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
          :disabled="!prêtÀÉpingler || !valeursChangées"
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
import type {client} from '@constl/ipa';
import {type favoris} from '@constl/ipa';

import {inject, ref, computed, watch} from 'vue';
import {useDisplay} from 'vuetify';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {enregistrerÉcoute} from '/@/components/utils';

import JetonDispositif from '/@/components/membres/JetonDispositif.vue';
import ItemDispositif from '/@/components/membres/ItemDispositif.vue';

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

const constl = inject<client.ClientConstellation>('constl');

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
const statutFavoris = ref<favoris.ÉlémentFavoris>();
enregistrerÉcoute(
  constl?.favoris?.suivreÉtatFavori({
    id: props.id,
    f: statut => (statutFavoris.value = statut),
  }),
);

watch(statutFavoris, () => {
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
    typeDispositifs.value = 'AUCUN';
    // On laisse typeDispositifsFichiers avec "INSTALLÉ" par défaut
    typeDispositifsFichiers.value = 'INSTALLÉ';
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
const ilYEuChangement = computed<boolean>(() => {
  if (statutFavoris.value) {
    return (
      dispositifsSélectionnés.value !== statutFavoris.value.dispositifs ||
      dispositifsFichiers.value !== statutFavoris.value.dispositifsFichiers
    );
  } else {
    return typeDispositifs.value !== 'AUCUN';
  }
});
const prêtÀÉpingler = computed<boolean>(() => {
  const dispositifsPrêts =
    typeDispositifs.value === 'SPÉCIFIQUES' ? !!dispositifsSpécifiques.value.length : true;
  const dispositifsFichiersPrêts =
    typeDispositifsFichiers.value === 'SPÉCIFIQUES'
      ? !!dispositifsFichiersSpécifiques.value.length
      : true;
  return dispositifsPrêts && dispositifsFichiersPrêts && ilYEuChangement.value;
});
const valeursChangées = computed<boolean>(() => {
  if (!statutFavoris.value) return true;
  const {dispositifs, dispositifsFichiers} = statutFavoris.value;
  const dispositifsChangés = Array.isArray(dispositifs)
    ? new Set(dispositifs) !== new Set(dispositifsSpécifiques.value)
    : dispositifs !== typeDispositifs.value;
  const dispositifsFichiersChangés = Array.isArray(dispositifsFichiers)
    ? new Set(dispositifsFichiers) !== new Set(dispositifsFichiersSpécifiques.value)
    : dispositifsFichiers !== typeDispositifsFichiers.value;

  return dispositifsChangés || dispositifsFichiersChangés;
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
