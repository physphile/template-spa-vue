export enum CategoryName {
	Bottle = 'bottle',
	Cups = 'cups',
	Bags = 'bags',
	Other = 'other',
}

export interface Object {
	bbox: [number, number, number, number];
	score: number;
	category_name: CategoryName;
	color_hex: string;
}

export interface Frame {
	id: number;
	source_name: string;
	timestamp: string;
	filename: string;
	filename_bbox: string;
	bbox_json: {
		objects: Object[];
	};
}
