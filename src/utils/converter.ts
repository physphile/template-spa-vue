import { CategoryName, Frame } from '../api/types';

interface Categories {
	[name: string]: number;
}

export interface JournalItem {
	id: number;
	source: string;
	categories: Categories;
	count: number;
	time: string;
	picture: string;
	accuracy: number;
}

export const CategoryMap: Record<CategoryName, string> = {
	[CategoryName.Bags]: 'Сумка',
	[CategoryName.Bottle]: 'Бутылка',
	[CategoryName.Cups]: 'Стаканчик',
	[CategoryName.Other]: 'Другое',
};

export class Converter {
	public static fromArray(frames: Frame[]): JournalItem[] {
		return frames.map(Converter.flat);
	}

	public static flat(frame: Frame) {
		return {
			id: frame.id,
			categories: Converter.getCategories(frame),
			count: frame.bbox_json.objects.length,
			picture: frame.filename_bbox,
			source: frame.source_name,
			time: frame.timestamp,
			accuracy: Converter.getAccuracy(frame),
		};
	}

	private static getCategories(frame: Frame): Categories {
		return frame.bbox_json.objects.reduce((acc, obj) => {
			if (!(obj.category_name in acc)) {
				acc[obj.category_name] = 0;
			}
			++acc[obj.category_name];
			return acc;
		}, {} as Categories);
	}

	private static getAccuracy(frame: Frame): number {
		const sum = frame.bbox_json.objects.reduce((acc, obj) => acc + obj.score * 100, 0);
		return Math.round(sum / frame.bbox_json.objects.length);
	}
}
