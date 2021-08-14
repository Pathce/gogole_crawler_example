// 크롤러
import { Builder, By, Key, until, promise } from "../node_modules/selenium-webdriver";
const chrome = require("selenium-webdriver/chrome");

// chrome 옵션 설정
const options = new chrome.Options();
options.addArguments("--headless");
options.addArguments("--no-sandbox");
options.addArguments("--disable-dev-shm-usage");

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
    
        const source = await driver.getPageSource();
    
        console.log(source);
    
        let userAgent = await driver.executeScript("return navigator.userAgent;");
      } finally {
        await driver.quit(), 1000;
      }
    })();
  }
  
  crawl();

// 텍스트 밀도 계산시 제외할 태그
const EXCEPT_TAG = ["script", "comment", "style"];



window.addEventListener('DOMContentLoaded', function() {
    const btn_crawl = document.querySelector('#btn_crawl');
    btn_crawl.addEventListener('click', onClickBtnCrawl);
});

function onClickBtnCrawl(event) {
    console.log(event);
    crawl();
}


