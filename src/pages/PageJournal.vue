<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import PageJournalMenuTab from '../components/PageJournalMenuTab.vue';
import { BPATable, BPAButton, BPALabel, BPADialog } from '@bpa-dev/uikit';
import { umsopApi } from '../api/UmsopApi';
import { Converter, JournalItem, CategoryMap } from '../utils/converter';
import { CategoryName } from '../api/types';
import UmsopBox from '../components/UmsopBox.vue';
import { colorMap } from './types';
import { useRoute, useRouter } from 'vue-router';
import { stringifyDate, formatDate } from '../utils/utils';

const router = useRouter();
const route = useRoute();

const startDate = new Date(2024, 0, 14);

const headers = [
	{ key: 'source', title: 'Камеры' },
	{ key: 'categories', title: 'Классы', width: '214px' },
	{ key: 'count', title: 'Кол-во' },
	{ key: 'time', title: 'Время' },
	{ key: 'picture', title: 'Материалы' },
];

const frames = ref<JournalItem[]>([]);
const loading = ref(false);
const totalItems = ref(1);
const totalObjects = ref(1);
const date = ref(route.query.date ? new Date(route.query.date as string) : new Date());
const page = ref(1);
const dialog = reactive({
	open: false,
	picture: '',
	source: '',
	time: '',
});

const nextDate = (d: Date) => {
	const r = new Date(d);
	r.setDate(d.getDate() + 1);
	return r;
};

const loadFrames = async (page: number) => {
	try {
		loading.value = true;
		const { data } = await umsopApi.getFrames({
			page,
			time_from: date.value.toISOString(),
			time_to: nextDate(date.value).toISOString(),
		});
		totalItems.value = data.total;
		totalObjects.value = data.total_objects;
		frames.value = Converter.fromArray(data.frames);
	} catch (err) {
		console.log(err instanceof Error ? err.message : err);
	} finally {
		loading.value = false;
	}
};

onMounted(async () => {
	await loadFrames(0);
});

const totalReports = computed(() => Math.ceil((Date.now() - Number(startDate)) / 1000 / 3600 / 24));
const getDate = (offset: number) => {
	const d = new Date(startDate);
	d.setDate(d.getDate() + offset);
	return d;
};

const clickReport = async (d: Date) => {
	date.value = d;
	router.push(`/journal?date=${stringifyDate(d)}`);
	page.value = 1;
	await loadFrames(1);
};

const getSrc = (filename: string) => `${import.meta.env.VITE_API_URL}/get_image_bbox?filename_bbox=${filename}`;

