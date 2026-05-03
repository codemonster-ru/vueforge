<template>
  <VfErrorLayout
    code="404"
    title="Page not found"
    description="The page you requested does not exist or has been moved."
  >
    <template #actions>
      <VfInline class="demo-not-found-actions" :wrap="false">
        <VfButton variant="primary" @click="goHome"> Go to home page </VfButton>
      </VfInline>
    </template>
  </VfErrorLayout>
</template>

<script setup lang="ts">
import { VfButton } from "@codemonster-ru/vueforge-core";
import { VfErrorLayout, VfInline } from "../../index";

function goHome() {
  window.location.assign("/");
}
</script>
