<template>
  <div>
    <v-container
      class="text-center"
      style="height: 100%"
    >
      <v-row
        align="center"
        no-gutters
        style="height: 80%"
      >
        <v-col>
          <LogoAnimé
            :largeur="500"
            :delai="délai"
            :debut="début"
          />
          <h1 class="mt-6 text-h1">{{ $t('communs.constellation') }}</h1>
          <p class="text-subtitle-1 text-disabled">
            {{ $t('accueil.version') }} {{ VERSION_APPLI }}
          </p>

          <div
            class="my-6"
            style="height: 150px"
          >
            <v-fade-transition leave-absolute>
              <v-btn
                v-show="animationTerminée"
                variant="outlined"
                @click="entrer"
              >
                {{ $t('accueil.démarrer') }}
              </v-btn>
            </v-fade-transition>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-footer>
      <v-container
        class="text-center"
        style="height: 100%"
      >
        <p class="text-disabled">
          {{ $t('accueil.piedDePage') }}
        </p>
      </v-container>
    </v-footer>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';

import LogoAnimé from '/@/components/LogoAnimé.vue';

const emit = defineEmits(['entrer']);
const entrer = () => emit('entrer');

const délai = ref(3);
const début = ref(2);
const animationTerminée = ref(false);

const VERSION_APPLI = import.meta.env.VITE_APP_VERSION;

onMounted(() => {
  setTimeout(() => (animationTerminée.value = true), (délai.value + début.value) * 1000);
});
</script>
