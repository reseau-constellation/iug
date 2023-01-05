<template>
  <v-navigation-drawer
    expand-on-hover
    permanent
    rail
  >
    <v-list>
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
        title="Sandra Adams"
        subtitle="sandra_a88@gmailcom"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list
      density="compact"
      class="align-start"
      nav
    >
      <v-list-item
        prepend-icon="mdi-folder"
        title="My Files"
        value="myfiles"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-multiple"
        title="Shared with me"
        value="shared"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-star"
        title="Starred"
        value="starred"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { inject, ref, onMounted, onUnmounted } from 'vue';
import type ClientConstellation from '@constl/ipa';
import type { schémaFonctionOublier } from '@constl/ipa/dist/utils';


const constl: ClientConstellation = inject('constl')!;
const image = ref<Uint8Array | null>();

let oublierImageProfil: schémaFonctionOublier;

onMounted(async () => {
  oublierImageProfil = await constl.profil!.suivreImage({
    f: x => image.value = x,
  });
});

onUnmounted(async () => {
  if (oublierImageProfil) await oublierImageProfil();
});

</script>
