import { initFiles } from './page.svelte.js';

export function load() {
    return {
        prototypeItems: initFiles()
    };
}