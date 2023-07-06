<template>
  <v-dialog>
    <template #activator="{props}">
      <slot
        name="activator"
        v-bind="{props}"
      ></slot>
    </template>

    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 1500 : undefined"
    >
      <v-card-item>
        <v-card-title>{{ t('languesInterface.dialogueContribuer.titre') }}</v-card-title>
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
              :items="codesLanguesDisponibles"
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
              :items="codesLanguesDisponibles"
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
            <v-switch
              v-model="montrerTraduites"
              color="primary"
              hide-details
              :label="t('languesInterface.dialogueContribuer.montrerTraduites')"
            ></v-switch>
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
              <v-list-item>
                <v-list-item-title>
                  <v-text-field
                    v-model="rechercher"
                    variant="outlined"
                    label="Rechercher"
                    hide-details
                    clearable
                    prepend-inner-icon="mdi-magnify"
                  >
                  </v-text-field>
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-list
              v-if="mdAndUp"
              max-height="350px"
            >
              <v-fade-transition group>
                <item-message-traduction
                  v-for="clef in clefsPourListe"
                  :key="clef"
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
              </v-fade-transition>
            </v-list>
            <v-select
              v-else
              v-model="clefSélectionnée"
              :items="clefsPourListe"
              label="Message"
              variant="outlined"
            >
              <template #item="{item, props}">
                <v-list-item
                  v-bind="props"
                  :active="item.value === clefSélectionnée"
                >
                  <template #title>
                    {{ traductionsApprouvées[item.value][langueSource] || '[Aucune traduction]' }}
                  </template>
                  <template #subtitle>
                    {{ item.value }}
                  </template>
                </v-list-item>
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
                label="Suggérez une traduction ici"
                no-resize
                variant="outlined"
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
                  Suggérer <v-icon end>mdi-upload</v-icon>
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
              <img
                :src="imgMessage"
                contain
                :width="mdAndUp ? 400 : 250"
              />
              <p class="my-2">Pour commencer, choisissez un message à traduire.</p>
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
            <div v-if="suggestionsLangueCibleClef.length || traductionsClefAutresLangues?.length">
              <v-list max-height="350px">
                <v-list-item
                  v-if="traductionApprouvée"
                  @click="suggestion = traductionApprouvée"
                >
                  <v-list-item-title> அங்கீகரிக்கப்பட்ட மொழிபெயர்ப்பு </v-list-item-title>
                  {{ traductionApprouvée }}
                </v-list-item>

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
                    :key="sugg.கைரேகை"
                    :suggestion="sugg"
                    :compte="sugg.பங்கேற்பாளர்"
                    @utiliser="suggestion = sugg.பரிந்துரை.மொழிபெயர்ப்பு"
                    @effacer="effacerSuggestion(sugg.கைரேகை)"
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
                  <v-list-item
                    v-for="{lng, traduc} in traductionsClefAutresLangues"
                    :key="lng"
                  >
                    {{ traduc }}
                    <v-list-item-subtitle>
                      {{ lng }}
                    </v-list-item-subtitle>
                  </v-list-item>
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
                Nous n'avons trouvé aucune suggestion communautaire pour ce message.
              </p>
            </div>
          </v-col>
        </v-row>

        <v-btn variant="outlined">Gérer traductions</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {computed, inject, onMounted, ref, watch} from 'vue';
import {useDisplay} from 'vuetify';
import {utiliserLangues, utiliserNumération} from '/@/plugins/localisation/localisation';

import type {கிளிமூக்கு, மொழி_மொழிபெயர்ப்பு_அகராதி_வகை} from '/@/plugins/kilimukku/கிளிமூக்கு';
import type {client} from '@constl/ipa';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {couper} from '/@/utils';

import ItemLangueProgrès from '/@/components/langues/ItemLangueProgrès.vue';
import JetonLangue from '/@/components/langues/JetonLangue.vue';
import ItemMessageTraduction from './ItemMessageTraduction.vue';
import ItemSuggestionTraduction from './ItemSuggestionTraduction.vue';
import {enregistrerÉcoute} from '/@/components/utils';

