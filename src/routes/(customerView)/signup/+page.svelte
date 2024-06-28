<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	import * as Form from '$lib/components/ui/form';
	import { SignupFormSchema } from '$lib/formSchema';
	import { Loader } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();
	let form = superForm(data.form, {
		validators: zodClient(SignupFormSchema)
	});

	const { form: formData, enhance, delayed } = form;
</script>

<form method="post" use:enhance class="grid h-full place-items-center">
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Sign Up</Card.Title>
			<Card.Description
				>Enter your username and password below to create your account.</Card.Description
			>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<Form.Field {form} name="username">
				<Form.Control let:attrs>
					<Form.Label>Username</Form.Label>

					<Input {...attrs} bind:value={$formData.username} />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>

					<Input {...attrs} type="email" bind:value={$formData.email} />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>

					<Input {...attrs} type="password" bind:value={$formData.password} />
				</Form.Control>
			</Form.Field>
		</Card.Content>
		<Card.Footer class="flex flex-col gap-3">
			<Button type="submit">
				{#if $delayed}
					<Loader class="size-4 animate-spin" />
				{:else}
					Sign Up
				{/if}
			</Button>

			<div class="flex w-full justify-end">
				<span class="text-xs">
					Already have an account? <a href="/login" class="font-semibold"> Login </a>
				</span>
			</div>
		</Card.Footer>
	</Card.Root>
</form>
