function scrollToUpload() {
    document.getElementById("upload").scrollIntoView({ behavior: "smooth" });
}

function previewImage() {
    const file = document.getElementById("imageUpload").files[0];
    const preview = document.getElementById("preview");
    const result = document.getElementById("result");

    if (!file) {
        alert("Please upload an image");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        preview.src = reader.result;
        preview.style.display = "block";
        result.innerText = "Analyzing image... (AI model will be connected)";
    };
    reader.readAsDataURL(file);
}
