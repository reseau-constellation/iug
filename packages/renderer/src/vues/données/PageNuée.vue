<template>
  <v-container>
    <TitrePage :titre="nomTraduit || couper(id, 50, t('communs.troisPetitsPoints'))" />
    <p>{{ id }}</p>
    <generer-appli :id-nuee="id">
      <template #activator="{props: propsActivateurCarte}">
        <v-tooltip
          :text="t('code.générerAppli.indice')"
          :open-delay="200"
          location="bottom"
        >
          <template #activator="{props: propsActivateurIndice}">
            <v-btn
              v-bind="{...propsActivateurCarte, ...propsActivateurIndice}"
              variant="flat"
              icon
            >
              <v-icon
                icon="mdi-creation-outline"
                color="primary"
              ></v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
    </generer-appli>
    <carte-code-nuee :id="id">
      <template #activator="{props: propsActivateurCarte}">
        <v-tooltip
          :text="t('code.indice')"
          :open-delay="200"
          location="bottom"
        >
          <template #activator="{props: propsActivateurIndice}">
            <v-btn
              v-bind="{...propsActivateurCarte, ...propsActivateurIndice}"
              icon="mdi-xml"
              variant="flat"
            />
          </template>
        </v-tooltip>
      </template>
    </carte-code-nuee>
  </v-container>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import {constellation, écouter} from '/@/components/utils';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {couper} from '/@/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import TitrePage from '/@/components/communs/TitrePage.vue';
import GenererAppli from '/@/components/nuées/GénérerAppli.vue';
import CarteCodeNuee from '/@/components/nuées/CarteCodeNuée.vue';

import {utiliserHistoriqueDocuments} from '/@/état/historiqueDocuments';

const props = defineProps<{id: string}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const historiqueDocuments = utiliserHistoriqueDocuments();

onMounted(() => {
  historiqueDocuments.documentOuvert({id: props.id, à: Date.now()});
});

// Nom de la nuée
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = écouter(constl.nuées.suivreNomsNuée, {idNuée: props.id}, {});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);
</script>
