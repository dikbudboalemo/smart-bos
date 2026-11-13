/**
 * ============================================================================
 * SMART-BOS — SISTEM MANAJEMEN ADMINISTRASI REKONSILIASI TERPADU BOS
 * "Kelola BOS Lebih Mudah, Akurat dan Terpercaya"
 * Dinas Pendidikan dan Kebudayaan Kabupaten Boalemo — Tahun Anggaran 2026
 * File 1: Code.gs (Backend Lengkap & Tersinkronisasi dengan Database 190 Sekolah)
 * ============================================================================
 */

const CONFIG = {
  APP_NAME: 'SMART-BOS',
  APP_FULL_TITLE: 'SMART-BOS - Sistem Manajemen Administrasi Rekonsiliasi Terpadu BOS',
  APP_TAGLINE: 'Kelola BOS Lebih Mudah, Akurat dan Terpercaya',
  APP_LOGO_URL: 'https://i.ibb.co.com/DHKyLRYp/a96772c7-3a62-4333-b1c6-2765aa0fe2b8.png',
  FOOTER_LOGO_URL: 'https://i.ibb.co.com/9mjcFmhN/logo-dikbud.png',
  TARGET_PARENT_FOLDER_ID: '1zGeEDPl6aNusAbQMTLiEQdVSid4vTypM',
  DB_NAME: 'DATABASE_SMARTBOS_2026_BOALEMO',
  FOLDER_DOKUMEN_NAMA: 'DOKUMEN_SMARTBOS_2026_BOALEMO',
  TAHUN_ANGGARAN: '2026',
  LOCK_TIMEOUT_MINUTES: 15
};

const BULAN_LIST = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Entry Point Web App
 */
function doGet(e) {
  initDatabase();
  const template = HtmlService.createTemplateFromFile('Index');
  template.config = JSON.stringify({
    appName: CONFIG.APP_NAME,
    appFullTitle: CONFIG.APP_FULL_TITLE,
    appTagline: CONFIG.APP_TAGLINE,
    appLogoUrl: CONFIG.APP_LOGO_URL,
    footerLogoUrl: CONFIG.FOOTER_LOGO_URL,
    tahun: CONFIG.TAHUN_ANGGARAN,
    bulanList: BULAN_LIST
  });

  return template.evaluate()
    .setTitle(CONFIG.APP_NAME + ' | Dinas Pendidikan dan Kebudayaan Kab. Boalemo')
    .setFaviconUrl(CONFIG.APP_LOGO_URL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Menghubungkan ke Spreadsheet Database Anda
 */
function getDatabaseSpreadsheet() {
  const props = PropertiesService.getScriptProperties();
  let ssId = props.getProperty('DB_SPREADSHEET_ID');
  let ss = null;

  if (ssId) {
    try {
      ss = SpreadsheetApp.openById(ssId);
    } catch (e) {
      ss = null;
    }
  }

  if (!ss) {
    const parentFolder = DriveApp.getFolderById(CONFIG.TARGET_PARENT_FOLDER_ID);
    const files = parentFolder.getFilesByName(CONFIG.DB_NAME);
    if (files.hasNext()) {
      ss = SpreadsheetApp.open(files.next());
    } else {
      ss = SpreadsheetApp.create(CONFIG.DB_NAME);
      const file = DriveApp.getFileById(ss.getId());
      file.moveTo(parentFolder);
    }
    props.setProperty('DB_SPREADSHEET_ID', ss.getId());
  }
  return ss;
}

/**
 * Menghubungkan ke Folder Utama Penyimpanan Dokumen BKU Sekolah
 */
function getMainDocFolder() {
  const props = PropertiesService.getScriptProperties();
  let folderId = props.getProperty('DOC_FOLDER_ID');
  let folder = null;

  if (folderId) {
    try {
      folder = DriveApp.getFolderById(folderId);
    } catch (e) {
      folder = null;
    }
  }

  if (!folder) {
    const parentFolder = DriveApp.getFolderById(CONFIG.TARGET_PARENT_FOLDER_ID);
    const folders = parentFolder.getFoldersByName(CONFIG.FOLDER_DOKUMEN_NAMA);
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = parentFolder.createFolder(CONFIG.FOLDER_DOKUMEN_NAMA);
    }
    props.setProperty('DOC_FOLDER_ID', folder.getId());
  }
  return folder;
}

/**
 * Inisialisasi Sheet Database (Menjaga Sheet USERS Asli Anda Tetap Utuh)
 */
function initDatabase() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;

  try {
    const ss = getDatabaseSpreadsheet();

    // 1. Sheet USERS (12 Kolom sesuai struktur asli Anda)
    let sheetUsers = ss.getSheetByName('USERS');
    if (!sheetUsers) {
      sheetUsers = ss.insertSheet('USERS');
      sheetUsers.appendRow([
        'UserID', 'Username', 'Password', 'Role', 'NamaLengkap',
        'Sekolah', 'No', 'Jenjang', 'Kecamatan', 'StatusAkun', 'LastLogin', 'CreatedAt'
      ]);
      sheetUsers.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#1e3a8a').setFontColor('#ffffff');
    }

    // 2. Sheet REKONSILIASI (Menyimpan Angka, Status Kunci, Ajuan Revisi, Verifikator & Anti-Bentrok)
    let sheetRekon = ss.getSheetByName('REKONSILIASI');
    if (!sheetRekon) {
      sheetRekon = ss.insertSheet('REKONSILIASI');
      const headers = [
        'REKON_ID', 'KODE_SEKOLAH', 'NAMA_SEKOLAH', 'KECAMATAN', 'JENJANG', 'BULAN', 'BULAN_INDEX',
        // Bagian 1: Saldo Awal & Pajak Terhutang 2019-2025
        'SA_TUNAI', 'SA_BANK', 'SA_PAJAK_TERHUTANG',
        // Bagian 2: Penambahan Dana & Pungutan Pajak 2026
        'TERIMA_BOS_TAHAP1', 'TERIMA_BOS_TAHAP2', 'TERIMA_JASA_GIRO', 'PUNGUT_PAJAK',
        // Bagian 3: Penarikan Tunai & Belanja Non-Tunai CMS/Transfer
        'TARIK_TUNAI', 'BELANJA_NONTUNAI',
        // Bagian 4: Pengurangan / Realisasi Belanja & Setoran Pajak
        'BELANJA_PEGAWAI', 'BELANJA_BARANG_JASA', 'BELANJA_MODAL', 'SETOR_PAJAK', 'SETOR_JASA_GIRO',
        // Bagian 5: Hasil Perhitungan Otomatis Saldo Akhir & Pajak
        'TOTAL_SALDO_AWAL', 'TOTAL_PENERIMAAN', 'TOTAL_BELANJA', 'SK_TUNAI', 'SK_BANK', 'TOTAL_SALDO_AKHIR', 'SISA_PAJAK',
        // Tata Kelola: Status Rekon, Auto-Lock, Ajuan Revisi, Verifikator, & Anti-Bentrok
        'STATUS_REKON',         // MENUNGGU_REKON | TERVERIFIKASI
        'IS_LOCKED',            // TRUE | FALSE
        'REVISI_STATUS',        // NONE | DIAJUKAN | DIIZINKAN | DITOLAK
        'REVISI_ALASAN',
        'REVISI_TGL_AJUAN',
        'REVISI_DIPROSES_OLEH',
        'CATATAN_VERIFIKATOR',
        'VERIFIKATOR_NAMA',
        'VERIFIKATOR_TGL',
        'KODE_PENGESAHAN',
        'ACTIVE_REVIEWER',
        'ACTIVE_REVIEWER_TIME',
        'LAST_UPDATED_BY',
        'LAST_UPDATED_AT'
      ];
      sheetRekon.appendRow(headers);
      sheetRekon.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#0f172a').setFontColor('#ffffff');
    }

    // 3. Sheet DOKUMEN (BKU ARKAS PDF, BKU Manual Excel, Rekening Koran, Bukti Pajak)
    let sheetDok = ss.getSheetByName('DOKUMEN');
    if (!sheetDok) {
      sheetDok = ss.insertSheet('DOKUMEN');
      sheetDok.appendRow([
        'DOK_ID', 'KODE_SEKOLAH', 'NAMA_SEKOLAH', 'BULAN', 'JENIS_DOKUMEN',
        'NAMA_FILE', 'FILE_ID', 'PREVIEW_URL', 'DOWNLOAD_URL', 'UPLOADED_AT'
      ]);
      sheetDok.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#1e3a8a').setFontColor('#ffffff');
    }

    // 4. Sheet AUDIT_LOG (Jejak Aktivitas Lengkap)
    let sheetLog = ss.getSheetByName('AUDIT_LOG');
    if (!sheetLog) {
      sheetLog = ss.insertSheet('AUDIT_LOG');
      sheetLog.appendRow([
        'LOG_ID', 'WAKTU', 'ACTOR_ROLE', 'ACTOR_NAME', 'KODE_SEKOLAH', 'NAMA_SEKOLAH', 'BULAN', 'AKSI', 'DETAIL'
      ]);
      sheetLog.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#334155').setFontColor('#ffffff');
    }

    const defaultSheet = ss.getSheetByName('Sheet1');
    if (defaultSheet && ss.getSheets().length > 1) {
      ss.deleteSheet(defaultSheet);
    }
  } finally {
    lock.releaseLock();
  }
}

