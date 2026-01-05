const API_KEY = "AIzaSyC_m8RpUh0J3Lan29jBTZlg6xPEEVjQ1-M"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

// SELECTORS (Make sure these IDs match your HTML file!)
const chemicalInput = document.querySelector('input[type="text"]'); 
const fileInput = document.querySelector('input[type="file"]');     
const analyzeBtn = document.querySelector('button');              
const resultDiv = document.createElement('div');                    

// Append result div to body or a specific container
document.body.appendChild(resultDiv); 
resultDiv.style.marginTop = "20px";
resultDiv.style.padding = "20px";
resultDiv.style.whiteSpace = "pre-wrap"; // Preserves formatting

// MAIN FUNCTION
analyzeBtn.addEventListener('click', async () => {
    // 1. CLEAR PREVIOUS RESULTS & SHOW LOADING
    resultDiv.innerHTML = "Consulting the AI Doctor...";
    resultDiv.style.color = "blue";
    
    try {
        const chemicalName = chemicalInput.value.trim();
        const file = fileInput.files[0];
        
        if (!chemicalName && !file) {
            alert("Please enter a chemical name or upload a label.");
            return;
        }

        let contents = [];

        // Add text instruction
        let promptText = "You are an AI Safety Doctor. Analyze this chemical/product for safety, usage, and risks.";
        if (chemicalName) {
            promptText += ` The chemical name is: ${chemicalName}.`;
        }
        
        // Prepare parts array for Gemini
        const parts = [{ text: promptText }];

        // 3. HANDLE IMAGE 
        if (file) {
            const base64Data = await fileToGenerativePart(file);
            parts.push(base64Data);
        }

        // 4. PREPARE API BODY
        const requestBody = {
            contents: [{
                parts: parts
            }]
        };

        // 5. FETCH DATA
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        // 6. CHECK FOR ERRORS IN RESPONSE
        if (!response.ok) {
            console.error("API Error Details:", data);
            throw new Error(data.error?.message || "Unknown API Error");
        }

        // 7. DISPLAY RESULT
        const aiResponse = data.candidates[0].content.parts[0].text;
        resultDiv.innerHTML = `<strong>Analysis Result:</strong><br>${aiResponse}`;
        resultDiv.style.color = "black";
        resultDiv.style.backgroundColor = "#f0f0f0";

    } catch (error) {
        console.error("Full Error:", error);
        alert(`AI Error: ${error.message}. Check the Console (F12) for details.`);
        resultDiv.innerHTML = "Analysis Failed.";
        resultDiv.style.color = "red";
    }
});

// HELPER: Convert File to Base64 for Gemini API
async function fileToGenerativePart(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // Remove the "data:image/jpeg;base64," part
            const base64String = reader.result.split(',')[1];
            resolve({
                inline_data: {
                    mime_type: file.type,
                    data: base64String
                }
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
