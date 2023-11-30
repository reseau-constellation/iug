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
    ts: `
import { générerClient } from "@constl/ipa";

const client = générerClient({});

client.bds.suivreDonnéesExportation({
  idBd: "${props.id}"
})
`,
    py: `
from constellationPy import Serveur, ClientSync

client = ClientSync()

with Serveur():
  données = client.bds.suivreDonnéesExportation(
    idBd="${props.id}"
  )
`,
    julia: `
import Constellation

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
r: `
library(constellationR)

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
