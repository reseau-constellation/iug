<template>
  <carte-code :codes="codes">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
  </carte-code>
</template>

<script setup lang="ts">
import {suivre} from '@constl/vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import CarteCode from '/@/components/communs/CarteCode.vue';

import {utiliserConstellation} from '../utils';

const {மொழி, மாற்றுமொழிகள்} = மொழிகளைப்_பயன்படுத்து();

const constl = utiliserConstellation();

const languesPréférées = computed(() => {
  return [மொழி.value, ...மாற்றுமொழிகள்.value];
});

const props = defineProps<{id: string}>();

const codes = computed(() => {
  return {
    ts: `import { créerConstellation, type nuées } from "@constl/ipa";

const client = créerConstellation();

const analyser = async (données: nuées.donnéesNuéeExportation) => {
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

with Serveur():
    client = ClientSync()

    données = client.obt_données_tableau_nuée(
        id_nuée="${props.id}",
        clef_tableau=${clefTableau.value},
        n_résultats_désirés=100,
        # Modifier langues selon vos besoins
        langues=[${languesPréférées.value.map(lng => '"' + lng + '"').join(', ')}]
    )

    # Analyser ou sauvegarder les données ici...
    données.to_excel("./MesDonnéesExportées.xlsx")
`,
    julia: `import Constellation

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

const infoTableaux = suivre(constl.nuées.suivreTableauxNuée, {
  idNuée: computed(() => props.id),
});
const clefTableau = computed(() => {
  return infoTableaux.value?.find(tbl => tbl.id === props.id)?.clef;
});
</script>
