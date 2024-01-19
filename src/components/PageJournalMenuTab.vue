<script setup lang="ts">
import { BPACounter } from '@bpa-dev/uikit';

withDefaults(defineProps<{ counter?: number; active?: boolean }>(), { counter: 0, active: false });
</script>
<template>
	<button class="row tab" :class="{ active }">
		<div class="text-body-md ellipsis title">
			<slot />
		</div>
		<div>
			<BPACounter :number="counter" class="counter" size="lg" />
		</div>
	</button>
</template>
<style scoped>
.title {
	color: #a2a8b4;
}

.counter {
	--color: #343a46;
	--color-text: #a2a8b4;
}

.tab {
	border-radius: 8px;
	border: 2px solid #343a46;
	padding: 8px 16px;
	height: 40px;
	justify-content: space-between;

	&:hover {
		border-color: #404653;

		& .title {
			color: #fff;
		}

		& .counter {
			--color: #404653;
			--color-text: #fff;
		}
	}

	&.active,
	&:active {
		border-color: var(--color-primary);

		& .counter {
			--color: var(--color-primary);
			--color-text: #1b202a;
		}
	}

	&.active {
		& .title {
			color: var(--color-primary);
		}
	}
}
</style>
