<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import { cn } from '$lib/utils';
	import { LogOut } from 'lucide-svelte';
	import '../../app.css';

	let { children, data } = $props();
	let pathname = $derived($page.url.pathname);
</script>

<Navbar>
	{#if data.user?.isAdmin}
		{@render navLink({ href: '/admin', text: 'Dashboard' })}
	{/if}
	{@render navLink({ href: '/', text: 'Home' })}

	{#if data.user}
		{@render navLink({ href: '/profile', text: 'Profile' })}

		<form class={cn('p-4 capitalize')} action="/?/logout" method="post" use:enhance>
			<button class="w3-bar-item w3-button"> <LogOut /> </button>
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
