<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar>
	{@render navLink({ href: '/', text: 'admin' })}
	{@render navLink({ href: '/', text: 'admin' })}
	{@render navLink({ href: '/', text: 'admin' })}
	{@render navLink({ href: '/', text: 'admin' })}
	{@render navLink({ href: '/', text: 'admin' })}
</Navbar>

{#snippet navLink({href, text}: {href:string, text:string})}
	<a {href}>{text} </a>
{/snippet}
