// Data siswa: Dipisah berdasarkan kelas untuk Autocomplete
const dataSiswaPerKelas = {
    " KELAS VII ( 7 ) ": [
    "Aditya Fahreza",
    "Al-Fatir Nur Rizky",
    "Anita Nur'aini",
    "Arobi Hafiz",
    "Azriel Aizhafran",
    "Bayu Hadi Wibisono",
    "Delicia Alya Wibisono",
    "Dina",
    "Dini",
    "Dafa Caesar aprilio",
    "Faridzul Ilham Junaedi",
    "Haikal",
    "Hapid Zuhri",
    "Laura Runiandra Putri",
    "Lintang Nur Anggraeni",
    "Lisya Aisha A",
    "Mentari Falaysafitri R",
    "Miftahul Jannah",
    "Muhamad Azki Ramadan",
    "Muhammad Devine",
    "Muhammad Yogi Saputra",
    "Muhammad Azmi Fuadi",
    "Nazila Nurapriani",
    "Nazla Muzdalifah",
    "Noer Hasanah",
    "Pricilia Aqila Zahwa",
    "Radyan Putra Pratama",
    "Rifqah Aaidah Qoddriyah",
    "Tian Ramdani",
    "Yuliatun",
    "Royana",
    ],
    " KELAS VIII ( 8 ) ": [
    "Jeven Setiawan",
    "Alvino",
    "Caprilio Harianja",
    "Dewi Cempaka Angraeni",
    "Fadel Raditya Hafiz",
    "Gihon Jeremy",
    "Herlangga",
    "Indah Agus Tina",
    "Izdinar Khalid Rahmansyah",
    "Keyla Ilmi Nur Fauziah",
    "Muhammad Caesar Hanief",
    "Mohammad Ridwan Maulana",
    "Muhamad Irfan Aditya",
    "Muhamad Rizki Aditya",
    "Nadilah Syafitri",
    "Nicky Fauziah",
    "Niken Widyaningsih",
    "Nurbaina",
    "Parid Ahmad Endang",
    "Sofyan Saputra",
    "Syarif Hidayatullah",
    "Teguh Pirmansyah",
    "Vanessa Ardila Putri",
    "Wan Naya Vanilla",
    "Yuni Awalia",
    "Anita Az-Zahra",
    "Alika Nayla Putri",
    "Muhamad Alam Fauzan",
    "Muhammad Zulfiqar",
    "Ilham Ramadhan",
    ],
    " KELAS IX ( 9 ) ": [
    "Achmad Yoga Pratama",
    "Anisa Nazwa Putri",
    "Aulia",
    "Christian Septiranda",
    "Dea Inggita Khoirunnisa Rajiman",
    "Descham Adrian Mustamu",
    "Fatma Liviyana",
    "Bnu Tegar Athaullah",
    "Indri Nur'aini",
    "Juan Naufal Adelar",
    "Kanaya Thabita",
    "M Rio Setiawan",
    "M. Afrizal Natayudha",
    "M. Lazuardy Al Faribi Wibisono",
    "Malisa Dwi Lestari",
    "Muhammad Fahat",
    "Muhammad Rizky",
    "Natasya Nurainita",
    "Nizam Abdu Fadillah",
    "Nursahada",
    "Rafi Muhamad",
    "Renal Putra Selapada",
    "Sandy Saputra Namin",
    "Sila Rahmadani",
    "Tiara Nuraini",
    "Vieny Herlina Oktavia Hutabarat",
    "Zian Alqiano",
    "Deka Saputra",
    "Eva Nurmalasari",
    "Khaerunnissa",
    "Alexsandra Vania Maylani Putri",
    ]
};
// Membuat daftar siswa gabungan untuk keperluan validasi.
const dataSiswaCombined = Object.values(dataSiswaPerKelas).flat();

// Data absensi
let dataAbsensi = JSON.parse(localStorage.getItem('dataAbsensi')) || [];
let currentEditId = null;
let currentDeleteId = null;

// Konfigurasi pagination
let currentPage = 1;
const recordsPerPage = 10;

