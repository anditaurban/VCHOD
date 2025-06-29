// Backup toggle function jika yang di script.js tidak berfungsi
function toggleRejectSection(section) {
    console.log('Backup toggle called for:', section);
    
    const container = document.getElementById(`container${section.charAt(0).toUpperCase() + section.slice(1)}`);
    const icon = document.getElementById(`icon${section.charAt(0).toUpperCase() + section.slice(1)}`);
    
    if (!container || !icon) {
        console.error('Element tidak ditemukan:', container, icon);
        return;
    }
    
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
        container.classList.add('show');
        icon.textContent = '▲';
        icon.classList.add('rotated');
        
        // Auto-enable semua input dalam container ini
        const inputs = container.querySelectorAll('.jumlah-input');
        inputs.forEach(input => {
            input.disabled = false;
            input.removeAttribute('disabled');
        });
        
    } else {
        container.style.display = 'none';
        container.classList.remove('show');
        icon.textContent = '▼';
        icon.classList.remove('rotated');
    }
}

// Force enable all inputs setelah page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const allInputs = document.querySelectorAll('.jumlah-input');
        allInputs.forEach(input => {
            input.disabled = false;
            input.removeAttribute('disabled');
        });
        console.log('Auto-enabled all inputs on page load');
    }, 1000);
});

// fungsi store data ke spreadsheet Google menggunakan Google Apps Script
function getRejectArray(sectionName) {
  const checkboxes = document.querySelectorAll(`input[name="${sectionName}"]:checked`);
  const result = [];

  checkboxes.forEach((checkbox) => {
    const id = checkbox.id;
    const value = checkbox.value;
    const jumlahInput = document.querySelector(`#jumlah${id.charAt(0).toUpperCase() + id.slice(1)}`);
    const jumlah = jumlahInput?.value || "0";

    result.push({ nama: value, jumlah });
  });

  return result;
}

document.getElementById("rejectForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const submitBtn = document.getElementById("submitButton");
  submitBtn.disabled = true;
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = "⏳ Menyimpan...";

  const tanggal = document.getElementById("tanggal").value;
  const jam = document.getElementById("jam").value;
  const line = document.getElementById("line").value;
  const shift = document.getElementById("shift").value;
  const spv = document.getElementById("spv").value;
  const petugas = document.getElementById("petugas").value;
  const keterangan = document.getElementById("keterangan").value;

  const rejectIsi = getRejectArray("rejectIsi");
  const rejectKosong = getRejectArray("rejectKosong");

  const rows = [];
  const maxLength = Math.max(rejectIsi.length, rejectKosong.length);

  if (maxLength === 0) {
    rows.push({
      tanggal,
      jam,
      line,
      rejectVisualIsi: "-",
      jumlahVisualIsi: "0",
      rejectVisualKosong: "-",
      jumlahVisualKosong: "0",
      spv,
      petugas,
      shift,
      keterangan,
    });
  } else {
    for (let i = 0; i < maxLength; i++) {
      rows.push({
        tanggal,
        jam,
        line,
        rejectVisualIsi: rejectIsi[i]?.nama || "-",
        jumlahVisualIsi: rejectIsi[i]?.jumlah || "0",
        rejectVisualKosong: rejectKosong[i]?.nama || "-",
        jumlahVisualKosong: rejectKosong[i]?.jumlah || "0",
        spv,
        petugas,
        shift,
        keterangan,
      });
    }
  }

  const formData = new FormData();
  formData.append("payload", JSON.stringify(rows));

  try {
    await fetch("https://script.google.com/macros/s/AKfycbw8F_Nfp-4wJQyHlXhxldLVnTuo4jYYjA8MpnjhAtQoNc1Ajv440Z6rD92g4m7ZpDw/exec", {
      method: "POST",
      mode: "no-cors",
      body: formData 
    });

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: `Berhasil menyimpan ${rows.length} baris ke Google Sheets.`,
      timer: 2500,
      showConfirmButton: false,
    });

    document.getElementById("rejectForm").reset();
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Gagal menyimpan",
      text: "Terjadi kesalahan saat mengirim data.",
    });
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});