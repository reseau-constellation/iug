<template>
  <v-btn
    :style="'position: absolute;' + (isRtl ? 'left:' : 'right:') + '20px; top: 20px'"
    icon="mdi-earth"
    size="small"
  >
    <v-icon size="large"></v-icon>

    <v-menu
      activator="parent"
      open-on-hover
      offset="10px"
      min-width="225"
      :location="isRtl ? 'bottom right' : 'bottom left'"
    >
      <v-list
        class="overflow-y-auto"
        max-height="500px"
        min-width="200px"
      >
        <item-langue
          v-for="code in codesLanguesDisponibles"
          :key="code"
          :code="code"
          :selectionnee="code === langueSélectionnée"
        />
      </v-list>
      <v-divider />
      <!--<dialogue-traductions-interface>
        <template v-slot:activator="{on, attrs}">
          <v-list-item
            v-bind="attrs"
            v-on="on"
          >
            <v-list-item-icon>
              <v-icon>mdi-pencil-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              {{ $t('opsLangue.Contribuer') }}
            </v-list-item-content>
          </v-list-item>
        </template>
      </dialogue-traductions-interface>-->
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
import {useRtl} from 'vuetify';
import {utiliserLangues} from '/@/composables/langues';

import ItemLangue from '/@/components/langues/ItemLangueProgrès.vue';
// import dialogueTraductionsInterface from '@/components/commun/traductions/dialogueTraductionsInterface.vue';

const {isRtl} = useRtl();

const {utiliserCodesLanguesDisponibles, utiliserLangueSélectionnée} = utiliserLangues();
const codesLanguesDisponibles = utiliserCodesLanguesDisponibles();
const langueSélectionnée = utiliserLangueSélectionnée();
</script>

<style></style>
