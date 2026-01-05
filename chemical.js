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
