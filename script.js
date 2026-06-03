// ===== CONFIGURATION =====
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbz2v_RV97A2RNhWSOgETsuVskYH5g3647g8IdDwiy6fWuG9VXo3Q0Oexri-3nS2MuttzA/exec";

// ===== FORM SUBMISSION =====
document.getElementById("registrationForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const village = document.getElementById("village").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const course = document.getElementById("course").value;
  const transactionId = document.getElementById("transactionId").value.trim();
  const screenshotFile = document.getElementById("screenshot").files[0];

  // ===== VALIDATION =====
  if (!name || !village || !phone || !course || !transactionId || !screenshotFile) {
    showAlert("❌ Please fill all fields!", "error");
    return;
  }

  if (phone.length !== 10 || isNaN(phone)) {
    showAlert("❌ Please enter a valid 10-digit phone number!", "error");
    return;
  }

  // ===== SHOW LOADING =====
  const submitBtn = document.querySelector(".btn-submit");
  submitBtn.innerHTML = "⏳ Submitting... Please wait";
  submitBtn.disabled = true;

  try {
    // ===== CONVERT SCREENSHOT TO BASE64 =====
    const base64Screenshot = await convertToBase64(screenshotFile);

    // ===== PREPARE DATA =====
    const formData = {
      name: name,
      village: village,
      phone: phone,
      course: course,
      transactionId: transactionId,
      screenshot: base64Screenshot,
      submittedAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    };

    // ===== SEND TO GOOGLE SHEETS =====
    await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    // ===== SUCCESS =====
    showThankYouPage(name, course);

  } catch (error) {
    showAlert("❌ Something went wrong! Please try again.", "error");
    submitBtn.innerHTML = "✅ Submit Registration";
    submitBtn.disabled = false;
  }
});

// ===== CONVERT IMAGE TO BASE64 =====
function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// ===== SHOW THANK YOU PAGE =====
function showThankYouPage(name, course) {
  document.body.innerHTML = `
    <div style="
      min-height: 100vh;
      background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Poppins', sans-serif;
      padding: 20px;
    ">
      <div style="
        background: #111111;
        border: 2px solid #f7c948;
        border-radius: 20px;
        padding: 50px 40px;
        text-align: center;
        max-width: 550px;
        width: 100%;
      ">
        <div style="font-size: 70px; margin-bottom: 20px;">🎉</div>

        <h1 style="
          color: #f7c948;
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 15px;
        ">Payment Received Successfully!</h1>

        <p style="
          color: #ffffff;
          font-size: 18px;
          margin-bottom: 10px;
        ">Thank you, <strong style="color: #f7c948;">${name}</strong>! 🙌</p>

        <p style="
          color: #cccccc;
          font-size: 15px;
          margin-bottom: 30px;
        ">You have successfully registered for the
          <strong style="color: #f7c948;">${course} Course</strong>
        </p>

        <div style="
          background: #1a1a1a;
          border: 2px solid #333333;
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 30px;
          text-align: left;
        ">
          <p style="color: #f7c948; font-weight: 700; font-size: 16px; margin-bottom: 15px;">
            📋 What Happens Next?
          </p>
          <p style="color: #cccccc; font-size: 14px; margin-bottom: 10px;">
            ✅ Your registration has been received
          </p>
          <p style="color: #cccccc; font-size: 14px; margin-bottom: 10px;">
            📱 Within <strong style="color: #ffffff;">24 hours</strong>, you will be added to our WhatsApp group
          </p>
          <p style="color: #cccccc; font-size: 14px; margin-bottom: 10px;">
            📚 You will receive class schedule & study materials
          </p>
          <p style="color: #cccccc; font-size: 14px;">
            🔗 Google Meet link will be shared in the WhatsApp group
          </p>
        </div>

        <div style="
          background: #1a1a1a;
          border: 2px solid #f7c948;
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 30px;
        ">
          <p style="color: #f7c948; font-weight: 700; font-size: 15px; margin-bottom: 8px;">
            ⚠️ Important
          </p>
          <p style="color: #cccccc; font-size: 14px;">
            Make sure your WhatsApp number is active on the phone number you registered with.
          </p>
        </div>

        <a href="https://instagram.com/codewithkirann" target="_blank" style="
          display: block;
          background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
          color: #ffffff;
          padding: 14px 35px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          margin-bottom: 15px;
        ">📸 Follow us on Instagram</a>

        <p style="color: #666666; font-size: 13px;">
          © 2026 Code With Kirann. Welcome to the family! 🚀
        </p>
      </div>
    </div>
  `;
}

// ===== SHOW ALERT =====
function showAlert(message, type) {
  const existing = document.querySelector(".alert-box");
  if (existing) existing.remove();

  const alert = document.createElement("div");
  alert.className = "alert-box";
  alert.innerHTML = message;
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "error" ? "#ff4444" : "#44bb44"};
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    font-family: Poppins, sans-serif;
    font-weight: 600;
    font-size: 15px;
    z-index: 9999;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 4000);
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});