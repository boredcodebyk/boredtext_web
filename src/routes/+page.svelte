<script lang="ts">
  import { appdata, type appjson, type notejson } from "$lib/store";
  import { VERSION } from "$lib/index";
  import { goto } from "$app/navigation";
  import {
    Content,
    Grid,
    Row,
    Column,
    Button,
    Link,
  } from "carbon-components-svelte";

  import { Add } from "carbon-icons-svelte";
  import { onMount } from "svelte";

  import { db } from "$lib/db";
  import { liveQuery } from "dexie";

  let noteslist = liveQuery(() => db.notes.toArray());

  onMount(() => {
    if (localStorage.getItem("__app") === null) {
      $appdata = <appjson>{
        version: VERSION,
        commit: "",
        username: "",
      };
    }
  });

  const newNote = async () => {
    let id = crypto.randomUUID();
    let note: notejson = {
      id: id,
      title: `Untitled ${$noteslist.length + 1}`,
      dateCreated: new Date(Date.now()),
      dateModified: new Date(Date.now()),
      note: "\n",
    };
    try {
      let i = await db.notes.add(note);
      // console.log(`Created successfully added. Got id ${i}`);
    } catch (error) {
      // console.log(`Error\n ${error}`);
    }
    goto(`/note/${id}`);
  };
</script>

<Content>
  <Grid>
    <Row>
      <Column>
        <h1>Welcome User!</h1>
        <br />
        <Button icon={Add} on:click={() => newNote()}>New</Button>
      </Column>
    </Row>
    <Row>
      <Column>
        {#if $noteslist}<ul>
            {#each $noteslist as note (note.id)}
              <li>
                <Link href="/note/{note.id}"
                  >{note.title}, {note.dateModified}</Link
                >
              </li>
            {/each}
          </ul>
        {/if}
      </Column>
    </Row>
  </Grid>
</Content>
