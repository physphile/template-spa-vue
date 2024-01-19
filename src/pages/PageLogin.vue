<script setup lang="ts">
import Logo from '../assets/logo.svg';
import { BPAButton, BPACheckbox, BPAInput } from '@bpa-dev/uikit';
</script>
<template>
	<div class="layout">
		<div class="column display">
			<div class="picture"></div>
			<div class="text-title-xl heading">
				<span class="text-primary">Умный мониторинг</span><br />
				содержания офисных помещений
			</div>
		</div>
		<div class="column panel">
			<div style="margin-bottom: 24px" class="centered">
				<Logo width="64" height="64" />
			</div>
			<div class="text-title-md centered" style="margin-bottom: 48px">ВХОД В СИСТЕМУ</div>
			<form class="column form" style="margin-bottom: 48px" @submit.prevent>
				<div>
					<label for="login" class="text-body-lg label">Логин*</label>
					<BPAInput id="login" placeholder="example@mail.ru" />
				</div>
				<div>
					<label for="password" class="text-body-lg label">Пароль*</label>
					<BPAInput id="password" placeholder="************" />
				</div>
				<BPACheckbox>Запомнить меня</BPACheckbox>
				<BPAButton type="submit" style="width: 100%">Войти</BPAButton>
			</form>
			<span class="text-body-md centered" style="color: #a2a8b4">ПО "УМСОП" | Версия V1.01</span>
		</div>
	</div>
</template>
<style scoped>
.layout {
	display: flex;
	height: 100%;
}

.display,
.picture {
	flex: 1;
}

.form {
	gap: 24px;
}

.label {
	margin-left: 18px;
	margin-bottom: 10px;
}

.picture {
	position: relative;
	background: url('../assets/backgrounds/cluster.avif');
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		background: rgb(27 32 42 / 8%);
	}
}

.heading {
	background: #252b36;
	padding: 64px;
}

.panel {
	width: 556px;
	padding: 96px;
}
</style>
