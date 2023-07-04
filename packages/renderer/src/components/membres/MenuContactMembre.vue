<template>
  <v-menu>
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-list>
      <v-list-item
        prepend-icon="mdi-content-copy"
        @click="copierContact"
      >
        <v-list-item-title>{{ t('membres.menuContact.copier') }}</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="autoContactable"
        :prepend-icon="icône"
        @click="contacter"
      >
        <v-list-item-title>{{ t('membres.menuContact.contacter') }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script setup lang="ts">
import {computed} from 'vue';

import {copier, ouvrirLien} from '/@/utils';

import {utiliserNumération} from '/@/plugins/localisation/localisation';
import {obtIcôneContact} from './utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const props = defineProps<{type: string; contact: string}>();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {formatterNuméro} = utiliserNumération();

// Contenu
const icône = computed(() => {
  return obtIcôneContact({type: props.type});
});

const autoContactable = computed(() => {
  return ['siteInternet', 'télégramme', 'téléphone', 'courriel', 'whatsapp'].includes(props.type);
});

const copierContact = async () => {
  await copier(props.contact);
};

const numéroLatin = formatterNuméro(props.contact, 'latin');

const contacter = () => {
  switch (props.type) {
    case 'siteInternet':
      ouvrirLien(props.contact);
      break;
    case 'courriel':
      ouvrirLien(`mailto://${props.contact}`);
      break;
    case 'whatsapp': {
      const messageSalut = t('membres.menuContact.messageSalut');
      ouvrirLien(`whatsapp://send?text=${messageSalut}&phone=${numéroLatin.value}`);
      break;
    }
    case 'téléphone': {
      ouvrirLien(`tel://${props.contact}`);
      break;
    }
    case 'télégrame': {
      ouvrirLien(`tg://resolve?phone=${numéroLatin.value}`);
      break;
    }
    default:
      break;
  }
};
</script>