/**
 * Helper: Mencatat Aktivitas ke Sheet AUDIT_LOG
 */
function writeAuditLog(role, actorName, kodeSekolah, namaSekolah, bulan, aksi, detail) {
  try {
    const ss = getDatabaseSpreadsheet();
    const sheetLog = ss.getSheetByName('AUDIT_LOG');
    const nowStr = Utilities.formatDate(new Date(), 'Asia/Makassar', 'dd/MM/yyyy HH:mm:ss');
    const logId = 'LOG-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000);
    sheetLog.appendRow([logId, nowStr, role, actorName, kodeSekolah || '-', namaSekolah || '-', bulan || '-', aksi, detail]);
  } catch (e) {
    Logger.log('AuditLog Error: ' + e.message);
  }
}

/**
 * Helper: Menyeragamkan nama kecamatan ("Kecamatan Botumoito" -> "Botumoito")
 */
function normalizeKecamatan(rawKec) {
  return String(rawKec || '').replace(/^Kecamatan\s+/i, '').trim();
}

/**
 * ============================================================================
 * 1. AUTENTIKASI LOGIN (SESUAI USERNAME & PASSWORD ASLI DATABASE ANDA)
 * Kolom Sheet USERS:
 * [0]UserID, [1]Username, [2]Password, [3]Role, [4]NamaLengkap,
 * [5]Sekolah, [6]No, [7]Jenjang, [8]Kecamatan, [9]StatusAkun, [10]LastLogin, [11]CreatedAt
 * ============================================================================
 */
