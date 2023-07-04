<template>
  <v-list-item
    :prepend-avatar="srcImgBd || imgDéfaut"
    :title="nomTraduit || t('bds.sansNom')"
    :subtitle="descrTraduite"
  >
    <série-jetons
      :n-max="3"
      :items="variables"
    >
      <template #jeton="{id: idVariable}">
        <carte-variable :id="idVariable">
          <template #activator="{props: propsActivateur}">
            <JetonVariable
              v-bind="propsActivateur"
              :id="idVariable"
              size="small"
            />
          </template>
        </carte-variable>
      </template>
      <template #itemListe="{id: idVariable}">
        <carte-variable :id="idVariable">
          <template #activator="{props: propsActivateur}">
            <ItemVariable
              v-bind="propsActivateur"
              :id="idVariable"
            />
          </template>
        </carte-variable>
      </template>
    </série-jetons>
  </v-list-item>
</template>
<script setup lang="ts">
import type {client} from '@constl/ipa';
import {ref, inject, computed} from 'vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import JetonVariable from '/@/components/variables/JetonVariable.vue';
import SérieJetons from '/@/components/communs/SérieJetons.vue';
import CarteVariable from '/@/components/variables/CarteVariable.vue';
import ItemVariable from '../variables/ItemVariable.vue';

const props = defineProps<{id: string}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Nom de la Bd
const {traduireNom} = utiliserLangues();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.bds?.suivreNomsBd({
    id: props.id,
    f: x => (noms.value = x),
  }),
);

// Description de la Bd
const descriptions = ref<{[lng: string]: string}>({});
const descrTraduite = traduireNom(descriptions);

enregistrerÉcoute(
  constl?.bds?.suivreDescrBd({
    id: props.id,
    f: x => (noms.value = x),
  }),
);

// Image
const imageBd = ref<Uint8Array | null>();
const srcImgBd = computed(() => {
  if (imageBd.value) {
    return URL.createObjectURL(new Blob([imageBd.value], {type: 'image'}));
  } else {
    return undefined;
  }
});
enregistrerÉcoute(
  constl?.bds?.suivreImage({
    idBd: props.id,
    f: image => (imageBd.value = image),
  }),
);

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('logoBD');

// Variables
const variables = ref<string[]>();
enregistrerÉcoute(
  constl?.bds?.suivreVariablesBd({
    id: props.id,
    f: vars => (variables.value = vars),
  }),
);
</script>