// Elemen DOM (diasumsikan sudah didefinisikan di index.html)
const formAbsensi = document.getElementById('formAbsensi');
const namaSiswaInput = document.getElementById('namaSiswa');
const namaSiswaList = document.getElementById('namaSiswaList');
const tabelRekap = document.getElementById('tabelRekap').querySelector('tbody');
const totalData = document.getElementById('totalData');
const pageStart = document.getElementById('pageStart');
const pageEnd = document.getElementById('pageEnd');
const totalRecords = document.getElementById('totalRecords');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const pageNumbersContainer = document.getElementById('pageNumbers');
const filterKelas = document.getElementById('filterKelas');
const filterStatus = document.getElementById('filterStatus');
const filterTanggalMulai = document.getElementById('filterTanggalMulai');
const filterTanggalSampai = document.getElementById('filterTanggalSampai');
const resetFilterButton = document.getElementById('resetFilter');

// Elemen Modal Edit
const editModal = document.getElementById('editModal');
const editTanggalInput = document.getElementById('editTanggal');
const editNamaSiswaInput = document.getElementById('editNamaSiswa');
const editKelasSelect = document.getElementById('editKelas');
const editStatusSelect = document.getElementById('editStatus');
const saveEditButton = document.getElementById('saveEdit');
const cancelEditButton = document.getElementById('cancelEdit');
const closeModals = document.querySelectorAll('.modal .close');

// Elemen Modal Hapus
const confirmModal = document.getElementById('confirmModal');
const confirmDeleteButton = document.getElementById('confirmDelete');
const cancelDeleteButton = document.getElementById('cancelDelete');

// Elemen Toast
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const toastIcon = document.getElementById('toast-icon');

// Elemen Stat Summary
const statHadir = document.getElementById('statHadir');
const statSakit = document.getElementById('statSakit');
const statIzin = document.getElementById('statIzin');
const statAlpa = document.getElementById('statAlpa');
const statSkorsing = document.getElementById('statSkorsing');

// Elemen Navigasi Mobile
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navItems = document.querySelectorAll('.main-nav .nav-item'); // Navigasi Desktop
const mobileNavItems = document.querySelectorAll('.mobile-nav-item'); // Navigasi Mobile
const sections = document.querySelectorAll('.main-content section');

// Chart
let absensiChart = null;

// ===================================================================
// INISIALISASI DAN EVENT LISTENERS
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tampilkan tanggal hari ini di header
    document.getElementById('currentDate').textContent = formatDate(new Date());

    // 2. Tampilkan tahun saat ini di footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // 3. Inisialisasi Autocomplete Siswa
    initializeDatalist();

    // 4. Atur tanggal default di form input hari ini
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggal').value = today;
    document.getElementById('filterTanggalMulai').value = today;
    document.getElementById('filterTanggalSampai').value = today;

    // 5. Render rekap absensi saat halaman dimuat
    renderTable();

    // 6. Setup event listeners
    formAbsensi.addEventListener('submit', handleAbsensiSubmit);
    filterKelas.addEventListener('change', () => { currentPage = 1; renderTable(); });
    filterStatus.addEventListener('change', () => { currentPage = 1; renderTable(); });
    filterTanggalMulai.addEventListener('change', () => { currentPage = 1; renderTable(); });
    filterTanggalSampai.addEventListener('change', () => { currentPage = 1; renderTable(); });
    resetFilterButton.addEventListener('click', resetFilters);
    prevPage.addEventListener('click', () => changePage(-1));
    nextPage.addEventListener('click', () => changePage(1));
    saveEditButton.addEventListener('click', handleEditSave);
    cancelEditButton.addEventListener('click', () => editModal.style.display = 'none');
    confirmDeleteButton.addEventListener('click', handleConfirmDelete);
    cancelDeleteButton.addEventListener('click', () => confirmModal.style.display = 'none');
    
    // Event listener untuk tombol download
    document.getElementById('downloadExcelHarian').addEventListener('click', () => exportData('harian', 'excel'));
    document.getElementById('downloadPdfHarian').addEventListener('click', () => exportData('harian', 'pdf'));
    document.getElementById('downloadExcelTotal').addEventListener('click', () => exportData('total', 'excel'));
    document.getElementById('downloadPdfTotal').addEventListener('click', () => exportData('total', 'pdf'));

    // Event listeners untuk tombol close modal
    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            editModal.style.display = 'none';
            confirmModal.style.display = 'none';
        });
    });
    
    // Event listeners untuk navigasi desktop dan mobile
    navItems.forEach(item => {
        item.addEventListener('click', handleNavClick);
    });
    mobileNavItems.forEach(item => {
        item.addEventListener('click', handleMobileNavClick);
    });
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    // Tampilkan bagian dashboard saat pertama kali load
    showSection('dashboard');
});

