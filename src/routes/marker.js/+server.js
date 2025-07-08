// src/routes/my-script.js/+server.js
import { readFile } from 'fs/promises';
import { createHash } from 'crypto';


// 缓存文件内容和哈希值
let cachedContent = null;
let cachedHash = null;

export async function GET() {
  try {
    console.log('GET /marker.js');
    // 检查是否有缓存内容
    if (!cachedContent) {
      const filePath = `src/lib/marker.js`;
      cachedContent = await readFile(filePath, 'utf-8');
      
      // 生成内容哈希作为ETag
      cachedHash = createHash('sha256').update(cachedContent).digest('hex');
    }
    
    return new Response(cachedContent, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600', // 缓存1小时
        'ETag': cachedHash
      }
    });
  } catch (error) {
    return new Response('Not found', { status: 404 });
  }
}