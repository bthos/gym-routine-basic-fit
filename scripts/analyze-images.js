#!/usr/bin/env node

/**
 * Скрыпт для аналізу ўсіх выяў на старонцы Matrix Fitness
 * Дапамагае вызначыць, якая выява з'яўляецца правільнай выявай трэнажора
 */

const puppeteer = require('puppeteer');

async function analyzeImages(url) {
  const browser = await puppeteer.launch({
    headless: true,
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

    const analysis = await page.evaluate(() => {
      const results = {
        metaTags: {},
        allImages: [],
        heroImages: [],
        productImages: []
      };

      // Мета-тэгі
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) results.metaTags.ogImage = ogImage.content;

      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (twitterImage) results.metaTags.twitterImage = twitterImage.content;

      // Усе выявы з jhtassets.com
      document.querySelectorAll('img').forEach((img, index) => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        if (src && src.includes('jhtassets.com')) {
          const rect = img.getBoundingClientRect();
          const parent = img.closest('div, section, article, main');
          
          const imageInfo = {
            index: index,
            src: src,
            alt: img.alt || '',
            width: img.naturalWidth || img.width || 0,
            height: img.naturalHeight || img.height || 0,
            displayWidth: rect.width,
            displayHeight: rect.height,
            loading: img.getAttribute('loading') || '',
            draggable: img.getAttribute('draggable') || '',
            parentClass: parent?.className || '',
            parentId: parent?.id || '',
            isVisible: rect.width > 0 && rect.height > 0,
            position: {
              top: rect.top,
              left: rect.left
            }
          };

          results.allImages.push(imageInfo);

          // Hero выявы
          if (img.getAttribute('loading') === 'eager' ||
              (img.alt || '').toLowerCase().includes('hero') ||
              img.getAttribute('draggable') === 'false') {
            results.heroImages.push(imageInfo);
          }

          // Выявы ў секцыях прадукту
          if (parent) {
            const parentClass = (parent.className || '').toLowerCase();
            const parentId = (parent.id || '').toLowerCase();
            if (parentClass.includes('product') || parentClass.includes('hero') || 
                parentId.includes('product') || parentId.includes('hero')) {
              results.productImages.push(imageInfo);
            }
          }
        }
      });

      return results;
    });

    console.log('\n' + '='.repeat(70));
    console.log('IMAGE ANALYSIS RESULTS');
    console.log('='.repeat(70));

    console.log('\n📋 META TAGS:');
    if (Object.keys(analysis.metaTags).length > 0) {
      console.log(JSON.stringify(analysis.metaTags, null, 2));
    } else {
      console.log('   No meta tags found');
    }

    console.log(`\n🖼️  TOTAL IMAGES FOUND: ${analysis.allImages.length}`);
    
    console.log(`\n🎯 HERO IMAGES: ${analysis.heroImages.length}`);
    analysis.heroImages.forEach((img, idx) => {
      console.log(`\n   ${idx + 1}. ${img.src.substring(0, 80)}${img.src.length > 80 ? '...' : ''}`);
      console.log(`      Alt: "${img.alt}"`);
      console.log(`      Size: ${img.width}x${img.height} (display: ${img.displayWidth.toFixed(0)}x${img.displayHeight.toFixed(0)})`);
      console.log(`      Loading: ${img.loading || 'N/A'}, Draggable: ${img.draggable || 'N/A'}`);
      console.log(`      Parent: ${img.parentClass.substring(0, 50) || img.parentId || 'N/A'}`);
    });

    console.log(`\n📦 PRODUCT SECTION IMAGES: ${analysis.productImages.length}`);
    analysis.productImages.forEach((img, idx) => {
      console.log(`\n   ${idx + 1}. ${img.src.substring(0, 80)}${img.src.length > 80 ? '...' : ''}`);
      console.log(`      Alt: "${img.alt}"`);
      console.log(`      Size: ${img.width}x${img.height} (display: ${img.displayWidth.toFixed(0)}x${img.displayHeight.toFixed(0)})`);
      console.log(`      Parent: ${img.parentClass.substring(0, 50) || img.parentId || 'N/A'}`);
    });

    console.log(`\n📊 ALL IMAGES (first 5 largest):`);
    const sortedBySize = [...analysis.allImages]
      .filter(img => img.isVisible)
      .sort((a, b) => (b.width * b.height) - (a.width * a.height))
      .slice(0, 5);
    
    sortedBySize.forEach((img, idx) => {
      console.log(`\n   ${idx + 1}. ${img.src.substring(0, 80)}${img.src.length > 80 ? '...' : ''}`);
      console.log(`      Alt: "${img.alt}"`);
      console.log(`      Size: ${img.width}x${img.height} (${(img.width * img.height / 1000).toFixed(0)}K pixels)`);
      console.log(`      Display: ${img.displayWidth.toFixed(0)}x${img.displayHeight.toFixed(0)}`);
      console.log(`      Position: top=${img.position.top.toFixed(0)}, left=${img.position.left.toFixed(0)}`);
    });

    console.log('\n' + '='.repeat(70));
    console.log('RECOMMENDATION:');
    console.log('='.repeat(70));
    
    if (analysis.metaTags.ogImage) {
      console.log('✅ Use og:image meta tag (most reliable)');
      console.log(`   ${analysis.metaTags.ogImage}`);
    } else if (analysis.heroImages.length > 0) {
      const largestHero = analysis.heroImages.sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
      console.log('✅ Use largest Hero image');
      console.log(`   ${largestHero.src}`);
      console.log(`   Size: ${largestHero.width}x${largestHero.height}`);
    } else if (analysis.productImages.length > 0) {
      const largestProduct = analysis.productImages.sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
      console.log('✅ Use largest image from product section');
      console.log(`   ${largestProduct.src}`);
      console.log(`   Size: ${largestProduct.width}x${largestProduct.height}`);
    } else if (sortedBySize.length > 0) {
      console.log('⚠️  Use largest visible image (fallback)');
      console.log(`   ${sortedBySize[0].src}`);
      console.log(`   Size: ${sortedBySize[0].width}x${sortedBySize[0].height}`);
    }

  } finally {
    await browser.close();
  }
}

const url = process.argv[2] || 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s10-chest-press';
analyzeImages(url).catch(console.error);