function loginUser(username, password, petugasName) {
  initDatabase();
  const ss = getDatabaseSpreadsheet();
  const sheetUsers = ss.getSheetByName('USERS');
  const data = sheetUsers.getDataRange().getValues();

  const cleanUser = String(username || '').trim().toLowerCase();
  const cleanPass = String(password || '').trim();
  const cleanPetugas = String(petugasName || '').trim();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (String(row[1]).trim().toLowerCase() === cleanUser && String(row[2]).trim() === cleanPass) {
      if (String(row[9]).trim().toUpperCase() !== 'AKTIF') {
        return { success: false, message: 'Akun Anda berstatus NON-AKTIF. Hubungi Dinas Pendidikan Kab. Boalemo.' };
      }

      const rawRole = String(row[3]).trim().toUpperCase();
      let appRole = rawRole;
      if (rawRole === 'SUPER_ADMIN' || rawRole === 'SUPERADMIN') {
        appRole = 'SUPER_ADMIN';
      } else if (rawRole === 'ADMIN_KEC' || rawRole === 'ADMIN') {
        appRole = 'ADMIN_KEC';
      } else {
        appRole = 'SEKOLAH';
      }

      if (appRole === 'SUPER_ADMIN' && !cleanPetugas) {
        return {
          success: false,
          message: 'Wajib mengisi Nama Petugas Verifikator sebelum masuk ke akun Super Admin.'
        };
      }

      // Catat waktu login terakhir pada kolom LastLogin (Kolom ke-11)
      const nowLoginStr = Utilities.formatDate(new Date(), 'Asia/Makassar', 'dd/MM/yyyy HH:mm');
      sheetUsers.getRange(i + 1, 11).setValue(nowLoginStr);

      const kodeAkun = String(row[1]).trim(); // contoh: sekolah001, admin.botumoito, superadmin
      const namaLengkap = String(row[4] || '').trim();
      const namaSekolah = String(row[5] || row[4] || '').trim();
      const kecRaw = String(row[8] || '').trim();
      const kecBersih = normalizeKecamatan(kecRaw);
      const displayActor = appRole === 'SUPER_ADMIN' ? cleanPetugas : namaLengkap;

      writeAuditLog(appRole, displayActor, kodeAkun, namaSekolah, '-', 'LOGIN', 'Berhasil masuk ke aplikasi SMART-BOS');

      return {
        success: true,
        user: {
          userId: String(row[0] || ''),
          username: kodeAkun,
          role: appRole,
          namaLengkap: namaLengkap,
          namaInstansi: namaSekolah,
          kodeSekolah: kodeAkun, // Kunci relasi unik (sekolah001..sekolah190)
          noUrut: String(row[6] || ''),
          jenjang: String(row[7] || ''),
          kecamatan: kecBersih,
          kecamatanAsli: kecRaw,
          petugasName: appRole === 'SUPER_ADMIN' ? cleanPetugas : namaLengkap
        }
      };
    }
  }

  return { success: false, message: 'Username atau Password tidak sesuai!' };
}

/**
 * ============================================================================
 * 2. DATA SEKOLAH: LOAD BULAN, AUTO-CARRY FORWARD SALDO, DOKUMEN & STATUS KUNCI
 * ============================================================================
 */
function getSekolahMonthData(kodeSekolah, bulan) {
  const ss = getDatabaseSpreadsheet();
  const sheetRekon = ss.getSheetByName('REKONSILIASI');
  const sheetDok = ss.getSheetByName('DOKUMEN');
  const bulanIdx = BULAN_LIST.indexOf(bulan);

  const rekonRows = sheetRekon.getDataRange().getValues();
  let currentData = null;
  let prevMonthSaldo = { saTunai: 0, saBank: 0, saPajakTerhutang: 0, sourceBulan: null };

  for (let i = 1; i < rekonRows.length; i++) {
    const r = rekonRows[i];
    if (String(r[1]).trim().toLowerCase() === String(kodeSekolah).trim().toLowerCase()) {
      if (String(r[5]) === bulan) {
        currentData = mapRekonRowToObj(r);
      }
      if (bulanIdx > 0 && String(r[5]) === BULAN_LIST[bulanIdx - 1]) {
        prevMonthSaldo = {
          saTunai: Number(r[24]) || 0,
          saBank: Number(r[25]) || 0,
          saPajakTerhutang: Number(r[27]) || 0,
          sourceBulan: BULAN_LIST[bulanIdx - 1]
        };
      }
    }
  }

  // Daftar dokumen bulan terpilih
  const dokRows = sheetDok.getDataRange().getValues();
  const dokumenList = [];
  for (let j = 1; j < dokRows.length; j++) {
    const d = dokRows[j];
    if (String(d[1]).trim().toLowerCase() === String(kodeSekolah).trim().toLowerCase() && String(d[3]) === bulan) {
      dokumenList.push({
        dokId: d[0],
        jenis: d[4],
        namaFile: d[5],
        fileId: d[6],
        previewUrl: d[7],
        downloadUrl: d[8],
        uploadedAt: d[9]
      });
    }
  }

  // Ringkasan status 12 bulan untuk sekolah ini
  const status12Bulan = BULAN_LIST.map((bName) => {
    const found = rekonRows.slice(1).find(r =>
      String(r[1]).trim().toLowerCase() === String(kodeSekolah).trim().toLowerCase() && String(r[5]) === bName
    );
    if (!found) {
      return { bulan: bName, status: 'BELUM_INPUT', isLocked: false, revisiStatus: 'NONE', kodePengesahan: '' };
    }
    return {
      bulan: bName,
      status: found[28],
      isLocked: String(found[29]).toUpperCase() === 'TRUE',
      revisiStatus: found[30] || 'NONE',
      kodePengesahan: found[37] || ''
    };
  });

  return {
    success: true,
    data: currentData,
    prevMonthSaldo: prevMonthSaldo,
    dokumenList: dokumenList,
    status12Bulan: status12Bulan
  };
}

function mapRekonRowToObj(r) {
  return {
    rekonId: r[0],
    kodeSekolah: String(r[1]),
    namaSekolah: r[2],
    kecamatan: r[3],
    jenjang: r[4],
    bulan: r[5],
    bulanIndex: Number(r[6]),
    // Bagian 1
    saTunai: Number(r[7]) || 0,
    saBank: Number(r[8]) || 0,
    saPajakTerhutang: Number(r[9]) || 0,
    // Bagian 2
    terimaBosTahap1: Number(r[10]) || 0,
    terimaBosTahap2: Number(r[11]) || 0,
    terimaJasaGiro: Number(r[12]) || 0,
    pungutPajak: Number(r[13]) || 0,
    // Bagian 3
    tarikTunai: Number(r[14]) || 0,
    belanjaNonTunai: Number(r[15]) || 0,
    // Bagian 4
    belanjaPegawai: Number(r[16]) || 0,
    belanjaBarangJasa: Number(r[17]) || 0,
    belanjaModal: Number(r[18]) || 0,
    setorPajak: Number(r[19]) || 0,
    setorJasaGiro: Number(r[20]) || 0,
    // Bagian 5
    totalSaldoAwal: Number(r[21]) || 0,
    totalPenerimaan: Number(r[22]) || 0,
    totalBelanja: Number(r[23]) || 0,
    skTunai: Number(r[24]) || 0,
    skBank: Number(r[25]) || 0,
    totalSaldoAkhir: Number(r[26]) || 0,
    sisaPajak: Number(r[27]) || 0,
    // Status & Lock
    statusRekon: r[28] || 'MENUNGGU_REKON',
    isLocked: String(r[29]).toUpperCase() === 'TRUE',
    revisiStatus: r[30] || 'NONE',
    revisiAlasan: r[31] || '',
    revisiTglAjuan: r[32] || '',
    revisiDiprosesOleh: r[33] || '',
    catatanVerifikator: r[34] || '',
    verifikatorNama: r[35] || '',
    verifikatorTgl: r[36] || '',
    kodePengesahan: r[37] || '',
    activeReviewer: r[38] || '',
    activeReviewerTime: r[39] || '',
    lastUpdatedBy: r[40] || '',
    lastUpdatedAt: r[41] || ''
  };
}

