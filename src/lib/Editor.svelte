<script lang="ts">
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

  import { type MarkdownConfig, GFM } from "@lezer/markdown";
  import { tags, Tag, styleTags } from "@lezer/highlight";
  import { languages } from "@codemirror/language-data";
  import { highlightStyle } from "$lib/markdownHighlightStyle";
  import { onDestroy, onMount } from "svelte";
  
  import { notedata, type notejson } from "./store";

  export let value: notejson;
  $: value
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
        extensions: [GFM],
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
          // console.log(getText());
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

    editor.focus();
  };

  const saveNote = async (newNote: string) => {
    let noteIndex = $notedata.findIndex((e)=> e.id === value.id)
    $notedata[noteIndex].note = newNote;
    $notedata[noteIndex].dateCreated = new Date(Date.now()).toISOString();
  };

  

  onMount(() => {
    if (value != undefined) {
      initEditor(value.note);
    }
    return () => {
      console.log("Bye, have a great time!")
    };
  });
</script>

<div bind:this={editorContainer}></div>
