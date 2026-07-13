#!/usr/bin/env node

/**
 * Аўтаматычны скрыпт для здабывання выяў Matrix Fitness
 * Выкарыстоўвае Puppeteer для рэндэрынгу JavaScript старонак
 * 
 * Патрабаванні:
 * npm install puppeteer
 * 
 * Выкарыстанне:
 * node scripts/extract-matrix-images-puppeteer.js [model-code]
 * node scripts/extract-matrix-images-puppeteer.js --all    # Здабыць выявы для ўсіх мадэляў
 * node scripts/extract-matrix-images-puppeteer.js --list  # Паказаць спіс даступных мадэляў
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Мапінг мадэляў на URL старонак прадуктаў
const MODEL_URLS = {
  'g3-s10': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s10-chest-press',
  'g3-s12': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s12-pectoral-fly',
  'g3-s13': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s13-converging-chest-press',
  'g3-s20': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s20-shoulder-press',
  'g3-s21': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s21-lateral-raise',
  'g3-s22': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s22-rear-delt-fly',
  'g3-s23': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s23-converging-shoulder-press',
  'g3-s30': 'https://www.matrixfitness.com/us/eng/strength/multi-station/lat-pulldown',
  'g3-s31': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s31-seated-row',
  'g3-s33': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s33-diverging-lat-pulldown',
  'g3-s34': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s34-diverging-seated-row',
  'g3-s40': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s40-arm-curl',
  'g3-s42': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s42-triceps-press',
  'g3-s45': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s45-tricep-extension',
  'g3-s50': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s50-abdominal',
  'g3-s51': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s51-abdominal-crunch',
  'g3-s52': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s52-back-extension',
  'g3-s55': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s55-rotary-torso',
  'g3-s60': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s60-dip-chin-assist',
  'g3-s70': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s70-leg-press',
  'g3-s71': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s71-leg-extension',
  'g3-s72': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s72-seated-leg-curl',
  'g3-s73': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s73-prone-leg-curl',
  'g3-s74': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s74-hip-adductor',
  'g3-s75': 'https://www.matrixfitness.com/us/eng/strength/single-station/g3-s75-hip-abductor',
  'smith-machine': 'https://www.matrixfitness.com/eng/strength/free-weights/g1-fw161-smith-machine',
  'perfect-squat': 'https://www.matrixfitness.com/us/eng/strength/plate-loaded/vy-400-perfect-squat'
};

/**
 * Здабывае выявы са старонкі, выкарыстоўваючы Puppeteer
 */
