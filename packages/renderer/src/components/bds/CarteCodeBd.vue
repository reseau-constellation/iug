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
import {computed} from 'vue';
import CarteCode from '/@/components/communs/CarteCode.vue';

const props = defineProps<{id: string}>();

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
  f: monAnalyse
})
`,
    py: `from constellationPy import Serveur, ClientSync
    
with Serveur():
    client = ClientSync()

    données = client.bds.suivreDonnéesExportation(
      idBd="${props.id}"
    )
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