const constl = inject<client.ClientConstellation>('constl');
const கிளி = inject<கிளிமூக்கு>('கிளிமூக்கு');

const {mdAndUp} = useDisplay();
const {langue, languesAlternatives} = utiliserLangues();
const {formatterChiffre} = utiliserNumération();

const {
  useI18n,
  கிடைக்கும்_மொழிகளை_பயன்படுத்து,
  சாபிகளை_பயன்படுத்து,
  மொழிபெயர்ப்புகளை_பயன்படுத்து,
  பரிந்துரைகளை_பயன்படுத்து,
} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const {codesLanguesDisponibles} = கிடைக்கும்_மொழிகளை_பயன்படுத்து();

// Général
const monCompte = ref<string>();
onMounted(async () => {
  monCompte.value = await constl?.obtIdCompte();
});

// Contrôles
const langueSource = ref(langue.value);
const langueCible = ref<string>(languesAlternatives.value[0]);
const montrerTraduites = ref(false);
const rechercher = ref('');

const échangerLangues = () => {
  const langueCibleAvant = langueCible.value;
  langueCible.value = langueSource.value;
  langueSource.value = langueCibleAvant;
};

// Ligne de progrès
const {மொழி_முன்னேற்றத்தை_பயன்படுத்து} = கிளிமூக்கை_உபயோகி();
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
const {சாபிகள்: clefsDisponibles} = சாபிகளை_பயன்படுத்து();
const clefsPourListe = computed(() => {
  if (!clefsDisponibles.value) return;
  let toutesClefs: string[] = [];
  if (montrerTraduites.value) {
    toutesClefs = clefsDisponibles.value;
  } else {
    toutesClefs = clefsDisponibles.value?.filter(c => !traductionsApprouvéesLangueCible.value[c]);
  }
  if (rechercher.value) {
    toutesClefs = toutesClefs.filter(
      c =>
        c.includes(rechercher.value) ||
        Object.values(traductionsApprouvées.value[c] || {}).some(t => t.includes(rechercher.value)),
    );
  }
  return toutesClefs;
});
const clefSélectionnée = ref<string>();
watch(clefSélectionnée, () => {
  suggestion.value = '';
});

const {அங்கீகரிக்கப்பட்ட_மொழிபெயர்ப்புகள்: traductionsApprouvées} = மொழிபெயர்ப்புகளை_பயன்படுத்து();
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

const traductionApprouvée = computed(() => {
  if (clefSélectionnée.value) return traductionsApprouvéesLangueCible.value[clefSélectionnée.value];
  else return undefined;
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
const imgVide = obtImageDéco('vide');
const {பரிந்துரைகள்: suggestions} = பரிந்துரைகளை_பயன்படுத்து();
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
const effacerSuggestion = async (empreinte: string) => {
  await கிளி?.பரிந்துரையை_நீக்கு({
    கைரேகை: empreinte,
  });
};
const nSuggestionsClefLangue = computed(() => {
  return suggestionsLangueCibleClef.value.length;
});
const nSuggestionsClefLangueFormattée = formatterChiffre(nSuggestionsClefLangue);

const traductionsClefToutesLangues = ref<மொழி_மொழிபெயர்ப்பு_அகராதி_வகை>();
enregistrerÉcoute(
  கிளி?.மொழிபெயர்ப்புகளை_கேள்ளு({
    செ: trads => {
      if (clefSélectionnée.value)
        traductionsClefToutesLangues.value = trads[clefSélectionnée.value];
    },
  }),
);

const traductionsClefAutresLangues = computed(() => {
  if (traductionsClefToutesLangues.value)
    return Object.entries(traductionsClefToutesLangues.value).map(([lng, traduc]) => ({
      lng,
      traduc,
    }));
  else return undefined;
});

const nTraductionsClefsAutresLanguesFormattée = formatterChiffre(
  computed(() => {
    return traductionsClefAutresLangues.value ? traductionsClefAutresLangues.value.length : 0;
  }),
);
</script>
