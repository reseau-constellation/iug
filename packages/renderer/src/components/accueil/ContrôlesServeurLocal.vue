<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      class="mx-auto"
      :min-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex">
          {{ t('accueil.page.connectivité.serveurLocal.titre') }}
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
        <v-icon start>mdi-information-outline</v-icon>Vous pouvez activer l'accès au nœud local afin de pouvoir accéder Constellation à partir d'applications tièrces (par exemple, Python, R).
        <v-switch
          v-model="choixActif"
          :color="choixActif ? 'primary' : 'secondary'"
          :label="actif ? 'Accès activé' : 'Accès désactivé'"
        />
        <v-text-field
          v-model="choixPort"
          label="Port"
          variant="outlined"
        />
        <v-textarea
          v-if="codeSecret"
          v-model="codeSecret"
          label="Code secret"
          readonly
          variant="outlined"
          auto-grow
          :append-inner-icon="codeSecretCopié ? 'mdi-check' : 'mdi-content-copy'"
          @click:append-inner="()=>copierCodeSecret()"
        >
        </v-textarea>
        <v-btn
          :loading="miseÀJourEnCours"
          :disabled="choixPort === port"
          @click="() => démarrerServeur()"
        />
        <v-list>
          <v-list-item
            v-for="r in requêtes"
            :key="r"
          >
            {{ r }}
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed, ref, watch, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserServeurLocalConstellation} from '/@/components/utils';
import {copier} from '/@/utils';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

const serveurLocal = utiliserServeurLocalConstellation();

// Navigation
const dialogue = ref(false);

// Serveur local - statut
const statut = suivre(serveurLocal.suivreÉtatServeur.bind(serveurLocal));
const actif = computed(()=>statut.value?.état === 'actif');
const codeSecret = computed(() =>
  statut.value?.état === 'actif' ? statut.value.détails.codeSecret : undefined,
);
const port = computed(() =>
  statut.value?.état === 'actif' ? statut.value.détails.port : undefined,
);

const choixActif = ref(statut.value?.état === 'actif');
watchEffect(() => (choixActif.value = statut.value?.état === 'actif'));
const choixPort = ref(port.value);
watchEffect(() => (choixPort.value = port.value));


const miseÀJourEnCours = ref(false);
const démarrerServeur = async () => {
  if (statut.value?.état === 'actif' && choixPort.value === port.value) return;
  miseÀJourEnCours.value = true;
  await serveurLocal.initialiser(choixPort.value);
  miseÀJourEnCours.value = false;
};


watchEffect(async ()=>{
  if (choixActif.value) {
    await démarrerServeur();
  }
});

const codeSecretCopié  = ref(false);
const copierCodeSecret = async () => {
  await copier(codeSecret.value || '');
  codeSecretCopié.value = true;
};
watch(codeSecret, ()=>{
  codeSecretCopié.value = false;
});

// Serveur local - requêtes
const requêtes = suivre(serveurLocal.suivreRequêtesAuthServeur.bind(serveurLocal));
</script>
