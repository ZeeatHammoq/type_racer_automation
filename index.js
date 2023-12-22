const { Builder, Browser, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const searchtag = require("./searchtag");
const vision = require("@google-cloud/vision");

async function loop(driver, e) {
  await driver.get("https://www.typeracer.com/");

  const startButton = await searchtag(driver, "a", "Enter a Typing Race");

  await startButton.click();

  const input = await driver.wait(
    until.elementLocated(By.xpath('//input[@class="txtInput"]')),
    20000
  );

  await driver.wait(until.elementIsVisible(input));
  await driver.wait(until.elementIsEnabled(input));

  let text = await driver.wait(
    until.elementLocated(By.xpath('//span[@unselectable="on"]'))
  );

  text = await text.findElement(By.xpath(".."));

  text = (await text.getText("textContent")).split(" ");

  for (let i = 0; i < text.length; i++) {
    await input.sendKeys(text[i]);
    if (i < text.length - 1) await input.sendKeys(" ");

    await driver.sleep(400 - e);
  }

  try {
    const btn = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(@class, 'gwt-Button') and text()='Begin Test']"
        )
      ),
      5000
    );

    if (btn) {
      await btn.click();

      const imgElement = await driver.wait(
        until.elementLocated(By.xpath("//img[@class='challengeImg']"))
      );

      // Get the src attribute value
      const imagePath = await imgElement.getAttribute("src");

      const client = new vision.ImageAnnotatorClient({
        keyFilename: "./gcp_key.json",
      });

      console.log("imageUri", imagePath);

      // Read the image file
      const [result] = await client.textDetection({
        image: { source: { imageUri: imagePath } },
      });

      let ocrText = result.fullTextAnnotation.text;

      const textArea = await driver.wait(
        until.elementLocated(By.xpath("//textarea[@class='challengeTextArea']"))
      );

      await driver.wait(until.elementIsEnabled(textArea));

      let t = ocrText.split(" ");

      for (let j = 0; j < t.length; j++) {
        await textArea.sendKeys(t[j]);
        if (j < t.length - 1) await textArea.sendKeys(" ");

        await driver.sleep(400 - e);
      }

      const sBtn = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//button[contains(@class, 'gwt-Button') and text()='Submit']"
          )
        ),
        10000
      );

      await sBtn.click();
    }
  } catch (error) {
    console.log(error);
  }

  return 0;
}

async function typeRacer() {
  const options = new chrome.Options();

  options.setUserPreferences({
    "download.prompt_for_download": false,
    "download.directory_upgrade": true,
    "safebrowsing.enabled": true,
  });

  try {
    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    await driver.wait(until.urlContains("abc"), 50000000);

    for (let i = 0; i < 100; i++) {
      await loop(driver, i);
    }

    // await driver.get("https://www.typeracer.com/");

    // const startButton = await searchtag(driver, "a", "Enter a Typing Race");

    // await startButton.click();

    // const input = await driver.wait(
    //   until.elementLocated(By.xpath('//input[@class="txtInput"]')),
    //   20000
    // );

    // await driver.wait(until.elementIsVisible(input));
    // await driver.wait(until.elementIsEnabled(input));

    // let text = await driver.wait(
    //   until.elementLocated(By.xpath('//span[@unselectable="on"]'))
    // );

    // text = await text.findElement(By.xpath(".."));

    // text = (await text.getText("textContent")).split(" ");

    // for (let i = 0; i < text.length; i++) {
    //   await input.sendKeys(text[i]);
    //   if (i < text.length - 1) await input.sendKeys(" ");

    //   await driver.sleep(400);
    // }

    // await driver.sleep(3000);

    // const btn = await driver.wait(
    //   until.elementLocated(
    //     By.xpath(
    //       "//button[contains(@class, 'gwt-Button') and text()='Begin Test']"
    //     )
    //   ),
    //   10000
    // );

    // await btn.click();

    // const imgElement = await driver.wait(
    //   until.elementLocated(By.xpath("//img[@class='challengeImg']"))
    // );

    // // Get the src attribute value
    // const imagePath = await imgElement.getAttribute("src");

    // const client = new vision.ImageAnnotatorClient({
    //   keyFilename: "./gcp_key.json",
    // });

    // console.log("imageUri", imagePath);

    // // Read the image file
    // const [result] = await client.textDetection({
    //   image: { source: { imageUri: imagePath } },
    // });

    // let ocrText = result.fullTextAnnotation.text;

    // const textArea = await driver.wait(
    //   until.elementLocated(By.xpath("//textarea[@class='challengeTextArea']"))
    // );

    // await textArea.sendKeys(ocrText);

    // const sBtn = await driver.wait(
    //   until.elementLocated(
    //     By.xpath("//button[contains(@class, 'gwt-Button') and text()='Submit']")
    //   ),
    //   10000
    // );

    // await driver.sleep(7000);

    // await sBtn.click();

    // await driver.wait(
    //   until.elementLocated(By.xpath("//button[@class='asdfasdf']")),
    //   50000
    // );
    // await driver.quit();
  } catch (error) {
    console.log("Error while initializing driver", error);
    return null;
  }
}

typeRacer().then(() => {
  console.log("`````````````````````Complete``````````````````");
});
