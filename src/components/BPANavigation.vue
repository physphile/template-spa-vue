<script setup lang="ts">
import Logo from '../assets/logo.svg';
import { BPAIcon } from '@bpa-dev/uikit';
</script>
<template>
	<nav class="column nav">
		<div class="column">
			<Logo class="logo" width="32" height="32" />
			<div class="column buttons">
				<!-- <RouterLink
					to="/"
					class="nav-item"
					:class="{ active: $route.path === '/scanning' }"
					aria-label="Главная страница"
				>
					<span style="position: relative; display: inline-flex">
						<BPAIcon name="clean" />
						<BPACounter :number="0" class="counter" />
					</span>
				</RouterLink> -->
				<RouterLink
					to="/journal"
					class="nav-item"
					:class="{ active: $route.path === '/journal' }"
					aria-label="Журнал событий"
				>
					<BPAIcon name="journal" />
				</RouterLink>
			</div>
		</div>

		<div class="column buttons">
			<button type="button" class="nav-item" aria-label="Выход"><BPAIcon name="logout" /></button>
		</div>
	</nav>
</template>
<style scoped>
.nav {
	position: fixed;
	left: 0;
	top: 0;
	bottom: 0;
	width: 68px;
	background: #343a46;
	box-shadow: 6px 0 12px 0 rgb(0 0 0 / 24%);
	justify-content: space-between;
	padding: 24px 0;
}

.logo {
	align-self: center;
	margin-bottom: 24px;
}

.counter {
	position: absolute;
	right: -2px;
	top: -4px;
	transform: translate(50%, 0);
	z-index: 999;
}

.nav-item {
	display: flex;
	height: 40px;
	justify-content: center;
	align-items: center;
	fill: #a2a8b4;

	& .counter {
		--background: #343a46;
	}

	&:hover {
		fill: #fff;
	}

	&:active,
	&.active {
		fill: var(--color-primary);
		background: #30494a;

		& .counter {
			--background: #30494a;
		}
	}

	&.active {
		position: relative;

		&::after {
			content: '';
			position: absolute;
			left: -2px;
			top: 0;
			bottom: 0;
			width: 4px;
			background: var(--color-primary);
			border-radius: 999px;
			z-index: 1;
		}
	}
}

.buttons {
	gap: 16px;
}
</style>
