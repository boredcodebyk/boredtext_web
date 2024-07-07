import { persisted } from 'svelte-persisted-store'

export interface appjson {
    version: string,
    commit: string,
    username: string,
}

export interface notejson {
    id: string,
    title: string,
    note: string,
    dateCreated: Date,
    dateModified: Date,
}

export const appdata = persisted("__app", <appjson>{
    version: "",
    commit: "",
    username: "",
})
