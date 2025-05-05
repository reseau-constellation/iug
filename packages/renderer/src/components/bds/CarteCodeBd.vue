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

const props = defineProps<{id: string}>();

const {மொழி, மாற்றுமொழிகள்} = மொழிகளைப்_பயன்படுத்து();

const languesPréférées = computed(() => {
  return [மொழி.value, ...மாற்றுமொழிகள்.value];
});

const codes = computed(() => {
  return {
    ts: `import { créerConstellation } from "@constl/ipa";

const client = créerConstellation();

const monAnalyse = async (données) => {
  console.log(données)
  // Faire quelque chose...
}

const fOublier = client.bds.suivreDonnéesExportation({
  idBd: "${props.id}",
  langues: [${languesPréférées.value.map(lng => '"' + lng + '"').join(', ')}]  // Modifier langues selon vos besoins
  f: monAnalyse
})
`,
    py: `from constellationPy import Serveur, ClientSync, tableau_exporté_à_pandas
    
with Serveur():
    client = ClientSync()

    données = client.obt_données_bd(
      idBd="${props.id}",
      # Modifier langues selon vos besoins
      langues=[${languesPréférées.value.map(lng => '"' + lng + '"').join(', ')}]
    )

    # Exporter les données
    données.exporter("fichier.ods")  # ou bien "fichier.xlsx" pour Excel

    # Accéder à un tableau en format pandas
    données_tableau = tableau_exporté_à_pandas(données["Un tableau"])
    
`,
    julia: `import Constellation

Constellation.avecServeur() do port
  Constellation.avecClient(port) do client

    oublier = Constellation.suivre(
        client, 
        "bds.suivreDonnéesExportation", 
        Dict([("idBd","${props.id}")])
    ) do résultat
        print(résultat)
    end
  end
end
`,
    r: `library(constellationR)

constellationR::avecClientEtServeur(
  function (client) {
    
    données <- client$appeler(
      "bds.suivreDonnéesExportation", 
      list(idBd="${props.id}")
    )
  }
)
`,
  };
});
</script>
