// ============================================
// CAMERA PERMISSION HANDLER
// ============================================
async function requestCameraPermission() {
  // Cek dulu apakah browser mendukung
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Browser Anda tidak mendukung akses kamera.");
    return null;
  }

  // Cek konteks aman (HTTPS atau localhost)
  if (!window.isSecureContext) {
    alert(
      "Akses kamera hanya diizinkan pada HTTPS atau localhost.\n" +
      "Silakan akses via https:// atau jalankan di localhost."
    );
    return null;
  }

  try {
    // Cek status izin terlebih dahulu (jika API tersedia)
    if (navigator.permissions && navigator.permissions.query) {
      const status = await navigator.permissions.query({ name: "camera" });
      console.log("Status izin kamera:", status.state);

      if (status.state === "denied") {
        alert(
          "Izin kamera DIBLOKIR.\n\n" +
          "Cara mengaktifkan:\n" +
          "1. Klik ikon 🔒 / ⓘ di address bar\n" +
          "2. Pilih 'Site settings' / 'Pengaturan situs'\n" +
          "3. Ubah Camera menjadi 'Allow' / 'Izinkan'\n" +
          "4. Refresh halaman"
        );
        return null;
      }
    }

    // Minta akses kamera
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: "user"
      },
      audio: false
    });

    console.log("✅ Kamera berhasil diakses");
    return stream;

  } catch (err) {
    console.error("❌ Gagal akses kamera:", err);

    switch (err.name) {
      case "NotAllowedError":
        alert("Izin kamera ditolak. Silakan izinkan di pengaturan browser.");
        break;
      case "NotFoundError":
        alert("Tidak ada kamera yang terdeteksi di perangkat ini.");
        break;
      case "NotReadableError":
        alert("Kamera sedang digunakan aplikasi lain. Tutup aplikasi tersebut.");
        break;
      case "OverconstrainedError":
        alert("Kamera tidak mendukung resolusi yang diminta.");
        break;
      default:
        alert("Error kamera: " + err.message);
    }
    return null;
  }
}

// Panggil setelah user gesture (klik tombol), bukan langsung saat load
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("start-camera") || document.body;

  // Opsi A: Pakai tombol
  if (document.getElementById("start-camera")) {
    document.getElementById("start-camera").addEventListener("click", async () => {
      const stream = await requestCameraPermission();
      if (stream && window.startGestureApp) {
        window.startGestureApp(stream);
      }
    });
  }
});

// Ekspos ke global agar bisa dipakai oleh bundle Vite
window.requestCameraPermission = requestCameraPermission;