// ===================================================================
// FUNGSI NAVIGASI
// ===================================================================

/**
 * Menampilkan bagian (section) yang dipilih dan menyembunyikan yang lain.
 */
function showSection(targetId) {
    sections.forEach(section => {
        section.classList.remove('active-section');
        if (section.id === targetId) {
            section.classList.add('active-section');
        }
    });

    // Update status active pada menu desktop
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').substring(1) === targetId) {
            item.classList.add('active');
        }
    });
    // Update status active pada menu mobile
    mobileNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').substring(1) === targetId) {
            item.classList.add('active');
        }
    });
    
    // Khusus untuk Rekap, panggil renderTable lagi untuk meyakinkan data terload
    if (targetId === 'rekap') {
        renderTable();
    }
}

/**
 * Menangani klik navigasi desktop
 */
function handleNavClick(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    showSection(targetId);
}

/**
 * Mengubah tampilan menu mobile
 */
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
}

/**
 * Menangani klik navigasi mobile
 */
function handleMobileNavClick(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);

    showSection(targetId);
    
    // Sembunyikan menu setelah klik
    mobileMenu.classList.remove('active');
}

// ===================================================================
// FUNGSI UTAMA (CRUD)
// ===================================================================

/**
 * Mengisi datalist untuk input nama siswa (fitur autocomplete)
 */
function initializeDatalist() {
    namaSiswaList.innerHTML = ''; 
    
    for (const kelas in dataSiswaPerKelas) {
        // 1. Tambahkan pemisah kelas
        const separatorOption = document.createElement('option');
        separatorOption.value = `====== ${kelas} ======`; 
        namaSiswaList.appendChild(separatorOption);
        
        // 2. Tambahkan nama-nama siswa
        dataSiswaPerKelas[kelas].forEach(nama => {
            const option = document.createElement('option');
            option.value = nama;
            namaSiswaList.appendChild(option);
        });
    }
}

/**
 * Menangani pengiriman form absensi (Create)
 */
function handleAbsensiSubmit(e) {
    e.preventDefault();

    const tanggal = document.getElementById('tanggal').value;
    const kelas = document.getElementById('kelas').value;
    const namaSiswa = namaSiswaInput.value.trim();
    const statusElement = document.querySelector('input[name="status"]:checked');
    const status = statusElement ? statusElement.value : null;

    if (!tanggal || !kelas || !namaSiswa || !status) {
        showToast('Semua kolom harus diisi!', 'error');
        return;
    }
    
    if (namaSiswa.startsWith('======') && namaSiswa.endsWith('======')) {
        showToast('Silakan pilih nama siswa yang valid, bukan pemisah kelas.', 'warning');
        return;
    }

    if (!dataSiswaCombined.includes(namaSiswa)) {
        const isConfirmed = confirm(`Nama siswa "${namaSiswa}" tidak ditemukan di daftar resmi. Apakah Anda yakin ingin menambahkannya?`);
        if (!isConfirmed) {
            return;
        }
    }
    
    const isDuplicate = dataAbsensi.some(data => 
        data.tanggal === tanggal && 
        data.namaSiswa.toLowerCase() === namaSiswa.toLowerCase()
    );

    if (isDuplicate) {
        showToast(`Siswa "${namaSiswa}" sudah diabsen pada tanggal ini.`, 'warning');
        return;
    }

    const newAbsensi = {
        id: Date.now(), 
        tanggal,
        kelas,
        namaSiswa,
        status,
        timestamp: new Date().toISOString()
    };

    dataAbsensi.push(newAbsensi);
    localStorage.setItem('dataAbsensi', JSON.stringify(dataAbsensi));

    // Reset form dan render ulang tabel
    formAbsensi.reset();
    document.getElementById('tanggal').value = tanggal; 
    document.getElementById('kelas').value = kelas; 
    document.querySelector('input[name="status"][value="Hadir"]').checked = true; 
    renderTable();
    showToast('Absensi berhasil ditambahkan!', 'success');
}

/**
 * Memfilter dan menampilkan data absensi (Read)
 */
