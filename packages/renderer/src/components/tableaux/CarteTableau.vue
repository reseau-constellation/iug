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
            :noms-initiaux="nomsAvecModifs"
            :titre="t('objet.titreDialogueNoms')"
            :sous-titre="t('objet.sousTitreDialogueNoms')"
            :autorisation-modification="permissionModifier"
            @ajuster-noms="ajusterNoms"
          >
            <template #activator="{props: propsActivateur}">
              <span
                v-bind="propsActivateur"
                class="text-h4"
              >
                {{ nomTraduit || t('bds.sansNom') }}
                <v-btn
                  :icon="monAutorisation ? 'mdi-pencil' : 'mdi-earth'"
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
          :noms-initiaux="descriptionsAvecModifs"
          :titre="t('objet.titreDialogueDescriptions')"
          :sous-titre="t('objet.sousTitreDialogueDescriptions')"
          :autorisation-modification="permissionModifier"
          longue
          @ajuster-noms="ajusterDescriptions"
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
          :active="modifié"
          >{{ t('communs.sauvegarder') }}</v-btn
        >
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
}>();
const émettre = defineEmits<{
  (e: 'effacer'): void;
  (
    e: 'sauvegarder',
    args: {
      noms?: {[langue: string]: string};
      descrs?: {[langue: string]: string};
      clef?: string;
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
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(computed(() => nomsAvecModifs));

// Contrôles
const modifié = computed(() => {
  return nomsModifiés || descrsModifiées || clefModifiée;
});
const effacerTableau = () => émettre('effacer');
const sauvegarder = () => {
  émettre('sauvegarder', {
    noms: nomsModifiés ? noms : undefined,
  });
};
</script>
