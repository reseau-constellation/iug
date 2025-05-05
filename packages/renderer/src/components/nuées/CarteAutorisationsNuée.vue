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
          {{ t('nuées.autorisations.carte.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          />
        </v-card-title>
      </v-card-item>
      <v-card-text v-if="monAutorisation">
        <p class="mt-2 font-weight-bold">{{ t('nuées.autorisations.philosophie') }}</p>
        <v-divider />
        <v-radio-group
          v-model="autorisation"
        >
          <v-radio
            value="CJPI"
            class="my-2"
          >
            <template #label>
              <div>
                <p>{{ t('nuées.nouvelle.parInvitation') }}</p>
                <p class="text-disabled">
                  {{ t('nuées.nouvelle.indiceParInvitation') }}
                </p>
              </div>
            </template>
          </v-radio>
          <v-radio
            value="IJPC"
            class="my-2"
          >
            <template #label>
              <div>
                <p>{{ t('nuées.nouvelle.ouverteÀTous') }}</p>
                <p class="text-disabled">
                  {{ t('nuées.nouvelle.indiceOuverteÀTous') }}
                </p>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
        <p class="mt-2 font-weight-bold">
          {{
            t(
              `nuées.autorisations.${autorisation === 'CJPI' ? 'membresAutorisés' : 'membresBloqués'}`,
            )
          }}
        </p>
        <v-divider />
        <v-dialog>
          <template #activator="{props: propsActivateur}">
            <v-list-item
              v-bind="propsActivateur"
              :prepend-icon="autorisation === 'CJPI' ? 'mdi-account-plus-outline' : 'mdi-account-cancel-outline'"
            >
              {{
                t(
                  `nuées.autorisations.${autorisation === 'CJPI' ? 'ajouterMembreAccepté' : 'ajouterMembreExclus'}`,
                )
              }}
            </v-list-item>
          </template>
          <v-card
            class="mx-auto"
            :max-width="500"
            :min-width="300"
          >
            <v-card-text>
              <selecteur-membre
                multiples
                :interdits="autorisation === 'CJPI' ? membresAcceptés : membresExclus"
                @selectionnee="membres => lorsqueMembresSélectionnés(membres)"
              />
            </v-card-text>  
          </v-card>
        </v-dialog>
        <p
          v-if="autorisation === 'CJPI' ? !membresAcceptés?.length : !membresExclus?.length"
          class="text-h6 text-disabled text-center"
        >
          {{ t(`nuées.autorisations.${autorisation === 'CJPI' ? 'aucunMembreAccepté' : 'aucunMembreExclus'}`) }}
        </p>
        <v-list v-if="autorisation === 'CJPI'">
          <item-membre-accepte-nuee
            v-for="membre in membresAcceptés"
            :key="membre"
            :id-compte="membre"
            @effacer="idMembre=>révoquerAcceptationMembre(idMembre)"
          />
        </v-list>
        <v-list v-else-if="autorisation === 'IJPC'">
          <item-membre-exclus-nuee
            v-for="membre in membresExclus"
            :key="membre"
            :id-compte="membre"
            @effacer="idMembre=>révoquerExclusionMembre(idMembre)"
          />
        </v-list>
      </v-card-text>
      <v-card-text v-else>
        <div class="text-center">
          <p class="text-h5">{{ autorisation === 'CJPI' ? t('nuées.autorisations.parInvitation') : t('nuées.autorisations.ouverteÀTous') }}</p>
          <p class="text-disabled text-h6">
            {{ autorisation === 'CJPI' ? t('nuées.autorisations.indiceParInvitation') : t('nuées.autorisations.indiceOuverteÀTous') }}
          </p>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <btn-annuler @click="dialogue = false" />
        <btn-sauvegarder
          :actif="modifié"
          @click="() => sauvegarder()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import SelecteurMembre from '/@/components/membres/SélecteurMembre.vue';
import ItemMembreExclusNuee from '../nuées/ItemMembreExclusNuée.vue';
import ItemMembreAccepteNuee from '../nuées/ItemMembreAcceptéNuée.vue';

import BtnAnnuler from '/@/components/communs/BtnAnnuler.vue';
import BtnSauvegarder from '/@/components/communs/BtnSauvegarder.vue';

import {suivre} from '@constl/vue';
import {watchEffect} from 'vue';
import {utiliserConstellation} from '../utils';

const props = defineProps<{idNuee: string}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();
const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);

// Accès à la Nuée
const monAutorisation = suivre(constl.suivrePermission, {idObjet: computed(() => props.idNuee)});

// Autorisation
const autorisationNuée = suivre(constl.nuées.suivrePhilosophieAutorisation, {
  idNuée: computed(() => props.idNuee),
});
const autorisation = ref(autorisationNuée.value);
watchEffect(() => {
  autorisation.value = autorisationNuée.value;
});

// Membres
const autorisationsMembres = suivre(constl.nuées.suivreAutorisationsMembresDeNuée, {
  idNuée: computed(() => props.idNuee),
});
const membresAcceptés = computed(() =>
  autorisationsMembres.value?.filter(a => a.statut === 'accepté').map(a => a.idCompte),
);
const membresExclus = computed(() =>
  autorisationsMembres.value?.filter(a => a.statut === 'exclus').map(a => a.idCompte),
);

const lorsqueMembresSélectionnés = async (membres: string[]) => {
  if (autorisation.value === 'CJPI') {
    await Promise.all(
      membres.map(async m=>await constl.nuées.accepterMembreNuée({
        idNuée: props.idNuee,
        idCompte: m,
      }),
    ));
  } else if (autorisation.value === 'IJPC') {
    await Promise.all(
      membres.map(async m => await constl.nuées.exclureMembreDeNuée({
        idNuée: props.idNuee,
        idCompte: m,
      })),
    );
  }
};

const révoquerExclusionMembre = async (idMembre: string) => {
  await constl.nuées.révoquerExclusionMembreNuée({
    idNuée: props.idNuee,
    idCompte: idMembre,
  });
}; 
const révoquerAcceptationMembre = async (idMembre: string) => {
  await constl.nuées.révoquerAcceptationMembreNuée({
    idNuée: props.idNuee,
    idCompte: idMembre,
  });
}; 

// Sauvegarde
const modifié = computed(() => autorisation.value !== autorisationNuée.value);
const sauvegarder = () => {};
</script>
