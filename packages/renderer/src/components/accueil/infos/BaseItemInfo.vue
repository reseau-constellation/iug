<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <v-list-item
        v-bind="propsActivateur"
        @click="() => lire()"
      >
        <v-list-item-title>
          <v-avatar
            v-if="!info.lu"
            class="mx-2"
            color="error"
            size="10"
          />
          {{ titre }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ sousTitre }}
        </v-list-item-subtitle>

        <v-btn
          v-if="texteAction"
          class="mt-2"
          variant="flat"
          size="small"
          :append-icon="isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"
        >
          {{ texteAction }}
        </v-btn>

        <template #append>
          <v-icon
            icon="mdi-close"
            @click.stop="() => fermer()"
          />
        </template>
      </v-list-item>
    </template>
    <v-card
      :max-width="mdAndUp ? 700 : 300"
      class="mx-auto"
    >
      <v-card-item>
        <v-card-title class="d-flex align-center">{{ titre }} </v-card-title>
        <v-card-subtitle>
          {{ sousTitre }}
        </v-card-subtitle>
      </v-card-item>
      <v-card-text style="overflow-y: scroll">
        <slot name="contenu" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          append-icon="mdi-close"
          @click="() => (dialogue = false)"
        >
          {{ t('communs.fermer') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {Info, InfoAvecId} from '/@/état/infos';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ref} from 'vue';
import {useDisplay, useRtl} from 'vuetify';
import {utiliserÉtatInfos} from '/@/état/infos';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const props = defineProps<{
  info: InfoAvecId<Info>;
  titre: string;
  sousTitre: string;
  texteAction: string;
}>();

const {isRtl} = useRtl();
const {mdAndUp} = useDisplay();
const étatInfos = utiliserÉtatInfos();

const dialogue = ref(false);

const lire = () => {
  étatInfos.lireInfo(props.info.id);
};

const fermer = () => {
  étatInfos.effacerInfo(props.info.id);
};
</script>
