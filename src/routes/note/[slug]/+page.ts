
import { db } from '$lib/db';
import type { notejson } from '$lib/store';
import { error, redirect } from '@sveltejs/kit';
import { liveQuery } from 'dexie';
import { get } from 'svelte/store';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    console.log(params.slug)
    const note = await db.notes.where("id").equals(params.slug).first();

    if (note) {
        return {
            noteID: params.slug
        }
    }


    error(404, 'Not found');
}