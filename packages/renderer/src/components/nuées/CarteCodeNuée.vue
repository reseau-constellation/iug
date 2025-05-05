<template>
  <carte-code
    :codes="codes"
    langage-defaut="py"
  >
    <template #activateur="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
  </carte-code>
</template>

<script setup lang="ts">
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import CarteCode from '/@/components/communs/CarteCode.vue';

const {மொழி, மாற்றுமொழிகள்} = மொழிகளைப்_பயன்படுத்து();

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
    f: analyser
});
`,
    py: `from constellationPy import Serveur, ClientSync

with Serveur():
    client = ClientSync()

    données = client.obt_données_nuée(
        id_nuée="${props.id}",
        # Modifier langues selon vos besoins
        langues=[${languesPréférées.value.map(lng => '"' + lng + '"').join(', ')}]
    )

    # Analyser ou sauvegarder les données ici, par exemple...
    données.exporter("fichier.ods")  # ou bien "fichier.xlsx" pour Excel

    # Accéder à un tableau en format pandas
    données_tableau = tableau_exporté_à_pandas(données["Un tableau"])
`,
    julia: `import Constellation

Constellation.avecServeur() do port
    Constellation.avecClient(port) do client
        donnéesRéseau = Constellation.obtDonnéesTableauNuée(
          client, 
          "${props.id}", 
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
    )
  }
)
`,
  };
});
</script>
