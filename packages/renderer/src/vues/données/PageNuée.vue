<template>
  <v-container>
    <div>
      <v-breadcrumbs
        v-if="mdAndUp"
        :items="petitPousset"
        class="pa-0"
      >
        <template #divider>
          <v-icon>{{ isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right' }}</v-icon>
        </template>
        <template #title="{item}">
          <v-breadcrumbs-item
            :disabled="item.disabled"
            @click="item.href && $router.push(item.href)"
          >
            <TexteTronque
              :texte="item.title"
              :longueur-max="35"
            />
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <v-btn
        v-else
        icon="mdi-arrow-left-top"
        variant="flat"
        @click="() => $router.push(encodeURI('/données/'))"
      />
    </div>
    <TitrePage :titre="nomTraduit || couper(id, 50, t('communs.troisPetitsPoints'))" />
    <p>{{ id }}</p>
    <generer-appli :id-nuee="id">
      <template #activator="{props: propsActivateurCarte}">
        <v-tooltip
          :text="t('code.générerAppli.indice')"
          :open-delay="200"
          location="bottom"
        >
          <template #activator="{props: propsActivateurIndice}">
            <v-btn
              v-bind="{...propsActivateurCarte, ...propsActivateurIndice}"
              variant="flat"
              icon
            >
              <v-icon
                icon="mdi-creation-outline"
                color="primary"
              ></v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
    </generer-appli>
    <carte-code-nuee :id="id">
      <template #activator="{props: propsActivateurCarte}">
        <v-tooltip
          :text="t('code.indice')"
          :open-delay="200"
          location="bottom"
        >
          <template #activator="{props: propsActivateurIndice}">
            <v-btn
              v-bind="{...propsActivateurCarte, ...propsActivateurIndice}"
              icon="mdi-xml"
              variant="flat"
            />
          </template>
        </v-tooltip>
      </template>
    </carte-code-nuee>
    {{ tableaux }}
    {{ autorisation }}
  </v-container>
</template>

<script setup lang="ts">
import {suivre} from '@constl/vue';
import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, onMounted} from 'vue';

import {utiliserConstellation} from '/@/components/utils';
import {couper} from '/@/utils';

import TitrePage from '/@/components/communs/TitrePage.vue';
import CarteCodeNuee from '/@/components/nuées/CarteCodeNuée.vue';
import GenererAppli from '/@/components/nuées/GénérerAppli.vue';
import TexteTronque from '/@/components/communs/TexteTronqué.vue';

import {utiliserHistoriqueDocuments} from '/@/état/historiqueDocuments';
import { useDisplay, useRtl } from 'vuetify';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {mdAndUp} = useDisplay();
const {isRtl} = useRtl();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const historiqueDocuments = utiliserHistoriqueDocuments();

onMounted(() => {
  historiqueDocuments.documentOuvert({id: props.id, à: Date.now()});
});

// Navigation
const petitPousset = computed<{title: string; href?: string; disabled?: boolean}[]>(() => [
  {title: t('navigation.données') as string, href: encodeURI('/données/')},
  {title: nomTraduit.value || t('nuées.sansNom'), disabled: true},
]);

// Nom de la nuée
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = suivre(constl.nuées.suivreNomsNuée, {idNuée: props.id});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

/*
const estApprouvable = computed(()=>{})
const activerApprouvable = async () => {

}
*/

// Tableaux
const tableaux = suivre(constl.nuées.suivreTableauxNuée, {idNuée: props.id});

const autorisation = suivre(constl.nuées.suivrePhilosophieAutorisation, {idNuée: props.id});
</script>