/**
 * ============================================================================
 * 3. UPLOAD & HAPUS DOKUMEN PENDUKUNG (DENGAN PENGECEKAN STATUS KUNCI)
 * ============================================================================
 */
function uploadDokumenSekolah(payload) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    return { success: false, message: 'Server sedang sibuk memproses unggahan lain. Silakan coba beberapa detik lagi.' };
  }

  try {
    const ss = getDatabaseSpreadsheet();
    const sheetRekon = ss.getSheetByName('REKONSILIASI');
    const rekonRows = sheetRekon.getDataRange().getValues();

    for (let i = 1; i < rekonRows.length; i++) {
      if (String(rekonRows[i][1]).trim().toLowerCase() === String(payload.kodeSekolah).trim().toLowerCase() && String(rekonRows[i][5]) === payload.bulan) {
        if (String(rekonRows[i][29]).toUpperCase() === 'TRUE') {
          return {
            success: false,
            message: 'Data dan dokumen bulan ' + payload.bulan + ' sudah TERKUNCI. Ajukan izin revisi ke Super Admin terlebih dahulu untuk mengubah dokumen.'
          };
        }
      }
    }

    const mainFolder = getMainDocFolder();
    const folderSekolahName = payload.kodeSekolah.toUpperCase() + '_' + payload.namaSekolah.replace(/[^a-zA-Z0-9]/g, '_');
    const subFolders = mainFolder.getFoldersByName(folderSekolahName);
    const sekolahFolder = subFolders.hasNext() ? subFolders.next() : mainFolder.createFolder(folderSekolahName);

    const bulanFolders = sekolahFolder.getFoldersByName(payload.bulan);
    const bulanFolder = bulanFolders.hasNext() ? bulanFolders.next() : sekolahFolder.createFolder(payload.bulan);

    const decoded = Utilities.base64Decode(payload.base64Data);
    const blob = Utilities.newBlob(decoded, payload.mimeType, payload.fileName);
    const file = bulanFolder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const fileId = file.getId();
    const previewUrl = 'https://drive.google.com/file/d/' + fileId + '/preview';
    const downloadUrl = 'https://drive.google.com/uc?export=download&id=' + fileId;
    const nowStr = Utilities.formatDate(new Date(), 'Asia/Makassar', 'dd/MM/yyyy HH:mm:ss');
    const dokId = 'DOK-' + new Date().getTime();

    const sheetDok = ss.getSheetByName('DOKUMEN');
    sheetDok.appendRow([
      dokId, payload.kodeSekolah, payload.namaSekolah, payload.bulan, payload.jenisDokumen,
      payload.fileName, fileId, previewUrl, downloadUrl, nowStr
    ]);

    writeAuditLog('SEKOLAH', payload.namaSekolah, payload.kodeSekolah, payload.namaSekolah, payload.bulan, 'UPLOAD_DOKUMEN', payload.jenisDokumen + ': ' + payload.fileName);

    return {
      success: true,
      dokumen: {
        dokId: dokId,
        jenis: payload.jenisDokumen,
        namaFile: payload.fileName,
        fileId: fileId,
        previewUrl: previewUrl,
        downloadUrl: downloadUrl,
        uploadedAt: nowStr
      }
    };
  } catch (e) {
    return { success: false, message: 'Gagal mengunggah file: ' + e.message };
  } finally {
    lock.releaseLock();
  }
}

function hapusDokumenSekolah(dokId, kodeSekolah, namaSekolah, bulan) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return { success: false, message: 'Server sibuk, coba lagi.' };

  try {
    const ss = getDatabaseSpreadsheet();
    const sheetRekon = ss.getSheetByName('REKONSILIASI');
    const rekonRows = sheetRekon.getDataRange().getValues();

    for (let i = 1; i < rekonRows.length; i++) {
      if (String(rekonRows[i][1]).trim().toLowerCase() === String(kodeSekolah).trim().toLowerCase() && String(rekonRows[i][5]) === bulan) {
        if (String(rekonRows[i][29]).toUpperCase() === 'TRUE') {
          return { success: false, message: 'Dokumen tidak dapat dihapus karena data bulan ' + bulan + ' sudah terkunci.' };
        }
      }
    }

    const sheetDok = ss.getSheetByName('DOKUMEN');
    const dokRows = sheetDok.getDataRange().getValues();
    for (let j = 1; j < dokRows.length; j++) {
      if (String(dokRows[j][0]) === String(dokId) && String(dokRows[j][1]).trim().toLowerCase() === String(kodeSekolah).trim().toLowerCase()) {
        const fileId = dokRows[j][6];
        const fileName = dokRows[j][5];
        try { DriveApp.getFileById(fileId).setTrashed(true); } catch (err) {}
        sheetDok.deleteRow(j + 1);
        writeAuditLog('SEKOLAH', namaSekolah, kodeSekolah, namaSekolah, bulan, 'HAPUS_DOKUMEN', fileName);
        return { success: true };
      }
    }
    return { success: false, message: 'Dokumen tidak ditemukan.' };
  } finally {
    lock.releaseLock();
  }
}

/**
 * ============================================================================
 * 4. SIMPAN REKONSILIASI & OTOMATIS MENGUNCI FORM (AUTO-LOCK)
 * ============================================================================
 */
