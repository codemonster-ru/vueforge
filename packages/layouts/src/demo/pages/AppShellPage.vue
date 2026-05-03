<template>
  <VfAppShell
    layout="sidebar-content-aside"
    fill-viewport
    sticky-header
    sticky-sidebar
    sticky-aside
    show-subheader
    show-content-subheader
  >
    <template #header>
      <div class="demo-real-bar">
        <strong>Acme Workspace</strong>
        <VfInline>
          <VfBadge>Production</VfBadge>
          <VfBadge>v2.4.1</VfBadge>
        </VfInline>
      </div>
    </template>

    <template #subheader>
      <div class="demo-real-bar">
        <span>Projects / Billing / Invoices</span>
        <VfBadge>Synced 2 min ago</VfBadge>
      </div>
    </template>

    <template #sidebar>
      <VfStack>
        <VfCard v-for="item in sidebarItems" :key="item">{{ item }}</VfCard>
      </VfStack>
    </template>

    <template #content-subheader>
      <div class="demo-real-bar">
        <strong>Invoices</strong>
        <VfInline>
          <VfBadge>Q2</VfBadge>
          <VfBadge>18 items</VfBadge>
        </VfInline>
      </div>
    </template>

    <VfStack>
      <VfSection surface>
        <h3>Revenue Summary</h3>
        <p>
          Monthly recurring revenue increased by 7.4% compared to the previous
          period. Payment retries recovered 82 failed invoices.
        </p>
      </VfSection>
      <VfGrid>
        <VfCard>ARR: $1.24M</VfCard>
        <VfCard>MRR: $103K</VfCard>
        <VfCard>Churn: 1.9%</VfCard>
        <VfCard>Expansion: +12%</VfCard>
      </VfGrid>
      <VfSection surface>
        <VfStack>
          <h3>Recent Activity</h3>
          <p v-for="item in contentItems" :key="item">{{ item }}</p>
        </VfStack>
      </VfSection>
    </VfStack>

    <template #aside>
      <VfStack>
        <VfSection surface>
          <strong>Owner</strong>
          <p>Finance Operations</p>
        </VfSection>
        <VfSection surface>
          <strong>Health</strong>
          <p>All systems operational</p>
        </VfSection>
        <VfSection surface>
          <strong>Automation</strong>
          <p>3 rules active</p>
        </VfSection>
      </VfStack>
    </template>

    <template #footer>
      <div class="demo-real-bar">
        <span>Last deployment: 2026-04-17 18:42 UTC</span>
        <span>Support SLA: 99.95%</span>
      </div>
    </template>
  </VfAppShell>
</template>

<script setup lang="ts">
import { VfBadge, VfCard } from "@codemonster-ru/vueforge-core";
import { VfAppShell, VfGrid, VfInline, VfSection, VfStack } from "../../index";

const sidebarItems = [
  "Dashboard",
  "Customers",
  "Invoices",
  "Subscriptions",
  "Exports",
  "Settings"
];

const contentItems = Array.from(
  { length: 14 },
  (_, index) =>
    `Activity ${index + 1}: Invoice #INV-${4200 + index} was processed and audit trail was updated.`
);
</script>
