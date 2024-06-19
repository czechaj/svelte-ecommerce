<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="h-screen bg-background">
	{@render children()}
</div>

<style></style>
