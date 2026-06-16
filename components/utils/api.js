// utils/api.js
const BASE_URL = "http://192.168.43.38:3000"; // replace with your server URL

export async function sendOtp(email) {
  const res = await fetch(`${BASE_URL}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
    
  return res.json();
}

export async function verifyOtp(email, otp) {
  const res = await fetch(`${BASE_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return res.json();
}