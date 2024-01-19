import { Converter } from '../utils/converter';
import { BaseApi } from './BaseApi';
import { CategoryName, Frame } from './types';

interface GetFramesParams {
	category: CategoryName | 'any';
	source_name: string;
	page_size: number;
	page: number;
	time_from: string;
	time_to: string;
	order_by: 'time' | 'source_name' | 'objects_count' | 'unique_category_count';
	order_direction: 'desc' | 'asc';
}

interface GetFramesResponse {
	total: number;
	total_objects: number;
	frames: Frame[];
}

interface GetRecentFrameParams {
	source_name: string;
	offset_down: number;
}

class UmsopApi extends BaseApi {
	constructor() {
		super('');
	}

	public async getFrames(params?: Partial<GetFramesParams>) {
		return this.get<GetFramesResponse, GetFramesParams>('/get_frames', { page_size: 20, ...params });
	}

	public async getRecentFrame(source: string, offset = 0) {
		const { data } = await this.get<Frame, GetRecentFrameParams>('/get_recent_frame', {
			source_name: source,
			offset_down: offset,
		});
		return Converter.flat(data);
	}

	public async getFramesCount(params?: Partial<GetFramesParams>) {
		const { data } = await this.get<GetFramesResponse, GetFramesParams>('/get_frames', { page_size: 0, ...params });
		return data.total;
	}
}

export const umsopApi = new UmsopApi();
