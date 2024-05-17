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
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title>
          <DialogueNoms
            :etiquette-nom="t('objet.étiquetteNom')"
            :indice-nom="t('objet.indiceNom')"
            :indice-langue="t('objet.indiceLangue')"
            :texte-aucun-nom="t('objet.texteAucunNom')"
            :noms-initiaux="noms"
            :titre="t('objet.titreDialogueNoms')"
            :sous-titre="t('objet.sousTitreDialogueNoms')"
            :autorisation-modification="permissionModifier"
            @ajuster-noms="noms => (nouveauxNoms = noms)"
          >
            <template #activator="{props: propsActivateur}">
              <span
                v-bind="propsActivateur"
                class="text-h4"
              >
                {{ nomTraduit || t('bds.sansNom') }}
                <v-btn
                  :icon="permissionModifier ? 'mdi-pencil' : 'mdi-earth'"
                  variant="flat"
                  size="small"
                ></v-btn>
              </span>
            </template>
          </DialogueNoms>
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <DialogueNoms
          :etiquette-nom="t('objet.étiquetteDescription')"
          :indice-nom="t('objet.indiceDescription')"
          :indice-langue="t('objet.indiceLangue')"
          :texte-aucun-nom="t('objet.texteAucuneDescription')"
          :noms-initiaux="descriptions"
          :titre="t('objet.titreDialogueDescriptions')"
          :sous-titre="t('objet.sousTitreDialogueDescriptions')"
          :autorisation-modification="permissionModifier"
          longue
          @ajuster-noms="descrs => (nouvellesDescrs = descrs)"
        >
          <template #activator="{props: propsActivateur}">
            <span :class="{'text-disabled': !descrTraduite}">{{
              descrTraduite || t('communs.baseCarteObjet.sansDescription')
            }}</span>
            <v-btn
              v-bind="propsActivateur"
              :icon="permissionModifier ? 'mdi-pencil' : 'mdi-earth'"
              variant="flat"
              size="small"
            ></v-btn>
          </template>
        </DialogueNoms>
        <carte-effacer @effacer="() => effacerTableau()">
          <template #activator="{props: propsActivateur}">
            <v-btn
              v-bind="propsActivateur"
              icon="mdi-delete"
            />
          </template>
        </carte-effacer>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn>t()</v-btn>
        <v-btn
          v-if="permissionModifier"
          :disabled="!modifié"
          @click="() => sauvegarder()"
        >
          {{ t('communs.sauvegarder') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';
import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import CarteEffacer from '/@/components/communs/CarteEffacer.vue';
import DialogueNoms from '/@/components/communs/listeNoms/DialogueNoms.vue';

const props = defineProps<{
  permissionModifier: boolean;
  noms: {[langue: string]: string};
  descriptions: {[langue: string]: string};
  clef: string;
}>();
const émettre = defineEmits<{
  (e: 'effacer'): void;
  (
    e: 'sauvegarder',
    args: {
      noms: {[langue: string]: string};
      descrs: {[langue: string]: string};
      clef: string;
    },
  ): void;
}>();

const {mdAndUp} = useDisplay();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Navigation
const dialogue = ref(false);

// Noms
const nouveauxNoms = ref<{[langue: string]: string}>({});

const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(nouveauxNoms);

const nomsModifiés = computed(() => {
  return (
    !Object.values(props.noms).every(([lng, nom]) => nouveauxNoms.value[lng] !== nom) ||
    Object.keys(nouveauxNoms.value).length !== Object.keys(props.noms).length
  );
});

// Descriptions
const nouvellesDescrs = ref<{[langue: string]: string}>({});

const descrTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(nouvellesDescrs);

const descrsModifiées = computed(() => {
  return (
    !Object.values(props.descriptions).every(
      ([lng, descr]) => nouvellesDescrs.value[lng] !== descr,
    ) || Object.keys(nouveauxNoms.value).length !== Object.keys(props.noms).length
  );
});

// Clef tableau
const choixClef = ref(props.clef);
const clefModifiée = computed(() => choixClef.value !== props.clef);

// Contrôles
const modifié = computed(() => {
  return nomsModifiés.value || descrsModifiées || clefModifiée;
});
const effacerTableau = () => émettre('effacer');
const sauvegarder = () => {
  émettre('sauvegarder', {
    noms: nouveauxNoms.value,
    descrs: nouvellesDescrs.value,
    clef: choixClef.value,
  });
};
</script>
