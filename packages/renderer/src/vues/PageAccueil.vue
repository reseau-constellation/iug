<template>
  <div class="text-center">
    <h1>{{ $t('communs.constellation') }}</h1>
    <ReactiveHash />
  </div>
</template>

<script setup lang="ts">
import ReactiveHash from '../components/ReactiveHash.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
const {useI18n} = கிளிமூக்கை_உபயோகி();
const {$t} = useI18n();

</script>
