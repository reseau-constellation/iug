<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props}">
      <slot
        name="activator"
        v-bind="{props}"
      ></slot>
    </template>

    <v-card
      class="mx-auto"
      :width="mdAndUp ? '95%' : undefined"
    >
      <v-card-item>
        <v-card-title class="d-flex">
          {{ t('languesInterface.dialogueContribuer.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="outlined"
            @click="dialogue = false"
          ></v-btn>
        </v-card-title>
        <v-card-subtitle>{{ t('languesInterface.dialogueContribuer.sousTitre') }}</v-card-subtitle>
        <v-divider class="my-3" />
      </v-card-item>

      <v-card-text class="overflow-auto">
        <v-row>
          <v-col :cols="mdAndUp ? 4 : 12">
            <v-select
              v-model="langueSource"
              variant="outlined"
              hide-details
              :items="கிடைக்கும்_மொழி_குறியீடுகள்"
              :label="t('languesInterface.dialogueContribuer.langueSource')"
            >
              <template #item="{item, props}">
                <ItemLangueProgrès
                  v-bind="props"
                  :code="item.value"
                  :selectionnee="false"
                ></ItemLangueProgrès>
              </template>
              <template #selection="{item}">
                <JetonLangue :code="item.value" />
              </template>
            </v-select>
          </v-col>
          <v-col
            v-if="mdAndUp"
            :cols="1"
            class="text-center"
          >
            <v-btn
              icon="mdi-swap-horizontal"
              variant="flat"
              @click="() => échangerLangues()"
            />
          </v-col>
          <v-col :cols="mdAndUp ? 4 : 12">
            <v-select
              v-model="langueCible"
              variant="outlined"
              hide-details
              :items="கிடைக்கும்_மொழி_குறியீடுகள்"
              :label="t('languesInterface.dialogueContribuer.langueCible')"
            >
              <template #item="{item, props}">
                <ItemLangueProgrès
                  v-bind="props"
                  :code="item.value"
                  :selectionnee="false"
                ></ItemLangueProgrès>
              </template>
              <template #selection="{item}">
                <JetonLangue :code="item.value" />
              </template>
            </v-select>
          </v-col>
          <v-col :cols="mdAndUp ? 2 : 12">
            <v-select
              v-model="montrer"
              :label="t('languesInterface.dialogueContribuer.montrer')"
              :items="[
                {title: t('languesInterface.dialogueContribuer.filtre.toutes'), value: 'toutes'},
                {
                  title: t('languesInterface.dialogueContribuer.filtre.nonTraduite'),
                  value: 'nonTraduites',
                },
                {
                  title: t('languesInterface.dialogueContribuer.filtre.sansSuggestion'),
                  value: 'sansSuggestion',
                },
              ]"
              variant="outlined"
            >
            </v-select>
          </v-col>
        </v-row>
        <v-progress-linear
          :absolute="!mdAndUp"
          :class="{'my-3': mdAndUp}"
          color="primary"
          :model-value="progrèsApprouvé * 100"
          :buffer-value="(progrèsApprouvé + progrèsSuggéré) * 100"
        />
        <v-row class="fill-height">
          <v-col :cols="mdAndUp ? 3 : 12">
            <v-list v-if="mdAndUp">
              <v-list-item class="px-0">
                <v-list-item-title>
                  <v-text-field
                    v-model="rechercher"
                    class="mt-2"
                    variant="outlined"
                    :label="t('communs.rechercher')"
                    hide-details
                    clearable
                    prepend-inner-icon="mdi-magnify"
                  >
                  </v-text-field>
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-virtual-scroll
              v-if="mdAndUp"
              :items="clefsPourListe || []"
              height="350px"
            >
              <template #default="{item: clef}">
                <item-message-traduction
                  :actif="clef === clefSélectionnée"
                  :clef="clef"
                  :traduction-approuvee="traductionsApprouvées[clef]?.[langueCible]"
                  :traduction-langue-source="traductionsApprouvées[clef]?.[langueSource]"
                  :suggestions="
                    suggestions.filter(
                      s => s.பரிந்துரை.சாபி === clef && s.பரிந்துரை.இலக்கு_மொழி === langueCible,
                    )
                  "
                  @click="clefSélectionnée = clef === clefSélectionnée ? undefined : clef"
                />
              </template>
            </v-virtual-scroll>
            <v-select
              v-else
              v-model="clefSélectionnée"
              :items="clefsPourListe"
              :label="t('languesInterface.dialogueContribuer.message')"
              variant="outlined"
            >
              <template #item="{item, props}">
                <item-message-traduction
                  v-bind="props"
                  :key="item.value"
                  :actif="item.value === clefSélectionnée"
                  :clef="item.value"
                  :traduction-approuvee="traductionsApprouvées[item.value]?.[langueCible]"
                  :traduction-langue-source="traductionsApprouvées[item.value]?.[langueSource]"
                  :suggestions="
                    suggestions.filter(
                      s =>
                        s.பரிந்துரை.சாபி === item.value && s.பரிந்துரை.இலக்கு_மொழி === langueCible,
                    )
                  "
                />
              </template>
              <template #selection="{item}">
                {{
                  couper(
                    traductionsApprouvées[item.value][langueSource] || item.value,
                    20,
                    t('communs.troisPetitsPoints'),
                  )
                }}
              </template>
            </v-select>
          </v-col>

          <v-col
            :cols="mdAndUp ? (clefSélectionnée ? 5 : 9) : 12"
            class="pt-6"
          >
            <div v-if="clefSélectionnée">
              <v-textarea
                v-model="suggestion"
                :label="t('languesInterface.dialogueContribuer.indiceSuggestion')"
                no-resize
                variant="outlined"
                @keydown.enter="(é: KeyboardEvent) => (é.metaKey || é.ctrlKey) && suggérer()"
              ></v-textarea>
              <div class="text-right">
                <v-btn
                  class="mx-2"
                  color="primary"
                  variant="outlined"
                  :disabled="!suggestion"
                  :loading="enTrainDeSuggérer"
                  @click="() => suggérer()"
                >
                  {{ t('languesInterface.dialogueContribuer.suggérer') }}
                  <v-icon end>mdi-hand-pointing-up</v-icon>
                </v-btn>
                <v-btn
                  class="ml-2"
                  variant="outlined"
                  :disabled="!suggestion || enTrainDeSuggérer"
                  @click="suggestion = ''"
                >
                  Effacer <v-icon end>mdi-close</v-icon>
                </v-btn>
              </div>

              <v-textarea
                v-model="texteOriginal"
                class="mt-4"
                append-inner-icon="mdi-content-copy"
                :label="'Text original'"
                readonly
                no-resize
                variant="outlined"
                @click:append-inner="suggestion = texteOriginal"
              ></v-textarea>
            </div>
            <div
              v-else
              class="text-center"
            >
              <p class="my-2 text-h6">Pour commencer, choisissez un message à traduire.</p>
              <img
                :src="imgMessage"
                contain
                :width="mdAndUp ? 400 : 250"
              />
            </div>
          </v-col>
          <v-col
            v-if="clefSélectionnée"
            :cols="mdAndUp ? 4 : 12"
            class="pt-6"
          >
            <div class="text-center">
              <h2 class="text-h4">
                {{ t('languesInterface.dialogueContribuer.titreSuggestions') }}
              </h2>
            </div>
            <div v-if="suggestionsDisponibles">
              <v-list max-height="350px">
                <v-list-group v-if="suggestionsLangueCibleClef.length">
                  <template #activator="{props}">
                    <v-list-item v-bind="props">
                      <v-list-item-title>
                        சமூக பரிந்துரைகள்
                        <v-avatar
                          class="mx-2"
                          color="primary"
                          size="20"
                        >
                          {{ nSuggestionsClefLangueFormattée }}
                        </v-avatar>
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <item-suggestion-traduction
                    v-for="sugg in suggestionsLangueCibleClef"
                    :key="sugg.அடையாளம்"
                    :suggestion="sugg"
                    :compte="sugg.பங்கேற்பாளர்"
                    class="ps-10"
                    @utiliser="suggestion = sugg.பரிந்துரை.மொழிபெயர்ப்பு"
                    @effacer="effacerSuggestion(sugg.அடையாளம்)"
                  />
                </v-list-group>

                <v-list-group>
                  <template #activator="{props}">
                    <v-list-item v-bind="props">
                      <v-list-item-title>
                        தானாக பரிந்துரைகள்
                        <v-avatar
                          class="mx-2"
                          color="primary"
                          size="20"
                        >
                          {{ nSuggestionsClefLangueFormattée }}
                        </v-avatar>
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </v-list-group>

                <v-list-group>
                  <template #activator="{props}">
                    <v-list-item v-bind="props">
                      <v-list-item-title>
                        வேறு மொழிகள்
                        <v-avatar
                          class="mx-2"
                          color="primary"
                          size="20"
                        >
                          {{ nTraductionsClefsAutresLanguesFormattée }}
                        </v-avatar>
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <item-suggestion-autre-langue
                    v-for="{lng, traduc} in traductionsClefAutresLangues"
                    :key="lng"
                    :lng="lng"
                    :traduc="traduc"
                    @click="suggestion = traduc"
                  />
                </v-list-group>
              </v-list>
            </div>
            <div
              v-else-if="clefSélectionnée"
              class="text-center"
            >
              <img
                :src="imgVide"
                contain
                :width="mdAndUp ? 300 : 200"
                class="my-4"
              />
              <p class="my-2">
                {{ t('languesInterface.dialogueContribuer.aucuneSuggestion') }}
              </p>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          :text="t('communs.fermer')"
          append-icon="mdi-close"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {computed, inject, onMounted, ref, watch} from 'vue';
import {useDisplay} from 'vuetify';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import type {கிளிமூக்கு, மொழிபெயர்ப்பு_அகராதி_வகை} from '@lassi-js/kilimukku';
import type {ClientConstellation} from '@constl/ipa';

import {கிளிமூக்கை_பயன்படுத்து, எண்களைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {couper} from '/@/utils';

import ItemLangueProgrès from '/@/components/langues/ItemLangueProgrès.vue';
import JetonLangue from '/@/components/langues/JetonLangue.vue';
import ItemMessageTraduction from './ItemMessageTraduction.vue';
import ItemSuggestionTraduction from './ItemSuggestionTraduction.vue';
import ItemSuggestionAutreLangue from './ItemSuggestionAutreLangue.vue';

import {enregistrerÉcoute} from '/@/components/utils';

const constl = inject<ClientConstellation>('constl');
const கிளி = inject<கிளிமூக்கு>('கிளிமூக்கு');

const {mdAndUp} = useDisplay();
const {மொழி, மாற்றுமொழிகள்} = மொழிகளைப்_பயன்படுத்து();

const {
  கிடைக்கும்_மொழிகளை_பயன்படுத்து,
  சாபிகளை_பயன்படுத்து,
  மொழிபெயர்ப்புகளை_பயன்படுத்து,
  பரிந்துரைகளை_பயன்படுத்து,
  மொழியாக்கம்_பயன்படுத்து,
  மொழி_முன்னேற்றத்தை_பயன்படுத்து,
} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const {எண்ணை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

const {கிடைக்கும்_மொழி_குறியீடுகள்} = கிடைக்கும்_மொழிகளை_பயன்படுத்து({});

// Navigation
const dialogue = ref(false);

// Général
const monCompte = ref<string>();
onMounted(async () => {
  monCompte.value = await constl?.obtIdCompte();
});

// Contrôles
const langueSource = ref(மொழி.value);
const langueCible = ref<string>(மாற்றுமொழிகள்.value[0]);
const montrer = ref<'toutes' | 'nonTraduites' | 'sansSuggestion'>('nonTraduites');
const rechercher = ref('');

const échangerLangues = () => {
  const langueCibleAvant = langueCible.value;
  langueCible.value = langueSource.value;
  langueSource.value = langueCibleAvant;
};

// Ligne de progrès
const {மொழி_முன்னேற்றம்: progrèsLangue} = மொழி_முன்னேற்றத்தை_பயன்படுத்து({
  மொழி: langueCible,
  வகை: 'வார்த்தை',
});
const progrèsApprouvé = computed(() => {
  if (progrèsLangue.value)
    return progrèsLangue.value.அங்கீகரிக்கப்பட்டவை / progrèsLangue.value.மொத்தம்;
  else return 0;
});
const progrèsSuggéré = computed(() => {
  if (progrèsLangue.value)
    return progrèsLangue.value.பரிந்துரைக்கப்பட்டவை / progrèsLangue.value.மொத்தம்;
  else return 0;
});

// Liste clefs à traduire
const {சாபிகள்: clefsDisponibles} = சாபிகளை_பயன்படுத்து({});
const clefsPourListe = computed(() => {
  if (!clefsDisponibles.value) return;
  let toutesClefs: string[] = clefsDisponibles.value;
  if (montrer.value === 'nonTraduites' || montrer.value === 'sansSuggestion') {
    toutesClefs = toutesClefs.filter(c => !traductionsApprouvéesLangueCible.value[c]);
    if (montrer.value === 'sansSuggestion') {
      toutesClefs = toutesClefs.filter(c => !suggestions.value.find(s => s.பரிந்துரை.சாபி === c));
    }
  }
  if (rechercher.value) {
    toutesClefs = toutesClefs.filter(
      c =>
        c.toLowerCase().includes(rechercher.value.toLowerCase()) ||
        Object.values(traductionsApprouvées.value[c] || {}).some(t =>
          t.toLowerCase().includes(rechercher.value.toLowerCase()),
        ),
    );
  }
  return toutesClefs;
});
const clefSélectionnée = ref<string>();
watch(clefSélectionnée, () => {
  suggestion.value = '';
});

const {அங்கீகரிக்கப்பட்ட_மொழிபெயர்ப்புகள்: traductionsApprouvées} = மொழிபெயர்ப்புகளை_பயன்படுத்து(
  {},
);
const traductionsApprouvéesLangueCible = computed(() => {
  const {value: lngCible} = langueCible;
  return (
    (lngCible &&
      Object.fromEntries(
        Object.keys(traductionsApprouvées.value).map(c => [
          c,
          traductionsApprouvées.value[c][lngCible],
        ]),
      )) ||
    {}
  );
});

// Panneau traduire
const {obtImageDéco} = utiliserImagesDéco();

const imgMessage = obtImageDéco('message');

const suggestion = ref<string>();
const texteOriginal = computed(() => {
  if (clefSélectionnée.value)
    return traductionsApprouvées.value[clefSélectionnée.value]?.[langueSource.value];
  return undefined;
});

const enTrainDeSuggérer = ref(false);
const suggérer = async () => {
  enTrainDeSuggérer.value = true;

  if (clefSélectionnée.value && suggestion.value && langueCible.value) {
    await கிளி?.மொழிபெயர்ப்பை_பரிந்துரையு({
      சாபி: clefSélectionnée.value,
      மொழிபெயர்ப்பு: suggestion.value.trim(),
      இலக்கு_மொழி: langueCible.value,
      மூல்_மொழி: langueSource.value,
      மூல்_உரை: texteOriginal.value,
    });
  }
  suggestion.value = '';

  enTrainDeSuggérer.value = false;
};

// Suggestions
const suggestionsDisponibles = computed(() => {
  return suggestionsLangueCibleClef.value.length || traductionsClefAutresLangues.value?.length;
});
const imgVide = obtImageDéco('vide');
const {பரிந்துரைகள்: suggestions} = பரிந்துரைகளை_பயன்படுத்து({});
const suggestionsLangueCibleClef = computed(() => {
  const {value: lngCible} = langueCible;
  return (
    (lngCible &&
      suggestions.value.filter(
        s => s.பரிந்துரை.இலக்கு_மொழி === lngCible && s.பரிந்துரை.சாபி === clefSélectionnée.value,
      )) ||
    []
  );
});
const effacerSuggestion = async (id: string) => {
  await கிளி?.கிளி?.பரிந்துரையை_நீக்கு({
    அடையாளம்: id,
  });
};
const nSuggestionsClefLangue = computed(() => suggestionsLangueCibleClef.value.length);
const nSuggestionsClefLangueFormattée = எண்ணை_வடிவூட்டு(nSuggestionsClefLangue);

const toutesTraductions = ref<மொழிபெயர்ப்பு_அகராதி_வகை>();
const traductionsClefToutesLangues = computed(() => {
  if (clefSélectionnée.value && toutesTraductions.value)
    return toutesTraductions.value[clefSélectionnée.value];
  return [];
});
enregistrerÉcoute(
  கிளி?.மொழிபெயர்ப்புகளை_கேள்ளு({
    செ: trads => (toutesTraductions.value = trads),
  }),
);

const traductionsClefAutresLangues = computed(() => {
  if (traductionsClefToutesLangues.value)
    return Object.entries(traductionsClefToutesLangues.value)
      .map(([lng, traduc]) => ({
        lng,
        traduc,
      }))
      .filter(({lng}) => lng !== langueCible.value && lng !== langueSource.value);
  else return [];
});

const nTraductionsClefsAutresLanguesFormattée = எண்ணை_வடிவூட்டு(
  computed(() => traductionsClefAutresLangues.value.length),
);
</script>
