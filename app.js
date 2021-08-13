const { Builder, By, Key, until, promise } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

// chrome 옵션 설정
const options = new chrome.Options();
options.addArguments("--headless");
options.addArguments("--no-sandbox");
options.addArguments("--disable-dev-shm-usage");

// DOM트리
function domTree(element, parentElement, childElement, tag) {
  this.element = element;
  this.parentElement = parentElement;
  this.childElement = childElement;
  this.tag = tag;
  this.id = element.getId();
}

// 텍스트 밀도 계산시 제외할 태그
const EXCEPT_TAG = ["script", "comment", "style"];

(async function example() {
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

    // const body = await driver.findElement(By.tagName("body"));

    // console.log(body.getId());

    // const rootElement = await new domTree(
    //   body,
    //   null,
    //   await getChildElement(body),
    //   await body.getTagName()
    // );

    // console.log(rootElement);

    let userAgent = await driver.executeScript("return navigator.userAgent;");
  } finally {
    await driver.quit(), 1000;
  }
})();

// 입력받은 element에서 url을 추출하여 리턴
function getUrl() {}

// 입력받은 element의 안의 문자 수를 계산하여 리턴
function calcTextLength(element) {}

// 입력받은 element의 하위 태그의 수를 계산하여 리턴
function calcChildElementLength(element) {}

// 입력받은 element의 텍스트 밀도를 계산하여 리턴 (element 안의 문자 수 / element 안의 태그 수)
function calcTextDensity(element) {
  const textLength = calcTextLength(element);
  const tagLength = calcChildElementLength(element);
  return textLength / tagLength;
}

// 입력받은 webElement에 자식태그가 존재하면 자식태그 리스트를 리턴, 없으면 undifined 리턴
function getChildElement(webElement) {
  if (webElement.findElements(By.xpath("*"))) {
    return webElement.findElements(By.xpath("*"));
  } else {
    return;
  }
}