function filterData() {
    let filtered = dataAbsensi.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)); // Urutkan dari terbaru
    
    const kelas = filterKelas.value;
    const status = filterStatus.value;
    const tanggalMulai = filterTanggalMulai.value;
    const tanggalSampai = filterTanggalSampai.value;

    if (kelas !== 'all') {
        filtered = filtered.filter(data => data.kelas === kelas);
    }

    if (status !== 'all') {
        filtered = filtered.filter(data => data.status === status);
    }

    if (tanggalMulai) {
        filtered = filtered.filter(data => data.tanggal >= tanggalMulai);
    }

    if (tanggalSampai) {
        filtered = filtered.filter(data => data.tanggal <= tanggalSampai);
    }

    return filtered;
}

/**
 * Merender tabel dan pagination
 */
function renderTable() {
    const filteredData = filterData();
    const totalRecordsCount = filteredData.length;
    const totalPages = Math.ceil(totalRecordsCount / recordsPerPage);

    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const dataOnPage = filteredData.slice(startIndex, endIndex);

    // Tampilkan data di tabel
    tabelRekap.innerHTML = '';
    if (dataOnPage.length === 0) {
        tabelRekap.innerHTML = `<tr><td colspan="6" class="text-center" style="text-align: center; color: var(--text-medium);">Tidak ada data absensi yang ditemukan.</td></tr>`;
    } else {
        dataOnPage.forEach((data, index) => {
            const row = tabelRekap.insertRow();
            const actualIndex = startIndex + index + 1;
            row.innerHTML = `
                <td>${actualIndex}</td>
                <td>${data.namaSiswa}</td>
                <td>${data.kelas}</td>
                <td><span class="status-badge ${data.status.toLowerCase()}">${data.status}</span></td>
                <td>${data.tanggal}</td>
                <td class="action-buttons">
                    <button class="action-btn btn-edit" onclick="openEditModal(${data.id})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn btn-delete" onclick="openDeleteConfirmModal(${data.id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
        });
    }

    // Update status summary dan chart
    updateStatsSummary(filteredData);
    updateChart(filteredData);

    // Update pagination
    totalData.textContent = totalRecordsCount;
    pageStart.textContent = totalRecordsCount > 0 ? startIndex + 1 : 0;
    pageEnd.textContent = Math.min(endIndex, totalRecordsCount);
    totalRecords.textContent = totalRecordsCount;
    
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages || totalPages === 0;
    
    renderPageNumbers(totalPages);
}

/**
 * Merender nomor-nomor halaman pagination
 */
function renderPageNumbers(totalPages) {
    pageNumbersContainer.innerHTML = '';
    
    if (totalPages <= 1) return;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        endPage = Math.min(totalPages, 5);
    }
    if (currentPage > totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageNumberBtn = document.createElement('button');
        pageNumberBtn.textContent = i;
        pageNumberBtn.classList.add('page-number');
        if (i === currentPage) {
            pageNumberBtn.classList.add('active');
        }
        pageNumberBtn.addEventListener('click', () => {
            currentPage = i;
            renderTable();
        });
        pageNumbersContainer.appendChild(pageNumberBtn);
    }
}

/**
 * Mengganti halaman pagination
 */
function changePage(delta) {
    currentPage += delta;
    renderTable();
}

/**
 * Mereset semua filter
 */
function resetFilters() {
    filterKelas.value = 'all';
    filterStatus.value = 'all';
    const today = new Date().toISOString().split('T')[0];
    filterTanggalMulai.value = today;
    filterTanggalSampai.value = today;
    currentPage = 1;
    renderTable();
    showToast('Filter berhasil direset!', 'success');
}

/**
 * Membuka modal edit (Update - part 1)
 */
function openEditModal(id) {
    const dataToEdit = dataAbsensi.find(data => data.id === id);
    if (!dataToEdit) return;

    currentEditId = id;
    editTanggalInput.value = dataToEdit.tanggal;
    editNamaSiswaInput.value = dataToEdit.namaSiswa;
    editKelasSelect.value = dataToEdit.kelas;
    editStatusSelect.value = dataToEdit.status;

    editModal.style.display = 'flex';
}

/**
 * Menyimpan perubahan dari modal edit (Update - part 2)
 */
function handleEditSave() {
    const index = dataAbsensi.findIndex(data => data.id === currentEditId);
    if (index === -1) {
        showToast('Data tidak ditemukan!', 'error');
        editModal.style.display = 'none';
        return;
    }

    const newTanggal = editTanggalInput.value;
    const newStatus = editStatusSelect.value;
    
    dataAbsensi[index].tanggal = newTanggal;
    dataAbsensi[index].status = newStatus;
    
    localStorage.setItem('dataAbsensi', JSON.stringify(dataAbsensi));
    editModal.style.display = 'none';
    renderTable();
    showToast('Data berhasil diperbarui!', 'success');
}

/**
 * Membuka modal konfirmasi hapus (Delete - part 1)
 */
function openDeleteConfirmModal(id) {
    currentDeleteId = id;
    confirmModal.style.display = 'flex';
}

/**
 * Menghapus data absensi setelah konfirmasi (Delete - part 2)
 */
function handleConfirmDelete() {
    dataAbsensi = dataAbsensi.filter(data => data.id !== currentDeleteId);
    localStorage.setItem('dataAbsensi', JSON.stringify(dataAbsensi));
    
    confirmModal.style.display = 'none';
    currentDeleteId = null;
    renderTable();
    showToast('Data absensi berhasil dihapus!', 'success');
}

// ===================================================================
// STATISTIK & CHART
// ===================================================================

/**
 * Mengupdate ringkasan statistik
 */
function updateStatsSummary(data) {
    const totalHadir = data.filter(d => d.status === 'Hadir').length;
    const totalSakit = data.filter(d => d.status === 'Sakit').length;
    const totalIzin = data.filter(d => d.status === 'Izin').length;
    const totalAlpa = data.filter(d => d.status === 'Alpa').length;
    const totalSkorsing = data.filter(d => d.status === 'Skorsing').length;

    statHadir.textContent = totalHadir;
    statSakit.textContent = totalSakit;
    statIzin.textContent = totalIzin;
    statAlpa.textContent = totalAlpa;
    statSkorsing.textContent = totalSkorsing;
}

/**
 * Mengupdate Chart.js
 */
function updateChart(data) {
    const totalHadir = data.filter(d => d.status === 'Hadir').length;
    const totalSakit = data.filter(d => d.status === 'Sakit').length;
    const totalIzin = data.filter(d => d.status === 'Izin').length;
    const totalAlpa = data.filter(d => d.status === 'Alpa').length;
    const totalSkorsing = data.filter(d => d.status === 'Skorsing').length;

    const chartData = {
        labels: ['Hadir', 'Sakit', 'Izin', 'Alpa', 'Skorsing'],
        datasets: [{
            data: [totalHadir, totalSakit, totalIzin, totalAlpa, totalSkorsing],
            backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'],
            hoverOffset: 4
        }]
    };

    if (absensiChart) {
        absensiChart.data = chartData;
        absensiChart.update();
    } else {
        const ctx = document.getElementById('absensiChart').getContext('2d');
        absensiChart = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += context.parsed;
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
}

// ===================================================================
// EKSPOR DATA (Excel & PDF)
// ===================================================================

/**
 * Mengubah data absensi harian menjadi ringkasan total per siswa.
 * DITAMBAHKAN: Kolom Total (Hadir+Sakit+Izin+Alpa+Skorsing).
 * @param {Array} absensiData - Array data absensi harian.
 * @returns {Array} Array objek ringkasan total per siswa.
 */
function processDataForTotalReport(absensiData) {
    const summaryMap = {};

    absensiData.forEach(item => {
        const key = `${item.namaSiswa}|${item.kelas}`; 
        
        if (!summaryMap[key]) {
            summaryMap[key] = {
                namaSiswa: item.namaSiswa,
                kelas: item.kelas,
                Hadir: 0,
                Sakit: 0,
                Izin: 0,
                Alpa: 0,
                Skorsing: 0,
                Total: 0
            };
        }
        
        if (summaryMap[key].hasOwnProperty(item.status)) {
            summaryMap[key][item.status]++;
        }
        
        summaryMap[key].Total++;
    });

    return Object.values(summaryMap).sort((a, b) => a.kelas.localeCompare(b.kelas) || a.namaSiswa.localeCompare(b.namaSiswa));
}

/**
 * Mengatur data yang akan diekspor berdasarkan tipe (harian/total)
 */
function getDataForExport(type) {
    if (type === 'harian') {
        return filterData();
    } else if (type === 'total') {
        return processDataForTotalReport(dataAbsensi);
    }
    return [];
}

/**
 * Fungsi utama untuk mengekspor data
 */
function exportData(type, format) {
    const data = getDataForExport(type);

    if (data.length === 0) {
        showToast('Tidak ada data yang dapat diekspor.', 'warning');
        return;
    }

    if (format === 'excel') {
        exportToExcel(data, type);
    } else if (format === 'pdf') {
        exportToPdf(data, type);
    }
}

/**
 * Mengekspor ke format Excel (.xlsx)
 * PERUBAHAN: Ditambahkan kolom Skorsing dan Total (untuk total).
 */
function exportToExcel(data, type) {
    let worksheetData;
    let sheetName;
    
    if (type === 'harian') {
        // Format Harian (Tanpa Ringkasan Statistik)
        worksheetData = data.map(d => ({
            'Tanggal': d.tanggal,
            'Kelas': d.kelas,
            'Nama Siswa': d.namaSiswa,
            'Status': d.status
        }));
        sheetName = 'Absensi Harian';
    } else if (type === 'total') {
        // Format Total (Ringkasan per siswa) DITAMBAHKAN: Skorsing dan Total
        worksheetData = data.map(d => ({
            'Kelas': d.kelas,
            'Nama Siswa': d.namaSiswa,
            'Total Hadir': d.Hadir,
            'Total Sakit': d.Sakit,
            'Total Izin': d.Izin,
            'Total Alpa': d.Alpa,
            'Total Skorsing': d.Skorsing,
            'Total': d.Total
        }));
        sheetName = 'Rekap Total Absensi';
    }

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const fileName = `absensi_${type}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    showToast(`Data ${type} berhasil diekspor ke Excel!`, 'success');
}

/**
 * Mengekspor ke format PDF (.pdf)
 * PERUBAHAN: Dihapus Ringkasan Statistik untuk Laporan Harian. Ditambahkan kolom Skorsing dan Total untuk Laporan Total.
 */
function exportToPdf(data, type) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape'); 
    
    let tableColumn;
    let tableRows = [];
    let title;
    
    if (type === 'harian') {
        // Format Harian: Daftar per kehadiran
        title = "Laporan Absensi Siswa Harian";
        tableColumn = ["No.", "Tanggal", "Kelas", "Nama Siswa", "Status"];
        
        data.forEach((d, index) => {
            tableRows.push([
                index + 1,
                d.tanggal,
                d.kelas,
                d.namaSiswa,
                d.status
            ]);
        });
        
        // Ringkasan Statistik DIHAPUS

    } else if (type === 'total') {
        // Format Total: Ringkasan per siswa
        title = "Laporan Rekap Total Absensi Siswa";
        tableColumn = ["No.", "Kelas", "Nama Siswa", "Hadir", "Sakit", "Izin", "Alpa", "Skorsing", "Total"];
        
        data.forEach((d, index) => {
            tableRows.push([
                index + 1,
                d.kelas,
                d.namaSiswa,
                d.Hadir,
                d.Sakit,
                d.Izin,
                d.Alpa,
                d.Skorsing,
                d.Total
            ]);
        });
    }

    // Tambahkan Judul
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    doc.setFontSize(12);
    doc.text(`SMP MANGUN JAYA 01 - Tanggal Cetak: ${formatDate(new Date())}`, 14, 27);
    
    // Tambahkan tabel
    doc.autoTable(tableColumn, tableRows, { 
        startY: 35,
        headStyles: { fillColor: [44, 90, 160] }, 
        theme: 'grid',
        styles: { fontSize: 10 }
    });
    
    const fileName = `absensi_${type}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    showToast(`Data ${type} berhasil diekspor ke PDF!`, 'success');
}

// ===================================================================
// UTILITAS (Format Tanggal & Toast)
// ===================================================================

/**
 * Memformat objek Date menjadi string tanggal lokal Indonesia
 */
function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
}

/**
 * Menampilkan notifikasi singkat (toast)
 */
function showToast(message, type) {
    toastMessage.textContent = message;
    
    switch(type) {
        case 'success':
            toastIcon.className = 'fas fa-check-circle';
            toast.style.backgroundColor = '#10b981';
            break;
        case 'error':
            toastIcon.className = 'fas fa-exclamation-circle';
            toast.style.backgroundColor = '#ef4444';
            break;
        case 'warning':
            toastIcon.className = 'fas fa-exclamation-triangle';
            toast.style.backgroundColor = '#f59e0b';
            break;
        default:
            toastIcon.className = 'fas fa-info-circle';
            toast.style.backgroundColor = '#2c5aa0';
    }

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}