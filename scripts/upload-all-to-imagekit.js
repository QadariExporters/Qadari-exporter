const ImageKit = require('imagekit');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadFileToImageKit(filePath, folder) {
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  
  console.log(`Uploading ${fileName} to ImageKit folder ${folder}...`);
  const res = await imagekit.upload({
    file: fileBuffer.toString('base64'),
    fileName: fileName,
    folder: folder,
    useUniqueFileName: false,
  });
  console.log(` -> Uploaded: ${res.url}`);
  return res.url;
}

async function run() {
  console.log('=== Starting ImageKit Upload for Collections, Products & Site Assets ===\n');

  const urlMap = {};

  // 1. Upload our-collection images
  const collectionDir = path.join(process.cwd(), 'public', 'our-collection');
  if (fs.existsSync(collectionDir)) {
    const files = fs.readdirSync(collectionDir);
    for (const f of files) {
      if (/\.(jpg|jpeg|png|webp|svg)$/i.test(f)) {
        const fullPath = path.join(collectionDir, f);
        const ikUrl = await uploadFileToImageKit(fullPath, '/qadri-cms/collections');
        urlMap[`/our-collection/${f}`] = ikUrl;
        // Also map lowercase variant if needed
        urlMap[`/our-collection/${f.toLowerCase()}`] = ikUrl;
      }
    }
  }

  // 2. Upload home-our-products images
  const productsDir = path.join(process.cwd(), 'public', 'home-our-products');
  if (fs.existsSync(productsDir)) {
    const files = fs.readdirSync(productsDir);
    for (const f of files) {
      if (/\.(jpg|jpeg|png|webp|svg)$/i.test(f)) {
        const fullPath = path.join(productsDir, f);
        const ikUrl = await uploadFileToImageKit(fullPath, '/qadri-cms/products');
        urlMap[`/home-our-products/${f}`] = ikUrl;
        urlMap[`/home-our-products/${f.toLowerCase()}`] = ikUrl;
      }
    }
  }

  // 3. Upload hero-images
  const heroDir = path.join(process.cwd(), 'public', 'hero-images');
  if (fs.existsSync(heroDir)) {
    const files = fs.readdirSync(heroDir);
    for (const f of files) {
      if (/\.(jpg|jpeg|png|webp|svg)$/i.test(f)) {
        const fullPath = path.join(heroDir, f);
        const ikUrl = await uploadFileToImageKit(fullPath, '/qadri-cms/hero');
        urlMap[`/hero-images/${f}`] = ikUrl;
        urlMap[`/hero-images/${f.toLowerCase()}`] = ikUrl;
      }
    }
  }

  console.log('\n=== Upload Complete. Total Mappings:', Object.keys(urlMap).length);
  fs.writeFileSync(
    path.join(process.cwd(), 'scripts', 'imagekit-mapping.json'),
    JSON.stringify(urlMap, null, 2)
  );

  function mapUrl(originalUrl) {
    if (!originalUrl) return originalUrl;
    if (urlMap[originalUrl]) return urlMap[originalUrl];
    if (urlMap[originalUrl.toLowerCase()]) return urlMap[originalUrl.toLowerCase()];
    // Check trimmed or decoded
    const decoded = decodeURIComponent(originalUrl);
    if (urlMap[decoded]) return urlMap[decoded];
    if (urlMap[decoded.toLowerCase()]) return urlMap[decoded.toLowerCase()];
    return originalUrl;
  }

  // 4. Update Collections in Supabase
  console.log('\n--- Updating Collections in Supabase ---');
  const { data: cols } = await supabase.from('collections').select('*');
  if (cols) {
    for (const col of cols) {
      const newImg = mapUrl(col.image);
      if (newImg !== col.image) {
        await supabase.from('collections').update({ image: newImg }).eq('id', col.id);
        console.log(`Updated Collection ${col.name}: ${newImg}`);
      }
    }
  }

  // 5. Update Products in Supabase
  console.log('\n--- Updating Products in Supabase ---');
  const { data: prods } = await supabase.from('products').select('*');
  if (prods) {
    for (const prod of prods) {
      const newImg = mapUrl(prod.image);
      const newGallery = (prod.gallery_images || []).map(mapUrl);
      await supabase.from('products').update({
        image: newImg,
        gallery_images: newGallery,
      }).eq('id', prod.id);
      console.log(`Updated Product ${prod.name}: ${newImg}`);
    }
  }

  // 6. Update Hero Sections in Supabase
  console.log('\n--- Updating Hero Sections in Supabase ---');
  const { data: heroes } = await supabase.from('hero_sections').select('*');
  if (heroes) {
    for (const hero of heroes) {
      const newImg = mapUrl(hero.image);
      if (newImg !== hero.image) {
        await supabase.from('hero_sections').update({ image: newImg }).eq('id', hero.id);
        console.log(`Updated Hero ${hero.title?.substring(0, 20)}: ${newImg}`);
      }
    }
  }

  // 7. Update About Sections in Supabase
  console.log('\n--- Updating About Section in Supabase ---');
  const { data: abouts } = await supabase.from('about_sections').select('*');
  if (abouts) {
    for (const about of abouts) {
      const newImg = mapUrl(about.image);
      if (newImg !== about.image) {
        await supabase.from('about_sections').update({ image: newImg }).eq('id', about.id);
        console.log(`Updated About Section: ${newImg}`);
      }
    }
  }

  // 8. Update Process Steps in Supabase
  console.log('\n--- Updating Process Steps in Supabase ---');
  const { data: steps } = await supabase.from('process_steps').select('*');
  if (steps) {
    for (const step of steps) {
      const newImg = mapUrl(step.image);
      if (newImg !== step.image) {
        await supabase.from('process_steps').update({ image: newImg }).eq('id', step.id);
        console.log(`Updated Process Step ${step.step_number}: ${newImg}`);
      }
    }
  }

  // 9. Update Gallery in Supabase
  console.log('\n--- Updating Gallery Images in Supabase ---');
  const { data: gals } = await supabase.from('gallery_images').select('*');
  if (gals) {
    for (const gal of gals) {
      const newImg = mapUrl(gal.image);
      if (newImg !== gal.image) {
        await supabase.from('gallery_images').update({ image: newImg }).eq('id', gal.id);
        console.log(`Updated Gallery ${gal.title}: ${newImg}`);
      }
    }
  }

  console.log('\n=== All Collections & Products & Assets migrated to ImageKit! ===');
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
