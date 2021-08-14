const { Builder, By, Key, until, promise } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

// chrome 옵션 설정
const options = new chrome.Options();
options.addArguments("--headless");
options.addArguments("--no-sandbox");
options.addArguments("--disable-dev-shm-usage");

// 텍스트 밀도 계산시 제외할 태그
const EXCEPT_TAG = ["script", "comment", "style"];

function crawl() {
  (async function () {
    let driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  
    try {
      // 시작주소 : 구글 '크롤러' 검색 결과
      await driver.get(
        "https://www.google.com/search?q=%ED%81%AC%EB%A1%A4%EB%9F%AC&oq=%ED%81%AC%EB%A1%A4%EB%9F%AC&aqs=chrome.0.69i59l3j69i61l3.2074j0j7&sourceid=chrome&ie=UTF-8"
      );
  
      // const source = await driver.getPageSource();
  
      let userAgent = await driver.executeScript("return navigator.userAgent;");

      console.log(`[userAgnet] ${userAgent}`);

      // 검색 결과 모음
      let resultMain = await driver.findElement(By
          .xpath('//div[@id="rso"]'));

      console.log(await resultMain);
      
      // 검색 결과 중 추천 스니펫
      let resultSug = await resultMain.findElement(By
        .xpath('//div[@class="ULSxyf"]/div/div/div/div/div/div[@class="g"]'));

      console.log(await resultSug);

      let urlList = [];
      let titleList = [];

      // 검색 결과 중 추천 스니펫을 포함한 전체
      let resultCom = await resultMain.findElements(By
        .xpath('//div[@class="tF2Cxc"]'));
      let resultComLen = resultCom.length;

      for(let element of resultCom) {
        let div = await element.findElement(By
          .xpath('div[@class="yuRUbf"]'));
        let a = await div.findElement(By
          .xpath('a'));
        urlList.push(await a.getAttribute('href'));
        titleList.push(await a.findElement(By
          .xpath('h3')).getText());
      }

      console.log(resultComLen);
      console.log(urlList);
      console.log(titleList);

      // console.log(resultCom);
      
    } catch {

    } finally {
      await driver.quit(), 1000;
    } 
  })();
}

crawl();