function simpanRekonsiliasiSekolah(form) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    return { success: false, message: 'Antrean server padat. Silakan tekan Simpan sekali lagi.' };
  }

  try {
    const ss = getDatabaseSpreadsheet();
    const sheetRekon = ss.getSheetByName('REKONSILIASI');
    const sheetDok = ss.getSheetByName('DOKUMEN');

    // Validasi wajib unggah BKU ARKAS (PDF) dan BKU Manual (Excel)
    const dokRows = sheetDok.getDataRange().getValues();
    let hasArkas = false;
    let hasManual = false;
    for (let d = 1; d < dokRows.length; d++) {
      if (String(dokRows[d][1]).trim().toLowerCase() === String(form.kodeSekolah).trim().toLowerCase() && String(dokRows[d][3]) === form.bulan) {
        const jenis = String(dokRows[d][4]).toUpperCase();
        if (jenis.indexOf('ARKAS') !== -1) hasArkas = true;
        if (jenis.indexOf('MANUAL') !== -1) hasManual = true;
      }
    }
    if (!hasArkas || !hasManual) {
      return {
        success: false,
        message: 'Wajib mengunggah minimal dokumen [1. BKU Arkas (PDF)] dan [2. BKU Manual (Excel)] sebelum menyimpan rekonsiliasi!'
      };
    }

    const rows = sheetRekon.getDataRange().getValues();
    let targetRowIndex = -1;
    let existingRow = null;

    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][1]).trim().toLowerCase() === String(form.kodeSekolah).trim().toLowerCase() && String(rows[i][5]) === form.bulan) {
        targetRowIndex = i + 1;
        existingRow = rows[i];
        break;
      }
    }

    if (existingRow && String(existingRow[29]).toUpperCase() === 'TRUE') {
      return {
        success: false,
        message: 'Form bulan ' + form.bulan + ' dalam status TERKUNCI. Silakan ajukan izin perubahan data ke Super Admin terlebih dahulu.'
      };
    }

    const saTunai = Number(form.saTunai) || 0;
    const saBank = Number(form.saBank) || 0;
    const saPajakTerhutang = Number(form.saPajakTerhutang) || 0;

    const terimaBosTahap1 = Number(form.terimaBosTahap1) || 0;
    const terimaBosTahap2 = Number(form.terimaBosTahap2) || 0;
    const terimaJasaGiro = Number(form.terimaJasaGiro) || 0;
    const pungutPajak = Number(form.pungutPajak) || 0;

    const tarikTunai = Number(form.tarikTunai) || 0;
    const belanjaNonTunai = Number(form.belanjaNonTunai) || 0;

    const belanjaPegawai = Number(form.belanjaPegawai) || 0;
    const belanjaBarangJasa = Number(form.belanjaBarangJasa) || 0;
    const belanjaModal = Number(form.belanjaModal) || 0;
    const setorPajak = Number(form.setorPajak) || 0;
    const setorJasaGiro = Number(form.setorJasaGiro) || 0;

    const totalSaldoAwal = saTunai + saBank;
    const totalPenerimaan = terimaBosTahap1 + terimaBosTahap2 + terimaJasaGiro;
    const totalBelanja = belanjaPegawai + belanjaBarangJasa + belanjaModal;

    const belanjaTunai = totalBelanja - belanjaNonTunai;
    const skTunai = saTunai + tarikTunai - belanjaTunai;
    const skBank = saBank + totalPenerimaan - tarikTunai - belanjaNonTunai - setorJasaGiro;
    const totalSaldoAkhir = skTunai + skBank;
    const sisaPajak = saPajakTerhutang + pungutPajak - setorPajak;

    const nowStr = Utilities.formatDate(new Date(), 'Asia/Makassar', 'dd/MM/yyyy HH:mm:ss');
    const bulanIndex = BULAN_LIST.indexOf(form.bulan) + 1;
    const rekonId = existingRow ? existingRow[0] : ('REK-' + form.kodeSekolah.toUpperCase() + '-' + bulanIndex);

    const rowValues = [
      rekonId, form.kodeSekolah, form.namaSekolah, normalizeKecamatan(form.kecamatan), form.jenjang, form.bulan, bulanIndex,
      saTunai, saBank, saPajakTerhutang,
      terimaBosTahap1, terimaBosTahap2, terimaJasaGiro, pungutPajak,
      tarikTunai, belanjaNonTunai,
      belanjaPegawai, belanjaBarangJasa, belanjaModal, setorPajak, setorJasaGiro,
      totalSaldoAwal, totalPenerimaan, totalBelanja, skTunai, skBank, totalSaldoAkhir, sisaPajak,
      'MENUNGGU_REKON', // Status kembali menunggu rekon tim dinas
      'TRUE',           // Otomatis terkunci setelah disimpan
      'NONE',           // Reset status revisi
      existingRow ? existingRow[31] : '',
      existingRow ? existingRow[32] : '',
      existingRow ? existingRow[33] : '',
      existingRow ? existingRow[34] : '',
      '',
      '',
      '',
      '',
      '',
      form.namaSekolah,
      nowStr
    ];

    if (targetRowIndex > 0) {
      sheetRekon.getRange(targetRowIndex, 1, 1, rowValues.length).setValues([rowValues]);
      writeAuditLog('SEKOLAH', form.namaSekolah, form.kodeSekolah, form.namaSekolah, form.bulan, 'SIMPAN_REVISI', 'Menyimpan perbaikan data rekonsiliasi & mengunci form otomatis');
    } else {
      sheetRekon.appendRow(rowValues);
      writeAuditLog('SEKOLAH', form.namaSekolah, form.kodeSekolah, form.namaSekolah, form.bulan, 'SIMPAN_BARU', 'Mengirim data rekonsiliasi baru & mengunci form otomatis');
    }

    return {
      success: true,
      message: 'Data Rekonsiliasi bulan ' + form.bulan + ' berhasil disimpan dan otomatis TERKUNCI untuk pemeriksaan Tim Dinas.'
    };
  } catch (e) {
    return { success: false, message: 'Gagal menyimpan data: ' + e.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * ============================================================================
 * 5. PENGAJUAN IZIN REVISI OLEH SEKOLAH & PERSETUJUAN OLEH SUPER ADMIN
 * ============================================================================
 */
function ajukanIzinRevisiSekolah(kodeSekolah, namaSekolah, bulan, alasan) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return { success: false, message: 'Server sibuk, coba sebentar lagi.' };

  try {
    if (!alasan || String(alasan).trim().length < 5) {
      return { success: false, message: 'Tuliskan alasan pengajuan perubahan data secara jelas (minimal 5 karakter).' };
    }

    const ss = getDatabaseSpreadsheet();
    const sheetRekon = ss.getSheetByName('REKONSILIASI');
    const rows = sheetRekon.getDataRange().getValues();
    const nowStr = Utilities.formatDate(new Date(), 'Asia/Makassar', 'dd/MM/yyyy HH:mm:ss');

    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][1]).trim().toLowerCase() === String(kodeSekolah).trim().toLowerCase() && String(rows[i][5]) === bulan) {
        if (String(rows[i][29]).toUpperCase() !== 'TRUE') {
          return { success: false, message: 'Form bulan ' + bulan + ' saat ini sudah terbuka dan dapat langsung diedit.' };
        }
        if (String(rows[i][30]) === 'DIAJUKAN') {
          return { success: false, message: 'Pengajuan izin revisi bulan ' + bulan + ' sudah terkirim dan sedang menunggu persetujuan Super Admin.' };
        }

        const rIdx = i + 1;
        sheetRekon.getRange(rIdx, 31).setValue('DIAJUKAN');
        sheetRekon.getRange(rIdx, 32).setValue(String(alasan).trim());
        sheetRekon.getRange(rIdx, 33).setValue(nowStr);

        writeAuditLog('SEKOLAH', namaSekolah, kodeSekolah, namaSekolah, bulan, 'AJUKAN_REVISI', 'Alasan: ' + String(alasan).trim());
        return {
          success: true,
          message: 'Permohonan izin perubahan data bulan ' + bulan + ' telah dikirim ke Super Admin. Silakan tunggu persetujuan pembukaan kunci.'
        };
      }
    }

    return { success: false, message: 'Data rekonsiliasi bulan ' + bulan + ' belum ditemukan.' };
  } finally {
    lock.releaseLock();
  }
}

