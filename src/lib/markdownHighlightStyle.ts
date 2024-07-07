
import { HighlightStyle } from "@codemirror/language";
import { tags, Tag, styleTags } from "@lezer/highlight";
export const highlightStyle = HighlightStyle.define([
    {
        tag: tags.heading1,

        fontSize: "2em",
        fontWeight: "400",
    },
    {
        tag: tags.heading2,

        fontSize: "1.75em",
        fontWeight: "400",
    },
    {
        tag: tags.heading3,

        fontSize: "1.5em",
        fontWeight: "400",
    },
    {
        tag: tags.heading4,

        fontSize: "1.375em",
        fontWeight: "400",
    },
    {
        tag: tags.heading5,

        fontSize: "1em",
        fontWeight: "400",
    },
    {
        tag: tags.heading6,

        fontSize: "0.875em",
        fontWeight: "400",
    },
    {
        tag: tags.content,

        fontSize: "0.875em",
        fontWeight: "400",
    },
    {
        tag: tags.link,

    }
]);