async function extractImagesWithPuppeteer(url, modelCode) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Перахоплiваем запыты да выяў
    const images = [];
    const imageUrls = new Set();

    // Перахопліваем толькі вялікія выявы (выключаем іконкі і лагатыпы)
    page.on('response', async (response) => {
      const url = response.url();
      // Фільтруем толькі выявы прадуктаў (выключаем маленькія файлы — іконкі)
      if (url.includes('jhtassets.com') && 
          (url.match(/\.(jpg|jpeg|png|webp)$/i) || url.includes('transformed'))) {
        // Выключаем відавочна маленькія выявы (іконкі, лагатыпы)
        if (!url.includes('icon') && !url.includes('logo') && !url.includes('nav')) {
          // Аддаём перавагу памерам thumbnail для прадуктаў
          if (url.includes('150x150') || url.includes('300x300') || url.includes('thumbnail') || 
              url.includes('w_300') || url.includes('w_150')) {
            imageUrls.add(url);
          } else if (url.includes('transformed/w_') && 
                     (url.includes('w_600') || url.includes('w_900') || url.includes('w_1200'))) {
            // Вялікія выявы прадуктаў (не thumbnail, але прадукт)
            imageUrls.add(url);
          }
        }
      }
    });

    // Загружаем старонку
    console.log(`Loading page: ${url}`);
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Чакаем загрузкі выяў (павялічана для дынамічнага кантэнту Angular)
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Чакаем з'яўлення Hero-выявы з alt="PNG Hero" (самае надзейнае)
    try {
      await page.waitForSelector('img[alt*="Hero"], img[alt*="hero"], img[loading="eager"]', { 
        timeout: 10000 
      }).catch(() => {});
    } catch (e) {
      // Ігнаруем, калі не знойдзена
    }
    
    // Дадатковае чаканне для поўнай загрузкі выяў
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Правяраем наяўнасць мета-тэгаў і Hero-выяў
    const pageCheck = await page.evaluate(() => {
      const ogImage = document.querySelector('meta[property="og:image"]');
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      const heroImages = document.querySelectorAll('img[alt*="Hero"], img[alt*="hero"], img[loading="eager"]');
      return {
        hasMetaTags: !!(ogImage || twitterImage),
        heroCount: heroImages.length,
        hasHeroWithAlt: Array.from(heroImages).some(img => (img.alt || '').toLowerCase().includes('hero'))
      };
    });
    
    console.log(`   Meta tags: ${pageCheck.hasMetaTags ? 'Yes' : 'No'}, Hero images: ${pageCheck.heroCount} (with alt: ${pageCheck.hasHeroWithAlt})`);
    
    // Правяраем структуру старонкі для лепшага разумення
    const pageStructure = await page.evaluate(() => {
      const structure = {
        hasProductHero: false,
        hasProductImage: false,
        heroImageUrl: null,
        productImageUrl: null
      };
      
      // Шукаем hero-выяву ў секцыі прадукту
      const heroSection = document.querySelector('[class*="hero"], [class*="Hero"], [id*="hero"], [id*="Hero"]');
      if (heroSection) {
        const heroImg = heroSection.querySelector('img[src*="jhtassets.com"]');
        if (heroImg) {
          structure.hasProductHero = true;
          structure.heroImageUrl = heroImg.src || heroImg.getAttribute('data-src');
        }
      }
      
      // Шукаем выяву ў секцыі прадукту
      const productSection = document.querySelector('[class*="product"], [id*="product"]');
      if (productSection) {
        const productImg = productSection.querySelector('img[src*="jhtassets.com"]');
        if (productImg) {
          structure.hasProductImage = true;
          structure.productImageUrl = productImg.src || productImg.getAttribute('data-src');
        }
      }
      
      return structure;
    });
    
    console.log(`   Page structure: Hero=${pageStructure.hasProductHero}, Product=${pageStructure.hasProductImage}`);

    // Здабываем выявы з DOM (толькі выявы трэнажораў)
    const evaluateResult = await page.evaluate(() => {
      const images = [];
      const MIN_SIZE = 200; // Мінімальны памер для выявы прадукту
      
      // Функцыя для атрымання інфармацыі пра бацькоўскі элемент
      const getParentInfo = (element) => {
        const parent = element.closest('div, section, article, main');
        if (!parent) return null;
        return {
          className: parent.className || '',
          id: parent.id || '',
          tagName: parent.tagName,
          hasProductClass: (parent.className || '').toLowerCase().includes('product') ||
                          (parent.id || '').toLowerCase().includes('product'),
          hasHeroClass: (parent.className || '').toLowerCase().includes('hero') ||
                       (parent.id || '').toLowerCase().includes('hero'),
          hasMainClass: (parent.className || '').toLowerCase().includes('main') ||
                       (parent.id || '').toLowerCase().includes('main')
        };
      };
      
      // Функцыя праверкі, ці з'яўляецца элемент часткай навігацыі/header/footer
      // НЕ выключае Hero-выявы (alt змяшчае "Hero" або loading="eager")
      const isInExcludedArea = (element) => {
        // Правяраем, ці з'яўляецца гэта Hero-выявай — калі так, НЕ выключаем
        const alt = (element.alt || '').toLowerCase();
        const loading = element.getAttribute('loading');
        const draggable = element.getAttribute('draggable');
        const isHero = alt.includes('hero') || loading === 'eager' || draggable === 'false';
        
        if (isHero) {
          return false; // Hero-выявы НІКОЛІ не выключаем
        }
        
        const excludedTags = ['HEADER', 'FOOTER', 'NAV'];
        let parent = element.parentElement;
        while (parent) {
          const tagName = parent.tagName;
          const className = parent.className || '';
          const id = parent.id || '';
          
          if (excludedTags.includes(tagName)) return true;
          // Больш строгія праверкі — толькі відавочныя выключэнні
          if (className.toLowerCase().includes('logo') && !className.toLowerCase().includes('product')) return true;
          if (className.toLowerCase().includes('icon') && !className.toLowerCase().includes('product')) return true;
          if ((className.toLowerCase().includes('nav') || className.toLowerCase().includes('menu')) && 
              !className.toLowerCase().includes('product') && !className.toLowerCase().includes('hero')) return true;
          if (className.toLowerCase().includes('banner') || className.toLowerCase().includes('ad')) return true;
          if (id.toLowerCase().includes('logo') || 
              (id.toLowerCase().includes('nav') && !id.toLowerCase().includes('product')) ||
              (id.toLowerCase().includes('menu') && !id.toLowerCase().includes('product'))) return true;
          
          parent = parent.parentElement;
        }
        return false;
      };
      
      // Функцыя праверкі alt-тэксту
      const isExcludedByAlt = (alt) => {
        if (!alt) return false;
        const lowerAlt = alt.toLowerCase();
        return lowerAlt.includes('logo') || 
               lowerAlt.includes('icon') || 
               lowerAlt.includes('menu') ||
               lowerAlt.includes('banner') ||
               lowerAlt.includes('ad');
      };
      
      // 0. ПЕРШЫ ПРЫЯРЫТЭТ: Hero-выявы з alt="PNG Hero" (самае надзейнае)
      // Шукаем іх ПЕРШЫМІ, да ўсіх астатніх праверак
      let heroFoundCount = 0;
      let heroCheckedCount = 0;
      let heroExcludedCount = 0;
      
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        const alt = (img.alt || '').toLowerCase();
        const loading = img.getAttribute('loading');
        const draggable = img.getAttribute('draggable');
        
        if (src && src.includes('jhtassets.com')) {
          // Шукаем выявы з alt, якi змяшчае "PNG Hero" або "Hero"
          const isPngHero = alt.includes('png hero') || alt === 'png hero';
          const isHero = alt.includes('hero') || loading === 'eager' || draggable === 'false';
          
          if (isPngHero || isHero) {
            heroCheckedCount++;
            const excluded = isInExcludedArea(img);
            
            if (!excluded) {
              heroFoundCount++;
              let imageUrl = src;
              // Калі URL заканчваецца на /, дадаём параметры для thumbnail
              if (imageUrl.endsWith('/')) {
                imageUrl = imageUrl + 'transformed/w_300';
              } else if (imageUrl.includes('transformed/w_900')) {
                imageUrl = imageUrl.replace('/w_900', '/w_300');
              } else if (!imageUrl.includes('transformed')) {
                imageUrl = imageUrl + (imageUrl.endsWith('/') ? '' : '/') + 'transformed/w_300';
              }
              
              const parentInfo = getParentInfo(img);
              images.push({ 
                url: imageUrl, 
                source: isPngHero ? 'Hero image (PNG Hero)' : 'Hero image (alt/loading)', 
                isMain: true,
                isThumbnail: imageUrl.includes('w_300') || imageUrl.includes('w_150') || imageUrl.includes('300x300'),
                parentInfo: parentInfo,
                alt: img.alt,
                priority: isPngHero ? 1 : 2,
                width: img.naturalWidth || img.width || 0,
                height: img.naturalHeight || img.height || 0
              });
            } else {
              heroExcludedCount++;
            }
          }
        }
      });
      
      // 1. Мета-тэгі (НАЙВЫШЭЙШЫ ПРЫЯРЫТЭТ — звычайна змяшчаюць галоўную выяву прадукту)
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage && ogImage.content.includes('jhtassets.com')) {
        let url = ogImage.content;
        // Нармалізуем URL для thumbnail
        if (url.endsWith('/')) {
          url = url + 'transformed/w_300';
        } else if (url.includes('transformed/w_900')) {
          url = url.replace('/w_900', '/w_300');
        } else if (!url.includes('transformed')) {
          // Калі URL без параметраў, дадаём thumbnail
          url = url + (url.endsWith('/') ? '' : '/') + 'transformed/w_300';
        }
        images.push({ 
          url: url, 
          source: 'og:image', 
          isMain: true,
          isThumbnail: url.includes('w_300') || url.includes('w_150') || url.includes('300x300')
        });
      }
      
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (twitterImage && twitterImage.content.includes('jhtassets.com')) {
        const ogContent = ogImage?.content || '';
        if (twitterImage.content !== ogContent) {
          let url = twitterImage.content;
          // Нармалізуем URL для thumbnail
          if (url.endsWith('/')) {
            url = url + 'transformed/w_300';
          } else if (url.includes('transformed/w_900')) {
            url = url.replace('/w_900', '/w_300');
          } else if (!url.includes('transformed')) {
            url = url + (url.endsWith('/') ? '' : '/') + 'transformed/w_300';
          }
          images.push({ 
            url: url, 
            source: 'twitter:image', 
            isMain: true,
            isThumbnail: url.includes('w_300') || url.includes('w_150') || url.includes('300x300')
          });
        }
      }
      
      // 2. Hero-выявы (alt змяшчае "Hero" або loading="eager")
      // Шукаем рознымі спосабамі, бо Angular можа выкарыстоўваць розныя атрыбуты
      // ПРЫЯРЫТЭТ: alt="PNG Hero" > loading="eager" > draggable="false"
      
      // Спачатку шукаем выявы з дакладным alt="PNG Hero" або alt змяшчае "Hero"
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        const alt = (img.alt || '').toLowerCase();
        const loading = img.getAttribute('loading');
        const draggable = img.getAttribute('draggable');
        
        if (src && src.includes('jhtassets.com') && !isInExcludedArea(img)) {
          // Правяраем, што гэта сапраўды hero-выява
          const isHero = alt.includes('hero') || 
                        loading === 'eager' || 
                        draggable === 'false';
          
          if (isHero) {
            const parentInfo = getParentInfo(img);
            // Калі URL заканчваецца на /, дадаём параметры для thumbnail
            let imageUrl = src;
            if (imageUrl.endsWith('/')) {
              imageUrl = imageUrl + 'transformed/w_300';
            } else if (imageUrl.includes('transformed/w_900')) {
              // Пераўтвараем w_900 у w_300 для thumbnail
              imageUrl = imageUrl.replace('/w_900', '/w_300');
            } else if (!imageUrl.includes('transformed')) {
              // Калі няма параметраў, дадаём thumbnail
              imageUrl = imageUrl + (imageUrl.endsWith('/') ? '' : '/') + 'transformed/w_300';
            }
            
            // Прыярытэт для выяў з alt="PNG Hero"
            const priority = alt.includes('png hero') || alt === 'png hero' ? 1 : 2;
            
            images.push({ 
              url: imageUrl, 
              source: alt.includes('png hero') ? 'Hero image (PNG Hero)' : 'Hero image (alt/loading)', 
              isMain: true,
              isThumbnail: imageUrl.includes('w_300') || imageUrl.includes('w_150') || imageUrl.includes('300x300'),
              parentInfo: parentInfo,
              alt: img.alt,
              priority: priority,
              width: img.naturalWidth || img.width || 0,
              height: img.naturalHeight || img.height || 0
            });
          }
        }
      });
      
      // Выдаляем дублікаты Hero-выяў (пакідаем толькі адну з найвышэйшым прыярытэтам)
      const heroImages = images.filter(img => img.source.includes('Hero'));
      if (heroImages.length > 1) {
        // Сартуем Hero-выявы па прыярытэце і памеры
        heroImages.sort((a, b) => {
          if (a.priority !== b.priority) return a.priority - b.priority;
          const aSize = (a.width || 0) * (a.height || 0);
          const bSize = (b.width || 0) * (b.height || 0);
          return bSize - aSize;
        });
        
        // Выдаляем дублікаты па базавым URL (без параметраў transformed)
        const seenHeroUrls = new Set();
        const uniqueHeroImages = [];
        heroImages.forEach(img => {
          const baseUrl = img.url.replace('/transformed/w_300', '').replace('/transformed/w_900', '').replace(/\/$/, '');
          if (!seenHeroUrls.has(baseUrl)) {
            seenHeroUrls.add(baseUrl);
            uniqueHeroImages.push(img);
          }
        });
        
        // Выдаляем старыя Hero-выявы і дадаём унікальныя
        const nonHeroImages = images.filter(img => !img.source.includes('Hero'));
        images.length = 0; // Ачышчаем масіў
        images.push(...uniqueHeroImages, ...nonHeroImages); // Дадаём Hero спачатку, потым астатнія
      }
      
      // Спецыяльны пошук для выяў з URL, які заканчваецца на / (як у прыкладзе карыстальніка)
      // Гэта характэрна для Matrix Fitness — URL без пашырэння патрабуе параметраў
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        if (src && src.includes('jhtassets.com') && src.endsWith('/') && !isInExcludedArea(img)) {
          const alt = (img.alt || '').toLowerCase();
          const loading = img.getAttribute('loading');
          
          // Калі alt змяшчае "hero" або гэта loading="eager", гэта галоўная выява
          // Таксама правяраем draggable="false" як індыкатар галоўнай выявы
          if (alt.includes('hero') || loading === 'eager' || img.getAttribute('draggable') === 'false') {
            const imageUrl = src + 'transformed/w_300';
            const existing = images.find(i => {
              const iUrl = i.url.replace('/transformed/w_300', '').replace('/transformed/w_900', '');
              return iUrl === src || iUrl === src.replace(/\/$/, '');
            });
            
            if (!existing) {
              images.push({ 
                url: imageUrl, 
                source: 'Hero image (URL ends with /)', 
                isMain: true,
                isThumbnail: true
              });
            }
          }
        }
      });

      // 3. Структураваныя дадзеныя JSON-LD (высокі прыярытэт)
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
      jsonLdScripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent);
          if (data['@type'] === 'Product' && data.image) {
            const imageUrl = Array.isArray(data.image) ? data.image[0] : data.image;
            if (typeof imageUrl === 'string' && imageUrl.includes('jhtassets.com')) {
              let url = imageUrl;
              if (url.endsWith('/')) {
                url = url + 'transformed/w_300';
              }
              images.push({ url: url, source: 'JSON-LD Product', isMain: true });
            }
          }
        } catch (e) {}
      });

      // 4. Выявы з асноўных селектараў прадукту
      const productSelectors = [
        '.product-image img',
        '.product-photo img',
        '.hero-image img',
        '.main-image img',
        '[data-product-image] img',
        '.product-hero img',
        '.product-visual img',
        '.product-gallery img:first-of-type'
      ];
      
      productSelectors.forEach(selector => {
        try {
          document.querySelectorAll(selector).forEach(img => {
            const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
            if (src && src.includes('jhtassets.com') && !isInExcludedArea(img) && 
                !isExcludedByAlt(img.alt)) {
              const width = img.naturalWidth || img.width || 0;
              const height = img.naturalHeight || img.height || 0;
              
              // Уключаем выявы (калі памер невядомы, усё роўна ўключаем)
              if (width >= MIN_SIZE || height >= MIN_SIZE || (width === 0 && height === 0)) {
                const isThumbnail = src.includes('150x150') || src.includes('300x300') || 
                                   src.includes('thumbnail') || src.includes('w_300') || src.includes('w_150');
                images.push({ 
                  url: src, 
                  source: `product selector: ${selector}`,
                  isThumbnail: isThumbnail,
                  width: width,
                  height: height
                });
              }
            }
          });
        } catch (e) {}
      });
      
      // 5. Fallback: ТОЛЬКІ калі нічога не знойдзена вышэй, шукаем выявы з асаблівымі прыкметамі прадукту
      // НЕ выкарыстоўваем агульны fallback, каб пазбегнуць непатрэбных выяў
      if (images.length === 0) {
        // Шукаем выявы ў секцыях прадукту з канкрэтнымі класамі
        const productSectionSelectors = [
          '[class*="product"]',
          '[class*="hero"]',
          '[class*="main-image"]',
          '[id*="product"]',
          '[id*="hero"]'
        ];
        
        productSectionSelectors.forEach(sectionSelector => {
          try {
            document.querySelectorAll(`${sectionSelector} img`).forEach(img => {
              const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
              if (src && src.includes('jhtassets.com') && !isInExcludedArea(img) && 
                  !isExcludedByAlt(img.alt)) {
                const urlLower = src.toLowerCase();
                // Выключаем толькі відавочныя лагатыпы/іконкі
                if (!urlLower.includes('/logo') && !urlLower.includes('logo.') &&
                    !urlLower.includes('/icon') && !urlLower.includes('icon.')) {
                  let imageUrl = src;
                  // Калі URL заканчваецца на /, дадаём параметры для thumbnail
                  if (imageUrl.endsWith('/')) {
                    imageUrl = imageUrl + 'transformed/w_300';
                  }
                  const isThumbnail = imageUrl.includes('150x150') || imageUrl.includes('300x300') || 
                                     imageUrl.includes('thumbnail') || imageUrl.includes('w_300') || imageUrl.includes('w_150');
                  images.push({ 
                    url: imageUrl, 
                    source: `img tag (fallback from ${sectionSelector})`,
                    isThumbnail: isThumbnail
                  });
                }
              }
            });
          } catch (e) {}
        });
      }
      
      // Апрацоўваем усе знойдзеныя URL: калі заканчваюцца на /, дадаём параметры
      images.forEach(img => {
        if (img.url.endsWith('/') && !img.url.includes('transformed')) {
          img.url = img.url + 'transformed/w_300';
          img.isThumbnail = true;
        }
      });

      // 4. Элементы picture (толькі з асноўных секцый прадукту)
      document.querySelectorAll('picture source').forEach(source => {
        const picture = source.closest('picture');
        if (picture && !isInExcludedArea(picture)) {
          const srcset = source.getAttribute('srcset');
          if (srcset && srcset.includes('jhtassets.com')) {
            srcset.split(',').forEach(src => {
              const url = src.trim().split(' ')[0];
              if (url.includes('jhtassets.com')) {
                images.push({ url: url, source: 'picture source' });
              }
            });
          }
        }
      });

      // Вяртаем інфармацыю для адладкі
      const heroCount = images.filter(img => img.source.includes('Hero')).length;
      return {
        images: images,
        debug: {
          heroCount: heroCount,
          heroFoundCount: heroFoundCount,
          heroCheckedCount: heroCheckedCount,
          heroExcludedCount: heroExcludedCount,
          totalCount: images.length,
          heroUrls: images.filter(img => img.source.includes('Hero')).map(img => img.url)
        }
      };
    });
    
    const debugInfo = evaluateResult.debug;
    const domImages = evaluateResult.images;
    
    console.log(`\n📸 Found ${domImages.length} images in DOM`);
    console.log(`   [DEBUG] Hero check: checked=${debugInfo.heroCheckedCount}, found=${debugInfo.heroFoundCount}, excluded=${debugInfo.heroExcludedCount}, in array=${debugInfo.heroCount}`);
    if (debugInfo.heroCount > 0) {
      console.log(`   🎯 Hero images found in evaluate: ${debugInfo.heroCount}`);
      debugInfo.heroUrls.forEach((url, idx) => {
        console.log(`      ${idx + 1}. ${url.substring(0, 70)}${url.length > 70 ? '...' : ''}`);
      });
    } else if (debugInfo.heroCheckedCount > 0) {
      console.log(`   ⚠️  Hero images were found (${debugInfo.heroCheckedCount}) but ${debugInfo.heroExcludedCount} were excluded by filters`);
    }
    
    if (domImages.length > 0) {
      console.log('   Sample sources:', [...new Set(domImages.slice(0, 5).map(img => img.source))].join(', '));
      // Паказваем інфармацыю пра галоўныя выявы
      const heroImages = domImages.filter(img => img.source.includes('Hero'));
      const mainImages = domImages.filter(img => img.isMain || img.source.includes('Hero') || img.source.includes('og:image'));
      
      if (heroImages.length > 0) {
        console.log(`\n   🎯 Hero images in final list: ${heroImages.length}`);
        heroImages.forEach((img, idx) => {
          console.log(`   ${idx + 1}. ${img.url.substring(0, 70)}${img.url.length > 70 ? '...' : ''}`);
          console.log(`      Source: ${img.source}, Alt: ${img.alt || 'N/A'}, Priority: ${img.priority || 'N/A'}`);
        });
      }
      
      if (mainImages.length > 0 && mainImages.length !== heroImages.length) {
        console.log(`\n   🎯 Other main images: ${mainImages.length - heroImages.length}`);
        mainImages.filter(img => !img.source.includes('Hero')).forEach((img, idx) => {
          console.log(`   ${idx + 1}. ${img.url.substring(0, 70)}${img.url.length > 70 ? '...' : ''}`);
          console.log(`      Source: ${img.source}`);
        });
      }
    }

    // Аб'ядноўваем выявы з DOM і сеткавых запытаў
    domImages.forEach(img => imageUrls.add(img.url));
    console.log(`🔗 Total unique URLs: ${imageUrls.size}`);
    
    // Фільтруем і фарматуем вынікі
    const finalImages = [];
    const seenUrls = new Set();

    // Прыярытэт: og:image > twitter:image > Hero images > JSON-LD > product selectors > img tags > network requests
    const priorityOrder = ['og:image', 'twitter:image', 'Hero image (alt/loading)', 'JSON-LD Product', 'picture source', 'img tag'];
    
    domImages.forEach(img => {
      if (!seenUrls.has(img.url) && img.url.includes('jhtassets.com')) {
        finalImages.push({
          url: img.url,
          source: img.source,
          isMain: img.source === 'og:image' || img.source === 'JSON-LD'
        });
        seenUrls.add(img.url);
      }
    });

    // Дадаём выявы з сеткавых запытаў
    Array.from(imageUrls).forEach(url => {
      if (!seenUrls.has(url)) {
        finalImages.push({
          url: url,
          source: 'network request',
          isMain: false
        });
        seenUrls.add(url);
      }
    });

    // Фільтруем толькі выявы трэнажораў (выключаем іконкі, лагатыпы)
    const productImages = finalImages.filter(img => {
      const url = img.url.toLowerCase();
      // Выключаем відавочна непрадуктовыя выявы
      if (url.includes('/icon') || url.includes('/logo') || url.includes('/nav') || 
          url.includes('/menu') || url.includes('/banner') || url.includes('/ad') ||
          url.includes('icon.') || url.includes('logo.')) {
        return false;
      }
      // Уключаем толькі выявы з jhtassets.com
      return url.includes('jhtassets.com');
    });
    
    // Калі пасля фільтрацыі нічога не засталося, выкарыстоўваем усе знойдзеныя выявы
    // але ўсё роўна выключаем відавочныя лагатыпы
    const filteredImages = productImages.length > 0 ? productImages : finalImages.filter(img => {
      const url = img.url.toLowerCase();
      return url.includes('jhtassets.com') && 
             !url.includes('/logo') && !url.includes('logo.') && 
             !url.includes('/icon') && !url.includes('icon.');
    });
    
    console.log(`\n✅ After filtering: ${filteredImages.length} product images`);
    if (filteredImages.length > 0) {
      console.log('   Top images:');
      filteredImages.slice(0, 3).forEach((img, idx) => {
        console.log(`   ${idx + 1}. ${img.url.substring(0, 80)}${img.url.length > 80 ? '...' : ''}`);
        console.log(`      Source: ${img.source}, Main: ${img.isMain ? 'Yes' : 'No'}`);
      });
    }
    
    // Сартуем па прыярытэце (мета-тэгі і JSON-LD спачатку, потым Hero, потым thumbnail)
    filteredImages.sort((a, b) => {
      // Мета-тэгі і JSON-LD маюць найвышэйшы прыярытэт
      const aIsMeta = a.source === 'og:image' || a.source === 'twitter:image' || a.source.includes('JSON-LD');
      const bIsMeta = b.source === 'og:image' || b.source === 'twitter:image' || b.source.includes('JSON-LD');
      
      if (aIsMeta && !bIsMeta) return -1;
      if (!aIsMeta && bIsMeta) return 1;
      
      // Hero-выявы маюць прыярытэт пасля мета-тэгаў
      const aIsHero = a.source.includes('Hero');
      const bIsHero = b.source.includes('Hero');
      
      if (aIsHero && !bIsHero) return -1;
      if (!aIsHero && bIsHero) return 1;
      
      // Калі абодва Hero, прыярытэт па памеры (больш = лепш) або па полі priority
      if (aIsHero && bIsHero) {
        if (a.priority && b.priority) {
          if (a.priority !== b.priority) return a.priority - b.priority;
        }
        const aSize = (a.width || 0) * (a.height || 0);
        const bSize = (b.width || 0) * (b.height || 0);
        if (aSize !== bSize) return bSize - aSize;
      }
      
      // Выявы thumbnail маюць прыярытэт пасля Hero
      const aIsThumbnail = a.url.includes('150x150') || a.url.includes('300x300') || 
                          a.url.includes('thumbnail') || a.url.includes('w_300') || a.url.includes('w_150');
      const bIsThumbnail = b.url.includes('150x150') || b.url.includes('300x300') || 
                          b.url.includes('thumbnail') || b.url.includes('w_300') || b.url.includes('w_150');
      
      if (aIsThumbnail && !bIsThumbnail) return -1;
      if (!aIsThumbnail && bIsThumbnail) return 1;
      
      const aPriority = priorityOrder.indexOf(a.source) !== -1 ? 
        priorityOrder.indexOf(a.source) : 999;
      const bPriority = priorityOrder.indexOf(b.source) !== -1 ? 
        priorityOrder.indexOf(b.source) : 999;
      return aPriority - bPriority;
    });
    
    return filteredImages;

    return finalImages;
  } finally {
    await browser.close();
  }
}

