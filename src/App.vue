<script setup lang="ts">
import BPANavigation from './components/BPANavigation.vue';
</script>

<template>
	<BPANavigation v-if="$route.path !== '/login'" />
	<div class="container" :class="{ margin: $route.path !== '/login' }">
		<RouterView />
	</div>
</template>

<style scoped>
.container {
	height: 100%;
}

.margin {
	padding-left: var(--navigation-width);
}
</style>
