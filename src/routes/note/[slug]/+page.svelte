<script lang="ts">
  import { page } from "$app/stores";

  import Editor from "$lib/Editor.svelte";

  import { type notejson, notedata } from "$lib/store";
  import {
    Button,
    Column,
    Content,
    Grid,
    Row,
    TextInput,
  } from "carbon-components-svelte";
  let note: notejson;

  $: note =
    $notedata.find((e) => e.id === $page.params.slug) ??
    <notejson>{
      id: "",
      title: "",
      note: "",
      dateCreated: "",
      dateModified: "",
    };
  $: title = note.title;
  const updateTitle = (newTitle: string) => {
    let noteIndex = $notedata.findIndex((e) => e.id === note.id);
    $notedata[noteIndex].title = newTitle;
    $notedata[noteIndex].dateCreated = new Date(Date.now()).toISOString();
  };
</script>

<Content>
  <Grid>
    <Row>
      <Column>
        <TextInput
          size="xl"
          hideLabel
          labelText="Title"
          value={title}
          on:input={(value) => updateTitle(value.detail?.toString() ?? title)}
          
          type="text"
          placeholder="Title..."
        />
      </Column>
    </Row>
    <Row>
      <Column>
        {#key $page.params.slug}
          <Editor bind:value={note} />
        {/key}
      </Column>
    </Row>
  </Grid>
</Content>
