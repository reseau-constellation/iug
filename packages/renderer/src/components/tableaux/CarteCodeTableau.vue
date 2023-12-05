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
import CarteCode from '/@/components/communs/CarteCode.vue';

const props = defineProps<{id: string}>();
const port = 5000;
const codes = {
  ts: `
const analyser = async (données) => {
    console.log(données) // Faire quelque chose de plus intelligent ici :)
}
const fOublierDonnées = await client.tableaux.suivreDonnéesExportation({
    idTableau: ${props.id},
    langues: ["த", "fr"],
    f: analyser
});
`,
  jl: `

`,
  r: `

`,
  py: `
import trio
from constellationPy import ouvrir_client

async def principale():
    async with ouvrir_client(${port}) as client:
        données = await client.obt_données_tableau(
            id_tableau=${props.id}, langues=["த", "fr"], formatDonnées="pandas"
        )
        
        # Analyser ou sauvegarder les données ici...
        données.to_excel("./MesDonnéesExportées.xlsx")

trio.run(principale)
`,
  'py:sync': `
from constellationPy import ClientSync

client = ClientSync(${port})
données = client.obt_données_tableau(
    id_tableau=${props.id}, langues=["த", "fr"], formatDonnées="pandas"
)

# Analyser ou sauvegarder les données ici...
données.to_excel("./MesDonnéesExportées.xlsx")
`,
};
</script>
