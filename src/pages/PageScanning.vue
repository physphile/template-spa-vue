<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import PageScanningMenuTab from '../components/PageScanningMenuTab.vue';
import { BPAButton, BPATable, BPALabel, BPAIcon } from '@bpa-dev/uikit';
import UmsopBox from '../components/UmsopBox.vue';
import { umsopApi } from '../api/UmsopApi';
import { JournalItem, CategoryMap } from '../utils/converter';
import { CategoryName } from '../api/types';
import { colorMap } from './types';
import { formatDate } from '../utils/utils';

const sourceMap = {
	'Кафетерий №1': ['cafe1_cam101', 'cafe1_cam201', 'cafe1_cam301', 'cafe1_cam401'],
	'Кафетерий №2': ['cafe2_cam101', 'cafe2_cam201', 'cafe2_cam301', 'cafe2_cam401', 'cafe2_cam501'],
};

const loading = ref(true);
const frames = ref<JournalItem[]>([]);
const source = ref('cafe1_cam101');

const imageSrc = computed(() =>
	frames.value.length
		? `${import.meta.env.VITE_API_URL}/get_image_bbox?filename_bbox=${frames.value[0].picture}`
		: undefined,
);
const updateFrame = async () => {
	try {
		loading.value = true;
		const frame = await umsopApi.getRecentFrame(source.value);
		frames.value = [frame];
	} catch (err) {
		console.log(err instanceof Error ? err.message : err);
	} finally {
		loading.value = false;
	}
};

onMounted(async () => {
	await updateFrame();
});

const headers = [
	{ key: 'categories', title: 'Классы' },
	{ key: 'count', title: 'Кол-во' },
	{ key: 'time', title: 'Время' },
	{ key: 'accuracy', title: 'Точность' },
];
</script>
<template>
	<div class="flex">
		<div class="column panel">
			<header class="panel-header">
				<span class="text-title-lg">Наблюдение</span>
				<button type="button">
					<BPAIcon name="settings" size="lg" />
				</button>
			</header>
			<div class="column submenu">
				<div class="column text-body-md headings">
					<span>Инновационный кластер</span>
					<div class="divider"></div>
					<span>1-й этаж</span>
					<div class="divider"></div>
				</div>
				<div v-for="[name, sources] of Object.entries(sourceMap)" :key="name" class="column tabs">
					<span class="text-body-md">{{ name }}</span>
					<PageScanningMenuTab
						v-for="s of sources"
						:key="s"
						:class="{ active: source === s }"
						@click="
							source = s;
							updateFrame();
						"
						>{{ s }}</PageScanningMenuTab
					>
				</div>
			</div>
		</div>
		<div class="column content">
			<header class="row header">
				<span class="text-title-lg"
					>Камера: {{ source }} <span class="text-primary">(LIVE - {{ formatDate(new Date()) }})</span></span
				>
				<BPAButton prepend="refresh" variant="secondary" size="md" @click="updateFrame">Обновить</BPAButton>
			</header>
			<main class="column main">
				<BPATable :headers="headers" :items="frames" :loading="loading" class="table">
					<template #categories="{ value: categories }">
						<div class="categories">
							<template v-for="[name, count] in Object.entries(categories)" :key="name">
								<BPALabel
									:style="{
										'--background': colorMap[name].background,
										'--color': colorMap[name].color,
										border: 'none',
									}"
									>{{ CategoryMap[name as CategoryName] }}</BPALabel
								>
								<BPALabel
									:style="{
										'--background': colorMap[name].background,
										'--color': colorMap[name].color,
										border: 'none',
									}"
									>{{ count }}</BPALabel
								>
							</template>
						</div>
					</template>
					<template #picture
						><BPAButton variant="secondary" size="sm" append="chevron_right">Открыть</BPAButton></template
					>
					<template #count="{ value }"> {{ value }} об. </template>
					<template #time="{ value }">{{ new Date(value).toLocaleTimeString('ru-RU') }}</template>
				</BPATable>

				<div v-if="loading" class="placeholder"></div>
				<img v-if="!loading && imageSrc" :src="imageSrc" alt="" class="image" onerror="alert('error')" />
				<UmsopBox />
			</main>
		</div>
	</div>
</template>
<style scoped>
.panel {
	width: 288px;
	max-height: 100%;
	overflow: hidden;
	background: #252b36;
}

.panel-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 24px;
	gap: 24px;
	fill: #a2a8b4;
}

.flex {
	height: clamp(100%, 100%, 100%);
	overflow: hidden;
}

.tabs {
	gap: 12px;
	height: fit-content;
}

.submenu {
	gap: 20px;
	padding: 0 24px;
	flex: 1;
	justify-content: flex-start;
}

.headings {
	color: #a2a8b4;
	gap: 12px;
}

.divider {
	border-radius: 999px;
	border: 1px solid #343a46;
	align-self: stretch;
	max-height: 0;
}

.header {
	padding: 20px 64px;
	justify-content: space-between;
}

.content {
	flex: 1;
}

.image,
.placeholder {
	height: auto;
	width: 100%;
	aspect-ratio: 16 / 9;
	max-height: 100%;
	overflow: hidden;
	border-radius: 8px;
	box-shadow: 0 4px 16px 0 rgb(0 0 0 / 12%);
	object-fit: cover;
	object-position: center;
}

.placeholder {
	background: linear-gradient(247deg, #7c828c 20%, #252b36 80%) 200%/200% no-repeat;
	animation: gradient 2s ease-in-out infinite;
}

@keyframes gradient {
	0% {
		background-position: 100% 0;
	}

	50% {
		background-position: 0% 100%;
	}

	100% {
		background-position: 100% 0%;
	}
}

.main {
	padding: 0 64px 20px;
	gap: 20px;
	flex: 1;
	max-height: 100%;
	overflow: hidden;
}

.categories {
	display: grid;
	grid-template-columns: 2fr 1fr;
	gap: 10px;
}

:global(.table.table-wrapper) {
	flex: 1;
}
</style>
