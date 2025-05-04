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
        <v-card-title class="d-flex align-center">
          {{ t('bds.qualité.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          />
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <v-list>
          <v-list-item>
            <template #prepend>
              <v-avatar>
                <v-progress-circular
                  :model-value="(qualité?.total || 0) * 100"
                  :width="5"
                  :indeterminate="qualité?.total === undefined"
                  :color="couleurScore(qualité?.total).couleur"
                />
              </v-avatar>
            </template>
            <template #title>Score total</template>
          </v-list-item>
          <v-divider />
          <v-list-item>
            <template #prepend>
              <v-avatar>
                <v-progress-circular
                  :model-value="(qualité?.accès || 0) * 100"
                  :width="5"
                  :indeterminate="qualité?.accès === undefined"
                  :color="couleurScore(qualité?.accès).couleur"
                />
              </v-avatar>
            </template>
            <template #title>Accessibilité</template>
          </v-list-item>
          <dialogue-licence
            :licence="licenceBd"
            :licence-contenu="licenceContenuBd"
            :permission-modifier="!!monAutorisation"
          >
            <template #activator="{props: propsActivateur}">
              <v-list-item v-bind="propsActivateur">
                <template #prepend>
                  <v-avatar>
                    <v-progress-circular
                      v-if="qualité?.licence === undefined"
                      :width="5"
                      indeterminate
                      :color="couleurScore(qualité?.licence).couleur"
                    />
                    <v-icon
                      :icon="qualité?.licence ? 'mdi-check' : 'mdi-alert-circle-outline'"
                      :color="couleurScore(qualité?.licence).couleur"
                    />
                  </v-avatar>
                </template>
                <template #title>
                  {{
                    qualité?.licence === undefined
                      ? t('bds.qualité.rechercheLicence')
                      : qualité.licence
                        ? t('bds.qualité.licenceOuverte')
                        : t('bds.qualité.licenceNonReconnue')
                  }}
                </template>
              </v-list-item>
            </template>
          </dialogue-licence>
          <v-list-item>
            <template #prepend>
              <v-avatar>
                <v-progress-circular
                  :model-value="(qualité?.valide || 0) * 100"
                  :width="5"
                  :indeterminate="qualité?.valide === undefined"
                  :color="couleurScore(qualité?.valide).couleur"
                />
              </v-avatar>
            </template>
            <template #title>Validation données</template>
          </v-list-item>
          <v-list-item>
            <template #prepend>
              <v-avatar>
                <v-progress-circular
                  :model-value="(qualité?.couverture || 0) * 100"
                  :width="5"
                  :indeterminate="qualité?.couverture === undefined"
                  :color="couleurScore(qualité?.couverture).couleur"
                />
              </v-avatar>
            </template>
            <template #title>Couverture tests</template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import DialogueLicence from '../licences/DialogueLicence.vue';
import {utiliserConstellation} from '/@/components/utils';
import {couleurScore} from '/@/utils';

const {mdAndUp} = useDisplay();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const props = defineProps<{idBd: string}>();

const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);

// Qualité
const qualité = suivre(constl.bds.suivreQualitéBd, {idBd: computed(() => props.idBd)});

// Licence
const licenceBd = suivre(constl.bds.suivreLicenceBd, {idBd: computed(() => props.idBd)});
const licenceContenuBd = suivre(constl.bds.suivreLicenceContenuBd, {
  idBd: computed(() => props.idBd),
});

// Permissions
const monAutorisation = suivre(constl.suivrePermission, {idObjet: computed(() => props.idBd)});
</script>
