<template>
  <CarteCode :codes="codes">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
  </CarteCode>
</template>

<script setup lang="ts">
import type {ClientConstellation, bds} from '@constl/ipa';

import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import CarteCode from '/@/components/communs/CarteCode.vue';
import {computed, inject, ref} from 'vue';
import {enregistrerÉcoute} from '../utils';

const {மொழி, மாற்றுமொழிகள்} = மொழிகளைப்_பயன்படுத்து();
const constl = inject<ClientConstellation>('constl');

const languesPréférées = computed(() => {
  return [மொழி.value, ...மாற்றுமொழிகள்.value];
});

const props = defineProps<{id: string}>();

const codes = computed(() => {
  return {
    ts: `
const analyser = async (données) => {
    console.log(données)  // Faire quelque chose de plus intelligent ici :)
}
const fOublierDonnées = await client.nuées.suivreDonnéesExportation({
    idNuée: "${props.id}",
    // Modifier langues selon vos besoins
    langues: [${languesPréférées.value.map(lng => '"' + lng + '"').join(', ')}],
    nRésultatsDésirés: 100,
    f: analyser
});
`,
    py: `from constellationPy import Serveur, ClientSync

client = ClientSync()

with Serveur():
    client = ClientSync()

    données = client.obt_données_tableau_nuée(
        id_nuée="${props.id}",
        clef_tableau=${clefTableau.value},
        n_résultats_désirés=100,
        # Modifier langues selon vos besoins
        langues=[[${languesPréférées.value.map(lng => '"' + lng + '"').join(', ')}]]
    )

    # Analyser ou sauvegarder les données ici...
    données.to_excel("./MesDonnéesExportées.xlsx")
`,
    jl: `import Constellation

Constellation.avecServeur() do port
    Constellation.avecClient(port) do client
        donnéesRéseau = Constellation.obtDonnéesTableauNuée(
          client, 
          "${props.id}", 
          ${clefTableau.value}, 
          // Modifier langues selon vos besoins
          [${languesPréférées.value.map(lng => '"' + lng + '"').join(', ')}]
        )
    end
end`,
    r: `library(constellationR)

constellationR::avecClientEtServeur(
  function (client) {
    f <- function(résultats) {
      print(résultats)

      # Analyser les données ici...
    }

    oublier <- client$obtDonnéesTableauNuée(
      f=f,
      idNuée="${props.id}",
      clefTableau=${clefTableau.value},
      nRésultatsDésirés=100
    )
  }
)
`,
  };
});

const infoTableaux = ref<bds.infoTableauAvecId[]>();
enregistrerÉcoute(
  constl?.nuées.suivreTableauxNuée({
    idNuée: props.id,
    f: x => (infoTableaux.value = x),
  }),
);
const clefTableau = computed(() => {
  return infoTableaux.value?.find(tbl => tbl.id === props.id)?.clef;
});
</script>
