<template>
  <base-carte-objet
    :id="id"
    :noms="noms"
    :descriptions="descriptions"
    :auteurs="auteurs"
    @effacer="effacerVariable"
    @ajuster-noms="nms => ajusterNoms(nms)"
    @ajuster-descriptions="descrs => ajusterDescriptions(descrs)"
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
    <v-select v-if="monAutorisation && catégorie" />
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
import type {client, utils, variables, valid} from '@constl/ipa';
import {computed, inject, ref} from 'vue';

import {enregistrerÉcoute} from '/@/components/utils';
import BaseCarteObjet from '../communs/BaseCarteObjet.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {ajusterTexteTraductible, icôneCatégorieVariable} from '/@/utils';
import DivisionCarte from '../communs/DivisionCarte.vue';
import ItemRègle from '/@/components/règles/ItemRègle.vue';

const props = defineProps<{id: string}>();

const constl = inject<client.ClientConstellation>('constl');

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
  constl?.variables?.suivreNomsVariable({
    id: props.id,
    f: x => (noms.value = x),
  }),
);
const ajusterNoms = async (nouveauxNoms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: noms.value,
    nouvelles: nouveauxNoms,
  });
  for (const langue of àEffacer) {
    await constl?.variables?.effacerNomVariable({
      id: props.id,
      langue,
    });
  }
  return await constl?.variables?.ajouterNomsVariable({
    id: props.id,
    noms: àAjouter,
  });
};

// Descriptions variable
const descriptions = ref<{[lng: string]: string}>({});

enregistrerÉcoute(
  constl?.variables?.suivreDescrVariable({
    id: props.id,
    f: x => (descriptions.value = x),
  }),
);

const ajusterDescriptions = async (descrs: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: descriptions.value,
    nouvelles: descrs,
  });
  for (const langue of àEffacer) {
    await constl?.variables?.effacerDescrVariable({
      id: props.id,
      langue,
    });
  }
  return await constl?.variables?.ajouterDescriptionsVariable({
    id: props.id,
    descriptions: àAjouter,
  });
};

// Catégorie
const icône = computed(() =>
  catégorie.value ? icôneCatégorieVariable(catégorie.value) : 'mdi-variable',
);
const catégorie = ref<variables.catégorieVariables>();
enregistrerÉcoute(
  constl?.variables?.suivreCatégorieVariable({
    id: props.id,
    f: x => (catégorie.value = x),
  }),
);

// Auteurs
const auteurs = ref<utils.infoAuteur[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreAuteursVariable({
    idVariable: props.id,
    f: x => (auteurs.value = x),
  }),
);

// Règles
const règles = ref<valid.règleVariableAvecId<valid.règleVariable>[]>();
enregistrerÉcoute(
  constl?.variables?.suivreRèglesVariable({
    id: props.id,
    f: x => (règles.value = x),
  }),
);

// Effacer
const effacerVariable = async () => {
  await constl?.variables?.effacerVariable({id: props.id});
};
</script>
