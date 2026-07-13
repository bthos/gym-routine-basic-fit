#!/usr/bin/env node

/**
 * Дапаможны скрыпт для адладкі структуры старонкі Matrix Fitness
 * Дапамагае зразумець, якія выявы трэба выбіраць
 */

const puppeteer = require('puppeteer');

async function debugPageStructure(url) {
  const browser = await puppeteer.launch({
    headless: false, // Паказваем браўзер для адладкі
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Чакаем загрузкі
    await new Promise(resolve => setTimeout(resolve, 5000));

    const pageInfo = await page.evaluate(() => {
      const info = {
        metaTags: {},
        heroImages: [],
        productImages: [],
        allImages: []
      };

      // Мета-тэгі
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) info.metaTags.ogImage = ogImage.content;

      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (twitterImage) info.metaTags.twitterImage = twitterImage.content;

      // Hero выявы
      document.querySelectorAll('img[loading="eager"], img[alt*="Hero"], img[alt*="hero"], img[draggable="false"]').forEach(img => {
        const src = img.src || img.getAttribute('data-src');
        if (src && src.includes('jhtassets.com')) {
          info.heroImages.push({
            src: src,
            alt: img.alt,
            loading: img.getAttribute('loading'),
            draggable: img.getAttribute('draggable'),
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
            parentClass: img.closest('div')?.className || '',
            parentId: img.closest('div')?.id || ''
          });
        }
      });

      // Выявы прадуктаў (з JSON-LD)
      document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
        try {
          const data = JSON.parse(script.textContent);
          if (data['@type'] === 'Product' && data.image) {
            info.productImages.push({
              type: 'JSON-LD',
              image: Array.isArray(data.image) ? data.image[0] : data.image
            });
          }
        } catch (e) {}
      });

      // Усе выявы з jhtassets.com
      document.querySelectorAll('img[src*="jhtassets.com"]').forEach(img => {
        const src = img.src;
        if (src.includes('jhtassets.com')) {
          info.allImages.push({
            src: src,
            alt: img.alt,
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
            parentClass: img.closest('div')?.className || '',
            parentId: img.closest('div')?.id || ''
          });
        }
      });

      return info;
    });

    console.log('\n=== META TAGS ===');
    console.log(JSON.stringify(pageInfo.metaTags, null, 2));

    console.log('\n=== HERO IMAGES ===');
    console.log(JSON.stringify(pageInfo.heroImages, null, 2));

    console.log('\n=== PRODUCT IMAGES (JSON-LD) ===');
    console.log(JSON.stringify(pageInfo.productImages, null, 2));

    console.log('\n=== ALL IMAGES (first 10) ===');
    console.log(JSON.stringify(pageInfo.allImages.slice(0, 10), null, 2));

    // Чакаем 10 секунд, каб карыстальнік мог паглядзець старонку
    console.log('\n⏳ Browser will stay open for 10 seconds...');
    await new Promise(resolve => setTimeout(resolve, 10000));

  } finally {
    await browser.close();
  }
}

const url = process.argv[2] || 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s10-chest-press';
debugPageStructure(url).catch(console.error);
