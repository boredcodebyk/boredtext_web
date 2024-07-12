<script>
  // @ts-nocheck

  import "carbon-components-svelte/css/all.css";

  import {
    Header,
    HeaderUtilities,
    HeaderAction,
    HeaderPanelLinks,
    HeaderPanelDivider,
    HeaderPanelLink,
    SideNav,
    SideNavDivider,
    SideNavItems,
    SideNavLink,
    SkipToContent,
    Theme,
  } from "carbon-components-svelte";
  
  import { goto } from "$app/navigation";
  import { notedata } from "$lib/store";
  import { page } from "$app/stores";
  import { Document, Home } from "carbon-icons-svelte";
  import { version } from "$app/environment";

  let themes = ["white", "g10", "g80", "g90", "g100"];

  let theme = "g10";

  let isSideNavOpen = false;
  let isOpen = false;

  let smallDevice = false;

  const attachListener = () => {
    const mediaQuery = window.matchMedia("(width <= 640px)");
    mediaQuery.addEventListener("change", ({ matches }) => {
      smallDevice = matches;
    });
  };

  $: filename =
    $page.route.id === "/note/[slug]"
      ? $notedata.find((e) => e.id === $page.params.slug)?.title ?? ""
      : "";
</script>

<svelte:window use:attachListener />
<Theme bind:theme persist persistKey="__carbon-theme" />
<Header
  href="/"
  persistentHamburgerMenu={false}
  company="boredtext"
  platformName={smallDevice ? filename.substring(0, 10) + "..." : filename}
  bind:isSideNavOpen
>
  <svelte:fragment slot="skip-to-content">
    <SkipToContent />
  </svelte:fragment>
  <HeaderUtilities>
    <HeaderAction bind:isOpen transition={{ duration: 200 }}>
      <HeaderPanelLinks>
        <HeaderPanelDivider>Theme</HeaderPanelDivider>
        {#each themes as value (value)}
          <HeaderPanelLink
            disabled={theme === value}
            on:click={() => (theme = value)}
          >
            {`${value}`}
          </HeaderPanelLink>
        {/each}
      </HeaderPanelLinks>
    </HeaderAction>
  </HeaderUtilities>

  <SideNav bind:isOpen={isSideNavOpen} rail={!smallDevice}>
    <SideNavItems
      ><SideNavLink
        icon={Home}
        href="/"
        text="Home"
        isSelected={$page.route.id === "/"}
      />
      <SideNavDivider />
      {#if $notedata}
        {#each $notedata as note (note.id)}
          <SideNavLink
            icon={Document}
            text={note.title}
            on:click={(e) =>
              goto(`/note/${note.id}`, { replaceState: $page.route.id != "/" })}
            isSelected={$page.params.slug === note.id}
          />
        {/each}
      {/if}
    </SideNavItems>
  </SideNav>
</Header>
<slot />
<p
  style="display: flex;
align-items: end;
justify-content: end;
font-style: italic;
opacity: 0.01;
padding-inline-end: 0.875rem;
position: fixed;
bottom: 0;
right: 0;
padding-bottom: 0.875rem;"
>
  v{version}
</p>