/**
 * Абнаўляе equipment.json са знойдзенымі выявамі
 */
function updateEquipmentJson(modelCode, images) {
  const equipmentPath = path.join(__dirname, '..', 'data', 'equipment.json');
  const equipment = JSON.parse(fs.readFileSync(equipmentPath, 'utf8'));

  const equipmentItem = equipment.equipment.find(eq => eq.id === modelCode);
  if (!equipmentItem) {
    console.error(`Equipment ${modelCode} not found in equipment.json`);
    return false;
  }

  // Абнаўляем выявы
  equipmentItem.images = images.map(img => ({
    url: img.url,
    source: img.source === 'network request' ? 'Matrix Official CDN' : img.source,
    isMain: img.isMain,
    type: 'image'
  }));

  // Захоўваем
  fs.writeFileSync(equipmentPath, JSON.stringify(equipment, null, 2));
  return true;
}

/**
 * Здабывае выявы для адной мадэлі
 */
async function extractForModel(modelCode) {
  const url = MODEL_URLS[modelCode.toLowerCase()];
  
  if (!url) {
    console.error(`Unknown model code: ${modelCode}`);
    return null;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Extracting images for ${modelCode.toUpperCase()}`);
  console.log(`URL: ${url}`);
  console.log('='.repeat(60));

  try {
    const images = await extractImagesWithPuppeteer(url, modelCode);

    if (images.length === 0) {
      console.log('❌ No images found');
      return null;
    }

    console.log(`\n✅ Found ${images.length} image(s):\n`);
    if (images.length > 0) {
      images.forEach((img, i) => {
        console.log(`   ${i + 1}. ${img.url}`);
        console.log(`      Source: ${img.source}`);
        console.log(`      Main: ${img.isMain ? 'Yes' : 'No'}`);
        if (img.url.includes('w_300') || img.url.includes('w_150') || img.url.includes('300x300')) {
          console.log(`      ✓ Thumbnail size`);
        }
        console.log('');
      });
    } else {
      console.log('   ⚠️  No images found for this model');
    }

    // Прапануем абнавіць equipment.json
    if (images.length > 0) {
      // ПАЛЕПШАНАЯ ЛОГІКА ВЫБАРУ: абіраем ТОЛЬКІ галоўную выяву прадукту
      // Прыярытэт: og:image/twitter:image > JSON-LD Product > Hero image з alt="Hero" > першая Hero-выява
      
      // 1. Мета-тэгі (самая надзейная крыніца)
      let mainImage = images.find(img => 
        img.source === 'og:image' || img.source === 'twitter:image'
      );
      
      // 2. JSON-LD Product
      if (!mainImage) {
        mainImage = images.find(img => img.source.includes('JSON-LD'));
      }
      
      // 3. Hero-выявы з alt, які змяшчае "Hero" (дакладнае супадзенне)
      if (!mainImage) {
        mainImage = images.find(img => 
          img.source.includes('Hero') && 
          (img.url.includes('w_300') || img.url.includes('w_150') || img.url.includes('300x300'))
        );
      }
      
      // 4. Любая Hero-выява
      if (!mainImage) {
        mainImage = images.find(img => img.source.includes('Hero'));
      }
      
      // 5. Выявы thumbnail (але толькі калі яны з надзейных крыніц)
      if (!mainImage) {
        mainImage = images.find(img => 
          (img.url.includes('150x150') || img.url.includes('300x300') || 
           img.url.includes('w_300') || img.url.includes('w_150')) &&
          !img.source.includes('fallback') // Пазбягаем fallback-выяў
        );
      }
      
      // 6. Калі нічога не знойдзена, бярэм першую выяву НЕ з fallback
      if (!mainImage) {
        mainImage = images.find(img => !img.source.includes('fallback')) || images[0];
      }
      
      // Калі URL няпоўны (без пашырэння), дадаём параметры для thumbnail
      images.forEach(img => {
        if (img.url.endsWith('/') && !img.url.includes('transformed')) {
          img.url = img.url + 'transformed/w_300';
        }
      });
      
      // Пакідаем ТОЛЬКІ галоўную выяву, калі яна знойдзена
      const finalImages = mainImage ? [mainImage] : images.slice(0, 1);
      
      if (mainImage) {
        console.log(`\n💡 Selected MAIN image (product photo):`);
        console.log(`   ${mainImage.url}`);
        console.log(`   Source: ${mainImage.source}`);
        console.log(`\n⚠️  Filtering: Keeping only the main product image`);
        console.log(`   (Removed ${images.length - finalImages.length} non-product images)`);
      }
      
      // Аўтаматычна абнаўляем ТОЛЬКІ галоўнай выявай
      if (updateEquipmentJson(modelCode, finalImages)) {
        console.log(`\n✅ Updated equipment.json for ${modelCode.toUpperCase()}`);
        console.log(`   Added ${finalImages.length} main product image(s) to the catalog`);
      } else {
        console.log(`\n⚠️  Failed to update equipment.json for ${modelCode}`);
      }
    }

    return images;
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    if (error.message.includes('puppeteer')) {
      console.log('\n💡 Install Puppeteer: npm install puppeteer');
    }
    return null;
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  // Паказваем спіс мадэляў
  if (args[0] === '--list' || args[0] === '--models') {
    console.log('📋 Available models:\n');
    Object.keys(MODEL_URLS).forEach((code, idx) => {
      console.log(`  ${idx + 1}. ${code.toUpperCase()}`);
    });
    console.log(`\nTotal: ${Object.keys(MODEL_URLS).length} models`);
    process.exit(0);
  }
  
  // Паказваем help
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log('Usage: node scripts/extract-matrix-images-puppeteer.js [model-code]');
    console.log('       node scripts/extract-matrix-images-puppeteer.js --all    # Extract images for all models');
    console.log('       node scripts/extract-matrix-images-puppeteer.js --list   # Show list of available models');
    console.log('\nExamples:');
    console.log('  node scripts/extract-matrix-images-puppeteer.js g3-s30');
    console.log('  node scripts/extract-matrix-images-puppeteer.js --all');
    console.log('  node scripts/extract-matrix-images-puppeteer.js --list');
    console.log('\nAvailable models:');
    Object.keys(MODEL_URLS).forEach(code => {
      console.log(`  - ${code}`);
    });
    process.exit(0);
  }

  // Правяраем наяўнасць Puppeteer
  try {
    require('puppeteer');
  } catch (e) {
    console.error('❌ Puppeteer not installed!');
    console.log('\nInstall it with:');
    console.log('  npm install puppeteer');
    console.log('\nOr use:');
    console.log('  npm install puppeteer-core');
    process.exit(1);
  }

  // Апрацоўваем усе мадэлі
  if (args[0] === '--all') {
    const totalModels = Object.keys(MODEL_URLS).length;
    console.log('🚀 Extracting images for ALL models...');
    console.log(`📋 Total models to process: ${totalModels}\n`);
    console.log('⚠️  This will take several minutes. Press Ctrl+C to cancel.\n');
    
    // Невялікая паўза для магчымасці адмены
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results = {};
    let processed = 0;
    let successCount = 0;
    let failedCount = 0;
    
    const modelCodes = Object.keys(MODEL_URLS);
    
    for (const modelCode of modelCodes) {
      processed++;
      console.log(`\n${'='.repeat(70)}`);
      console.log(`[${processed}/${totalModels}] Processing ${modelCode.toUpperCase()}...`);
      console.log('='.repeat(70));
      
      try {
        const images = await extractForModel(modelCode);
        if (images && images.length > 0) {
          results[modelCode] = images;
          successCount++;
          console.log(`\n✅ ${modelCode.toUpperCase()}: Successfully extracted ${images.length} image(s)`);
        } else {
          failedCount++;
          console.log(`\n⚠️  ${modelCode.toUpperCase()}: No images found`);
        }
      } catch (error) {
        failedCount++;
        console.error(`\n❌ ${modelCode.toUpperCase()}: Error - ${error.message}`);
      }
      
      // Невялікая затрымка паміж запытамі
      if (processed < totalModels) {
        console.log('\n⏳ Waiting 1 second before next model...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('📊 FINAL SUMMARY');
    console.log('='.repeat(70));
    const totalImages = Object.values(results).reduce((sum, imgs) => sum + imgs.length, 0);
    console.log(`✅ Successfully processed: ${successCount}/${totalModels} models`);
    console.log(`❌ Failed/No images: ${failedCount}/${totalModels} models`);
    console.log(`📸 Total images extracted: ${totalImages}`);
    
    if (successCount > 0) {
      console.log('\n✅ Successful extractions by model:');
      Object.keys(results).forEach(model => {
        const img = results[model][0]; // Бярэм першую (галоўную) выяву
        console.log(`   ${model.toUpperCase()}: ${img.url.substring(0, 60)}${img.url.length > 60 ? '...' : ''}`);
      });
    }
    
    if (failedCount > 0) {
      console.log(`\n⚠️  ${failedCount} model(s) had no images found or encountered errors`);
    }
    
    console.log('\n✅ All done! Equipment catalog has been updated.');
  } else {
    // Апрацоўваем адну мадэль
    await extractForModel(args[0]);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { extractImagesWithPuppeteer, extractForModel, MODEL_URLS };
