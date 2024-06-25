<script lang="ts">
	import '../../app.css';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import '../../app.css';
	import { cn } from '$lib/utils';

	let { children } = $props();
	let pathname = $derived($page.url.pathname);
</script>

<Navbar>
	{@render navLink({ href: '/', text: 'Home' })}
</Navbar>

<div class="container my-4">
	{@render children()}
</div>

{#snippet navLink({href, text}: {href:string, text:string})}
	<a
		{href}
		class={cn(
			'p-4 capitalize hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground',
			pathname === href && 'bg-background text-foreground'
		)}
		>{text}
	</a>
{/snippet}
