const vision = require("@google-cloud/vision");

async function ocr() {
  try {
    const client = new vision.ImageAnnotatorClient({
      keyFilename: "./gcp_key.json",
    });

    // Read the image file
    const [result] = await client.textDetection({
      image: {
        source: {
          imageUri:
            "https://play.typeracer.com/challenge?id=1703156550960guest:207105110599452",
        },
      },
    });

    let ocrText = result.fullTextAnnotation.text;

    console.log(ocrText);
  } catch (err) {
    console.log(err);
  }
}

ocr().then(() => {
  console.log("ocr completed");
});
