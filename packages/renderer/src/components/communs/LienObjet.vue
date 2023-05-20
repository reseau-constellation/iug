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
        <template #title>{{ id }}</template>
        <template #append>
          <v-btn
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
import {ref} from 'vue';
import {copier} from '/@/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {mergeProps} from 'vue';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const props = defineProps<{id: string}>();

// Contrôles
const copié = ref(false);
const copierLien = async () => {
  await copier(props.id);
  copié.value = true;
};
</script>
