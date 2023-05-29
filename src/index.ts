import puppeteer, { ElementHandle, Page } from "puppeteer";

export async function scrapper(){
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Google photos search link: https://www.google.com/search?tbm=isch&q=findSomeImage%20or%20anything
  // https://www.npmjs.com/package/node-base64-image
  // https://freeimage.host/page/api

  const query = "shingeki no kyojin"
  const parsedQuery = query.split(' ').join('%20');
  const url = `https://www.google.com/search?tbm=isch&q=${parsedQuery}`;

  await page.goto(url);
  await page.setViewport({ width: 1080, height: 1024 });
  
  //await scrollPage(page);

  const imagesContainerSelector = await page.waitForSelector('div#islrg > div:first-child');
  if (imagesContainerSelector === null) return;
  
  const imageCubes = await imagesContainerSelector.$$('div');

  if (imageCubes === null) return;

  const cube = imageCubes[0];

  const cubeAnchor = await cube.$$(':nth-child(2)') as ElementHandle<HTMLAnchorElement>[];
  const anchor = cubeAnchor[0];
  if (anchor === undefined) return;
  await anchor.click();

  for (const cube of imageCubes) {
    console.log('--------- link ---------')
    const img = await page.waitForSelector('#Sva75c > div.DyeYj > div > div.dFMRD > div.pxAole > div.tvh9oe.BIB1wf > c-wiz > div > div > div > div.n4hgof > div.MAtCL.PUxBg > a > img');
  
    if (img === null) return;
    const src = await img.getProperty('src').then((res) => res.jsonValue());
    if (src.startsWith('data')) continue;
    console.log(src);
  
    const nextBtn = await page.waitForSelector('#Sva75c > div.DyeYj > div > div.dFMRD > div.pxAole > div.tvh9oe.BIB1wf > c-wiz > div > div > div > div:nth-child(2) > div > div > div.Ox7icf > div:nth-child(1) > div > a:nth-child(2)');
    if (nextBtn === null || nextBtn === undefined) continue;
    await nextBtn.click();
    // await page.waitForTimeout(1000);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  // const imagesSelector = await imagesContainerSelector.$$('div');
  // if (imagesSelector === null) return;
  // console.log(imagesSelector.length)
  // const randomImage = Math.floor(Math.random() * imagesSelector.length);

  // // en imagesSelector[randomImage] dar click al elemento HTML que sea img
  // const imgSelector = await imagesSelector[randomImage].$('a:first-child');
  // if (imgSelector === null) return;
  // await imgSelector.click();

  // const img = await page.waitForSelector('#Sva75c > div.DyeYj > div > div.dFMRD > div.pxAole > div.tvh9oe.BIB1wf > c-wiz > div > div > div > div.n4hgof > div.MAtCL.PUxBg > a > img.r48jcc.pT0Scc.iPVvYb');

  // if (img === null) return;

  // const src = await img.getProperty('src').then((res) => res.jsonValue());
  // console.log(src);


  setTimeout(async () => {
    // await page.screenshot({ path: 'screenshot.png' });
    await browser.close();
  }, 5000);
}

async function scrollPage(page: Page){
  let count = 0;
  const interval = setInterval(async () => {
    await page.mouse.wheel({ deltaY: 1000 });
    count++;
    if (count === 2) clearInterval(interval);
  }, 2000);
}

scrapper();

// google-images-scrapper
// this scrapper will get images from google images search and return each 