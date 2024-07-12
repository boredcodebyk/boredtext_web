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
    dateCreated: string,
    dateModified: string,
}

export const appdata = persisted("__app", <appjson>{
    version: "",
    commit: "",
    username: "",
})

export const notedata = persisted("__notedata",<notejson[]>[])