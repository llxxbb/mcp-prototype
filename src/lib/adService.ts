export interface Advertisement {
	type: 'banner' | 'text';
	content: string;
	link: string;
	altText: string;
}

class AdService {
	private ads: Advertisement[] = [];
	private lastFetch: number = 0;
	private readonly CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存
	private readonly ADS_URL = '/api/ads';

	async getAds(): Promise<Advertisement[]> {
		// 检查缓存是否有效
		if (this.ads.length > 0 && Date.now() - this.lastFetch < this.CACHE_DURATION) {
			return this.ads;
		}

		try {
			const response = await fetch(this.ADS_URL);
			if (!response.ok) {
				throw new Error(`Failed to fetch ads: ${response.status}`);
			}

			this.ads = await response.json();
			this.lastFetch = Date.now();

			// 验证数据格式
			if (!Array.isArray(this.ads)) {
				console.warn('Invalid ads data format');
				this.ads = [];
			}

			return this.ads;
		} catch (error) {
			console.error('Error fetching ads:', error);
			this.ads = [];
			return this.ads;
		}
	}

	getAdByIndex(index: number): Advertisement | null {
		if (index >= 0 && index < this.ads.length) {
			return this.ads[index];
		}
		return null;
	}

	clearCache(): void {
		this.ads = [];
		this.lastFetch = 0;
	}
}

export const adService = new AdService();
