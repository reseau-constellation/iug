<template>
  <v-card
    class="text-start"
    variant="flat"
    height="175"
    :image="imageFond"
  >
    <v-card-item>
      <v-card-title>
        {{ t('accueil.page.apprendre.titre') }}
      </v-card-title>
    </v-card-item>
    <v-card-text>
      <v-btn
        class="ma-2"
        prepend-icon="mdi-school-outline"
        :append-icon="isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"
        @click="() => ouvrirLien(URL_TUTORIELS)"
      >
        {{ t('accueil.page.apprendre.tutoriel') }}
      </v-btn>
      <v-btn
        class="ma-2"
        prepend-icon="mdi-book-open-variant-outline"
        :append-icon="isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"
        @click="() => ouvrirLien(URL_DOCUMENTATION)"
      >
        {{ t('accueil.page.apprendre.docu') }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {onMounted, ref} from 'vue';
import {useRtl} from 'vuetify';
import {URL_DOCUMENTATION, URL_TUTORIELS} from '/@/consts';
import {ouvrirLien} from '/@/utils';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {isRtl} = useRtl();

const imageFond = ref<string>();
onMounted(async () => {
  imageFond.value = (await import('/@/assets/fonds/trianglify-lowres.png')).default;
});
</script>
