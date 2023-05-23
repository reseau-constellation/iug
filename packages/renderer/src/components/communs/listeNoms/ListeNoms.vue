<template>
  <v-list
    v-if="autorisationModification"
    class="pb-0"
  >
    <v-list-item>
      <v-row>
        <v-col cols="4">
          <v-select
            v-model="nouvelleLangue"
            class="pt-1"
            density="compact"
            variant="outlined"
            item-title="lng"
            item-value="code"
            :items="languesDisponibles"
            :label="indiceLangue"
          ></v-select>
        </v-col>
        <v-col cols="8">
          <v-text-field
            v-model="nouveauNom"
            class="pt-1"
            density="compact"
            variant="outlined"
            :rules="règlesNouveauNom"
            :label="indiceNom"
            @blur="ajouterNom"
            @keydown.enter="ajouterNom"
          ></v-text-field>
        </v-col>
      </v-row>
      <template #append>
        <v-btn
          icon="mdi-plus"
          variant="text"
          class="mb-2"
          :disabled="!ajoutPrêt"
          @click="ajouterNom"
        ></v-btn>
      </template>
    </v-list-item>
  </v-list>
  <v-list
    max-height="200"
    style="overflow-y: scroll"
  >
    <v-divider class="mb-2" />
    <v-scroll-y-transition group>
      <ItemNom
        v-for="nom in listeNoms"
        :id="nom.id"
        :key="nom.id"
        :langue="nom.lng"
        :nom="nom.nom"
        :indice-langue="indiceLangue"
        :indice-nom="indiceNom"
        :autorisation-modification="autorisationModification"
        @changer-nom="changerNom"
        @effacer="effacerNom"
      />
      <div
        v-if="!listeNoms.length"
        class="text-center mt-3 text-h6"
      >
        {{ texteAucunNom }}
      </div>
    </v-scroll-y-transition>
  </v-list>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watchEffect} from 'vue';

import {v4 as uuidv4} from 'uuid';

import ItemNom from './ItemNom.vue';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {Nuchabäl} from 'nuchabal';

const {கிடைக்கும்_மொழிகளை_பயன்படுத்து, useI18n} = கிளிமூக்கை_உபயோகி();

const {t} = useI18n();
const {languesEtCodes, nomLangue} = கிடைக்கும்_மொழிகளை_பயன்படுத்து();
const nuchabäl = new Nuchabäl({});

const props = defineProps<{
  nomsInitiaux: {[lng: string]: string};
  indiceNom: string;
  indiceLangue: string;
  texteAucunNom: string;
  autorisationModification: boolean;
}>();
const émettre = defineEmits<{
  (é: 'ajusterNoms', noms: {[lng: string]: string}): void;
}>();

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
  return languesEtCodes.value.filter(x => !listeNoms.value.some(n => n.lng === x.code));
});

// Changements
const émettreChangements = () => {
  const nomsFinaux: {[lng: string]: string} = Object.fromEntries(
    listeNoms.value.map(nom => {
      return [nom.lng, nom.nom];
    }),
  );
  émettre('ajusterNoms', nomsFinaux);
};

const changerNom = ({id, nom, lng}: {id: string; nom: string; lng: string}) => {
  if (lng === nouvelleLangue.value) nouvelleLangue.value = undefined;

  listeNoms.value = listeNoms.value
    .filter(nm => nm.lng !== lng || nm.id === id)
    .map(nm => {
      return nm.id === id ? {lng, nom, id: nm.id} : nm;
    });

  émettreChangements();
};

const effacerNom = ({id}: {id: string}) => {
  listeNoms.value = listeNoms.value.filter(nom => nom.id !== id);
  émettreChangements();
};

// Ajouts
const nouveauNom = ref<string>();
const nouvelleLangue = ref<string>();
const nomNouvelleLangue = nomLangue(nouvelleLangue);

const règlesNouveauNom = computed<string[] | undefined>(() => {
  if (!nouveauNom.value?.length || !nouvelleLangue.value) return undefined;
  const exprégÉcriture = nuchabäl.rutzibTzibanem({runuk: nouvelleLangue.value});
  if (!exprégÉcriture) return;
  const erreurLangue = !nouveauNom.value.match(new RegExp(exprégÉcriture, 'g'));

  return erreurLangue ? [t('communs.erreurLangue', {langue: nomNouvelleLangue.value})] : undefined;
});

const ajoutPrêt = computed(() => {
  return !!(nouvelleLangue.value && nouveauNom.value) && !règlesNouveauNom.value?.length;
});

const ajouterNom = () => {
  if (!(nouvelleLangue.value && nouveauNom.value)) return;
  if (règlesNouveauNom.value?.length) return;

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
