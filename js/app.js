const { Builder, By, Key, until, promise } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

// chrome 옵션 설정
const options = new chrome.Options();
options.addArguments("--headless");
options.addArguments("--no-sandbox");
options.addArguments("--disable-dev-shm-usage");

// 텍스트 밀도 계산시 제외할 태그
const EXCEPT_TAG = ["script", "comment", "style"];

(async function() {
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

    let url = "https://www.google.com/search?q=%ED%81%AC%EB%A1%A4%EB%9F%AC&oq=%ED%81%AC%EB%A1%A4%EB%9F%AC&aqs=chrome.0.69i59l3j69i61l3.2074j0j7&sourceid=chrome&ie=UTF-8";

  async function crawl(url) {
    try {
      // 시작주소 : 구글 '크롤러' 검색 결과
      await driver.get(url);
    
      let userAgent = await driver.executeScript("return navigator.userAgent;");
  
      console.log(`[userAgnet] ${userAgent}`);
  
      // 검색 결과 모음
      let resultMain = await driver.findElement(By.xpath('//div[@id="rso"]'));
      // 검색 결과 중 추천 스니펫
      let resultSug = await resultMain.findElement(By
      .xpath('//span[@class="hgKElc"]'));
      // 검색 결과 중 추천 스니펫을 포함한 전체
      let resultCom = await resultMain.findElements(By.xpath('//div[@class="tF2Cxc"]'));
      let resultComLen = resultCom.length;
      let urlList = [];
      let titleList = [];
      let contentList = [];
        
      for(let element of resultCom) {
        let divTitle = await element.findElement(By.xpath('div[@class="yuRUbf"]'));
        let divContent = await element.findElement(By.xpath('div[@class="IsZvec"]'));
        let a = await divTitle.findElement(By.xpath('a'));
        let content = await divContent.getText();
        urlList.push(await a.getAttribute('href'));
        titleList.push(await a.findElement(By.xpath('h3')).getText());
        contentList.push(content);
      }
  
      if(resultSug) {contentList[0] = await resultSug.getText()};
        
      let returnList = [];
      for(let i = 0; i < resultComLen; i++) {
        returnList.push({
          url: urlList[i],
          title: titleList[i],
          content: contentList[i]
        });
      }
  
      return returnList;
       
    } catch(e) {
        console.error(e);
    } finally {
    } 
  }

  function crawlEnd() {
    driver.quit(), 1000;
  }

  let crawlResult = [];
  let curPage = 0;
  let nextPage = 1;
  let pageList = [];
  let pageLen = 1;
  let pageLastNum = 1;

  while(nextPage > curPage++) {
    if(crawlResult.length !== 0) {
      crawlResult.push(await crawl(url));
    } else {
      crawlResult = await crawl(url);
    }
    pageList = await driver.findElements(By.xpath('//tr[@jsname="TeSSVd"]/td/a'));
    pageLen = pageList.length - 2;
    console.log(await pageList[pageLen].getText());
  }

  console.log(crawlResult);
  console.log(pageLastNum);
  console.log(pageLen);

  console.log(crawlResult[0]);

  console.log(/(?:크롤)+|(?:crawl)+/.exec(crawlResult[0].content));

  await crawlEnd();
})();