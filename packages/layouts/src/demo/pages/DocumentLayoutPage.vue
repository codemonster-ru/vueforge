<template>
  <VfDocumentLayout
    layout="sidebar-content-aside"
    fill-viewport
    sticky-header
    sticky-sidebar
    sticky-aside
    edge-notches
    show-subheader
    show-content-subheader
  >
    <template #header>
      <div class="demo-real-bar">
        <strong>Engineering Handbook</strong>
        <VfBadge>Internal Docs</VfBadge>
      </div>
    </template>

    <template #subheader>
      <div class="demo-real-bar">
        <span>Platform / Frontend / Layout Guidelines</span>
        <VfBadge>Updated April 18, 2026</VfBadge>
      </div>
    </template>

    <template #sidebar>
      <VfStack>
        <VfCard v-for="item in sidebarItems" :key="item">{{ item }}</VfCard>
      </VfStack>
    </template>

    <template #content-subheader>
      <div class="demo-real-bar">
        <strong>Layout Architecture</strong>
        <VfBadge>Section 3 of 8</VfBadge>
      </div>
    </template>

    <VfStack>
      <VfSection surface>
        <h3>Overview</h3>
        <p>
          This page demonstrates a document-centric layout with bounded content
          width, sticky regions, and independent side rails for navigation and
          metadata.
        </p>
      </VfSection>

      <VfSection surface>
        <VfStack>
          <h3>Recommendations</h3>
          <p v-for="item in contentItems" :key="item">{{ item }}</p>
        </VfStack>
      </VfSection>
    </VfStack>

    <template #aside>
      <VfStack>
        <VfSection surface>
          <strong>On this page</strong>
          <p>Overview, tokens, responsive behavior, migration notes.</p>
        </VfSection>
        <VfSection surface>
          <strong>Reading time</strong>
          <p>9 minutes</p>
        </VfSection>
        <VfSection surface>
          <strong>Maintainer</strong>
          <p>Design Systems Team</p>
        </VfSection>
      </VfStack>
    </template>

    <template #footer>
      <div class="demo-real-bar">
        <span>Documentation status: Approved</span>
        <span>Review due: July 2026</span>
      </div>
    </template>
  </VfDocumentLayout>
</template>

<script setup lang="ts">
import { VfBadge, VfCard } from "@codemonster-ru/vueforge-core";
import { VfDocumentLayout, VfSection, VfStack } from "../../index";

const sidebarItems = [
  "Introduction",
  "Design Tokens",
  "Shell Patterns",
  "Document Patterns",
  "Accessibility",
  "Migration"
];

const contentItems = Array.from(
  { length: 12 },
  (_, index) =>
    `Guideline ${index + 1}: Keep page chrome stable and let the main reading flow stay predictable across breakpoints.`
);
</script>
