<template>
  <CarteCode
    :codes="codes"
    langage-defaut="py"
  >
    <template #activateur="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
  </CarteCode>
</template>

<script setup lang="ts">
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import {computed} from 'vue';
import CarteCode from '/@/components/communs/CarteCode.vue';

const props = defineProps<{idTableau: string}>();

const {மொழி, மாற்றுமொழிகள்} = மொழிகளைப்_பயன்படுத்து();

const languesPréférées = computed(() => {
  return [மொழி.value, ...மாற்றுமொழிகள்.value];
});

const codes = {
  ts: `import { créerConstellation } from "@constl/ipa";

const client = créerConstellation();

const monAnalyse = async (données) => {
  console.log(données)
  // Faire quelque chose...
}

const fOublier = client.tableaux.suivreDonnéesExportation({
  idTableau: "${props.idTableau}",
  langues: [${languesPréférées.value.map(lng => '"' + lng + '"').join(', ')}],  // Modifier langues selon vos besoins
  f: monAnalyse
});
`,
  py: `from constellationPy import Serveur, ClientSync

with Serveur():
    client = ClientSync()

    données = client.obt_données_tableau(
      idTableau="${props.idTableau}"
      # Modifier langues selon vos besoins
      langues=[${languesPréférées.value.map(lng => '"' + lng + '"').join(', ')}]
    )

    # Analyser ou sauvegarder les données ici...
    données.to_excel("./MesDonnéesExportées.xlsx")
`,
  julia: `import Constellation

Constellation.avecServeur() do port
  Constellation.avecClient(port) do client

    oublier = Constellation.suivre(
        client, 
        "tableaux.suivreDonnéesExportation", 
        Dict([
          ("idTableau","${props.idTableau}"),
          ("langues", [${languesPréférées.value.map(lng => '"' + lng + '"').join(', ')}])
        ])
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
      "tableaux.suivreDonnéesExportation", 
      list(
        idTableau="${props.idTableau}",
        langues=c(${languesPréférées.value.map(lng => '"' + lng + '"').join(', ')})
      )
    )
  }
)

`,
};
</script>
