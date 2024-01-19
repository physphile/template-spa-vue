import { CategoryName } from '../api/types';

export const colorMap: Record<string, { color: string; background: string }> = {
	[CategoryName.Bags]: { color: '#23D7FF', background: '#1C3644' },
	[CategoryName.Bottle]: { color: '#FB23FF', background: '#362044' },
	[CategoryName.Cups]: { color: '#EDFF23', background: '#343B29' },
	[CategoryName.Other]: { color: '#FF3759', background: '#372330' },
};
