<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props}">
      <slot
        name="activateur"
        v-bind="{props}"
      />
    </template>
    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex align-center">
          <span>
            {{ t('compte.exporterCompte.titre') }}
          </span>
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          />
        </v-card-title>
      </v-card-item>
      <v-divider />
      <v-card-text>
        <div class="text-center">
          <v-btn
            append-icon="mdi-download"
            variant="outlined"
            @click="exporterCompte"
          >
            {{ t('compte.exporterCompte.exporter') }}
          </v-btn>
        </div>
        <v-expand-transition>
          <v-alert
            v-if="erreurExportation"
            class="my-6"
            type="error"
            variant="outlined"
            :title="t('compte.exporterCompte.titreErreur')"
            :text="t('compte.exporterCompte.texteErreur')"
          />
        </v-expand-transition>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="outlined"
          @click="dialogue = false"
        >
          {{ t('communs.annuler') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {obt, suivre} from '@constl/vue';
import {ref} from 'vue';

import {மொழிகளைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {useDisplay} from 'vuetify';
import {utiliserConstellation} from '../utils';

const constl = utiliserConstellation();

const {mdAndUp} = useDisplay();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

// Navigation
const dialogue = ref(false);

// Contrôles
const mesNoms = suivre(constl.profil.suivreNoms, undefined, {});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(mesNoms);
const idDispositif = obt(constl.obtIdDispositif);

const erreurExportation = ref(false);

const exporterCompte = async () => {
  try {
    await constl.exporterDispositif({
      nomFichier: `${nomTraduit.value}-${idDispositif.value?.slice(-10)}-${Date.now()}.zip`,
    });
  } catch {
    erreurExportation.value = true;
  }
};
</script>
