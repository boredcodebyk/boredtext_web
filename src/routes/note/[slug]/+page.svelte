<script lang="ts">
  import { db } from "$lib/db";

  import type { notejson } from "$lib/store";
  import { Button, Column, Content, Grid, Row, TextInput } from "carbon-components-svelte";
  import { liveQuery, type Observable } from "dexie";
  import { onMount } from "svelte";

  import { EditorView, basicSetup } from "codemirror";
  import { EditorState, type StateCommand } from "@codemirror/state";
  import {
    history,
    historyKeymap,
    defaultKeymap,
    indentLess,
    indentMore,
  } from "@codemirror/commands";
  import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
  import {
    HighlightStyle,
    bracketMatching,
    indentOnInput,
    syntaxHighlighting,
  } from "@codemirror/language";
  import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
  import { keymap } from "@codemirror/view";

  import { type MarkdownConfig } from "@lezer/markdown";
  import { tags, Tag, styleTags } from "@lezer/highlight";
  import { languages } from "@codemirror/language-data";
  import { highlightStyle } from "$lib/markdownHighlightStyle";

  /** @type {import('./$types').PageData} */
  export let data;
  let note: notejson;


  $: noteID = data.noteID;

  let editorContainer: HTMLElement;
  let editor: EditorView;
  let editorState: EditorState;
  let lineNumber: number = 1;
  let colNumber: number = 1;

  const insertTab: StateCommand = ({ state, dispatch }) => {
    dispatch(
      state.update({
        changes: {
          from: state.doc.lineAt(state.selection.main.head).from,
          insert: "\t",
        },
      })
    );
    return true;
  };

  const customTags = {
    headingMark: Tag.define(),
  };

  const MarkStylingExtension: MarkdownConfig = {
    props: [
      styleTags({
        HeadingMark: customTags.headingMark,
      }),
    ],
  };

  const focus = () => {
    if (typeof editor !== "undefined") {
      editor.focus();
    }
  };

  const getText = () => {
    if (typeof editor !== "undefined") {
      return editor.state.doc.toString();
    }
    return "";
  };

  const getLineCol = () => {
    if (typeof editor !== "undefined") {
      lineNumber = editor.state.doc.lineAt(
        editor.state.selection.main.head
      ).number;
      colNumber =
        editor.state.doc.lineAt(editor.state.selection.main.head).to -
        editor.state.doc.lineAt(editor.state.selection.main.head).from +
        1;
    }
  };

  export const initEditor = (text: string) => {
    editorContainer.innerHTML = "";

    let editorExtensions = [
      basicSetup,
      markdown({
        addKeymap: true,
        base: markdownLanguage,
        defaultCodeLanguage: markdownLanguage,
        codeLanguages: languages,
        extensions: [MarkStylingExtension],
      }),
      syntaxHighlighting(highlightStyle),
      history(),
      closeBrackets(),
      bracketMatching(),
      indentOnInput(),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...closeBracketsKeymap,
        {
          key: "Tab",
          preventDefault: true,
          run: insertTab,
        },
        {
          key: "Shift-Tab",
          preventDefault: true,
          run: indentLess,
        },
      ]),
      EditorView.lineWrapping,
      EditorView.updateListener.of((update: { docChanged: any }) => {
        if (update.docChanged) {
          saveNote(getText());
          console.log(getText());
        }
      }),
    ];

    editorState = EditorState.create({
      doc: text,
      extensions: editorExtensions,
    });

    editor = new EditorView({
      state: editorState,
      parent: editorContainer,
    });

    editor.focus()
  };

  const saveNote = async (newNote: string) => {
    await db.notes.update(note.id, {
      note: newNote,
      dateModified: new Date(Date.now()),
    });
  };

  onMount(async() => {
    note =  (await db.notes.where("id").equals(noteID).first()) ??
      <notejson>{
        id: "\n",
        title: "string",
        note: "string",
        dateCreated: new Date(Date.now()),
        dateModified: new Date(Date.now()),
      };
    console.log(note);
    initEditor(note.note);
    
  });
</script>

<Content>
  <Grid>
    <Row>
     <Column> <TextInput size="xl" hideLabel labelText="User name" placeholder="Enter user name..." />
     </Column>
    </Row>
    <Row>
      <Column>
        <div bind:this={editorContainer}></div>
      </Column>
    </Row>
  </Grid>
</Content>
