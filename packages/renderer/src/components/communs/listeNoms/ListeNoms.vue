<template>
  <v-list
    v-if="autorisationModification"
    class="pb-0"
  >
    <v-list-item>
      <v-row>
        <v-col :cols="mdAndUp ? 4 : 12">
          <v-autocomplete
            v-model="nouvelleLangue"
            class="pt-1"
            density="compact"
            variant="underlined"
            item-title="மொழி"
            item-value="குறியீடு"
            hide-details
            :items="languesDisponibles"
            :label="indiceLangue"
          >
            <template #no-data>
              <gestionnaire-ennikkai />
            </template>
          </v-autocomplete>
        </v-col>
        <v-col :cols="mdAndUp ? 8 : 12">
          <v-locale-provider :rtl="nouvelleLangueDÀG">
            <v-text-field
              v-if="!longue"
              v-model="nouveauNom"
              class="pt-1"
              density="compact"
              variant="underlined"
              :rules="règlesNouveauNom"
              :label="etiquetteNom"
              :hint="indiceNom"
              @blur="ajouterNom"
              @keydown.enter="ajouterNom"
            ></v-text-field>
            <v-textarea
              v-else
              v-model="nouveauNom"
              class="pt-1"
              density="compact"
              variant="underlined"
              rows="2"
              auto-grow
              :rules="règlesNouveauNom"
              :label="etiquetteNom"
              :hint="indiceNom"
              @blur="ajouterNom"
              @keydown.enter="ajouterNom"
            ></v-textarea>
          </v-locale-provider>
        </v-col>
      </v-row>
    </v-list-item>
  </v-list>
  <span v-show="listeNoms.length">
    <v-divider class="mb-2" />
    <p class="text-overline">{{ t('communs.autresLangues', {n: listeNoms.length}) }}</p>
    <v-list
      :max-height="longue ? 100 : 200"
      style="overflow-y: scroll"
    >
      <v-scroll-y-transition group>
        <item-nom
          v-for="nom in listeNoms"
          :id="nom.id"
          :key="nom.id"
          :langue="nom.lng"
          :nom="nom.nom"
          :autorisation-modification="autorisationModification"
          :longue="longue"
          @changer-nom="changerNom"
          @effacer="effacerNom"
        />
      </v-scroll-y-transition>
    </v-list>
  </span>
</template>

<script setup lang="ts">
import {
  கிடைக்கும்_மொழிகளைப்_பயன்படுத்து,
  மொழிகளைப்_பயன்படுத்து,
  மொழியாக்கத்தைப்_பயன்படுத்து,
} from '@lassi-js/kilimukku-vue';
import {computed, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

import {v4 as uuidv4} from 'uuid';

import ItemNom from './ItemNom.vue';

import GestionnaireEnnikkai from '/@/components/langues/contribuer/ennikkai/GestionnaireEnnikkai.vue';
import {utiliserNuchabäl} from '/@/components/utils';
import {utiliserHistoriqueLangues} from '/@/état/historiqueLangues';

const {மொழிகளும்_குறியீடுகளும், மொழியின்_பெயர்} = கிடைக்கும்_மொழிகளைப்_பயன்படுத்து();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {வலதிலிருந்து_இடது_மொழி} = மொழிகளைப்_பயன்படுத்து();
const historiqueLangues = utiliserHistoriqueLangues();

const {mdAndUp} = useDisplay();

const nuchabäl = utiliserNuchabäl();

const props = defineProps<{
  nomsInitiaux: {[lng: string]: string} | undefined;
  etiquetteNom: string;
  indiceNom: string;
  indiceLangue: string;
  texteAucunNom: string;
  autorisationModification: boolean;
  longue?: boolean;
}>();
const émettre = defineEmits<{
  (é: 'ajusterNoms', noms: {[lng: string]: string}): void;
}>();

// Noms
const noms = ref(props.nomsInitiaux);
watchEffect(() => {
  noms.value = props.nomsInitiaux || {};
});
const listeNoms = ref<
  {
    lng: string;
    nom: string;
    id: string;
  }[]
>([]);

watchEffect(() => {
  listeNoms.value = Object.entries(noms.value || {}).map(([lng, nom]) => {
    return {
      lng,
      nom,
      id: uuidv4(),
    };
  });
});

// Langues
const languesDisponibles = computed(() => {
  const disponibles = மொழிகளும்_குறியீடுகளும்.value.filter(
    x => !listeNoms.value.some(n => n.lng === x.குறியீடு),
  );

  return disponibles.sort((a, b) => {
    const indexA = historiqueLangues.historique.indexOf(a.குறியீடு);
    const indexB = historiqueLangues.historique.indexOf(b.குறியீடு);
    return indexA >= 0 ? (indexB >= 0 ? (indexA > indexB ? 1 : -1) : -1) : 1;
  });
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
  if (lng === nouvelleLangue.value) nouvelleLangue.value = '';

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
const nouveauNom = ref<string>('');
const nouvelleLangue = ref<string>('');
const nomNouvelleLangue = மொழியின்_பெயர்(nouvelleLangue);
const nouvelleLangueDÀG = வலதிலிருந்து_இடது_மொழி(nouvelleLangue);

watchEffect(() => {
  if (
    !nouvelleLangue.value ||
    !languesDisponibles.value.map(x => x.குறியீடு).includes(nouvelleLangue.value)
  )
    nouvelleLangue.value = languesDisponibles.value[0]?.குறியீடு;
});

const règlesNouveauNom = computed<string[] | undefined>(() => {
  if (!nouveauNom.value?.length || !nouvelleLangue.value) return undefined;
  const exprégÉcriture = nuchabäl.rutzibTzibanem({runuk: nouvelleLangue.value});
  if (!exprégÉcriture) return;
  const erreurLangue = !nouveauNom.value.match(new RegExp(exprégÉcriture, 'g'));

  return erreurLangue ? [t('communs.erreurLangue', {langue: nomNouvelleLangue.value})] : undefined;
});

const ajoutPrêt = computed(() => {
  if (nouvelleLangue.value && nouveauNom.value.trim() && !règlesNouveauNom.value?.length) {
    return {valNouvelleLangue: nouvelleLangue.value.trim(), valNouveauNom: nouveauNom.value};
  } else {
    return undefined;
  }
});

const ajouterNom = () => {
  const prêt = ajoutPrêt.value;
  if (!prêt) return;
  const {valNouveauNom, valNouvelleLangue} = prêt;
  historiqueLangues.sélectionner(valNouvelleLangue);

  listeNoms.value = [
    {
      nom: valNouveauNom,
      lng: valNouvelleLangue,
      id: uuidv4(),
    },
    ...listeNoms.value,
  ];

  nouvelleLangue.value = '';
  nouveauNom.value = '';

  émettreChangements();
};
</script>
