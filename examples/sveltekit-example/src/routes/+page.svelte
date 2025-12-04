<script lang="ts">
	import { Avatar } from '@avatune/svelte';
	import theme from '@avatune/pacovqzz-theme/svelte';
	import { browser } from '$app/environment'
</script>

<div class="container">
	{#if browser}
	<Avatar size={64} {theme} seed="https://github.com/shadcn.png?12" />
	<Avatar size={64} {theme} seed="https://github.com/shadcn.png?34" />
		<Avatar size={64} {theme} seed="https://github.com/shadcn.png?56" />
		<Avatar size={64} {theme} seed="https://github.com/shadcn.png?78" />
		<Avatar size={64} {theme} seed="https://github.com/shadcn.png?90" />
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		gap: 3rem;
	}
</style>
