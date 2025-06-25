let selectedFiles = [];
const preview = document.getElementById("preview");
const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  files.forEach((file) => {
    if (!selectedFiles.includes(file)) {
      selectedFiles.push(file);
      showPreview(file);
    }
  });
});

function showPreview(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const box = document.createElement("div");
    box.className = "img-box";

    const img = document.createElement("img");
    img.src = e.target.result;

    const btn = document.createElement("button");
    btn.textContent = "×";
    btn.onclick = () => {
      preview.removeChild(box);
      selectedFiles = selectedFiles.filter((f) => f !== file);
    };

    box.appendChild(img);
    box.appendChild(btn);
    preview.appendChild(box);
  };
  reader.readAsDataURL(file);
}

function clearAll() {
  preview.innerHTML = "";
  selectedFiles = [];
  document.getElementById("outputCanvas").getContext("2d").clearRect(0, 0, 10000, 10000);
}

function combineImages() {
  if (selectedFiles.length === 0) return alert("No images selected!");

  const imgs = [];
  let loaded = 0;

  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = () => {
        imgs[index] = img;
        loaded++;
        if (loaded === selectedFiles.length) drawCombined(imgs);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function drawCombined(images) {
  const widths = images.map(img => img.width);
  const heights = images.map(img => img.height);
  const maxWidth = Math.max(...widths);
  const totalHeight = heights.reduce((a, b) => a + b, 0);

  const canvas = document.getElementById("outputCanvas");
  canvas.width = maxWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext("2d");

  let y = 0;
  images.forEach(img => {
    ctx.drawImage(img, 0, y);
    y += img.height;
  });

  // Allow download
  const link = document.createElement("a");
  link.download = "combined-image.png";
  link.href = canvas.toDataURL();
  link.textContent = "Download Combined Image";
  link.style.display = "block";
  link.style.marginTop = "20px";
  document.body.appendChild(link);
}