const download = () => {
	window.open(dialog.picture, '_blank');
};
</script>
<template>
	<div class="flex">
		<div class="column panel">
			<header class="panel-header">
				<span class="text-title-lg ellipsis">Отчеты</span>
			</header>
			<div class="text-body-md ellipsis total-count">За все время - {{ totalReports }} шт.</div>
			<div class="column tabs">
				<PageJournalMenuTab
					v-for="i in totalReports"
					:key="i"
					:counter="0"
					:active="stringifyDate(date) === stringifyDate(getDate(totalReports - i))"
					@click="clickReport(getDate(totalReports - i))"
				>
					№{{ totalReports - i + 1 }} ({{ formatDate(getDate(totalReports - i)) }})
				</PageJournalMenuTab>
			</div>
			<div class="shadow"></div>
		</div>
		<div class="column content">
			<header class="content-header text-title-lg">
				<span>
					Журнал №{{ Math.ceil((+date - +startDate) / 1000 / 3600 / 24) + 1 }}
					<span class="text-primary"
						>({{ stringifyDate(date) === stringifyDate(new Date()) ? 'Сегодня' : formatDate(date) }})</span
					>
				</span>
				<div class="row control-buttons">
					<BPAButton size="md" variant="secondary" prepend="refresh" @click="loadFrames(page)" />
				</div>
			</header>
			<div class="row controls">
				<div class="text-body-md info">
					<div class="records">
						Записей:&ensp;<span class="text-primary">{{ totalItems }}</span>
					</div>
					<div class="objects">
						Объектов:&ensp;<span class="text-primary">{{ totalObjects }}</span>
					</div>
				</div>
			</div>
			<main class="main">
				<BPATable
					v-model:page="page"
					:headers="headers"
					:items="frames"
					:total-items="totalItems"
					:loading="loading"
					:page-loading="loading"
					pagination
					@update:page="(p: number) => loadFrames(p - 1)"
				>
					<template #categories="{ value: categories }">
						<div class="categories">
							<template v-for="[name, count] in Object.entries(categories)" :key="name">
								<BPALabel
									:style="{
										'--background': colorMap[name].background,
										'--color': colorMap[name].color,
										border: 'none',
										width: '116px',
									}"
									>{{ CategoryMap[name as CategoryName] }}</BPALabel
								>
								<BPALabel
									:style="{
										'--background': colorMap[name].background,
										'--color': colorMap[name].color,
										border: 'none',
										width: '56px',
									}"
									>{{ count }}</BPALabel
								>
							</template>
						</div>
					</template>
					<template #picture="{ item }"
						><BPAButton
							variant="secondary"
							size="sm"
							append="chevron_right"
							@click="
								dialog.open = true;
								dialog.picture = getSrc(item.picture);
								dialog.source = item.source;
								dialog.time = item.time;
							"
							>Открыть</BPAButton
						>
					</template>
					<template #count="{ value }"> {{ value }} об. </template>
					<template #time="{ value }">{{ new Date(value).toLocaleTimeString('ru-RU') }}</template>
				</BPATable>
				<UmsopBox class="umsop" />
			</main>
		</div>
		<BPADialog v-model="dialog.open" size="md">
			<template #title>
				<div class="row dialog-title">
					<span
						>Камреа: {{ dialog.source }} <span class="text-primary">({{ formatDate(date) }})</span></span
					>
					<span class="text-title-lg" style="color: #a2a8b4">{{
						new Date(dialog.time).toLocaleTimeString('ru-RU')
					}}</span>
				</div>
			</template>
			<img
				v-if="dialog.picture"
				:src="dialog.picture"
				alt=""
				onerror="alert('error')"
				width="800"
				height="500"
				class="picture"
			/>
			<template #action>
				<BPAButton size="md" prepend="download" @click="download">Скачать</BPAButton>
			</template>
		</BPADialog>
	</div>
</template>
<style scoped>
.panel {
	width: 288px;
	max-height: 100%;
	overflow-y: hidden;
	background: #252b36;
	position: relative;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
}

.panel-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 24px;
	gap: 24px;
	fill: #a2a8b4;
}

.total-count {
	color: #a2a8b4;
	padding: 0 24px;
}

.tabs {
	padding: 12px 24px;
	gap: 12px;
	height: fit-content;
	max-height: 100%;
	overflow-y: auto;
	flex: 1;
}

.flex {
	height: 100%;
	overflow: hidden;
}

.content-header {
	padding: 20px 64px;
	display: flex;
	justify-content: space-between;
}

.controls {
	padding: 0 64px;
	gap: 20px;
	display: flex;
	justify-content: space-between;
}

.control-buttons {
	gap: 12px;
}

.content {
	flex: 1;
}

.search {
	max-width: 524px;
}

.main {
	padding: 24px 64px;
	height: 100%;
	display: grid;
	overflow: hidden;
	grid-template-rows: minmax(0, 1fr) minmax(0, auto);
	gap: 20px;
}

.info {
	flex: 1;
	display: flex;
	flex-wrap: nowrap;
	max-width: 371px;
}

.records,
.objects {
	display: inline-flex;
	height: 40px;
	padding: 0 16px;
	border: 2px solid #343a46;
	align-items: center;
	flex: 1;
}

.records {
	border-radius: 8px 0 0 8px;
	border-right: none;
}

.objects {
	border-radius: 0 8px 8px 0;
}

.categories {
	display: grid;
	grid-template-columns: 2fr 1fr;
	gap: 10px;
}

.shadow {
	border-radius: 6px 6px 0 0;
	background: linear-gradient(180deg, rgb(37 42 53 / 24%) 0%, #252a35 100%);
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 240px;
	height: 24px;
	flex-shrink: 0;
}

.picture {
	border-radius: 8px;
	box-shadow: 0 4px 16px 0 rgb(0 0 0 / 12%);
}

.dialog-title {
	justify-content: space-between;
}
</style>
