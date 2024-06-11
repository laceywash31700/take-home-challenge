// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require('playwright');

async function saveHackerNewsArticles() {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News
  await page.goto('https://news.ycombinator.com/newest');

  // Wait for the articles to load
  await page.waitForSelector('.athing');
  await page.waitForTimeout(2000);

  // Extract timestamps of the first 100 articles
  const articles = await page.$$eval('.itemlist .athing', nodes => {
    return nodes.slice(0, 100).map(node => {
      const ageElement = node.nextElementSibling.querySelector('.age a');
      return ageElement ? new Date(ageElement.title).getTime() : null;
    }).filter(timestamp => timestamp !== null);
  });

  // Validate that the timestamps are sorted from newest to oldest
  let isSorted = true;
  for (let i = 0; i < articles.length - 1; i++) {
    if (articles[i] < articles[i + 1]) {
      isSorted = false;
      break;
    }
  }

  console.log(`Are the first 100 articles sorted from newest to oldest? ${isSorted}`);

  await browser.close();
}

(async () => {
  await saveHackerNewsArticles();
})();
