<template>
  <v-menu :close-on-content-click="false">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      max-width="500"
    >
      <v-card-title>
        {{ t('code.carte.titre') }}
      </v-card-title>
      <v-card-text>
        <v-divider />
        <v-row class="my-2">
          <v-col
            class="py-2"
          >
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
                {{ lng }}
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            class="py-2"
          >
            <v-divider />
            <div style="overflow-y:auto; height: 200px">
              <highlightjs
                :language="langage"
                :code="code"
                :autodetect="false"
              />
            </div>
            <v-divider />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="outlined"
          :append-icon="copié ? 'mdi-check' : 'mdi-content-copy'"
          @click="copierCode"
        >
          {{ t('communs.copier') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import { computed, onMounted, ref } from 'vue';

import { copier } from '/@/utils';
import { watch } from 'vue';

const props = defineProps<{codes: {[langage: string]: string}}>();


const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();

const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const copié = ref(false);

const langage = ref<string>();
const langages = computed(()=>Object.keys(props.codes));
onMounted(()=>{
  langage.value = langages.value[0];
});

const code = computed(()=>{
  return langage.value ? props.codes[langage.value] : '';
});

watch(langage, () => copié.value = false);

const copierCode = async () => {
  await copier(code.value);
  copié.value = true;
};

</script>