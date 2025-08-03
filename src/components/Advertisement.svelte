<script lang="ts">
  import type { Advertisement } from '../lib/adService';

  export let ad: Advertisement;
  export let showLabel: boolean = true;

  function handleClick() {
    // 可以在这里添加点击统计
    console.log('Ad clicked:', ad.link);
  }
</script>

<div class="advertisement-slot">
  {#if showLabel}
    <div class="ad-label">广告</div>
  {/if}
  <div class="ad-content">
    <a href={ad.link} target="_blank" rel="nofollow" on:click={handleClick}>
      {#if ad.type === 'banner'}
        <img src={ad.content} alt={ad.altText} />
      {:else}
        <div class="text-ad">{ad.content}</div>
      {/if}
    </a>
  </div>
</div>

<style>
  .advertisement-slot {
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background: #f9f9f9;
  }

  .ad-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 5px;
    text-align: center;
  }

  .ad-content {
    text-align: center;
  }

  .ad-content a {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  .ad-content img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  .text-ad {
    padding: 10px;
    background: #fff;
    border-radius: 4px;
    color: #333;
    font-size: 14px;
    line-height: 1.4;
  }

  .text-ad:hover {
    background: #f0f0f0;
  }
</style> 