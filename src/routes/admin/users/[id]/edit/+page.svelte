<script lang="ts">
	import { page } from '$app/stores';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { UserFormSchema } from '$lib/formSchema';
	import { Loader } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	let form = superForm(data.form, {
		validators: zodClient(UserFormSchema)
	});

	const { form: formData, enhance, delayed } = form;
</script>

<PageHeader>Edit User</PageHeader>
<form action={`/admin/users/${$page.params.id}/edit`} method="post" class="space-y-8" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>E-mail</Form.Label>
			<Input {...attrs} bind:value={$formData.email} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="isAdmin">
		<Form.Control let:attrs>
			<div class="space-y-1 leading-none">
				<Form.Label for="isAdmin">Is Admin</Form.Label>
			</div>
			<input id="isAdmin" type="checkbox" name="isAdmin" checked={$formData.isAdmin} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Button type="submit">
		{#if $delayed}
			<Loader class="size-4 animate-spin" />
		{:else}
			Save
		{/if}
	</Button>
</form>
