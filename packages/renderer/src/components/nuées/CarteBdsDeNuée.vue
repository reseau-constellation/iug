<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      class="mx-auto"
      :min-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex align-center">
          {{ t('nuées.bds.carte.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          />
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <v-list>
          <nouvelle-bd :init="{type: 'nuée', id: idNuee}">
            <template #activateur="{props: propsActivateur}">
              <v-list-item
                v-bind="propsActivateur"
                prepend-icon="mdi-database-plus-outline"
              >
                {{ t('nuées.bds.créer') }}
              </v-list-item>
            </template>
          </nouvelle-bd>
          <v-divider />
          <item-bd
            v-for="idBd in bdsDeNuée"
            :id="idBd"
            :key="idBd"
          />
          <div class="text-center">
            <p
              v-if="!bdsDeNuée?.length"
              class="my-4 text-h6 text-disabled"
            >
              {{ t('nuées.aucuneBd') }}
            </p>
          </div>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {rechercher} from '@constl/vue';
import {utiliserConstellation} from '../utils';
import ItemBd from '/@/components/bds/ItemBd.vue';
import NouvelleBd from '/@/components/bds/NouvelleBd.vue';

const props = defineProps<{idNuee: string}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();
const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);

// Bds
const {résultats: bdsDeNuée} = rechercher(constl.nuées.suivreBdsCorrespondantes, {
  idNuée: computed(() => props.idNuee),
});
</script>
