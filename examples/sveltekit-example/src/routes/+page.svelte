<script lang="ts">
	import { Avatar } from '@avatune/svelte';
	import theme from '@avatune/pacovqzz-theme/svelte';
</script>

<div class="container">
	<Avatar {theme} body="hoodie" head="standard" hair="short" eyes="standard" mouth="happy" />
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
