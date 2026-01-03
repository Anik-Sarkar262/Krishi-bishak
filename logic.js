// logic.js - Fixed Version with Error Debugging

// *** PASTE YOUR API KEY HERE ***
// Make sure you keep the quotes!
const API_KEY = "AIzaSyC-s8OOhrmY5nRrI8QFqeR4fK0yok1qa4Q"; 

// DOM Elements
const dropArea = document.getElementById('drop-area');
const imageInput = document.getElementById('imageInput');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('result');
const aiOutput = document.getElementById('aiOutput');

let currentBase64 = "";

// 1. Handle Click to Upload
dropArea.addEventListener('click', () => imageInput.click());

// 2. Handle File Selection
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
});

function processFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        // Clean the Base64 string (remove "data:image/jpeg;base64,")
        currentBase64 = e.target.result.split(',')[1]; 
        
        previewContainer.style.display = 'block';
        dropArea.style.display = 'none';
        resultDiv.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// 3. Analyze Button Click
analyzeBtn.addEventListener('click', async () => {
    if (!currentBase64) return alert("Please upload an image first.");

    // UI Updates
    loadingDiv.style.display = 'block';
    analyzeBtn.disabled = true;
    analyzeBtn.innerText = "Scanning Crop...";
    resultDiv.style.display = 'none';

    // CLEAN THE API KEY (Removes accidental spaces)
    const cleanKey = API_KEY.trim();

    const promptText = `
    You are 'Krishi Bhishak', an expert plant pathologist. 
    Analyze this crop image.
    Format your response in Markdown:
    ## 🌿 Diagnosis Report
    **1. Crop Name:** [Name]
    **2. Disease:** [Name or "Healthy"]
    **3. Solution (Organic):** [Remedy]
    **4. Solution (Chemical):** [Medicine name]
    `;

    const requestBody = {
        contents: [{
            parts: [
                { text: promptText },
                {
                    inline_data: {
                        mime_type: "image/jpeg",
                        data: currentBase64
                    }
                }
            ]
        }]
    };

    try {
        // We use 'gemini-1.5-flash' which is the standard free model
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${cleanKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            }
        );

        if (!response.ok) {
            // Read the exact error message from Google
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || "Unknown Error";
            
            throw new Error(`Google API Error (${response.status}): ${errorMessage}`);
        }

        const data = await response.json();
        
        // Check if candidates exist
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("AI returned no results. Try a different image.");
        }

        const botResponse = data.candidates[0].content.parts[0].text;

        // Render Result
        aiOutput.innerHTML = marked.parse(botResponse);
        resultDiv.style.display = 'block';

    } catch (error) {
        console.error("Full Error:", error);
        // Show the detailed error on the screen
        aiOutput.innerHTML = `
            <div style="color: #ef4444; background: #fef2f2; padding: 15px; border-radius: 8px; border: 1px solid #fecaca;">
                <strong>⚠️ Detection Failed</strong><br>
                ${error.message}
                <br><br>
                <em>Tip: Open Console (F12) for more technical details.</em>
            </div>
        `;
        resultDiv.style.display = 'block';
    } finally {
        loadingDiv.style.display = 'none';
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fas fa-microscope"></i> Detect Disease';
    }

});