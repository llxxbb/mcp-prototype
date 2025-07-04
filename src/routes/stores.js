import { writable } from 'svelte/store';

export const leftSidebarVisible = writable(true);
export const rightSidebarVisible = writable(true);
export const currentContent = writable('');