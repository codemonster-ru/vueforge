import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { VfThemeProvider } from "@/index";
import ShowcasePage from "./ShowcasePage.vue";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ShowcasePage", () => {
  it("opens the dialog from the demo button", async () => {
    const wrapper = mount(VfThemeProvider, {
      attachTo: document.body,
      slots: {
        default: ShowcasePage,
      },
    });

    await wrapper.get('[data-test="open-dialog"]').trigger("click");
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  });

  it("opens the regular drawer from the demo button", async () => {
    const wrapper = mount(VfThemeProvider, {
      attachTo: document.body,
      slots: {
        default: ShowcasePage,
      },
    });

    await wrapper.get('[data-test="open-drawer"]').trigger("click");
    expect(document.body.querySelector(".vf-drawer__content")).not.toBeNull();
    expect(document.body.querySelector(".vf-drawer__content--full")).toBeNull();
  });

  it("opens the fullscreen drawer from the demo button", async () => {
    const wrapper = mount(VfThemeProvider, {
      attachTo: document.body,
      slots: {
        default: ShowcasePage,
      },
    });

    await wrapper.get('[data-test="open-drawer-fullscreen"]').trigger("click");
    expect(
      document.body.querySelector(".vf-drawer__content--full"),
    ).not.toBeNull();
  });

  it("opens command palette from the demo button", async () => {
    const wrapper = mount(VfThemeProvider, {
      attachTo: document.body,
      slots: {
        default: ShowcasePage,
      },
    });

    await wrapper.get('[data-test="open-command-palette"]').trigger("click");
    expect(
      document.body.querySelector(".vf-command-palette__content"),
    ).not.toBeNull();
  });
});