function prosesIzinRevisiSuperAdmin(kodeSekolah, bulan, keputusan, petugasName, catatanAdmin) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return { success: false, message: 'Server sibuk, coba lagi.' };

  try {
    const ss = getDatabaseSpreadsheet();
    const sheetRekon = ss.getSheetByName('REKONSILIASI');
    const rows = sheetRekon.getDataRange().getValues();
    const nowStr = Utilities.formatDate(new Date(), 'Asia/Makassar', 'dd/MM/yyyy HH:mm:ss');

    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][1]).trim().toLowerCase() === String(kodeSekolah).trim().toLowerCase() && String(rows[i][5]) === bulan) {
        const rIdx = i + 1;
        const namaSekolah = rows[i][2];

        if (keputusan === 'IZINKAN') {
          sheetRekon.getRange(rIdx, 30).setValue('FALSE');
          sheetRekon.getRange(rIdx, 31).setValue('DIIZINKAN');
          sheetRekon.getRange(rIdx, 34).setValue(petugasName + ' (' + nowStr + ')');
          if (catatanAdmin) sheetRekon.getRange(rIdx, 35).setValue(catatanAdmin);
          writeAuditLog('SUPER_ADMIN', petugasName, kodeSekolah, namaSekolah, bulan, 'IZINKAN_REVISI', 'Membuka kunci form input sekolah. Catatan: ' + (catatanAdmin || '-'));
          return { success: true, message: 'Kunci form ' + namaSekolah + ' (' + bulan + ') telah DIBUKA. Sekolah kini dapat memperbaiki datanya.' };
        } else {
          sheetRekon.getRange(rIdx, 30).setValue('TRUE');
          sheetRekon.getRange(rIdx, 31).setValue('DITOLAK');
          sheetRekon.getRange(rIdx, 34).setValue(petugasName + ' (' + nowStr + ')');
          if (catatanAdmin) sheetRekon.getRange(rIdx, 35).setValue(catatanAdmin);
          writeAuditLog('SUPER_ADMIN', petugasName, kodeSekolah, namaSekolah, bulan, 'TOLAK_REVISI', 'Menolak pengajuan revisi. Alasan: ' + (catatanAdmin || '-'));
          return { success: true, message: 'Pengajuan revisi ' + namaSekolah + ' (' + bulan + ') DITOLAK. Data tetap terkunci.' };
        }
      }
    }
    return { success: false, message: 'Data sekolah tidak ditemukan.' };
  } finally {
    lock.releaseLock();
  }
}

/**
 * ============================================================================
 * 6. DASHBOARD MONITORING (ADMIN KECAMATAN & SUPER ADMIN) + ANTI-BENTROK
 * ============================================================================
 */
