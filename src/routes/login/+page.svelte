<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	import * as Form from '$lib/components/ui/form';
	import { LoginFormSchema } from '$lib/formSchema';
	import { Loader } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();
	let form = superForm(data.form, {
		validators: zodClient(LoginFormSchema)
	});

	const { form: formData, enhance, delayed } = form;
</script>

<form method="post" use:enhance class="grid h-full place-items-center">
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Login</Card.Title>
			<Card.Description
				>Enter your username and password below to login to your account.</Card.Description
			>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<Form.Field {form} name="username">
				<Form.Control let:attrs>
					<Form.Label>Username</Form.Label>

					<Input {...attrs} bind:value={$formData.username} />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>

					<Input {...attrs} type="password" bind:value={$formData.password} />
				</Form.Control>
			</Form.Field>
		</Card.Content>
		<Card.Footer>
			<Button type="submit">
				{#if $delayed}
					<Loader class="size-4 animate-spin" />
				{:else}
					Login
				{/if}
			</Button>
		</Card.Footer>
	</Card.Root>
</form>
