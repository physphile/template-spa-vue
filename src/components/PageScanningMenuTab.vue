<script setup lang="ts">
import { BPAIcon } from '@bpa-dev/uikit';

withDefaults(defineProps<{ number?: number }>(), { number: 0 });
</script>
<template>
	<button type="button" class="flex tab">
		<div class="text-body-md row title">
			<slot />
		</div>
		<div class="text-label-lg row icon">
			<BPAIcon v-if="number === 0" name="check" size="md" />
			<span v-else>
				{{ number }}
			</span>
		</div>
		<div></div>
	</button>
</template>
<style scoped>
.tab {
	color: #a2a8b4;
	fill: #a2a8b4;
	max-height: 40px;
	min-height: 40px;
	border-color: #343a46;

	& .title {
		border-radius: 8px 0 0 8px;
		border: 2px solid #343a46;
		border-right: none;
		border-color: inherit;
		padding: 0 16px;
		flex: 1;
		height: 100%;
	}

	& .icon {
		padding: 8px 16px;
		border: 2px solid #343a46;
		border-color: inherit;
		border-radius: 8px;
		display: flex;
		height: 100%;
		margin-left: -8px;
	}

	&.active {
		color: var(--color-primary);
		fill: var(--color-primary);
		border-color: var(--color-primary);
	}

	&:hover {
		color: #fff;
	}

	&:active {
		border-color: var(--color-primary);

		& .icon {
			color: var(--color-primary);
			fill: var(--color-primary);
		}
	}
}
</style>