function getDashboardMonitoringData(bulanFilter, kecamatanScope) {
  const ss = getDatabaseSpreadsheet();
  const sheetUsers = ss.getSheetByName('USERS');
  const sheetRekon = ss.getSheetByName('REKONSILIASI');
  const sheetDok = ss.getSheetByName('DOKUMEN');
  const sheetLog = ss.getSheetByName('AUDIT_LOG');

  const userRows = sheetUsers.getDataRange().getValues();
  const rekonRows = sheetRekon.getDataRange().getValues();
  const dokRows = sheetDok.getDataRange().getValues();
  const logRows = sheetLog.getDataRange().getValues();

  const bulanAktif = bulanFilter || BULAN_LIST[0];
  const scopeNorm = normalizeKecamatan(kecamatanScope || 'ALL');
  const nowMs = new Date().getTime();

  // Ambil daftar seluruh sekolah aktif dari sheet USERS Anda (190 sekolah)
  const sekolahList = [];
  for (let u = 1; u < userRows.length; u++) {
    const roleU = String(userRows[u][3]).trim().toUpperCase();
    const statusU = String(userRows[u][9]).trim().toUpperCase();
    if (roleU === 'SEKOLAH' && statusU === 'AKTIF') {
      const kecSek = normalizeKecamatan(userRows[u][8]);
      if (scopeNorm !== 'ALL' && scopeNorm !== '' && kecSek.toLowerCase() !== scopeNorm.toLowerCase()) {
        continue;
      }
      sekolahList.push({
        kodeSekolah: String(userRows[u][1]).trim(), // sekolah001..sekolah190
        noUrut: String(userRows[u][6] || ''),
        namaSekolah: String(userRows[u][5] || userRows[u][4]).trim(),
        kecamatan: kecSek,
        jenjang: String(userRows[u][7] || '').trim(),
        bendahara: String(userRows[u][4] || '').trim()
      });
    }
  }

  // Daftar antrean permohonan izin revisi lintas bulan (untuk Super Admin)
  const daftarPengajuanRevisi = [];
  for (let r = 1; r < rekonRows.length; r++) {
    if (String(rekonRows[r][30]) === 'DIAJUKAN') {
      daftarPengajuanRevisi.push({
        kodeSekolah: String(rekonRows[r][1]),
        namaSekolah: rekonRows[r][2],
        kecamatan: rekonRows[r][3],
        bulan: rekonRows[r][5],
        alasan: rekonRows[r][31],
        tglAjuan: rekonRows[r][32]
      });
    }
  }

  let countBelumInput = 0;
  let countMenungguRekon = 0;
  let countSedangDirekon = 0;
  let countTerverifikasi = 0;

  const monitoringRows = sekolahList.map((sek) => {
    const recRow = rekonRows.slice(1).find(r =>
      String(r[1]).trim().toLowerCase() === sek.kodeSekolah.toLowerCase() && String(r[5]) === bulanAktif
    );
    const docs = dokRows.slice(1)
      .filter(d => String(d[1]).trim().toLowerCase() === sek.kodeSekolah.toLowerCase() && String(d[3]) === bulanAktif)
      .map(d => ({
        dokId: d[0],
        jenis: d[4],
        namaFile: d[5],
        previewUrl: d[7],
        downloadUrl: d[8]
      }));

    if (!recRow) {
      countBelumInput++;
      return {
        ...sek,
        bulan: bulanAktif,
        statusTampil: 'BELUM_INPUT',
        activeReviewerValid: '',
        rekonData: null,
        dokumenList: docs
      };
    }

    const obj = mapRekonRowToObj(recRow);

    let activeReviewerValid = '';
    if (obj.activeReviewer && obj.activeReviewerTime) {
      const lockTime = Number(obj.activeReviewerTime);
      if (!isNaN(lockTime) && (nowMs - lockTime) < (CONFIG.LOCK_TIMEOUT_MINUTES * 60 * 1000)) {
        activeReviewerValid = obj.activeReviewer;
      }
    }

    let statusTampil = obj.statusRekon;
    if (obj.statusRekon === 'TERVERIFIKASI') {
      countTerverifikasi++;
    } else if (activeReviewerValid) {
      statusTampil = 'SEDANG_DIREKON';
      countSedangDirekon++;
    } else {
      statusTampil = 'MENUNGGU_REKON';
      countMenungguRekon++;
    }

    return {
      ...sek,
      bulan: bulanAktif,
      statusTampil: statusTampil,
      activeReviewerValid: activeReviewerValid,
      rekonData: obj,
      dokumenList: docs
    };
  });

  const recentLogs = logRows.slice(1).reverse().slice(0, 50).map(l => ({
    logId: l[0],
    waktu: l[1],
    role: l[2],
    actor: l[3],
    kodeSekolah: l[4],
    namaSekolah: l[5],
    bulan: l[6],
    aksi: l[7],
    detail: l[8]
  }));

  return {
    success: true,
    bulan: bulanAktif,
    summary: {
      totalSekolah: sekolahList.length,
      belumInput: countBelumInput,
      menungguRekon: countMenungguRekon,
      sedangDirekon: countSedangDirekon,
      terverifikasi: countTerverifikasi,
      pengajuanRevisiCount: daftarPengajuanRevisi.length
    },
    monitoringRows: monitoringRows,
    daftarPengajuanRevisi: daftarPengajuanRevisi,
    recentLogs: recentLogs
  };
}

/**
 * Penanda anti-bentrok saat petugas Super Admin membuka data sekolah tertentu
 */
function claimReviewSekolah(kodeSekolah, bulan, petugasName) {
  const ss = getDatabaseSpreadsheet();
  const sheetRekon = ss.getSheetByName('REKONSILIASI');
  const rows = sheetRekon.getDataRange().getValues();
  const nowMs = new Date().getTime();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][1]).trim().toLowerCase() === String(kodeSekolah).trim().toLowerCase() && String(rows[i][5]) === bulan) {
      const currentReviewer = String(rows[i][38] || '');
      const currentTime = Number(rows[i][39] || 0);

      if (currentReviewer && currentReviewer !== petugasName && (nowMs - currentTime) < (CONFIG.LOCK_TIMEOUT_MINUTES * 60 * 1000)) {
        return {
          success: false,
          warning: true,
          message: 'Perhatian: Data sekolah ini sedang diperiksa oleh petugas [' + currentReviewer + '].'
        };
      }

      sheetRekon.getRange(i + 1, 39).setValue(petugasName);
      sheetRekon.getRange(i + 1, 40).setValue(String(nowMs));
      return { success: true };
    }
  }
  return { success: false, message: 'Data rekonsiliasi belum tersedia.' };
}

/**
 * Super Admin menyimpan catatan temuan atau mensahkan rekonsiliasi sekolah
 */
