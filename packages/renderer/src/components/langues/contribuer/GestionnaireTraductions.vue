<template>
  <v-dialog
    v-model="dialogue"
    :max-width="mdAndUp ? 500 : 300"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card>
      <v-card-item>
        <v-card-title class="d-flex">
          {{ t('kilimukku.gestionnaire.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          />
        </v-card-title>
      </v-card-item>
      <v-card-text style="overflow-y: auto">
        <v-row>
          <v-col
            class="pb-0"
            :cols="mdAndUp ? 6 : 12"
          >
            <v-select
              v-model="choixLangue"
              :items="optionsLangues"
              variant="outlined"
              multiple
              chips
              closable-chips
            >
            </v-select>
          </v-col>
          <v-col
            class="pb-0"
            :cols="mdAndUp ? 6 : 12"
          >
            <v-select
              v-model="choixClef"
              :items="optionsClefs"
              variant="outlined"
              multiple
              chips
              closable-chips
            ></v-select>
          </v-col>
        </v-row>
        <v-list>
          <groupe-suggestions-traduction
            v-for="sugg in nouvellesSuggestionsParClefEtLangue"
            v-bind="sugg"
            :key="sugg.clef + sugg.langue"
          />
        </v-list>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn
          append-icon="mdi-download"
          @click="() => exporter()"
        >
          {{ t('communs.télécharger') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {tableaux, types} from '@constl/ipa';
import type {அங்கீகரிக்கப்பட்ட_உறுப்படி_வகை} from '@lassi-js/kili';
import type {
  பிணையம்_மொழிபெயர்ப்பு_பரிந்துரை_வகை,
  மொழிபெயர்ப்பு_அகராதி_வகை,
  மொழிபெயர்ப்பு_பரிந்துரை_உறுப்படி_வகை,
} from '@lassi-js/kilimukku';

import {ref, computed} from 'vue';
import {useDisplay} from 'vuetify';
import {suivre, rechercher} from '@constl/vue';


import {கிளிமூக்கு} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {மொழிபெயர்ப்பு_அகராதியிலிருந்து_மரம்} from '@lassi-js/kilimukku';

import GroupeSuggestionsTraduction from './GroupeSuggestionsTraduction.vue';

import {saveAs} from 'file-saver';

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const கிளி = கிளிமூக்கு();

// Navigation
const dialogue = ref(false);

// Contrôles
const optionsLangues = computed(() => {
  return [...new Set(nouvellesSuggestions.value?.map(s => s.பரிந்துரை.இலக்கு_மொழி))];
});
const optionsClefs = computed(() => {
  return [...new Set(nouvellesSuggestions.value?.map(s => s.பரிந்துரை.சாபி))];
});
const choixClef = ref<string[]>([]);
const choixLangue = ref<string[]>([]);

// Traductions
const {résultats: suggérées} = rechercher(
  async ({f}: {f: types.schémaFonctionSuivi<பிணையம்_மொழிபெயர்ப்பு_பரிந்துரை_வகை[]>}) =>
    await கிளி.மொழிபெயர்ப்பு_பரிந்துரைகளை_கேள்ளு({செ: f}),
);
const nouvellesSuggestions = computed(() => {
  if (!suggérées.value) return undefined;
  return suggérées.value.filter(s => {
    const {சாபி, இலக்கு_மொழி, தேதி} = s.பரிந்துரை;
    return !autorisées.value?.find(
      a =>
        a.données.சாபி === சாபி &&
        a.données.இலக்கு_மொழி === இலக்கு_மொழி &&
        தேதி.getTime() > a.données.தேதி,
    );
  });
});

const nouvellesSuggestionsParClefEtLangue = computed(() => {
  const clefsEtLangues: {
    clef: string;
    langue: string;
    suggestions: பிணையம்_மொழிபெயர்ப்பு_பரிந்துரை_வகை[];
  }[] = [];
  nouvellesSuggestions.value?.forEach(s => {
    const existante = clefsEtLangues.find(
      x => x.clef === s.பரிந்துரை.சாபி && x.langue === s.பரிந்துரை.இலக்கு_மொழி,
    );
    if (existante) {
      existante.suggestions.push(s);
    } else {
      clefsEtLangues.push({
        clef: s.பரிந்துரை.சாபி,
        langue: s.பரிந்துரை.இலக்கு_மொழி,
        suggestions: [s],
      });
    }
  });

  return clefsEtLangues.filter(
    x =>
      (!choixClef.value.length || choixClef.value.includes(x.clef)) &&
      (!choixLangue.value.length || choixLangue.value.includes(x.langue)),
  );
});

const autorisées = suivre(
  async ({
    f,
  }: {
    f: types.schémaFonctionSuivi<
      tableaux.élémentDonnées<
        அங்கீகரிக்கப்பட்ட_உறுப்படி_வகை<மொழிபெயர்ப்பு_பரிந்துரை_உறுப்படி_வகை>
      >[]
    >;
  }) => await கிளி.கிளி!.அங்கீகரிக்கப்பட்ட_உறுப்படிகளை_கேள்ளு({செ: f}),
);
/*const dicAutorisées = suivre(
  async ({f}: {f: types.schémaFonctionSuivi<மொழிபெயர்ப்பு_அகராதி_வகை>}) =>
  await கிளி.அங்கீகரிக்கப்பட்ட_மொழிபெயர்ப்புகளை_கேள்ளு({செ: f}),
);
const nouvellementAutorisées = computed(()=>{
    if (!dicAutorisées.value) return undefined;
    return Object.entries(dicAutorisées.value).map(
        ([clef, dic]) => Object.entries(dic).filter(
            ([langue, traduc])=>கிளி.மூல்_மொழிபெயர்ப்புகள்[clef]?.[langue] !== traduc,
        ).map(([langue, traduc]) => {
        return {
            clef,
            langue,
            traduc,
        };
    })).flat();
});*/

// Exportation
const toutesTraductions = suivre(
  async ({f}: {f: types.schémaFonctionSuivi<மொழிபெயர்ப்பு_அகராதி_வகை>}) =>
    await கிளி.மொழிபெயர்ப்புகளை_கேள்ளு({செ: f}),
);
const exporter = async () => {
  const traductionsJSON = JSON.stringify(
    மொழிபெயர்ப்பு_அகராதியிலிருந்து_மரம்(toutesTraductions.value || {}),
    undefined,
    2,
  );
  saveAs(new Blob([traductionsJSON], {type: 'text/plain;charset=utf-8'}), 'traducs.json');
};
</script>
