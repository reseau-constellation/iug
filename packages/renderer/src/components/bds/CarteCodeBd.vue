<template>
  <CarteCode :codes="codes"></CarteCode>
</template>
<script setup lang="ts">
const props = defineProps<{id: string}>();

const codes = {
    'ts': `
client.bds.suivreDonnéesExportation({

})
`,
    'py': `
${props.id}
`,
};
</script>