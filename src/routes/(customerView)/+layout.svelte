<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import { cn } from '$lib/utils';
	import '../../app.css';

	let { children, data } = $props();
	let pathname = $derived($page.url.pathname);
</script>

<Navbar>
	{@render navLink({ href: '/', text: 'Home' })}

	{#if data.loggedIn}
		<form
			class={cn(
				'p-4 capitalize hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground'
			)}
			action="/?/logout"
			method="post"
			use:enhance
		>
			<button class="w3-bar-item w3-button">Logout</button>
		</form>
	{:else}
		{@render navLink({ href: '/login', text: 'Login' })}
	{/if}
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
