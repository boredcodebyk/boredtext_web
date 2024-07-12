<script lang="ts">
  import { appdata, notedata, type appjson, type notejson } from "$lib/store";
  
  import { goto } from "$app/navigation";
  import {
    Content,
    Grid,
    Row,
    Column,
    Button,
    DataTable,
    Toolbar,
    ToolbarContent,
    ToolbarMenu,
    ToolbarMenuItem,
    ToolbarSearch,
    ToolbarBatchActions,
    Modal,
    TextInput,
  } from "carbon-components-svelte";

  import { Add, TrashCan } from "carbon-icons-svelte";
  import { onMount } from "svelte";
  import moment from "moment";
  import { version } from "$app/environment";
  onMount(() => {
    if (localStorage.getItem("__app") === null) {
      openmodel = true;
    }
    if (localStorage.getItem("__notedata") === null) {
      $notedata = <notejson[]>[];
    }
  });
  let openmodel = false;
  let editActive = false;
  let filteredRowIds = <string[]>[];
  let selectedRowIds = <string[]>[];
  let nameValue = "";

  const setUsername = (name: string) => {
    $appdata = <appjson>{
      version: version,
      commit: "",
      username: name,
    };
  };

  const newNote = async () => {
    let id = crypto.randomUUID();
    let note: notejson = {
      id: id,
      title: `Untitled ${$notedata.length + 1}`,
      dateCreated: new Date(Date.now()).toISOString(),
      dateModified: new Date(Date.now()).toISOString(),
      note: "\n",
    };
    try {
      let i = $notedata.push(note);
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
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <h1>Welcome <span on:click={()=>openmodel = true} style="text-decoration: dotted underline;cursor: pointer;">{$appdata.username.length > 0 ? $appdata.username : "User"}</span>!</h1>
        <br />
      </Column>
    </Row>
    <Row>
      <Column>
        {#if $notedata}<ul>
            <DataTable
              on:click:row={(e) => !editActive && goto(`/note/${e.detail.id}`)}
              stickyHeader
              batchSelection
              bind:selectedRowIds
              
              sortable
              sortKey="dateCreated"
              sortDirection="descending"
              headers={[
                { key: "title", value: "Title" },
                {
                  key: "dateModified",
                  value: "Date Modified",
                },
                {
                  key: "dateCreated",
                  value: "Date Created",
                },
              ]}
              rows={$notedata}
            >
              <Toolbar>
                <ToolbarBatchActions
                  bind:active={editActive}
                  on:cancel={(e) => {
                    e.preventDefault();
                    editActive = false;
                    selectedRowIds = [];
                  }}
                >
                  <Button
                    icon={TrashCan}
                    disabled={selectedRowIds.length === 0}
                    on:click={() => {
                      let notes = $notedata.filter(
                        (row) => !selectedRowIds.includes(row.id)
                      );
                      selectedRowIds = [];
                      $notedata = notes;
                      editActive = false;
                    }}
                  >
                    Delete
                  </Button>
                </ToolbarBatchActions>
                <ToolbarContent>
                  <ToolbarSearch
                    persistent
                    shouldFilterRows={(row, value) => {
                      return row.title
                        .toLowerCase()
                        .includes(value.toString().toLowerCase());
                    }}
                    bind:filteredRowIds
                  />
                  <ToolbarMenu>
                    <ToolbarMenuItem
                      on:click={() => (editActive = true)}
                      primaryFocus>Edit</ToolbarMenuItem
                    >
                  </ToolbarMenu>
                  <Button icon={Add} on:click={() => newNote()}>New Note</Button
                  >
                </ToolbarContent>
              </Toolbar>
              <svelte:fragment slot="cell" let:cell>
                {#if cell.key === "dateModified"}
                  {moment(cell.value).format("MMMM Do YY, h:mm a")}
                {:else if cell.key === "dateCreated"}
                  {moment(cell.value).format("MMMM Do YY, h:mm a")}
                {:else}
                  {cell.value}
                {/if}
              </svelte:fragment>
            </DataTable>
            {#if $notedata.length === 0}
              <p>Add a new note</p>
            {/if}
          </ul>
        {/if}
      </Column>
    </Row>
  </Grid>
</Content>

<Modal
  bind:open={openmodel}
  modalHeading="What should we call you?"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  selectorPrimaryFocus="#username"
  hasForm
  shouldSubmitOnEnter
  on:click:button--secondary={() => (openmodel = false)}
  on:click:button--primary={() => {
    setUsername(nameValue);
    openmodel = false
  }}
  on:open
  on:close
>
  <TextInput
    bind:value={nameValue}
    type="text"
    id="username"
    labelText="Name or Nickanme"
    placeholder=""
  />
</Modal>
