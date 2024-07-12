
import { HighlightStyle } from "@codemirror/language";
import { tags, Tag, styleTags } from "@lezer/highlight";
import type { DelimiterType, MarkdownConfig, MarkdownParser } from "@lezer/markdown";

export const strikethroughTags = {
    strikethrough: Tag.define(),
};
const StrikethroughDelim: DelimiterType = { resolve: "Strikethrough", mark: "StrikethroughMark" };
export const Strikethrough: MarkdownConfig = {
    parseInline: [{
        name: "Strikethrough",
        parse(cx, next, pos) {
            if (next != 126 /* '~' */ || cx.char(pos + 1) != 126) {
                return -1;
            }
            return cx.addDelimiter(StrikethroughDelim, pos, pos + 2, true, true);
        },
        after: "Emphasis"
    }],
    props: [
        styleTags({
            StrikethroughMark: tags.processingInstruction,
            'Strikethrough/...': strikethroughTags.strikethrough
        })
    ]
}

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
        tag: tags.emphasis,
        fontStyle: "italic",
    },
    {
        tag: tags.strong,
        fontWeight: "600",
    },
    {
        tag: tags.link,

    },
    { tag: strikethroughTags.strikethrough, textDecoration: 'line-through', }
]);

