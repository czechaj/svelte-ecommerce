<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { ProductFormSchema } from '$lib/formSchema';
	import { fileProxy, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { page } from '$app/stores';
	import { formatCurrency } from '$lib/utils.js';
	import { Loader } from 'lucide-svelte';

	let { data } = $props();

	let form = superForm(data.form, {
		validators: zodClient(ProductFormSchema.partial({ image: true, file: true }))
	});

	const { form: formData, enhance, delayed } = form;

	const image = fileProxy(formData, 'image');
	const file = fileProxy(formData, 'file');
</script>

<PageHeader>Edit Product</PageHeader>
<form
	action={`/admin/products/${$page.params.id}/edit`}
	method="post"
	class="space-y-8"
	enctype="multipart/form-data"
	use:enhance
>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="priceInCents">
		<Form.Control let:attrs>
			<Form.Label>Price (in cents)</Form.Label>
			<Input {...attrs} type="number" bind:value={$formData.priceInCents} />
			<Form.Description class="text-muted-foreground">
				{formatCurrency($formData.priceInCents)}
			</Form.Description>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Description</Form.Label>
			<Textarea {...attrs} bind:value={$formData.description} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="file">
		<Form.Control let:attrs>
			<Form.Label>File</Form.Label>
			<input {...attrs} type="file" bind:files={$file} />
			<div class="text-muted-foreground">
				{data?.product?.filePath}
			</div>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="image">
		<Form.Control let:attrs>
			<Form.Label>Image</Form.Label>
			<input {...attrs} accept="image/*" type="file" bind:files={$image} />
			<img src={data?.product?.imagePath} alt={data.product?.name} class="object-fit h-60 w-80" />
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
