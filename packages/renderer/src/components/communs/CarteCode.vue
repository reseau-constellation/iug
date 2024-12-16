<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card max-width="500">
      <v-card-title>
        {{ t('code.carte.titre') }}
      </v-card-title>
      <v-card-text>
        <v-divider />
        <v-row class="mt-2">
          <v-col class="py-2">
            <h3> {{ t('code.options.langage') }}</h3>
            <v-btn-toggle
              v-model="langage"
              mandatory
              density="compact"
              class="my-2"
            >
              <v-btn
                v-for="lng in langages"
                :key="lng"
                :value="lng"
                color="primary"
              >
                {{ t(`communs.langagesInformatiques.${lng}.abr`) }}
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            v-if="codeInstallation"
            cols="12"
            class="py-2"
          >
            <v-divider />
            <v-code-block
              :code="codeInstallation"
              :lang="codeInstallation.startsWith('$') ? 'shell' : langage"
              highlightjs
              max-height="75"
              theme="docco"
            />
            <v-divider />
          </v-col>
          <v-col
            cols="12"
            class="py-2"
          >
            <v-divider />
            <v-code-block
              :lang="langage"
              :code="code"
              :persistent-copy-button="mdAndDown"
              :max-height="codeInstallation ? 225 : 300"
              highlightjs
              theme="docco"
            />
            <v-divider />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="outlined"
          append-icon="mdi-close"
          @click="menu = false"
        >
          {{ t('communs.fermer') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import VCodeBlock from '@wdns/vue-code-block';

import {computed, onMounted, ref} from 'vue';

import {watch} from 'vue';
import {useDisplay} from 'vuetify';

const props = defineProps<{
  codes: {[langage: string]: string};
  installation?: {[langage: string]: string};
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();

const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const {mdAndDown} = useDisplay();

const menu = ref(false);
const copié = ref(false);

const langage = ref<string>();
const langages = computed(() => Object.keys(props.codes));
onMounted(() => {
  langage.value = langages.value[0];
});

const code = computed(() => {
  return langage.value ? props.codes[langage.value] : '';
});

watch(langage, () => (copié.value = false));

const installationDéfaut: {[langage: string]: string} = {
  ts: '$ pnpm add @constl/ipa',
  py: '$ poetry add constellationPy',
  julia: '$ pkg> add Constellation',
  r: `# install.packages("devtools")
devtools::install_github("reseau-constellation/client-r")`,
};

const codeInstallation = computed(() => {
  return langage.value
    ? {...installationDéfaut, ...(props.installation || {})}[langage.value]
    : undefined;
});
</script>
