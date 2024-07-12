import { error } from '@sveltejs/kit';


/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    // console.log(params.slug)

    if (params.slug) return

    error(404, 'Not found');
}