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
        <v-list-item>
          <template #prepend>
            <v-icon> mdi-plus </v-icon>
          </template>
          <v-list-item-title>
            {{ $t('languesInterface.contribuer') }}
          </v-list-item-title>
        </v-list-item>
        <v-divider />
        <item-langue
          v-for="code in codesLanguesDisponibles"
          :key="code"
          :code="code"
          :selectionnee="code === langue"
        />
      </v-list>
      <!--<dialogue-traductions-interface>
        <template v-slot:activator="{on, attrs}">-->

      <!--</template>
      </dialogue-traductions-interface>-->
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
import {useRtl} from 'vuetify';
import {utiliserLangues} from '/@/plugins/localisation/localisation';

import ItemLangue from '/@/components/langues/ItemLangueProgrès.vue';
// import dialogueTraductionsInterface from '@/components/commun/traductions/dialogueTraductionsInterface.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const {useI18n, கிடைக்கும்_மொழிகளை_பயன்படுத்து} = கிளிமூக்கை_உபயோகி();
const {$t} = useI18n();

const {isRtl} = useRtl();

const {langue} = utiliserLangues();
const {codesLanguesDisponibles} = கிடைக்கும்_மொழிகளை_பயன்படுத்து();
</script>

<style></style>
