import { writable } from 'svelte/store';

export const leftSidebarVisible = writable(true);
export const rightSidebarVisible = writable(true);
export const currentContentUrl = writable('');
export const currentContentHelp = writable('');
export const ads = writable([]);
export const panelPosition = writable({ x: 0, y: 0 });
