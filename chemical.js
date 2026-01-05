document.getElementById("auditBtn").addEventListener("click", async () => {
  const chemical = document.getElementById("chemSearch").value;
  const selectedLang = document.getElementById("languageSelect").value;
  const content = document.getElementById("aiContent");

  // Show your loader here...

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Dynamic prompt with language instruction
    const prompt = `
            Analyze the chemical: ${chemical}.
            Provide safety risks and organic replacements.
            IMPORTANT: Write the entire response in ${selectedLang}.
            Use simple words that a farmer can understand.
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Standard formatting
    let text = response.text();
    text = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");

    content.innerHTML = text;
    document.getElementById("auditResult").style.display = "block";
  } catch (error) {
    console.error(error);
  }
});

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "YOUR_GEMINI_API_KEY";
const genAI = new GoogleGenerativeAI(API_KEY);

// Helper function to convert file to base64 for Gemini
async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

document.getElementById("auditBtn").addEventListener("click", async () => {
  const textInput = document.getElementById("chemSearch").value;
  const fileInput = document.getElementById("labelUpload").files[0];
  const content = document.getElementById("aiContent");
  const loader = document.getElementById("loading");

  if (!textInput && !fileInput)
    return alert("Please type a name or upload a photo!");

  loader.style.display = "block";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let result;

    if (fileInput) {
      // Case: User uploaded an image
      const imagePart = await fileToGenerativePart(fileInput);
      const prompt =
        "Analyze the chemical product in this image. Identify it, assess safety, and suggest an organic replacement.";
      result = await model.generateContent([prompt, imagePart]);
    } else {
      // Case: User typed a name
      const prompt = `Analyze the chemical: ${textInput}. Provide safety risks and organic replacements.`;
      result = await model.generateContent(prompt);
    }

    const response = await result.response;
    let formattedText = response
      .text()
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");

    content.innerHTML = formattedText;
    document.getElementById("auditResult").style.display = "block";
  } catch (error) {
    alert("AI Error: Check console or API key.");
  } finally {
    loader.style.display = "none";
  }
});
