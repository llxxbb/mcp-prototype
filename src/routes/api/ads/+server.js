import { json } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { env } from '$env/dynamic/private';

export async function GET() {
	try {
		if (env.ADS_URL) {
			// 从本地路径加载 ads.json
			const adsData = readFileSync(env.ADS_URL, 'utf8');
			const ads = JSON.parse(adsData);

			// 验证数据格式
			if (!Array.isArray(ads)) {
				throw new Error('Invalid ads data format');
			}

			return json(ads);
		} else {
			// 从远程 URL 获取 ads.json
			const response = await fetch('https://gitee.com/xb_li/mcp-prototype/raw/main/ads/ads.json');

			if (!response.ok) {
				throw new Error(`Failed to fetch ads: ${response.status}`);
			}

			const ads = await response.json();

			// 验证数据格式
			if (!Array.isArray(ads)) {
				throw new Error('Invalid ads data format');
			}

			return json(ads);
		}
	} catch (error) {
		console.error('Error fetching ads from Gitee:', error);

		// 返回备用数据
		const fallbackAds = [
			{
				type: 'banner',
				content: 'https://landings-cdn.adsterratech.com/referralBanners/png/200%20x%20200%20px.png',
				link: 'https://beta.publishers.adsterra.com/referral/MMkdJQZHGc',
				altText: '广告横幅'
			},
			{
				type: 'text',
				content: '推荐产品：高性能开发工具',
				link: 'https://example.com/product',
				altText: '产品推荐'
			},
			{
				type: 'banner',
				content: 'https://example.com/banner2.jpg',
				link: 'https://example.com/sale',
				altText: '限时优惠'
			},
			{
				type: 'text',
				content: '限时优惠：开发工具包8折',
				link: 'https://example.com/discount',
				altText: '优惠活动'
			}
		];

		return json(fallbackAds);
	}
}