<template>
  <base-carte-objet
    :id="id"
    :noms="noms"
    :descriptions="descriptions"
    :auteurs="auteurs"
    :fichiers-epinglables="false"
    sauvegarde-possible
    @effacer="effacerVariable"
    @ajuster-noms="nms => ajusterNoms(nms)"
    @ajuster-descriptions="descrs => ajusterDescriptions(descrs)"
    @sauvegarder="() => sauvegarderCatégorie()"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <division-carte
      :titre="t('variables.catégorie')"
      :en-attente="!catégorie"
    />
    <span v-if="monAutorisation && catégorie">
      <v-select
        v-model="choixCatégorieBase"
        :items="catégoriesBase"
        :label="t('variables.catégorie')"
        variant="outlined"
      >
        <template #selection="{item}">
          <v-icon
            start
            :icon="icôneCatégorieVariable({type: 'simple', catégorie: item.raw}) || 'mdi-variable'"
          />
          {{ t(`variables.catégories.${item.raw}`) }}
        </template>
        <template #item="{item, props: propsItem}">
          <v-list-item
            v-bind="propsItem"
            :title="t(`variables.catégories.${item.raw}`)"
            :subtitle="t(`variables.indicesCatégories.${item.raw}`)"
            :prepend-icon="
              icôneCatégorieVariable({type: 'simple', catégorie: item.raw}) || 'mdi-variable'
            "
          />
        </template>
      </v-select>
      <v-checkbox
        v-model="choixCatégorieListe"
        :label="t('variables.nouvelle.typeListe')"
      />
    </span>
    <v-chip
      v-else-if="catégorie"
      label
      variant="outlined"
      :prepend-icon="icône"
    >
      {{ t(`variables.catégories.${catégorie.catégorie}`) }}
    </v-chip>

    <division-carte
      :titre="t('variables.règles')"
      :en-attente="!règles"
    />
    <v-list v-if="règles">
      <item-règle
        v-for="r in règles"
        :key="r.id"
        :regle="r"
      ></item-règle>
    </v-list>
  </base-carte-objet>
</template>
<script setup lang="ts">
import type {types, variables, valid} from '@constl/ipa';
import type {ClientConstellation} from '@constl/ipa';

import {computed, inject, ref, watchEffect} from 'vue';

import {enregistrerÉcoute} from '/@/components/utils';
import BaseCarteObjet from '/@/components/communs/BaseCarteObjet.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {ajusterTexteTraductible} from '/@/utils';
import {icôneCatégorieVariable} from '/@/components/variables/utils';
import DivisionCarte from '/@/components/communs/DivisionCarte.vue';
import ItemRègle from '/@/components/règles/ItemRègle.vue';

import {catégoriesBase} from './utils';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Autorisation
const monAutorisation = ref<'MODÉRATEUR' | 'MEMBRE' | undefined>();
enregistrerÉcoute(
  constl?.suivrePermission({
    idObjet: props.id,
    f: x => (monAutorisation.value = x),
  }),
);

// Nom variable
const noms = ref<{[langue: string]: string}>({});
enregistrerÉcoute(
  constl?.variables.suivreNomsVariable({
    idVariable: props.id,
    f: x => (noms.value = x),
  }),
);
const ajusterNoms = async (nouveauxNoms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: noms.value,
    nouvelles: nouveauxNoms,
  });
  for (const langue of àEffacer) {
    await constl?.variables.effacerNomVariable({
      idVariable: props.id,
      langue,
    });
  }
  return await constl?.variables.sauvegarderNomsVariable({
    idVariable: props.id,
    noms: àAjouter,
  });
};

// Descriptions variable
const descriptions = ref<{[lng: string]: string}>({});

enregistrerÉcoute(
  constl?.variables.suivreDescriptionsVariable({
    idVariable: props.id,
    f: x => (descriptions.value = x),
  }),
);

const ajusterDescriptions = async (descrs: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: descriptions.value,
    nouvelles: descrs,
  });
  for (const langue of àEffacer) {
    await constl?.variables.effacerDescriptionVariable({
      idVariable: props.id,
      langue,
    });
  }
  return await constl?.variables.sauvegarderDescriptionsVariable({
    idVariable: props.id,
    descriptions: àAjouter,
  });
};

// Catégorie
const icône = computed(() =>
  catégorie.value ? icôneCatégorieVariable(catégorie.value) : 'mdi-variable',
);
const catégorie = ref<variables.catégorieVariables>();
enregistrerÉcoute(
  constl?.variables.suivreCatégorieVariable({
    idVariable: props.id,
    f: x => (catégorie.value = x),
  }),
);

const choixCatégorieListe = ref(false);
const choixCatégorieBase = ref<variables.catégorieBaseVariables>();
const choixCatégorie = computed<variables.catégorieVariables | undefined>(() => {
  if (!choixCatégorieBase.value) return;
  return {
    type: choixCatégorieListe.value ? 'liste' : 'simple',
    catégorie: choixCatégorieBase.value,
  };
});
watchEffect(() => {
  choixCatégorieListe.value = catégorie.value?.type === 'liste';
  choixCatégorieBase.value = catégorie.value?.catégorie;
});

const catégorieChangée = computed<boolean>(() => {
  if (choixCatégorie.value) {
    const {type: nouveauType, catégorie: nouvelleCatégorieBase} = choixCatégorie.value;
    return (
      nouveauType !== catégorie.value?.type || nouvelleCatégorieBase !== catégorie.value.catégorie
    );
  } else {
    return false;
  }
});

const sauvegarderCatégorie = async () => {
  if (choixCatégorie.value && catégorieChangée.value) {
    await constl?.variables.sauvegarderCatégorieVariable({
      idVariable: props.id,
      catégorie: choixCatégorie.value,
    });
  }
};

// Auteurs
const auteurs = ref<types.infoAuteur[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreAuteursVariable({
    idVariable: props.id,
    f: x => (auteurs.value = x),
  }),
);

// Règles
const règles = ref<valid.règleVariableAvecId<valid.règleVariable>[]>();
enregistrerÉcoute(
  constl?.variables.suivreRèglesVariable({
    idVariable: props.id,
    f: x => (règles.value = x),
  }),
);

// Effacer
const effacerVariable = async () => {
  await constl?.variables.effacerVariable({idVariable: props.id});
};
</script>
