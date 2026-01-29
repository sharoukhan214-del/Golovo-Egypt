// auth.js
import { auth, db } from './firebase.js';
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

// إعداد reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier('orderBtn', {
  'size': 'invisible'
}, auth);

// تسجيل دخول العميل
export async function loginCustomer(phoneNumber) {
  const confirmation = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
  const code = prompt("ادخل كود OTP");
  await confirmation.confirm(code);
  alert("تم تسجيل الدخول بنجاح!");
}

// تسجيل الكابتن ونظام المديونية
export async function updateDebt(driverId, amount) {
  const driverRef = db.collection("drivers").doc(driverId);
  const doc = await driverRef.get();
  let debt = doc.data()?.debt || 0;
  debt += amount;

  if(debt >= 1000) {
    await driverRef.update({ debt, active: false });
    alert("تم إيقاف حسابك مؤقتًا بسبب المديونية. الرجاء السداد على 01020744825");
  } else {
    await driverRef.update({ debt });
  }
}

