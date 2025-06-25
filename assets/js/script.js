document.getElementById("rejectForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const submitBtn = document.getElementById("submitButton");
  submitBtn.disabled = true;
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = "⏳ Menyimpan...";

  const formData = {
    tanggal: document.getElementById("tanggal").value,
    jam: document.getElementById("jam").value,
    line: document.getElementById("line").value,
    jenisReject: document.getElementById("jenisReject").value,
    jumlah: document.getElementById("jumlah").value,
    spv: document.getElementById("spv").value,
    petugas: document.getElementById("petugas").value,
    shift: document.getElementById("shift").value,
    keterangan: document.getElementById("keterangan").value
  };

try {
    await fetch("https://script.google.com/macros/s/AKfycbwgfFE7qUPkjR6kuF4xdNxg_A4tVkdDI4jGdpRcx0IRGofVuT-50TNBLja15FzQDHo/exec", {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Data berhasil disimpan ke Google Sheet.",
      timer: 2000,
      showConfirmButton: false
    });

    document.getElementById("rejectForm").reset();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal!",
      text: "Terjadi kesalahan saat menyimpan data.",
    });
    console.error(error);
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});