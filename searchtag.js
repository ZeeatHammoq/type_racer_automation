const { By, until } = require("selenium-webdriver");

module.exports = async function searchTag(
  driver,
  tag,
  searchText,
  includes = false,
  print = false
) {
  try {
    await driver.sleep(5000);

    const elements = await driver.wait(
      until.elementsLocated(By.xpath(`//${tag}`)),
      10000
    );
    for (let i = 0; i < elements.length; i++) {
      let text = await elements[i].getText();

      if (print) {
        console.log("search tag text:    ", text);
      }

      if (includes) {
        if (text.toLowerCase().includes(searchText.toLowerCase())) {
          return elements[i];
        }
      } else {
        if (text.toLowerCase() == searchText.toLowerCase()) {
          return elements[i];
        }
      }
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
