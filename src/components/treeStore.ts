import { writable } from 'svelte/store';

export const expandedNodes = writable(new Map<string, boolean>()); 