function verifikasiRekonsiliasiSuperAdmin(kodeSekolah, bulan, petugasName, catatanVerifikator, sahkanSekarang) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return { success: false, message: 'Server sibuk, coba lagi.' };

  try {
    const ss = getDatabaseSpreadsheet();
    const sheetRekon = ss.getSheetByName('REKONSILIASI');
    const rows = sheetRekon.getDataRange().getValues();
    const nowStr = Utilities.formatDate(new Date(), 'Asia/Makassar', 'dd/MM/yyyy HH:mm:ss');

    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][1]).trim().toLowerCase() === String(kodeSekolah).trim().toLowerCase() && String(rows[i][5]) === bulan) {
        const rIdx = i + 1;
        const namaSekolah = rows[i][2];

        sheetRekon.getRange(rIdx, 35).setValue(catatanVerifikator || '');
        sheetRekon.getRange(rIdx, 39).setValue('');
        sheetRekon.getRange(rIdx, 40).setValue('');

        if (sahkanSekarang) {
          const kodeSah = 'SAH-BOALEMO-' + kodeSekolah.toUpperCase() + '-' + (BULAN_LIST.indexOf(bulan) + 1) + '-' + Math.floor(1000 + Math.random() * 9000);
          sheetRekon.getRange(rIdx, 29).setValue('TERVERIFIKASI');
          sheetRekon.getRange(rIdx, 30).setValue('TRUE');
          sheetRekon.getRange(rIdx, 36).setValue(petugasName);
          sheetRekon.getRange(rIdx, 37).setValue(nowStr);
          sheetRekon.getRange(rIdx, 38).setValue(kodeSah);

          writeAuditLog('SUPER_ADMIN', petugasName, kodeSekolah, namaSekolah, bulan, 'SAHKAN_REKON', 'Disahkan dengan kode ' + kodeSah + '. Catatan: ' + (catatanVerifikator || '-'));
          return {
            success: true,
            message: 'Rekonsiliasi ' + namaSekolah + ' bulan ' + bulan + ' BERHASIL DISAHKAN oleh ' + petugasName + '.'
          };
        } else {
          writeAuditLog('SUPER_ADMIN', petugasName, kodeSekolah, namaSekolah, bulan, 'CATATAN_TEMUAN', 'Memberi catatan temuan: ' + (catatanVerifikator || '-'));
          return {
            success: true,
            message: 'Catatan temuan berhasil disimpan dan langsung tampil di halaman akun ' + namaSekolah + '.'
          };
        }
      }
    }
    return { success: false, message: 'Data rekonsiliasi tidak ditemukan.' };
  } finally {
    lock.releaseLock();
  }
}

/**
 * ============================================================================
 * 7. EXPORT EXCEL FORMAT LAMPIRAN BERITA ACARA REKONSILIASI (SUPER ADMIN)
 * ============================================================================
 */
function generateExcelLampiranBARekon(bulanFilter, kecamatanFilter) {
  const ss = getDatabaseSpreadsheet();
  const sheetUsers = ss.getSheetByName('USERS');
  const sheetRekon = ss.getSheetByName('REKONSILIASI');

  const userRows = sheetUsers.getDataRange().getValues();
  const rekonRows = sheetRekon.getDataRange().getValues();
  const bulanTarget = bulanFilter || 'Januari';
  const kecTarget = normalizeKecamatan(kecamatanFilter || 'SEMUA');

  const sekolahList = [];
  for (let u = 1; u < userRows.length; u++) {
    if (String(userRows[u][3]).trim().toUpperCase() === 'SEKOLAH' && String(userRows[u][9]).trim().toUpperCase() === 'AKTIF') {
      const kecSek = normalizeKecamatan(userRows[u][8]);
      if (kecTarget === 'SEMUA' || kecSek.toLowerCase() === kecTarget.toLowerCase()) {
        sekolahList.push({
          kodeSekolah: String(userRows[u][1]).trim(),
          noUrut: String(userRows[u][6] || ''),
          namaSekolah: String(userRows[u][5] || userRows[u][4]).trim(),
          kecamatan: kecSek,
          jenjang: String(userRows[u][7] || '').trim()
        });
      }
    }
  }

  const exportRows = sekolahList.map((sek, idx) => {
    const rec = rekonRows.slice(1).find(r =>
      String(r[1]).trim().toLowerCase() === sek.kodeSekolah.toLowerCase() && String(r[5]) === bulanTarget
    );
    if (!rec) {
      return {
        no: idx + 1,
        kodeSekolah: sek.kodeSekolah,
        namaSekolah: sek.namaSekolah,
        kecamatan: sek.kecamatan,
        jenjang: sek.jenjang,
        saTunai: 0, saBank: 0, totalSaldoAwal: 0, saPajak: 0,
        terimaTahap1: 0, terimaTahap2: 0, jasaGiro: 0, totalPenerimaan: 0, pungutPajak: 0,
        tarikTunai: 0, belanjaNonTunai: 0,
        belanjaPegawai: 0, belanjaBarangJasa: 0, belanjaModal: 0, totalBelanja: 0,
        setorPajak: 0, setorJasaGiro: 0,
        skTunai: 0, skBank: 0, totalSaldoAkhir: 0, sisaPajak: 0,
        statusRekon: 'BELUM INPUT',
        verifikator: '-',
        kodeSah: '-'
      };
    }

    const o = mapRekonRowToObj(rec);
    return {
      no: idx + 1,
      kodeSekolah: sek.kodeSekolah,
      namaSekolah: sek.namaSekolah,
      kecamatan: sek.kecamatan,
      jenjang: sek.jenjang,
      saTunai: o.saTunai,
      saBank: o.saBank,
      totalSaldoAwal: o.totalSaldoAwal,
      saPajak: o.saPajakTerhutang,
      terimaTahap1: o.terimaBosTahap1,
      terimaTahap2: o.terimaBosTahap2,
      jasaGiro: o.terimaJasaGiro,
      totalPenerimaan: o.totalPenerimaan,
      pungutPajak: o.pungutPajak,
      tarikTunai: o.tarikTunai,
      belanjaNonTunai: o.belanjaNonTunai,
      belanjaPegawai: o.belanjaPegawai,
      belanjaBarangJasa: o.belanjaBarangJasa,
      belanjaModal: o.belanjaModal,
      totalBelanja: o.totalBelanja,
      setorPajak: o.setorPajak,
      setorJasaGiro: o.setorJasaGiro,
      skTunai: o.skTunai,
      skBank: o.skBank,
      totalSaldoAkhir: o.totalSaldoAkhir,
      sisaPajak: o.sisaPajak,
      statusRekon: o.statusRekon === 'TERVERIFIKASI' ? 'SAH / TERVERIFIKASI' : 'MENUNGGU REKON',
      verifikator: o.verifikatorNama || '-',
      kodeSah: o.kodePengesahan || '-'
    };
  });

  return {
    success: true,
    bulan: bulanTarget,
    kecamatan: kecTarget,
    tahun: CONFIG.TAHUN_ANGGARAN,
    tglCetak: Utilities.formatDate(new Date(), 'Asia/Makassar', 'dd MMMM yyyy'),
    rows: exportRows
  };
}