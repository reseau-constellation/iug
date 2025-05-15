<template>
  <v-menu>
    <template #activator="{props: propsMenu}">
      <v-tooltip :text="t('lienObjet.indice')">
        <template #activator="{props: propsIndice}">
          <v-btn
            v-bind="mergeProps(propsMenu, propsIndice)"
            icon="mdi-link"
            size="small"
            variant="flat"
          >
          </v-btn>
        </template>
      </v-tooltip>
    </template>
    <v-list @click.stop>
      <v-list-item>
        <template #title>
          <v-text-field
            v-if="editable"
            v-model="choixId"
            min-width="250"
            hide-details
            density="compact"
            variant="underlined"
          ></v-text-field>
          <span v-else>{{ id }}</span>
        </template>
        <template #append>
          <v-btn
            v-if="editable && idModifié"
            icon="mdi-content-save-outline"
            size="small"
            variant="flat"
            @click="() => émettre('modifie', choixId)"
          ></v-btn>
          <v-btn
            v-else
            :icon="copié ? 'mdi-check' : 'mdi-content-copy'"
            size="small"
            variant="flat"
            @click="copierLien"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, mergeProps, ref, watchEffect} from 'vue';
import {copier} from '/@/utils';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const props = defineProps({
  id: {type: String, required: true},
  editable: {type: Boolean, default: false},
});
const émettre = defineEmits<{
  (é: 'modifie', val: string): void;
}>();

// Modifications
const choixId = ref(props.id);
watchEffect(() => (choixId.value = props.id));
const idModifié = computed(() => choixId.value !== props.id);

// Contrôles
const copié = ref(false);
const copierLien = async () => {
  await copier(props.id);
  copié.value = true;
};
</script>
