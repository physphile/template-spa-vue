import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		redirect: '/scanning',
	},
	{
		path: '/scanning',
		component: () => import('../pages/PageScanning.vue'),
	},
	{
		path: '/journal',
		component: () => import('../pages/PageJournal.vue'),
		name: 'journal',
	},
	{
		path: '/login',
		component: () => import('../pages/PageLogin.vue'),
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
