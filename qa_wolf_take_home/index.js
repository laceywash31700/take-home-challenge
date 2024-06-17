// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

// I set my function up to return true if they are in order 
// and false if the first 100 articles are not in order 
async function saveHackerNewsArticles() {
  // Launch browser
  const timestamps = [];
  let results = null;

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");
  // await page.pause();

  // Extracting the timeStamps by going into the .age class prop and grabbing the title property from the span element 
  while (timestamps.length <= 100) {
    const articleTimes = await page.$$eval(".age", (nodes) => {
      return nodes.map((element) => {
        const title = element.getAttribute("title");
        if (title) {
          return title;
        }
        const textContent = element.textContent.trim();
        return textContent || "";
      });
    });
    // push the pages timestamp to the array
    timestamps.push(...articleTimes);
    // go to the next page 
    await page.locator("a.morelink").click();
    await page.waitForTimeout(2000); 
}
// Slice after loop completion
const firstOneHundredTimestamps = timestamps.slice(0, 100); 

for (let i = 1; i < firstOneHundredTimestamps.length; i++) {
  const currentTimestamp = new Date(firstOneHundredTimestamps[i]);
  const previousTimestamp = new Date(firstOneHundredTimestamps[i - 1]);

  // Compare timestamps in milliseconds (newer timestamp has higher value)
  if (currentTimestamp.getTime() >= previousTimestamp.getTime()) {
    results = false; // Not in order if current is not newer than previous
  }
  else{
    // If the loop completes without finding any out-of-order elements, return true
    results = true
  }
}
console.log(results);
return results;
}

(async () => {
  await saveHackerNewsArticles();
})();
