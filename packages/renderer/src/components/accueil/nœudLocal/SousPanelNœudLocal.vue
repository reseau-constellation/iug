<template>
  <v-card
    class="text-start"
    style="height: 100%"
  >
    <v-card-item>
      <v-card-title>
        <v-avatar><v-icon>mdi-transit-connection-horizontal</v-icon></v-avatar>
        {{ t('accueil.page.connectivité.serveurLocal.titre') }}
      </v-card-title>
    </v-card-item>
    <v-card-text>
      <v-list>
        <v-list-item>
          <div class="text-disabled"> Pour connecter Constellation à des applis externes. </div>
        </v-list-item>
        <v-list-item>
          <v-switch
            v-model="contrôleServeur"
            class="mx-2"
            density="compact"
            hide-details
            true-icon="mdi-check"
            false-icon="mdi-close"
            :color="contrôleServeur ? 'primary' : undefined"
            :readonly="changementEnCours"
            :loading="changementEnCours"
            :label="
              t(
                `accueil.page.connectivité.serveurLocal.${contrôleServeur ? 'activé' : 'désactivé'}`,
              )
            "
          />
        </v-list-item>
        <v-slide-y-transition>
          <v-list-item v-if="étatServeur?.état === 'actif'">
            <v-menu disabled>
              <template #activator="{props: propsActivateur}">
                <v-chip
                  v-bind="propsActivateur"
                  class="me-2 mb-2"
                  size="small"
                  prepend-icon="mdi-connection"
                  label
                  variant="outlined"
                >
                  Port : {{ étatServeur.détails.port }}
                </v-chip>
              </template>
              <v-list>
                <v-text-field
                  v-model="choixPort"
                  hide-details
                  density="compact"
                  variant="outlined"
                  @click.stop
                  @blur="() => peutêtreActualiserPort()"
                ></v-text-field>
              </v-list>
            </v-menu>
            <v-menu>
              <template #activator="{props: propsActivateur}">
                <v-chip
                  class="me-2 mb-2"
                  size="small"
                  v-bind="propsActivateur"
                  prepend-icon="mdi-key-outline"
                  label
                  variant="outlined"
                >
                  Voir code
                </v-chip>
              </template>
              <v-list @click.stop>
                <v-list-item>
                  <template #title>{{ étatServeur.détails.codeSecret }}</template>
                  <template #append>
                    <v-btn
                      :icon="codeCopié ? 'mdi-check' : 'mdi-content-copy'"
                      size="small"
                      variant="flat"
                      @click="copierCode"
                    ></v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item>
        </v-slide-y-transition>
        <v-list-item prepend-icon="mdi-lan">
          {{ t('accueil.page.connectivité.serveurLocal.requêtes', nRequêtes || 0) }}
        </v-list-item>
        <div class="text-center">
          <controles-serveur-local>
            <template #activator="{props: propsActivateur}">
              <v-btn
                v-bind="propsActivateur"
                class="mx-auto"
                variant="outlined"
                prepend-icon="mdi-toggle-switch-outline"
              >
                {{ t('accueil.page.connectivité.serveurLocal.gérer') }}
              </v-btn>
            </template>
          </controles-serveur-local>
        </div>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref} from 'vue';
import {utiliserServeurLocalConstellation} from '/@/components/utils';

import {watchEffect} from 'vue';
import ControlesServeurLocal from './ContrôlesNœudLocal.vue';
import {copier} from '/@/utils';

const serveurLocal = utiliserServeurLocalConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();

const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Contrôles
const contrôleServeur = ref(false);
const choixPort = ref<number>();

// Serveur local
const requêtesServeurLocal = suivre(serveurLocal.suivreRequêtesAuthServeur.bind(serveurLocal));
const nRequêtes = computed(() => requêtesServeurLocal.value?.length);

const étatServeur = suivre(serveurLocal.suivreÉtatServeur.bind(serveurLocal));

const codeCopié = ref(false);
const copierCode = async (code: string) => {
  await copier(code);
  codeCopié.value = true;
};

watchEffect(() => {
  contrôleServeur.value = étatServeur.value?.état === 'actif';
  codeCopié.value = false;
});

watchEffect(() => {
  if (étatServeur.value?.état === 'actif') {
    choixPort.value = étatServeur.value.détails.port;
  } else {
    choixPort.value = undefined;
  }
});

const changementEnCours = computed(() => {
  return contrôleServeur.value !== (étatServeur.value?.état === 'actif');
});

watchEffect(async () => {
  if (contrôleServeur.value && étatServeur.value?.état === 'fermé') {
    await serveurLocal.initialiser(choixPort.value);
  } else if (!contrôleServeur.value && étatServeur.value?.état === 'actif') {
    await serveurLocal.fermer();
  }
});

const peutêtreActualiserPort = async () => {
  if (
    choixPort.value &&
    étatServeur.value?.état === 'actif' &&
    choixPort.value !== étatServeur.value.détails.port
  ) {
    await serveurLocal.initialiser(choixPort.value);
  }
};
</script>
