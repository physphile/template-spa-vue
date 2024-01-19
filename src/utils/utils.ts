export const lz = (n: number) => `0${n}`.slice(-2);
export const stringifyDate = (date: Date) => `${date.getFullYear()}-${lz(date.getMonth() + 1)}-${lz(date.getDate())}`;
export const formatDate = (date: Date) =>
	date.toLocaleDateString('ru-RU', { year: '2-digit', month: '2-digit', day: '2-digit' });
