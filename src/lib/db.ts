import Dexie, { type EntityTable } from "dexie";
import type { notejson } from "./store";

const db = new Dexie("boredtext__db") as Dexie & {
    notes: EntityTable<notejson, 'id'>
}

db.version(1).stores({
    notes: 'id, title, note, dateCreated, dateModified',
})

export { db }