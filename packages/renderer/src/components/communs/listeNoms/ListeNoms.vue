<template>
  <v-list>
    <v-list-item>
      <v-row>
        <v-col cols="4">
          <v-autocomplete
            v-model="nouvelleLangue"
            hide-details
            density="compact"
            variant="outlined"
            item-title="lng"
            item-value="code"
            :items="languesDisponibles"
            :label="indiceLangue"
          ></v-autocomplete>
        </v-col>
        <v-col cols="8">
          <v-text-field
            v-model="nouveauNom"
            hide-details
            density="compact"
            variant="outlined"
            :label="indiceNom"
          ></v-text-field>
        </v-col>
      </v-row>
      <template #append>
        <v-btn
          icon="mdi-plus"
          variant="text"
          :disabled="!ajoutPrêt"
          @click="ajouterNom"
        ></v-btn>
      </template>
    </v-list-item>
  </v-list>
  <v-list>
    <v-divider class="mb-2" />
    <ItemNom
      v-for="nom in listeNoms"
      :id="nom.id"
      :key="nom.id"
      :langue="nom.lng"
      :nom="nom.nom"
      :indice-langue="indiceLangue"
      :indice-nom="indiceNom"
      @changer-nom="changerNom"
      @effacer="effacerNom"
    />
  </v-list>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watchEffect} from 'vue';

import {utiliserLangues} from '/@/fonctions/langues';

import {v4 as uuidv4} from 'uuid';

import ItemNom from './ItemNom.vue';

const props = defineProps<{
  nomsInitiaux: {[lng: string]: string};
  indiceNom: string;
  indiceLangue: string;
}>();
const emit = defineEmits<{
  (é: 'ajusterNoms', noms: {[lng: string]: string}): void;
}>();

const {listeLanguesEtCodes} = utiliserLangues();

const noms = ref<{[lng: string]: string}>({});
onMounted(() => {
  noms.value = Object.fromEntries(Object.entries(props.nomsInitiaux));
});
const listeNoms = ref<
  {
    lng: string;
    nom: string;
    id: string;
  }[]
>([]);
watchEffect(() => {
  listeNoms.value = Object.entries(noms.value).map(([lng, nom]) => {
    return {
      lng,
      nom,
      id: uuidv4(),
    };
  });
});

// Langues
const languesDisponibles = computed(() => {
  return listeLanguesEtCodes().filter(x => !listeNoms.value.some(n => n.lng === x.code));
});

// Changements
const émettreChangements = () => {
  const nomsFinaux: {[lng: string]: string} = Object.fromEntries(
    listeNoms.value.map(nom => {
      return [nom.lng, nom.nom];
    }),
  );
  emit('ajusterNoms', nomsFinaux);
};

const changerNom = ({id, nom, lng}: {id: string; nom: string, lng: string}) => {
  if (lng === nouvelleLangue.value) nouvelleLangue.value = undefined;

  const existant = listeNoms.value.find(nm => nm.lng === lng && nm.id !== id);
  const item = listeNoms.value.find(nm => nm.id === id);
  if (!item) throw new Error('Item non existant');

  const nomsFinaux = listeNoms.value
    .map(nm => {
      return nm.id === id ? {lng, nom: nom, id: nm.id} : nm;
    })
    .map(nm => {
      return existant && nm.id == existant.id
        ? {lng: item.id, nom: existant.nom, id: existant.id}
        : nm;
    });
  listeNoms.value = nomsFinaux;
  émettreChangements();
};

const effacerNom = ({id}: {id: string}) => {
  listeNoms.value = listeNoms.value.filter(nom => nom.id !== id);
  émettreChangements();
};

// Ajouts
const nouveauNom = ref<string>();
const nouvelleLangue = ref<string>();

const ajoutPrêt = computed(() => {
  return !!(nouvelleLangue.value && nouveauNom.value);
});

const ajouterNom = () => {
  if (!(nouvelleLangue.value && nouveauNom.value)) return;

  listeNoms.value = [
    {
      nom: nouveauNom.value,
      lng: nouvelleLangue.value,
      id: uuidv4(),
    },
    ...listeNoms.value,
  ];

  nouvelleLangue.value = undefined;
  nouveauNom.value = undefined;
  émettreChangements();
};
</script>
