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
      :width="mdAndUp ? 1500 : 300"
    >
      <v-card-item>
        <v-card-title>{{ t('languesInterface.dialogueContribuer.titre') }}</v-card-title>
        <v-card-subtitle>{{ t('languesInterface.dialogueContribuer.sousTitre') }}</v-card-subtitle>
        <v-divider class="my-3" />
      </v-card-item>

      <v-card-text class="overflow-auto">
        <v-row>
          <v-col :cols="mdAndUp ? 5 : 12">
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
          <v-col :cols="mdAndUp ? 5 : 12">
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
                <v-list-item
                  v-for="clef in clefsPourListe"
                  :key="clef"
                  :active="clef === clefSélectionnée"
                  @click="clefSélectionnée = clef === clefSélectionnée ? undefined : clef"
                >
                  <template #append>
                    <v-icon
                      v-if="traductionsApprouvées[clef]?.[langueCible]"
                      color="primary"
                      icon="mdi-check"
                    ></v-icon>
                    <v-badge
                      v-else-if="suggestionsClefLangueCible.length"
                      :content="suggestionsClefLangueCible.length"
                      color="primary"
                      location="bottom end"
                    >
                      <v-icon>mdi-hand-pointing-up</v-icon>
                    </v-badge>
                  </template>
                  <v-list-item-title>
                    {{ traductionsApprouvées[clef][langueSource] || '[Aucune traduction]' }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ clef }}</v-list-item-subtitle>
                </v-list-item>
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
                  (traductionsApprouvées[item.value][langueSource] || item.value).slice(0, 20) +
                    '...'
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
            <div class="text-center"><h2 class="text-h4">Suggestions</h2></div>
            <v-list v-if="texteOriginal">
              <v-list-item>
                <v-list-item-title>
                  {{ texteOriginal }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
            ici {{ suggestions }}
            <div v-if="!suggestionsLangueCible.length">
              <v-list max-height="350px">
                <v-list-item
                  v-for="i in [1, 2, 3, 4, 5]"
                  :key="i"
                >
                  <template #prepend> </template>
                  <v-list-item-subtitle> Date: aujourd'hui </v-list-item-subtitle>
                  <v-list-item-title>
                    <v-textarea
                      readonly
                      variant="plain"
                      no-resize
                      rows="3"
                      hide-details
                      value="Texte de la suggestion. Ça peut être un assez long texte. Peut-être qu'on devrait le mettre dans un v-textarea."
                    />
                  </v-list-item-title>
                  <v-row>
                    <v-col>
                      <JetonMembre
                        v-if="monCompte"
                        :compte="monCompte"
                      />
                    </v-col>
                    <v-col class="text-end">
                      <v-btn
                        text
                        variant="outlined"
                        size="small"
                        @click="suggestion = 'texte de la suggestion'"
                      >
                        Utiliser
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-divider class="mt-2" />
                </v-list-item>
                <v-list-item
                  v-for="sugg in suggestionsLangueCible"
                  :key="sugg.கைரேகை"
                >
                  <v-list-item-title>{{ sugg.கைரேகை }}</v-list-item-title>
                </v-list-item>
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
import {useDisplay} from 'vuetify';
import {utiliserLangues} from '/@/plugins/localisation/localisation';

import ItemLangueProgrès from '/@/components/langues/ItemLangueProgrès.vue';
import JetonLangue from '/@/components/langues/JetonLangue.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {computed, inject, onMounted, ref, watch} from 'vue';
import type {கிளிமூக்கு} from '/@/plugins/kilimukku/கிளிமூக்கு';
import {utiliserImagesDéco} from '/@/composables/images';
import JetonMembre from '../../membres/JetonMembre.vue';
import type ClientConstellation from '@constl/ipa';

const constl = inject<ClientConstellation>('constl');
const கிளி = inject<கிளிமூக்கு>('கிளிமூக்கு');

const {mdAndUp} = useDisplay();
const {langue, languesAlternatives} = utiliserLangues();

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

const {பரிந்துரைகள்: suggestions} = பரிந்துரைகளை_பயன்படுத்து();
const suggestionsLangueCible = computed(() => {
  const {value: lngCible} = langueCible;
  return (lngCible && suggestions.value.filter(s => s.பரிந்துரை.இலக்கு_மொழி === lngCible)) || [];
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

const suggestionsClefLangueCible = computed(() => {
  return suggestions.value.map(
    s =>
      s.பரிந்துரை.சாபி === clefSélectionnée.value && s.பரிந்துரை.இலக்கு_மொழி === langueCible.value,
  );
});
</script>
