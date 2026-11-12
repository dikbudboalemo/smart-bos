/**
 * ============================================================================
 * SMART-BOS — SISTEM MANAJEMEN ADMINISTRASI REKONSILIASI TERPADU BOS
 * "Kelola BOS Lebih Mudah, Akurat dan Terpercaya"
 * Kabupaten Boalemo - Tahun Anggaran 2026
 * File 1: Code.gs (Backend + Target Folder Drive Khusus + High-Concurrency)
 * ============================================================================
 */

const CONFIG = {
  APP_NAME: 'SMART-BOS',
  APP_FULL_TITLE: 'SMART-BOS — Sistem Manajemen Administrasi Rekonsiliasi Terpadu BOS',
  APP_TAGLINE: 'Kelola BOS Lebih Mudah, Akurat dan Terpercaya',
  APP_LOGO_URL: 'https://i.ibb.co.com/DHKyLRYp/a96772c7-3a62-4333-b1c6-2765aa0fe2b8.png',
  TARGET_PARENT_FOLDER_ID: '1zGeEDPl6aNusAbQMTLiEQdVSid4vTypM',
  DB_NAME: 'DATABASE_SMARTBOS_2026_BOALEMO',
  FOLDER_DOKUMEN_NAMA: 'DOKUMEN_SMARTBOS_2026_BOALEMO',
  BULAN_LIST: [
    { kode: 'JAN', nama: 'Januari', urutan: 1 },
    { kode: 'FEB', nama: 'Februari', urutan: 2 },
    { kode: 'MAR', nama: 'Maret', urutan: 3 },
    { kode: 'APR', nama: 'April', urutan: 4 },
    { kode: 'MEI', nama: 'Mei', urutan: 5 },
    { kode: 'JUN', nama: 'Juni', urutan: 6 },
    { kode: 'JUL', nama: 'Juli', urutan: 7 },
    { kode: 'AGU', nama: 'Agustus', urutan: 8 },
    { kode: 'SEP', nama: 'September', urutan: 9 },
    { kode: 'OKT', nama: 'Oktober', urutan: 10 },
    { kode: 'NOV', nama: 'November', urutan: 11 },
    { kode: 'DES', nama: 'Desember', urutan: 12 }
  ],
  KECAMATAN_LIST: [
    'Kecamatan Mananggu',
    'Kecamatan Botumoito',
    'Kecamatan Tilamuta',
    'Kecamatan Dulupi',
    'Kecamatan Paguyaman',
    'Kecamatan Paguyaman Pantai',
    'Kecamatan Wonosari'
  ]
};

// Master 190 Satuan Pendidikan Kabupaten Boalemo
const MASTER_SEKOLAH_INIT = [
  [1,"SD NEGERI 01 BOTUMOITO","SD","Kecamatan Botumoito"],[2,"SD NEGERI 02 BOTUMOITO","SD","Kecamatan Botumoito"],[3,"SD NEGERI 03 BOTUMOITO","SD","Kecamatan Botumoito"],[4,"SD NEGERI 04 BOTUMOITO","SD","Kecamatan Botumoito"],[5,"SD NEGERI 05 BOTUMOITO","SD","Kecamatan Botumoito"],[6,"SD NEGERI 06 BOTUMOITO","SD","Kecamatan Botumoito"],[7,"SD NEGERI 07 BOTUMOITO","SD","Kecamatan Botumoito"],[8,"SD NEGERI 08 BOTUMOITO","SD","Kecamatan Botumoito"],[9,"SD NEGERI 09 BOTUMOITO","SD","Kecamatan Botumoito"],[10,"SD NEGERI 10 BOTUMOITO","SD","Kecamatan Botumoito"],[11,"SD NEGERI 11 BOTUMOITO","SD","Kecamatan Botumoito"],[12,"SD NEGERI 12 BOTUMOITO","SD","Kecamatan Botumoito"],[13,"SD NEGERI 13 BOTUMOITO","SD","Kecamatan Botumoito"],[14,"SD NEGERI 14 BOTUMOITO","SD","Kecamatan Botumoito"],[15,"SD NEGERI 15 BOTUMOITO","SD","Kecamatan Botumoito"],
  [16,"SD NEGERI 01 DULUPI","SD","Kecamatan Dulupi"],[17,"SD NEGERI 02 DULUPI","SD","Kecamatan Dulupi"],[18,"SD NEGERI 03 DULUPI","SD","Kecamatan Dulupi"],[19,"SD NEGERI 04 DULUPI","SD","Kecamatan Dulupi"],[20,"SD NEGERI 05 DULUPI","SD","Kecamatan Dulupi"],[21,"SD NEGERI 06 DULUPI","SD","Kecamatan Dulupi"],[22,"SD NEGERI 07 DULUPI","SD","Kecamatan Dulupi"],[23,"SD NEGERI 08 DULUPI","SD","Kecamatan Dulupi"],[24,"SD NEGERI 09 DULUPI","SD","Kecamatan Dulupi"],[25,"SD NEGERI 10 DULUPI","SD","Kecamatan Dulupi"],[26,"SD NEGERI 11 DULUPI","SD","Kecamatan Dulupi"],[27,"SD NEGERI 12 DULUPI","SD","Kecamatan Dulupi"],[28,"SD NEGERI 13 DULUPI","SD","Kecamatan Dulupi"],[29,"SD NEGERI 14 DULUPI","SD","Kecamatan Dulupi"],[30,"SD NEGERI 15 DULUPI","SD","Kecamatan Dulupi"],[31,"SD NEGERI 16 DULUPI","SD","Kecamatan Dulupi"],[32,"SD NEGERI 17 DULUPI","SD","Kecamatan Dulupi"],[33,"SD NEGERI 18 DULUPI","SD","Kecamatan Dulupi"],[34,"SD NEGERI 19 DULUPI","SD","Kecamatan Dulupi"],
  [35,"SD NEGERI 01 MANANGGU","SD","Kecamatan Mananggu"],[36,"SD NEGERI 02 MANANGGU","SD","Kecamatan Mananggu"],[37,"SD NEGERI 03 MANANGGU","SD","Kecamatan Mananggu"],[38,"SD NEGERI 04 MANANGGU","SD","Kecamatan Mananggu"],[39,"SD NEGERI 05 MANANGGU","SD","Kecamatan Mananggu"],[40,"SD NEGERI 06 MANANGGU","SD","Kecamatan Mananggu"],[41,"SD NEGERI 07 MANANGGU","SD","Kecamatan Mananggu"],[42,"SD NEGERI 08 MANANGGU","SD","Kecamatan Mananggu"],[43,"SD NEGERI 09 MANANGGU","SD","Kecamatan Mananggu"],[44,"SD NEGERI 10 MANANGGU","SD","Kecamatan Mananggu"],[45,"SD NEGERI 11 MANANGGU","SD","Kecamatan Mananggu"],[46,"SD NEGERI 12 MANANGGU","SD","Kecamatan Mananggu"],[47,"SD NEGERI 13 MANANGGU","SD","Kecamatan Mananggu"],
  [48,"SD NEGERI 01 PAGUYAMAN","SD","Kecamatan Paguyaman"],[49,"SD NEGERI 02 PAGUYAMAN","SD","Kecamatan Paguyaman"],[50,"SD NEGERI 03 PAGUYAMAN","SD","Kecamatan Paguyaman"],[51,"SD NEGERI 04 PAGUYAMAN","SD","Kecamatan Paguyaman"],[52,"SD NEGERI 05 PAGUYAMAN","SD","Kecamatan Paguyaman"],[53,"SD NEGERI 06 PAGUYAMAN","SD","Kecamatan Paguyaman"],[54,"SD NEGERI 07 PAGUYAMAN","SD","Kecamatan Paguyaman"],[55,"SD NEGERI 08 PAGUYAMAN","SD","Kecamatan Paguyaman"],[56,"SD NEGERI 09 PAGUYAMAN","SD","Kecamatan Paguyaman"],[57,"SD NEGERI 10 PAGUYAMAN","SD","Kecamatan Paguyaman"],[58,"SD NEGERI 11 PAGUYAMAN","SD","Kecamatan Paguyaman"],[59,"SD NEGERI 12 PAGUYAMAN","SD","Kecamatan Paguyaman"],[60,"SD NEGERI 13 PAGUYAMAN","SD","Kecamatan Paguyaman"],[61,"SD NEGERI 14 PAGUYAMAN","SD","Kecamatan Paguyaman"],[62,"SD NEGERI 15 PAGUYAMAN","SD","Kecamatan Paguyaman"],[63,"SD NEGERI 16 PAGUYAMAN","SD","Kecamatan Paguyaman"],[64,"SD NEGERI 17 PAGUYAMAN","SD","Kecamatan Paguyaman"],[65,"SD NEGERI 18 PAGUYAMAN","SD","Kecamatan Paguyaman"],[66,"SD NEGERI 19 PAGUYAMAN","SD","Kecamatan Paguyaman"],[67,"SD NEGERI 20 PAGUYAMAN","SD","Kecamatan Paguyaman"],[68,"SD NEGERI 21 PAGUYAMAN","SD","Kecamatan Paguyaman"],[69,"SD NEGERI 22 PAGUYAMAN","SD","Kecamatan Paguyaman"],[70,"SD NEGERI 23 PAGUYAMAN","SD","Kecamatan Paguyaman"],[71,"SD NEGERI 24 PAGUYAMAN","SD","Kecamatan Paguyaman"],[72,"SD NEGERI 25 PAGUYAMAN","SD","Kecamatan Paguyaman"],[73,"SD NEGERI 26 PAGUYAMAN","SD","Kecamatan Paguyaman"],[74,"SD NEGERI 28 PAGUYAMAN","SD","Kecamatan Paguyaman"],[75,"SD NEGERI 29 PAGUYAMAN","SD","Kecamatan Paguyaman"],[76,"SD NEGERI 30 PAGUYAMAN","SD","Kecamatan Paguyaman"],
  [77,"SD NEGERI 01 PAGUYAMAN PANTAI","SD","Kecamatan Paguyaman Pantai"],[78,"SD NEGERI 02 PAGUYAMAN PANTAI","SD","Kecamatan Paguyaman Pantai"],[79,"SD NEGERI 03 PAGUYAMAN PANTAI","SD","Kecamatan Paguyaman Pantai"],[80,"SD NEGERI 04 PAGUYAMAN PANTAI","SD","Kecamatan Paguyaman Pantai"],[81,"SD NEGERI 05 PAGUYAMAN PANTAI","SD","Kecamatan Paguyaman Pantai"],[82,"SD NEGERI 06 PAGUYAMAN PANTAI","SD","Kecamatan Paguyaman Pantai"],[83,"SD NEGERI 07 PAGUYAMAN PANTAI","SD","Kecamatan Paguyaman Pantai"],[84,"SD NEGERI 08 PAGUYAMAN PANTAI","SD","Kecamatan Paguyaman Pantai"],[85,"SD NEGERI 09 PAGUYAMAN PANTAI","SD","Kecamatan Paguyaman Pantai"],[86,"SD NEGERI 10 PAGUYAMAN PANTAI","SD","Kecamatan Paguyaman Pantai"],
  [87,"SD NEGERI 01 TILAMUTA","SD","Kecamatan Tilamuta"],[88,"SD NEGERI 02 TILAMUTA","SD","Kecamatan Tilamuta"],[89,"SD NEGERI 03 TILAMUTA","SD","Kecamatan Tilamuta"],[90,"SD NEGERI 04 TILAMUTA","SD","Kecamatan Tilamuta"],[91,"SD NEGERI 05 TILAMUTA","SD","Kecamatan Tilamuta"],[92,"SD NEGERI 06 TILAMUTA","SD","Kecamatan Tilamuta"],[93,"SD NEGERI 07 TILAMUTA","SD","Kecamatan Tilamuta"],[94,"SD NEGERI 08 TILAMUTA","SD","Kecamatan Tilamuta"],[95,"SD NEGERI 09 TILAMUTA","SD","Kecamatan Tilamuta"],[96,"SD NEGERI 10 TILAMUTA","SD","Kecamatan Tilamuta"],[97,"SD NEGERI 11 TILAMUTA","SD","Kecamatan Tilamuta"],[98,"SD NEGERI 12 TILAMUTA","SD","Kecamatan Tilamuta"],[99,"SD NEGERI 13 TILAMUTA","SD","Kecamatan Tilamuta"],[100,"SD NEGERI 14 TILAMUTA","SD","Kecamatan Tilamuta"],[101,"SD NEGERI 15 TILAMUTA","SD","Kecamatan Tilamuta"],[102,"SD NEGERI 16 TILAMUTA","SD","Kecamatan Tilamuta"],[103,"SD NEGERI 17 TILAMUTA","SD","Kecamatan Tilamuta"],
  [104,"SD NEGERI 01 WONOSARI","SD","Kecamatan Wonosari"],[105,"SD NEGERI 02 WONOSARI","SD","Kecamatan Wonosari"],[106,"SD NEGERI 03 WONOSARI","SD","Kecamatan Wonosari"],[107,"SD NEGERI 04 WONOSARI","SD","Kecamatan Wonosari"],[108,"SD NEGERI 05 WONOSARI","SD","Kecamatan Wonosari"],[109,"SD NEGERI 06 WONOSARI","SD","Kecamatan Wonosari"],[110,"SD NEGERI 07 WONOSARI","SD","Kecamatan Wonosari"],[111,"SD NEGERI 08 WONOSARI","SD","Kecamatan Wonosari"],[112,"SD NEGERI 09 WONOSARI","SD","Kecamatan Wonosari"],[113,"SD NEGERI 10 WONOSARI","SD","Kecamatan Wonosari"],[114,"SD NEGERI 11 WONOSARI","SD","Kecamatan Wonosari"],[115,"SD NEGERI 12 WONOSARI","SD","Kecamatan Wonosari"],[116,"SD NEGERI 13 WONOSARI","SD","Kecamatan Wonosari"],[117,"SD NEGERI 14 WONOSARI","SD","Kecamatan Wonosari"],[118,"SD NEGERI 15 WONOSARI","SD","Kecamatan Wonosari"],[119,"SD NEGERI 16 WONOSARI","SD","Kecamatan Wonosari"],[120,"SD NEGERI 17 WONOSARI","SD","Kecamatan Wonosari"],[121,"SD NEGERI 18 WONOSARI","SD","Kecamatan Wonosari"],[122,"SD NEGERI 19 WONOSARI","SD","Kecamatan Wonosari"],[123,"SD NEGERI 20 WONOSARI","SD","Kecamatan Wonosari"],[124,"SD NEGERI 21 WONOSARI","SD","Kecamatan Wonosari"],[125,"SD NEGERI 23 WONOSARI","SD","Kecamatan Wonosari"],[126,"SD NEGERI 24 WONOSARI","SD","Kecamatan Wonosari"],[127,"SD NEGERI 25 WONOSARI","SD","Kecamatan Wonosari"],[128,"SD NEGERI 27 WONOSARI","SD","Kecamatan Wonosari"],[129,"SD NEGERI 28 WONOSARI","SD","Kecamatan Wonosari"],[130,"SD NEGERI 29 WONOSARI","SD","Kecamatan Wonosari"],[131,"SD NEGERI 30 WONOSARI","SD","Kecamatan Wonosari"],[132,"SD NEGERI 31 WONOSARI","SD","Kecamatan Wonosari"],
  [133,"SMP NEGERI 1 BOTUMOITO","SMP","Kecamatan Botumoito"],[134,"SMP NEGERI 2 BOTUMOITO","SMP","Kecamatan Botumoito"],[135,"SMP NEGERI 3 BOTUMOITO","SMP","Kecamatan Botumoito"],[136,"SMP NEGERI 4 SATU ATAP BOTUMOITO","SMP","Kecamatan Botumoito"],[137,"SMP NEGERI 5 SATU ATAP BOTUMOITO","SMP","Kecamatan Botumoito"],[138,"SMP NEGERI 6 SATU ATAP BOTUMOITO","SMP","Kecamatan Botumoito"],
  [139,"SMP NEGERI 1 DULUPI","SMP","Kecamatan Dulupi"],[140,"SMP NEGERI 2 DULUPI","SMP","Kecamatan Dulupi"],[141,"SMP NEGERI 3 SATU ATAP DULUPI","SMP","Kecamatan Dulupi"],[142,"SMP NEGERI 4 SATU ATAP DULUPI","SMP","Kecamatan Dulupi"],[143,"SMP NEGERI 5 SATU ATAP DULUPI","SMP","Kecamatan Dulupi"],[144,"SMP NEGERI 6 SATU ATAP DULUPI","SMP","Kecamatan Dulupi"],[145,"SMP NEGERI 7 SATU ATAP DULUPI","SMP","Kecamatan Dulupi"],[146,"SMP NEGERI 8 SATU ATAP DULUPI","SMP","Kecamatan Dulupi"],[147,"SMP NEGERI 9 SATU ATAP DULUPI","SMP","Kecamatan Dulupi"],
  [148,"SMP NEGERI 1 MANANGGU","SMP","Kecamatan Mananggu"],[149,"SMP NEGERI 2 MANANGGU","SMP","Kecamatan Mananggu"],[150,"SMP NEGERI 3 SATU ATAP MANANGGU","SMP","Kecamatan Mananggu"],[151,"SMP NEGERI 4 SATU ATAP MANANGGU","SMP","Kecamatan Mananggu"],
  [152,"SMP NEGERI 1 PAGUYAMAN","SMP","Kecamatan Paguyaman"],[153,"SMP NEGERI 2 PAGUYAMAN","SMP","Kecamatan Paguyaman"],[154,"SMP NEGERI 3 PAGUYAMAN","SMP","Kecamatan Paguyaman"],[155,"SMP NEGERI 4 SATU ATAP PAGUYAMAN","SMP","Kecamatan Paguyaman"],[156,"SMP NEGERI 5 PAGUYAMAN","SMP","Kecamatan Paguyaman"],[157,"SMP NEGERI 6 SATU ATAP PAGUYAMAN","SMP","Kecamatan Paguyaman"],[158,"SMP NEGERI 7 SATU ATAP PAGUYAMAN","SMP","Kecamatan Paguyaman"],[159,"SMP NEGERI 8 SATU ATAP PAGUYAMAN","SMP","Kecamatan Paguyaman"],[160,"SMP NEGERI 9 SATU ATAP PAGUYAMAN","SMP","Kecamatan Paguyaman"],[161,"SMP NEGERI 10 SATU ATAP PAGUYAMAN","SMP","Kecamatan Paguyaman"],[162,"SMP NEGERI 11 SATU ATAP PAGUYAMAN","SMP","Kecamatan Paguyaman"],[163,"SMP NEGERI 12 PAGUYAMAN","SMP","Kecamatan Paguyaman"],
  [164,"SMP NEGERI 1 PAGUYAMAN PANTAI","SMP","Kecamatan Paguyaman Pantai"],[165,"SMP NEGERI 2 PAGUYAMAN PANTAI","SMP","Kecamatan Paguyaman Pantai"],[166,"SMP NEGERI 3 SATU ATAP PAGUYAMAN PANTAI","SMP","Kecamatan Paguyaman Pantai"],[167,"SMP NEGERI 4 SATU ATAP PAGUYAMAN PANTAI","SMP","Kecamatan Paguyaman Pantai"],[168,"SMP NEGERI 5 SATU ATAP PAGUYAMAN PANTAI","SMP","Kecamatan Paguyaman Pantai"],[169,"SMP NEGERI 6 SATU ATAP PAGUYAMAN PANTAI","SMP","Kecamatan Paguyaman Pantai"],
  [170,"SMP NEGERI 1 TILAMUTA","SMP","Kecamatan Tilamuta"],[171,"SMP NEGERI 2 TILAMUTA","SMP","Kecamatan Tilamuta"],[172,"SMP NEGERI 3 SATU ATAP TILAMUTA","SMP","Kecamatan Tilamuta"],[173,"SMP NEGERI 4 TILAMUTA","SMP","Kecamatan Tilamuta"],[174,"SMP NEGERI 5 SATU ATAP TILAMUTA","SMP","Kecamatan Tilamuta"],[175,"SMP NEGERI 6 SATU ATAP TILAMUTA","SMP","Kecamatan Tilamuta"],
  [176,"SMP NEGERI 1 WONOSARI","SMP","Kecamatan Wonosari"],[177,"SMP NEGERI 2 WONOSARI","SMP","Kecamatan Wonosari"],[178,"SMP NEGERI 3 WONOSARI","SMP","Kecamatan Wonosari"],[179,"SMP NEGERI 4 WONOSARI","SMP","Kecamatan Wonosari"],[180,"SMP NEGERI 5 SATU ATAP WONOSARI","SMP","Kecamatan Wonosari"],[181,"SMP NEGERI 6 WONOSARI","SMP","Kecamatan Wonosari"],[182,"SMP NEGERI 7 WONOSARI","SMP","Kecamatan Wonosari"],[183,"SMP NEGERI 8 SATU ATAP WONOSARI","SMP","Kecamatan Wonosari"],[184,"SMP NEGERI 9 SATU ATAP WONOSARI","SMP","Kecamatan Wonosari"],[185,"SMP NEGERI 10 SATU ATAP WONOSARI","SMP","Kecamatan Wonosari"],[186,"SMP NEGERI 11 SATU ATAP WONOSARI","SMP","Kecamatan Wonosari"],[187,"SMP NEGERI 12 WONOSARI","SMP","Kecamatan Wonosari"],
  [188,"SD IT DARUL MADINAH WONOSARI","SWASTA","Kecamatan Wonosari"],[189,"SMP SALAFIYAH BP","SWASTA","Kecamatan Paguyaman"],[190,"SMP IT DARUL MADINAH WONOSARI","SWASTA","Kecamatan Wonosari"]
];

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle(CONFIG.APP_FULL_TITLE)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Mengambil Folder Induk Google Drive Anda (ID: 1zGeEDPl6aNusAbQMTLiEQdVSid4vTypM)
 */
function getParentDriveFolder_() {
  try {
    const f = DriveApp.getFolderById(CONFIG.TARGET_PARENT_FOLDER_ID);
    if (f && !f.isTrashed()) return f;
  } catch (e) {}
  return DriveApp.getRootFolder();
}

/**
 * Mengambil atau membuat Spreadsheet Database di dalam Folder Google Drive Anda
 */
function getDb_() {
  const props = PropertiesService.getScriptProperties();
  let ssId = props.getProperty('DB_SPREADSHEET_ID_V3');
  let ss = null;

  if (ssId) {
    try { ss = SpreadsheetApp.openById(ssId); } catch (err) { ss = null; }
  }

  const parentFolder = getParentDriveFolder_();

  if (!ss) {
    // Cek apakah file DATABASE_SMARTBOS_2026_BOALEMO sudah ada di dalam folder target
    const existingFiles = parentFolder.getFilesByName(CONFIG.DB_NAME);
    if (existingFiles.hasNext()) {
      const f = existingFiles.next();
      ss = SpreadsheetApp.openById(f.getId());
      props.setProperty('DB_SPREADSHEET_ID_V3', ss.getId());
    }
  }

  if (!ss) {
    ss = SpreadsheetApp.create(CONFIG.DB_NAME);
    const file = DriveApp.getFileById(ss.getId());
    // Pindahkan langsung ke folder Google Drive yang Anda tentukan
    file.moveTo(parentFolder);
    props.setProperty('DB_SPREADSHEET_ID_V3', ss.getId());
  }

  return ss;
}

/**
 * Mengambil atau membuat Folder DOKUMEN_SMARTBOS_2026_BOALEMO di dalam Folder Google Drive Anda
 */
function getRootDriveFolder_() {
  const props = PropertiesService.getScriptProperties();
  const folderId = props.getProperty('ROOT_DOC_FOLDER_ID_V3');
  if (folderId) {
    try {
      const f = DriveApp.getFolderById(folderId);
      if (!f.isTrashed()) return f;
    } catch (e) {}
  }

  const parentFolder = getParentDriveFolder_();
  const folders = parentFolder.getFoldersByName(CONFIG.FOLDER_DOKUMEN_NAMA);
  const root = folders.hasNext() ? folders.next() : parentFolder.createFolder(CONFIG.FOLDER_DOKUMEN_NAMA);
  props.setProperty('ROOT_DOC_FOLDER_ID_V3', root.getId());
  return root;
}

/**
 * Inisialisasi sheet inti (Hanya berjalan 1x saat pertama kali, setelah itu instan)
 */
function ensureCoreSheetsInitialized_() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('CORE_INIT_DONE_V3') === 'true') return;

  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    if (props.getProperty('CORE_INIT_DONE_V3') === 'true') return;
    const ss = getDb_();
    getRootDriveFolder_();

    // 1. USERS
    let shUsers = ss.getSheetByName('USERS');
    if (!shUsers) {
      shUsers = ss.insertSheet('USERS');
      shUsers.appendRow([
        'UserID', 'Username', 'Password', 'Role', 'NamaLengkap',
        'SekolahNo', 'Jenjang', 'Kecamatan', 'StatusAkun', 'LastLogin', 'CreatedAt'
      ]);
      shUsers.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#0B4F9F').setFontColor('#ffffff');
      shUsers.setFrozenRows(1);

      const now = new Date();
      const rows = [
        ['USR-SUPER-01', 'superadmin', 'boalemo2026', 'SUPER_ADMIN', 'Super Admin Dinas Pendidikan Kab. Boalemo', '', 'ALL', 'ALL', 'AKTIF', '', now]
      ];
      const kecCodes = [
        ['MANANGGU', 'Kecamatan Mananggu'],
        ['BOTUMOITO', 'Kecamatan Botumoito'],
        ['TILAMUTA', 'Kecamatan Tilamuta'],
        ['DULUPI', 'Kecamatan Dulupi'],
        ['PAGUYAMAN', 'Kecamatan Paguyaman'],
        ['PAGUYAMANPANTAI', 'Kecamatan Paguyaman Pantai'],
        ['WONOSARI', 'Kecamatan Wonosari']
      ];
      kecCodes.forEach((k, i) => {
        rows.push(['USR-ADM-0' + (i + 1), 'admin.' + k[0].toLowerCase(), 'admin2026', 'ADMIN_KEC', 'Admin ' + k[1], '', 'ALL', k[1], 'AKTIF', '', now]);
      });
      MASTER_SEKOLAH_INIT.forEach(s => {
        const noStr = String(s[0]).padStart(3, '0');
        rows.push(['USR-SCH-' + noStr, 'sekolah' + noStr, 'bos' + noStr + '26', 'SEKOLAH', s[1], s[0], s[2], s[3], 'AKTIF', '', now]);
      });
      shUsers.getRange(2, 1, rows.length, 11).setValues(rows);
    }

    // 2. KONTROL_AKSES
    let shAkses = ss.getSheetByName('KONTROL_AKSES');
    if (!shAkses) {
      shAkses = ss.insertSheet('KONTROL_AKSES');
      const header = ['SekolahNo', 'NamaSekolah', 'Jenjang', 'Kecamatan'].concat(CONFIG.BULAN_LIST.map(b => b.kode));
      shAkses.appendRow(header);
      shAkses.getRange(1, 1, 1, header.length).setFontWeight('bold').setBackground('#10B981').setFontColor('#ffffff');
      shAkses.setFrozenRows(1);

      const aksesRows = MASTER_SEKOLAH_INIT.map(s => [
        s[0], s[1], s[2], s[3],
        'TERBUKA', 'TERKUNCI', 'TERKUNCI', 'TERKUNCI', 'TERKUNCI', 'TERKUNCI',
        'TERKUNCI', 'TERKUNCI', 'TERKUNCI', 'TERKUNCI', 'TERKUNCI', 'TERKUNCI'
      ]);
      shAkses.getRange(2, 1, aksesRows.length, header.length).setValues(aksesRows);
    }

    // 3. DOKUMEN_PENDUKUNG
    let shDok = ss.getSheetByName('DOKUMEN_PENDUKUNG');
    if (!shDok) {
      shDok = ss.insertSheet('DOKUMEN_PENDUKUNG');
      shDok.appendRow([
        'DocID', 'SekolahNo', 'NamaSekolah', 'Kecamatan', 'BulanKode',
        'JenisDokumen', 'NamaFile', 'MimeType', 'UkuranKB', 'FileUrl', 'DriveFileId', 'UploadedBy', 'UploadedAt'
      ]);
      shDok.getRange(1, 1, 1, 13).setFontWeight('bold').setBackground('#0284C7').setFontColor('#ffffff');
      shDok.setFrozenRows(1);
    }

    // 4. AUDIT_LOG
    let shLog = ss.getSheetByName('AUDIT_LOG');
    if (!shLog) {
      shLog = ss.insertSheet('AUDIT_LOG');
      shLog.appendRow(['LogID', 'Waktu', 'User', 'Role', 'Aksi', 'Target', 'Detail']);
      shLog.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#1E293B').setFontColor('#ffffff');
      shLog.setFrozenRows(1);
    }

    // 5. VERIFIKASI_REKON (Status Centang Review Super Admin)
    let shVerif = ss.getSheetByName('VERIFIKASI_REKON');
    if (!shVerif) {
      shVerif = ss.insertSheet('VERIFIKASI_REKON');
      const vHeader = ['SekolahNo', 'NamaSekolah', 'Kecamatan'].concat(CONFIG.BULAN_LIST.map(b => b.kode));
      shVerif.appendRow(vHeader);
      shVerif.getRange(1, 1, 1, vHeader.length).setFontWeight('bold').setBackground('#F59E0B').setFontColor('#ffffff');
      shVerif.setFrozenRows(1);
      const vRows = MASTER_SEKOLAH_INIT.map(s => [
        s[0], s[1], s[3],
        'BELUM', 'BELUM', 'BELUM', 'BELUM', 'BELUM', 'BELUM',
        'BELUM', 'BELUM', 'BELUM', 'BELUM', 'BELUM', 'BELUM'
      ]);
      shVerif.getRange(2, 1, vRows.length, vHeader.length).setValues(vRows);
    }

    ensureMonthSheetExists_(ss, 'JAN');

    const defaultSheet = ss.getSheetByName('Sheet1');
    if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
      ss.deleteSheet(defaultSheet);
    }

    props.setProperty('CORE_INIT_DONE_V3', 'true');
  } finally {
    lock.releaseLock();
  }
}

/**
 * Membangun sheet bulan tertentu (90 Kolom A..CL, dukungan 2 angka di belakang koma)
 */
function ensureMonthSheetExists_(ss, bulanKode) {
  let sh = ss.getSheetByName(bulanKode);
  if (sh) return sh;

  const meta = CONFIG.BULAN_LIST.find(b => b.kode === bulanKode);
  if (!meta) throw new Error('Kode bulan tidak valid: ' + bulanKode);

  sh = ss.insertSheet(bulanKode);

  sh.getRange('A1').setValue('LAMPIRAN BERITA ACARA REKONSILIASI').setFontWeight('bold').setFontSize(13);
  sh.getRange('A2').setValue('DANA BANTUAN OPERASIONAL SATUAN PENDIDIKAN (BOSP) TAHUN ANGGARAN 2026 - BULAN ' + meta.nama.toUpperCase()).setFontWeight('bold').setFontSize(11);

  const r3 = new Array(90).fill('');
  const r4 = new Array(90).fill('');
  const r5 = new Array(90).fill('');
  const r6 = [];
  for (let i = 1; i <= 90; i++) r6.push(i);

  r3[0] = 'No'; r3[1] = 'Nama Sekolah'; r3[2] = 'Saldo Awal'; r3[14] = 'Penambahan';
  r3[26] = 'Penarikan Tunai'; r3[31] = 'Belanja Non-Tunai (CMS/Transfer)'; r3[36] = 'Pengurangan';
  r3[66] = 'Saldo Akhir Per Sumber Dana'; r3[78] = 'Total Saldo Akhir';
  r3[82] = 'Uraian Saldo Pajak 2026'; r3[86] = 'Uraian Saldo Pajak 2019/2025';

  r4[2] = 'Reguler'; r4[4] = 'Kinerja'; r4[6] = 'Afirmasi'; r4[8] = 'Lainnya'; r4[10] = 'Pajak Terhutang 2019-2025';
  r4[14] = 'Alokasi Dana BOS REGULER'; r4[15] = 'Alokasi Dana BOS KINERJA'; r4[16] = 'Alokasi Dana BOS SILPA KINERJA';
  r4[17] = 'Alokasi Dana BOS AFIRMASI'; r4[18] = 'Alokasi Dana BOS SILPA AFIRMASI'; r4[19] = 'Dana Lainnya';
  r4[20] = 'Bunga Bank/Jasa Giro'; r4[21] = 'Potongan dan Pungutan Pajak 2026'; r4[25] = 'Jumlah Penambahan';

  r4[26] = 'BOS REGULER'; r4[27] = 'BOS KINERJA (inc. SiLPA)'; r4[28] = 'BOS AFIRMASI (inc. SiLPA)'; r4[29] = 'DANA LAINNYA'; r4[30] = 'Jumlah Penarikan Tunai';
  r4[31] = 'BOS REGULER'; r4[32] = 'BOS KINERJA (inc. SiLPA)'; r4[33] = 'BOS AFIRMASI (inc. SiLPA)'; r4[34] = 'DANA LAINNYA'; r4[35] = 'Jumlah Belanja Non-Tunai';

  r4[36] = 'Belanja Operasi'; r4[42] = 'Belanja Modal Peralatan dan Mesin'; r4[48] = 'Belanja Modal Aset Tetap Lainnya';
  r4[54] = 'Setoran Giro'; r4[55] = 'Administrasi / Pajak Bank'; r4[56] = 'Pengembalian Dana Ke RKUD';
  r4[57] = 'Setoran Saldo Pajak 2019/2025'; r4[61] = 'Setoran Pajak 2026'; r4[65] = 'Jumlah Pengurangan';

  r4[66] = 'Reguler'; r4[69] = 'Kinerja (inc. SiLPA)'; r4[72] = 'Afirmasi (inc. SiLPA)'; r4[75] = 'Lainnya';
  r4[78] = 'Total BKU'; r4[79] = 'Total Tunai'; r4[80] = 'Total Bank'; r4[81] = 'Total Pajak';

  ['Tunai', 'Bank', 'Tunai', 'Bank', 'Tunai', 'Bank', 'Tunai', 'Bank'].forEach((lbl, idx) => r5[2 + idx] = lbl);
  const tax4 = ['PPN', 'PPh 21', 'PPh 23', 'SSPD / Pajak Daerah'];
  tax4.forEach((lbl, idx) => r5[10 + idx] = lbl);
  tax4.forEach((lbl, idx) => r5[21 + idx] = lbl);

  const sumber6 = ['BOS REGULER', 'BOS KINERJA', 'SILPA BOS KINERJA', 'BOS AFIRMASI', 'SILPA BOS AFIRMASI', 'DANA LAINNYA'];
  sumber6.forEach((lbl, idx) => r5[36 + idx] = lbl);
  sumber6.forEach((lbl, idx) => r5[42 + idx] = lbl);
  sumber6.forEach((lbl, idx) => r5[48 + idx] = lbl);
  tax4.forEach((lbl, idx) => r5[57 + idx] = lbl);
  tax4.forEach((lbl, idx) => r5[61 + idx] = lbl);

  for (let g = 0; g < 4; g++) {
    ['BKU', 'Tunai', 'Bank'].forEach((lbl, idx) => r5[66 + g * 3 + idx] = lbl);
  }
  tax4.forEach((lbl, idx) => r5[82 + idx] = lbl);
  tax4.forEach((lbl, idx) => r5[86 + idx] = lbl);

  sh.getRange(3, 1, 4, 90).setValues([r3, r4, r5, r6]);
  sh.getRange(3, 1, 4, 90).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true).setBorder(true, true, true, true, true, true);
  sh.getRange(3, 1, 3, 90).setBackground('#dbeafe');
  sh.getRange(6, 1, 1, 90).setBackground('#e2e8f0').setFontSize(9);

  const merges = [
    'A3:A5', 'B3:B5', 'C3:N3', 'O3:Z3', 'AA3:AE3', 'AF3:AJ3', 'AK3:BN3', 'BO3:BZ3', 'CA3:CD3', 'CE3:CH4', 'CI3:CL4',
    'C4:D4', 'E4:F4', 'G4:H4', 'I4:J4', 'K4:N4',
    'O4:O5', 'P4:P5', 'Q4:Q5', 'R4:R5', 'S4:S5', 'T4:T5', 'U4:U5', 'V4:Y4', 'Z4:Z5',
    'AA4:AA5', 'AB4:AB5', 'AC4:AC5', 'AD4:AD5', 'AE4:AE5',
    'AF4:AF5', 'AG4:AG5', 'AH4:AH5', 'AI4:AI5', 'AJ4:AJ5',
    'AK4:AP4', 'AQ4:AV4', 'AW4:BB4', 'BC4:BC5', 'BD4:BD5', 'BE4:BE5', 'BF4:BI4', 'BJ4:BM4', 'BN4:BN5',
    'BO4:BQ4', 'BR4:BT4', 'BU4:BW4', 'BX4:BZ4',
    'CA4:CA5', 'CB4:CB5', 'CC4:CC5', 'CD4:CD5'
  ];
  merges.forEach(m => sh.getRange(m).merge());

  const grid = [];
  for (let i = 0; i < 198; i++) grid.push(new Array(90).fill(''));

  function fillSchoolRow(arrIdx, schNo, schName, r) {
    const row = new Array(90).fill(0);
    row[0] = schNo;
    row[1] = schName;
    row[25] = `=SUM(O${r}:Y${r})`;
    row[30] = `=SUM(AA${r}:AD${r})`;
    row[35] = `=SUM(AF${r}:AI${r})`;
    row[65] = `=SUM(AK${r}:BM${r})`;
    row[66] = `=BP${r}+BQ${r}`;
    row[67] = `=(C${r}+AA${r}+AF${r})-(AK${r}+AQ${r}+AW${r})`;
    row[68] = `=(D${r}+O${r}+U${r})-(AA${r}+AF${r}+BC${r}+BD${r}+BE${r})`;
    row[69] = `=BS${r}+BT${r}`;
    row[70] = `=(E${r}+AB${r}+AG${r})-(AL${r}+AM${r}+AR${r}+AS${r}+AX${r}+AY${r})`;
    row[71] = `=(F${r}+P${r}+Q${r})-(AB${r}+AG${r})`;
    row[72] = `=BV${r}+BW${r}`;
    row[73] = `=(G${r}+AC${r}+AH${r})-(AN${r}+AO${r}+AT${r}+AU${r}+AZ${r}+BA${r})`;
    row[74] = `=(H${r}+R${r}+S${r})-(AC${r}+AH${r})`;
    row[75] = `=BY${r}+BZ${r}`;
    row[76] = `=(I${r}+AD${r}+AI${r})-(AP${r}+AV${r}+BB${r})`;
    row[77] = `=(J${r}+T${r})-(AD${r}+AI${r})`;
    row[78] = `=BO${r}+BR${r}+BU${r}+BX${r}`;
    row[79] = `=BP${r}+BS${r}+BV${r}+BY${r}`;
    row[80] = `=BQ${r}+BT${r}+BW${r}+BZ${r}`;
    row[81] = `=SUM(CE${r}:CL${r})`;
    row[82] = `=V${r}-BJ${r}`;
    row[83] = `=W${r}-BK${r}`;
    row[84] = `=X${r}-BL${r}`;
    row[85] = `=Y${r}-BM${r}`;
    row[86] = `=K${r}-BF${r}`;
    row[87] = `=L${r}-BG${r}`;
    row[88] = `=M${r}-BH${r}`;
    row[89] = `=N${r}-BI${r}`;
    grid[arrIdx] = row;
  }

  function fillSumRow(arrIdx, label, startR, endR) {
    const row = new Array(90).fill('');
    row[0] = label;
    for (let c = 2; c < 90; c++) {
      const colL = colToLetter_(c + 1);
      row[c] = `=SUM(${colL}${startR}:${colL}${endR})`;
    }
    grid[arrIdx] = row;
  }

  function fillAddTwoRow(arrIdx, label, r1, r2) {
    const row = new Array(90).fill('');
    row[0] = label;
    for (let c = 2; c < 90; c++) {
      const colL = colToLetter_(c + 1);
      row[c] = `=${colL}${r1}+${colL}${r2}`;
    }
    grid[arrIdx] = row;
  }

  for (let i = 0; i < 132; i++) fillSchoolRow(i, MASTER_SEKOLAH_INIT[i][0], MASTER_SEKOLAH_INIT[i][1], 7 + i);
  fillSumRow(132, 'JUMLAH SD', 7, 138);

  for (let i = 0; i < 55; i++) fillSchoolRow(133 + i, MASTER_SEKOLAH_INIT[132 + i][0], MASTER_SEKOLAH_INIT[132 + i][1], 140 + i);
  fillSumRow(188, 'JUMLAH SMP', 140, 194);
  fillAddTwoRow(189, 'JUMLAH SD DAN SMP', 139, 195);

  grid[192][0] = 'SEKOLAH SWASTA';
  for (let i = 0; i < 3; i++) fillSchoolRow(193 + i, MASTER_SEKOLAH_INIT[187 + i][0], MASTER_SEKOLAH_INIT[187 + i][1], 200 + i);
  fillSumRow(196, 'JUMLAH SEKOLAH SWASTA', 200, 202);
  fillAddTwoRow(197, 'JUMLAH TOTAL SD DAN SMP', 196, 203);

  sh.getRange(7, 1, 198, 90).setValues(grid);
  sh.getRange(7, 3, 198, 88).setNumberFormat('#,##0.00');
  sh.getRange(7, 1, 198, 90).setBorder(true, true, true, true, true, true);

  [139, 195, 196, 203, 204].forEach(r => {
    sh.getRange(r, 1, 1, 90).setFontWeight('bold').setBackground('#f1f5f9');
    sh.getRange(r, 1, 1, 2).merge();
  });
  sh.getRange(199, 1, 1, 90).merge().setFontWeight('bold').setBackground('#e2e8f0');

  sh.setFrozenRows(6);
  sh.setFrozenColumns(2);
  return sh;
}

function colToLetter_(col) {
  let temp = '', letter = '';
  while (col > 0) {
    temp = (col - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    col = (col - temp - 1) / 26;
  }
  return letter;
}

function getExcelRowBySchoolNo_(schoolNo) {
  const n = Number(schoolNo);
  if (n >= 1 && n <= 132) return 6 + n;
  if (n >= 133 && n <= 187) return 7 + n;
  if (n >= 188 && n <= 190) return 12 + n;
  throw new Error('Nomor sekolah tidak valid: ' + schoolNo);
}

/**
 * Login User
 */
function loginUser(username, password) {
  ensureCoreSheetsInitialized_();
  const ss = getDb_();
  const shUsers = ss.getSheetByName('USERS');
  const data = shUsers.getDataRange().getValues();

  const uClean = String(username || '').trim().toLowerCase();
  const pClean = String(password || '').trim();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (String(row[1]).trim().toLowerCase() === uClean && String(row[2]).trim() === pClean) {
      if (String(row[8]).toUpperCase() !== 'AKTIF') {
        return { success: false, message: 'Akun Anda dinonaktifkan oleh Super Admin.' };
      }
      shUsers.getRange(i + 1, 10).setValue(new Date());
      writeAuditLog_(row[1], row[3], 'LOGIN', row[4], 'Masuk ke portal SMART-BOS');

      return {
        success: true,
        user: {
          userId: row[0],
          username: row[1],
          role: row[3],
          namaLengkap: row[4],
          sekolahNo: row[5] ? Number(row[5]) : null,
          jenjang: row[6],
          kecamatan: row[7]
        }
      };
    }
  }
  return { success: false, message: 'Username atau Password salah!' };
}

/**
 * Boot data awal dashboard (sekali panggil, langsung di-cache di client agar pindah menu 0 detik)
 */
function getInitialDashboardData(sessionUser) {
  ensureCoreSheetsInitialized_();
  const ss = getDb_();
  const rootFolder = getRootDriveFolder_();
  const parentFolder = getParentDriveFolder_();

  const shAkses = ss.getSheetByName('KONTROL_AKSES');
  const aksesVals = shAkses.getDataRange().getValues();
  const aksesList = [];
  for (let i = 1; i < aksesVals.length; i++) {
    const r = aksesVals[i];
    if (sessionUser.role === 'ADMIN_KEC' && r[3] !== sessionUser.kecamatan) continue;
    if (sessionUser.role === 'SEKOLAH' && Number(r[0]) !== Number(sessionUser.sekolahNo)) continue;

    const bulanStatus = {};
    CONFIG.BULAN_LIST.forEach((b, idx) => { bulanStatus[b.kode] = r[4 + idx]; });
    aksesList.push({
      sekolahNo: Number(r[0]),
      namaSekolah: r[1],
      jenjang: r[2],
      kecamatan: r[3],
      statusBulan: bulanStatus
    });
  }

  const shDok = ss.getSheetByName('DOKUMEN_PENDUKUNG');
  const dokVals = shDok.getDataRange().getValues();
  const dokumenList = [];
  for (let i = 1; i < dokVals.length; i++) {
    const d = dokVals[i];
    if (sessionUser.role === 'ADMIN_KEC' && d[3] !== sessionUser.kecamatan) continue;
    if (sessionUser.role === 'SEKOLAH' && Number(d[1]) !== Number(sessionUser.sekolahNo)) continue;
    const driveId = d[10] || extractDriveIdFromUrl_(d[9]);
    dokumenList.push({
      docId: d[0],
      sekolahNo: Number(d[1]),
      namaSekolah: d[2],
      kecamatan: d[3],
      bulanKode: d[4],
      jenisDokumen: d[5],
      namaFile: d[6],
      mimeType: d[7],
      ukuranKB: d[8],
      fileUrl: d[9],
      driveFileId: driveId,
      previewUrl: driveId ? ('https://drive.google.com/file/d/' + driveId + '/preview') : d[9],
      uploadedBy: d[11],
      uploadedAt: d[12] ? Utilities.formatDate(new Date(d[12]), 'Asia/Makassar', 'dd/MM/yyyy HH:mm') : ''
    });
  }

  let usersList = [];
  if (sessionUser.role === 'SUPER_ADMIN' || sessionUser.role === 'ADMIN_KEC') {
    const shUsers = ss.getSheetByName('USERS');
    const uVals = shUsers.getDataRange().getValues();
    for (let i = 1; i < uVals.length; i++) {
      const u = uVals[i];
      if (sessionUser.role === 'ADMIN_KEC') {
        if (u[3] !== 'SEKOLAH' || u[7] !== sessionUser.kecamatan) continue;
      }
      usersList.push({
        userId: u[0],
        username: u[1],
        password: u[2],
        role: u[3],
        namaLengkap: u[4],
        sekolahNo: u[5],
        jenjang: u[6],
        kecamatan: u[7],
        statusAkun: u[8]
      });
    }
  }

  return {
    branding: {
      appName: CONFIG.APP_NAME,
      fullTitle: CONFIG.APP_FULL_TITLE,
      tagline: CONFIG.APP_TAGLINE,
      logoUrl: CONFIG.APP_LOGO_URL
    },
    bulanList: CONFIG.BULAN_LIST,
    kecamatanList: CONFIG.KECAMATAN_LIST,
    aksesList: aksesList,
    dokumenList: dokumenList.reverse(),
    usersList: usersList,
    dbUrl: ss.getUrl(),
    driveFolderUrl: rootFolder.getUrl(),
    parentFolderUrl: parentFolder.getUrl()
  };
}

function extractDriveIdFromUrl_(url) {
  if (!url) return '';
  const m = String(url).match(/[-\w]{25,}/);
  return m ? m[0] : '';
}

/**
 * Mengambil data 1 sekolah pada bulan tertentu + dokumen bulan tersebut untuk Split-Screen Preview
 */
function getSchoolMonthData(sessionUser, sekolahNo, bulanKode) {
  const ss = getDb_();
  const targetNo = sessionUser.role === 'SEKOLAH' ? Number(sessionUser.sekolahNo) : Number(sekolahNo);
  const sh = ensureMonthSheetExists_(ss, bulanKode);

  const excelRow = getExcelRowBySchoolNo_(targetNo);
  const rowValues = sh.getRange(excelRow, 1, 1, 90).getValues()[0];

  const shAkses = ss.getSheetByName('KONTROL_AKSES');
  const aksesRow = shAkses.getRange(targetNo + 1, 1, 1, 16).getValues()[0];
  const bIdx = CONFIG.BULAN_LIST.findIndex(b => b.kode === bulanKode);
  const statusAkses = aksesRow[4 + bIdx] || 'TERKUNCI';

  let statusVerif = 'BELUM';
  const shVerif = ss.getSheetByName('VERIFIKASI_REKON');
  if (shVerif) {
    statusVerif = shVerif.getRange(targetNo + 1, 4 + bIdx).getValue() || 'BELUM';
  }

  let prevSaldoAkhir = null;
  if (bIdx > 0) {
    const prevKode = CONFIG.BULAN_LIST[bIdx - 1].kode;
    const shPrev = ensureMonthSheetExists_(ss, prevKode);
    const prevVals = shPrev.getRange(excelRow, 1, 1, 90).getValues()[0];
    prevSaldoAkhir = {
      bulanNama: CONFIG.BULAN_LIST[bIdx - 1].nama,
      c3: round2_(prevVals[67]), c4: round2_(prevVals[68]),
      c5: round2_(prevVals[70]), c6: round2_(prevVals[71]),
      c7: round2_(prevVals[73]), c8: round2_(prevVals[74]),
      c9: round2_(prevVals[76]), c10: round2_(prevVals[77]),
      c11: round2_(prevVals[86]), c12: round2_(prevVals[87]),
      c13: round2_(prevVals[88]), c14: round2_(prevVals[89])
    };
  }

  const shDok = ss.getSheetByName('DOKUMEN_PENDUKUNG');
  const dokAll = shDok.getDataRange().getValues();
  const docs = [];
  for (let i = 1; i < dokAll.length; i++) {
    if (Number(dokAll[i][1]) === targetNo && dokAll[i][4] === bulanKode) {
      const driveId = dokAll[i][10] || extractDriveIdFromUrl_(dokAll[i][9]);
      docs.push({
        docId: dokAll[i][0],
        jenisDokumen: dokAll[i][5],
        namaFile: dokAll[i][6],
        mimeType: dokAll[i][7],
        ukuranKB: dokAll[i][8],
        fileUrl: dokAll[i][9],
        driveFileId: driveId,
        previewUrl: driveId ? ('https://drive.google.com/file/d/' + driveId + '/preview') : dokAll[i][9],
        uploadedAt: dokAll[i][12] ? Utilities.formatDate(new Date(dokAll[i][12]), 'Asia/Makassar', 'dd/MM/yyyy HH:mm') : ''
      });
    }
  }

  return {
    sekolahNo: targetNo,
    namaSekolah: rowValues[1],
    kecamatan: aksesRow[3],
    bulanKode: bulanKode,
    statusAkses: statusAkses,
    statusVerif: statusVerif,
    values: rowValues.map((v, idx) => (idx < 2 ? v : round2_(v))),
    prevSaldoAkhir: prevSaldoAkhir,
    dokumen: docs
  };
}

function round2_(val) {
  const n = Number(val);
  if (isNaN(n)) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * BATCH SAVE SUPER CEPAT (< 1 detik) & Validasi 2 Dokumen BKU (BKU Arkas PDF + BKU Manual Excel)
 */
function saveSchoolMonthData(sessionUser, sekolahNo, bulanKode, inputMap) {
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const ss = getDb_();
    const targetNo = sessionUser.role === 'SEKOLAH' ? Number(sessionUser.sekolahNo) : Number(sekolahNo);

    const shAkses = ss.getSheetByName('KONTROL_AKSES');
    const aksesRow = shAkses.getRange(targetNo + 1, 1, 1, 16).getValues()[0];
    const bIdx = CONFIG.BULAN_LIST.findIndex(b => b.kode === bulanKode);
    const statusAkses = aksesRow[4 + bIdx];

    if (sessionUser.role === 'SEKOLAH' && statusAkses !== 'TERBUKA') {
      return {
        success: false,
        message: 'Akses input bulan ' + bulanKode + ' sedang TERKUNCI. Hubungi Admin Kecamatan atau Super Admin.'
      };
    }

    if (sessionUser.role === 'SEKOLAH') {
      const shDok = ss.getSheetByName('DOKUMEN_PENDUKUNG');
      const dokVals = shDok.getDataRange().getValues();
      const schoolDocs = dokVals.filter((d, idx) => idx > 0 && Number(d[1]) === targetNo && d[4] === bulanKode);

      const hasBkuArkas = schoolDocs.some(d => String(d[5]) === 'BKU Arkas (PDF)');
      const hasBkuManual = schoolDocs.some(d => String(d[5]) === 'BKU Manual (Excel)');

      if (!hasBkuArkas || !hasBkuManual) {
        const kurang = [];
        if (!hasBkuArkas) kurang.push('BKU Arkas (PDF)');
        if (!hasBkuManual) kurang.push('BKU Manual (Excel)');
        return {
          success: false,
          message: 'Dokumen BKU belum lengkap! Wajib mengunggah: ' + kurang.join(' dan ') + ' sebelum menyimpan data.'
        };
      }
    }

    const sh = ensureMonthSheetExists_(ss, bulanKode);
    const excelRow = getExcelRowBySchoolNo_(targetNo);

    const currentRow = sh.getRange(excelRow, 1, 1, 90).getValues()[0];
    const editableCols = [
      3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
      27, 28, 29, 30,
      32, 33, 34, 35,
      37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65
    ];

    editableCols.forEach(c => {
      const key = 'c' + c;
      if (inputMap.hasOwnProperty(key)) {
        currentRow[c - 1] = round2_(inputMap[key]);
      }
    });

    sh.getRange(excelRow, 3, 1, 23).setValues([currentRow.slice(2, 25)]);
    sh.getRange(excelRow, 27, 1, 4).setValues([currentRow.slice(26, 30)]);
    sh.getRange(excelRow, 32, 1, 4).setValues([currentRow.slice(31, 35)]);
    sh.getRange(excelRow, 37, 1, 29).setValues([currentRow.slice(36, 65)]);

    SpreadsheetApp.flush();
    const updatedRow = sh.getRange(excelRow, 1, 1, 90).getValues()[0];
    writeAuditLog_(sessionUser.username, sessionUser.role, 'SIMPAN_REKON', aksesRow[1] + ' (' + bulanKode + ')', 'Menyimpan data realisasi BOSP');

    return {
      success: true,
      message: 'Data Rekonsiliasi ' + aksesRow[1] + ' bulan ' + bulanKode + ' berhasil disimpan!',
      values: updatedRow.map((v, idx) => (idx < 2 ? v : round2_(v)))
    };
  } finally {
    lock.releaseLock();
  }
}

function resetSchoolMonthData(sessionUser, sekolahNo, bulanKode) {
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const ss = getDb_();
    const targetNo = sessionUser.role === 'SEKOLAH' ? Number(sessionUser.sekolahNo) : Number(sekolahNo);

    const shAkses = ss.getSheetByName('KONTROL_AKSES');
    const aksesRow = shAkses.getRange(targetNo + 1, 1, 1, 16).getValues()[0];
    const bIdx = CONFIG.BULAN_LIST.findIndex(b => b.kode === bulanKode);
    if (sessionUser.role === 'SEKOLAH' && aksesRow[4 + bIdx] !== 'TERBUKA') {
      return { success: false, message: 'Akses bulan ' + bulanKode + ' terkunci, tidak dapat menghapus data.' };
    }

    const sh = ensureMonthSheetExists_(ss, bulanKode);
    const excelRow = getExcelRowBySchoolNo_(targetNo);

    sh.getRange(excelRow, 3, 1, 23).setValues([new Array(23).fill(0)]);
    sh.getRange(excelRow, 27, 1, 4).setValues([new Array(4).fill(0)]);
    sh.getRange(excelRow, 32, 1, 4).setValues([new Array(4).fill(0)]);
    sh.getRange(excelRow, 37, 1, 29).setValues([new Array(29).fill(0)]);

    SpreadsheetApp.flush();
    writeAuditLog_(sessionUser.username, sessionUser.role, 'HAPUS_ISIAN_REKON', aksesRow[1] + ' (' + bulanKode + ')', 'Mereset angka rekonsiliasi ke 0');
    return { success: true, message: 'Data isian rekonsiliasi bulan ' + bulanKode + ' berhasil dikosongkan.' };
  } finally {
    lock.releaseLock();
  }
}

/**
 * LIVE REVIEW & MONITORING SUPER ADMIN / ADMIN KECAMATAN
 */
function getAdminMonitoringTable(sessionUser, bulanKode, filterKecamatan, filterJenjang) {
  if (sessionUser.role === 'SEKOLAH') throw new Error('Akses ditolak');
  const ss = getDb_();
  const sh = ensureMonthSheetExists_(ss, bulanKode);
  const allVals = sh.getRange(7, 1, 198, 90).getValues();

  const shAkses = ss.getSheetByName('KONTROL_AKSES');
  const aksesVals = shAkses.getDataRange().getValues();
  const bIdx = CONFIG.BULAN_LIST.findIndex(b => b.kode === bulanKode);

  const aksesMap = {};
  for (let i = 1; i < aksesVals.length; i++) {
    aksesMap[Number(aksesVals[i][0])] = {
      jenjang: aksesVals[i][2],
      kecamatan: aksesVals[i][3],
      statusAkses: aksesVals[i][4 + bIdx]
    };
  }

  const shVerif = ss.getSheetByName('VERIFIKASI_REKON');
  const verifMap = {};
  if (shVerif) {
    const vVals = shVerif.getDataRange().getValues();
    for (let i = 1; i < vVals.length; i++) {
      verifMap[Number(vVals[i][0])] = vVals[i][3 + bIdx] || 'BELUM';
    }
  }

  const shDok = ss.getSheetByName('DOKUMEN_PENDUKUNG');
  const dokVals = shDok.getDataRange().getValues();
  const docCountMap = {};
  for (let i = 1; i < dokVals.length; i++) {
    if (dokVals[i][4] === bulanKode) {
      const sNo = Number(dokVals[i][1]);
      docCountMap[sNo] = (docCountMap[sNo] || 0) + 1;
    }
  }

  const rows = [];
  allVals.forEach(r => {
    const sNo = Number(r[0]);
    if (!sNo || sNo < 1 || sNo > 190) return;
    const meta = aksesMap[sNo];
    if (!meta) return;

    if (sessionUser.role === 'ADMIN_KEC' && meta.kecamatan !== sessionUser.kecamatan) return;
    if (filterKecamatan && filterKecamatan !== 'ALL' && meta.kecamatan !== filterKecamatan) return;
    if (filterJenjang && filterJenjang !== 'ALL' && meta.jenjang !== filterJenjang) return;

    const saldoAwalTotal = round2_((Number(r[2])||0)+(Number(r[3])||0)+(Number(r[4])||0)+(Number(r[5])||0)+(Number(r[6])||0)+(Number(r[7])||0)+(Number(r[8])||0)+(Number(r[9])||0));
    const penambahan = round2_(r[25]);
    const pengurangan = round2_(r[65]);
    const totalBKU = round2_(r[78]);
    const totalTunai = round2_(r[79]);
    const totalBank = round2_(r[80]);
    const totalPajak = round2_(r[81]);
    const jmlDok = docCountMap[sNo] || 0;
    const sudahInput = (saldoAwalTotal > 0 || penambahan > 0 || pengurangan > 0 || totalBKU > 0);

    rows.push({
      sekolahNo: sNo,
      namaSekolah: r[1],
      jenjang: meta.jenjang,
      kecamatan: meta.kecamatan,
      statusAkses: meta.statusAkses,
      statusVerif: verifMap[sNo] || 'BELUM',
      sudahInput: sudahInput,
      jmlDokumen: jmlDok,
      saldoAwalTotal: saldoAwalTotal,
      penambahan: penambahan,
      pengurangan: pengurangan,
      totalBKU: totalBKU,
      totalTunai: totalTunai,
      totalBank: totalBank,
      totalPajak: totalPajak
    });
  });

  return rows;
}

function toggleVerifySchoolMonth(sessionUser, sekolahNo, bulanKode, newVerifStatus) {
  if (sessionUser.role === 'SEKOLAH') return { success: false, message: 'Akses ditolak.' };
  const ss = getDb_();
  const shVerif = ss.getSheetByName('VERIFIKASI_REKON');
  const bIdx = CONFIG.BULAN_LIST.findIndex(b => b.kode === bulanKode);
  if (!shVerif || bIdx === -1) return { success: false, message: 'Data verifikasi tidak ditemukan.' };

  const targetRow = Number(sekolahNo) + 1;
  const schName = shVerif.getRange(targetRow, 2).getValue();
  shVerif.getRange(targetRow, 4 + bIdx).setValue(newVerifStatus);

  writeAuditLog_(sessionUser.username, sessionUser.role, 'VERIFIKASI_' + newVerifStatus, schName + ' (' + bulanKode + ')', 'Status verifikasi diubah ke ' + newVerifStatus);
  return { success: true, message: 'Status verifikasi ' + schName + ' (' + bulanKode + ') diubah menjadi ' + newVerifStatus };
}

function toggleSchoolAccess(sessionUser, sekolahNo, bulanKode, newStatus) {
  if (sessionUser.role === 'SEKOLAH') return { success: false, message: 'Tidak memiliki izin.' };
  const ss = getDb_();
  const shAkses = ss.getSheetByName('KONTROL_AKSES');
  const bIdx = CONFIG.BULAN_LIST.findIndex(b => b.kode === bulanKode);
  if (bIdx === -1) return { success: false, message: 'Bulan tidak valid.' };

  const targetRow = Number(sekolahNo) + 1;
  const rowData = shAkses.getRange(targetRow, 1, 1, 4).getValues()[0];

  if (sessionUser.role === 'ADMIN_KEC' && rowData[3] !== sessionUser.kecamatan) {
    return { success: false, message: 'Admin Kecamatan hanya dapat mengatur sekolah di wilayah kecamatannya.' };
  }

  shAkses.getRange(targetRow, 5 + bIdx).setValue(newStatus);
  writeAuditLog_(sessionUser.username, sessionUser.role, 'UBAH_AKSES_' + newStatus, rowData[1] + ' (' + bulanKode + ')', 'Status diubah menjadi ' + newStatus);
  return { success: true, message: 'Akses ' + rowData[1] + ' bulan ' + bulanKode + ' diubah menjadi ' + newStatus };
}

function bulkToggleAccess(sessionUser, kecamatanFilter, bulanKode, newStatus) {
  if (sessionUser.role === 'SEKOLAH') return { success: false, message: 'Tidak memiliki izin.' };
  const ss = getDb_();
  const shAkses = ss.getSheetByName('KONTROL_AKSES');
  const bIdx = CONFIG.BULAN_LIST.findIndex(b => b.kode === bulanKode);
  const vals = shAkses.getDataRange().getValues();
  let count = 0;

  for (let i = 1; i < vals.length; i++) {
    const kec = vals[i][3];
    if (sessionUser.role === 'ADMIN_KEC' && kec !== sessionUser.kecamatan) continue;
    if (kecamatanFilter && kecamatanFilter !== 'ALL' && kec !== kecamatanFilter) continue;
    vals[i][4 + bIdx] = newStatus;
    count++;
  }

  shAkses.getRange(1, 1, vals.length, vals[0].length).setValues(vals);
  writeAuditLog_(sessionUser.username, sessionUser.role, 'MASSAL_AKSES_' + newStatus, (kecamatanFilter || 'SEMUA') + ' - ' + bulanKode, count + ' sekolah diperbarui');
  return { success: true, message: 'Berhasil mengubah status ' + count + ' sekolah pada bulan ' + bulanKode + ' menjadi ' + newStatus };
}

/**
 * Upload Dokumen Pendukung ke dalam folder khusus Anda
 */
function uploadSupportingDocument(sessionUser, payload) {
  const ss = getDb_();
  const targetNo = sessionUser.role === 'SEKOLAH' ? Number(sessionUser.sekolahNo) : Number(payload.sekolahNo);

  const shAkses = ss.getSheetByName('KONTROL_AKSES');
  const schMeta = shAkses.getRange(targetNo + 1, 1, 1, 4).getValues()[0];

  const rootFolder = getRootDriveFolder_();
  const kecFolders = rootFolder.getFoldersByName(schMeta[3]);
  const kecFolder = kecFolders.hasNext() ? kecFolders.next() : rootFolder.createFolder(schMeta[3]);

  const schFolderName = String(targetNo).padStart(3, '0') + '_' + schMeta[1];
  const schFolders = kecFolder.getFoldersByName(schFolderName);
  const schFolder = schFolders.hasNext() ? schFolders.next() : kecFolder.createFolder(schFolderName);

  const blnFolders = schFolder.getFoldersByName(payload.bulanKode);
  const blnFolder = blnFolders.hasNext() ? blnFolders.next() : schFolder.createFolder(payload.bulanKode);

  const decoded = Utilities.base64Decode(payload.base64Data);
  const blob = Utilities.newBlob(decoded, payload.mimeType, payload.fileName);
  const file = blnFolder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  const docId = 'DOC-' + new Date().getTime();
  const sizeKB = Math.round(decoded.length / 1024);
  const shDok = ss.getSheetByName('DOKUMEN_PENDUKUNG');
  shDok.appendRow([
    docId, targetNo, schMeta[1], schMeta[3], payload.bulanKode,
    payload.jenisDokumen, payload.fileName, payload.mimeType, sizeKB,
    file.getUrl(), file.getId(), sessionUser.username, new Date()
  ]);

  writeAuditLog_(sessionUser.username, sessionUser.role, 'UPLOAD_DOKUMEN', schMeta[1] + ' (' + payload.bulanKode + ')', payload.jenisDokumen + ': ' + payload.fileName);

  return {
    success: true,
    message: 'Dokumen "' + payload.fileName + '" berhasil diunggah!',
    doc: {
      docId: docId,
      sekolahNo: targetNo,
      namaSekolah: schMeta[1],
      kecamatan: schMeta[3],
      bulanKode: payload.bulanKode,
      jenisDokumen: payload.jenisDokumen,
      namaFile: payload.fileName,
      mimeType: payload.mimeType,
      ukuranKB: sizeKB,
      fileUrl: file.getUrl(),
      driveFileId: file.getId(),
      previewUrl: 'https://drive.google.com/file/d/' + file.getId() + '/preview',
      uploadedAt: Utilities.formatDate(new Date(), 'Asia/Makassar', 'dd/MM/yyyy HH:mm')
    }
  };
}

function deleteSupportingDocument(sessionUser, docId) {
  const ss = getDb_();
  const shDok = ss.getSheetByName('DOKUMEN_PENDUKUNG');
  const vals = shDok.getDataRange().getValues();

  for (let i = 1; i < vals.length; i++) {
    if (vals[i][0] === docId) {
      const sNo = Number(vals[i][1]);
      const kec = vals[i][3];
      if (sessionUser.role === 'SEKOLAH' && sNo !== Number(sessionUser.sekolahNo)) {
        return { success: false, message: 'Anda tidak berhak menghapus dokumen sekolah lain.' };
      }
      if (sessionUser.role === 'ADMIN_KEC' && kec !== sessionUser.kecamatan) {
        return { success: false, message: 'Anda tidak berhak menghapus dokumen di luar kecamatan Anda.' };
      }
      try {
        if (vals[i][10]) DriveApp.getFileById(vals[i][10]).setTrashed(true);
      } catch (e) {}

      shDok.deleteRow(i + 1);
      writeAuditLog_(sessionUser.username, sessionUser.role, 'HAPUS_DOKUMEN', vals[i][2], vals[i][6]);
      return { success: true, message: 'Dokumen berhasil dihapus.' };
    }
  }
  return { success: false, message: 'Dokumen tidak ditemukan.' };
}

function updateUserAccount(sessionUser, payload) {
  if (sessionUser.role === 'SEKOLAH') return { success: false, message: 'Akses ditolak.' };
  const ss = getDb_();
  const shUsers = ss.getSheetByName('USERS');
  const vals = shUsers.getDataRange().getValues();

  for (let i = 1; i < vals.length; i++) {
    if (vals[i][0] === payload.userId) {
      if (sessionUser.role === 'ADMIN_KEC' && (vals[i][3] !== 'SEKOLAH' || vals[i][7] !== sessionUser.kecamatan)) {
        return { success: false, message: 'Admin Kecamatan hanya dapat mengedit akun sekolah di kecamatannya.' };
      }
      if (payload.username) shUsers.getRange(i + 1, 2).setValue(payload.username.trim());
      if (payload.password) shUsers.getRange(i + 1, 3).setValue(payload.password.trim());
      if (payload.namaLengkap) shUsers.getRange(i + 1, 5).setValue(payload.namaLengkap.trim());
      if (payload.statusAkun) shUsers.getRange(i + 1, 9).setValue(payload.statusAkun);

      writeAuditLog_(sessionUser.username, sessionUser.role, 'EDIT_USER', vals[i][1], 'Memperbarui kredensial/status akun');
      return { success: true, message: 'Data akun berhasil diperbarui.' };
    }
  }
  return { success: false, message: 'User tidak ditemukan.' };
}

function resetUserPasswordOrStatus(sessionUser, userId, actionType) {
  if (sessionUser.role !== 'SUPER_ADMIN') {
    return { success: false, message: 'Hanya Super Admin yang dapat menonaktifkan akun sistem.' };
  }
  const ss = getDb_();
  const shUsers = ss.getSheetByName('USERS');
  const vals = shUsers.getDataRange().getValues();

  for (let i = 1; i < vals.length; i++) {
    if (vals[i][0] === userId) {
      if (vals[i][3] === 'SUPER_ADMIN') return { success: false, message: 'Akun Super Admin utama tidak dapat dinonaktifkan.' };
      if (actionType === 'NONAKTIF') {
        shUsers.getRange(i + 1, 9).setValue('NONAKTIF');
        writeAuditLog_(sessionUser.username, sessionUser.role, 'NONAKTIF_USER', vals[i][1], 'Akun dinonaktifkan');
        return { success: true, message: 'Akun berhasil dinonaktifkan.' };
      }
    }
  }
  return { success: false, message: 'Akun tidak ditemukan.' };
}

function exportExcelWorkbook(sessionUser, mode, sekolahNo, kecamatanFilter) {
  if (sessionUser.role === 'SEKOLAH') throw new Error('Akses khusus Admin & Super Admin.');

  const sourceSs = getDb_();
  CONFIG.BULAN_LIST.forEach(b => ensureMonthSheetExists_(sourceSs, b.kode));
  SpreadsheetApp.flush();

  const kecTarget = sessionUser.role === 'ADMIN_KEC' ? sessionUser.kecamatan : (kecamatanFilter || 'ALL');

  let tempName = 'SMARTBOS_2026_BOALEMO_' + Utilities.formatDate(new Date(), 'Asia/Makassar', 'yyyyMMdd_HHmm');
  if (mode === 'PER_SEKOLAH') {
    const shAkses = sourceSs.getSheetByName('KONTROL_AKSES');
    const schName = shAkses.getRange(Number(sekolahNo) + 1, 2).getValue();
    tempName = 'SMARTBOS_2026_' + String(schName).replace(/[^A-Za-z0-9]/g, '_');
  } else if (kecTarget !== 'ALL') {
    tempName = 'SMARTBOS_2026_' + kecTarget.replace(/[^A-Za-z0-9]/g, '_');
  }

  const copyFile = DriveApp.getFileById(sourceSs.getId()).makeCopy(tempName);
  const copySs = SpreadsheetApp.openById(copyFile.getId());

  ['USERS', 'KONTROL_AKSES', 'DOKUMEN_PENDUKUNG', 'AUDIT_LOG', 'VERIFIKASI_REKON'].forEach(sysName => {
    const s = copySs.getSheetByName(sysName);
    if (s) copySs.deleteSheet(s);
  });

  if (mode === 'PER_SEKOLAH') {
    const keepExcelRow = getExcelRowBySchoolNo_(Number(sekolahNo));
    CONFIG.BULAN_LIST.forEach(b => {
      const sh = copySs.getSheetByName(b.kode);
      if (!sh) return;
      for (let r = 204; r >= 7; r--) {
        if (r !== keepExcelRow) sh.deleteRow(r);
      }
      sh.getRange(8, 1).setValue('TOTAL');
      for (let c = 3; c <= 90; c++) {
        const colL = colToLetter_(c);
        sh.getRange(8, c).setFormula(`=${colL}7`);
      }
      sh.getRange(8, 1, 1, 90).setFontWeight('bold').setBackground('#e2e8f0').setBorder(true, true, true, true, true, true);
    });
  } else if (kecTarget !== 'ALL') {
    const shAkses = sourceSs.getSheetByName('KONTROL_AKSES');
    const aksesData = shAkses.getDataRange().getValues();
    const validRows = new Set();
    for (let i = 1; i < aksesData.length; i++) {
      if (aksesData[i][3] === kecTarget) {
        validRows.add(getExcelRowBySchoolNo_(Number(aksesData[i][0])));
      }
    }

    CONFIG.BULAN_LIST.forEach(b => {
      const sh = copySs.getSheetByName(b.kode);
      if (!sh) return;
      for (let r = 204; r >= 7; r--) {
        if (!validRows.has(r)) sh.deleteRow(r);
      }
      const lastDataRow = sh.getLastRow();
      if (lastDataRow >= 7) {
        const totRow = lastDataRow + 1;
        sh.getRange(totRow, 1).setValue('JUMLAH ' + kecTarget.toUpperCase());
        sh.getRange(totRow, 1, 1, 2).merge();
        for (let c = 3; c <= 90; c++) {
          const colL = colToLetter_(c);
          sh.getRange(totRow, c).setFormula(`=SUM(${colL}7:${colL}${lastDataRow})`);
        }
        sh.getRange(totRow, 1, 1, 90).setFontWeight('bold').setBackground('#dbeafe').setBorder(true, true, true, true, true, true);
      }
    });
  }

  SpreadsheetApp.flush();

  const exportUrl = 'https://docs.google.com/spreadsheets/d/' + copyFile.getId() + '/export?format=xlsx';
  const token = ScriptApp.getOAuthToken();
  const response = UrlFetchApp.fetch(exportUrl, {
    headers: { Authorization: 'Bearer ' + token }
  });

  const xlsxBase64 = Utilities.base64Encode(response.getBlob().getBytes());
  copyFile.setTrashed(true);

  writeAuditLog_(sessionUser.username, sessionUser.role, 'EXPORT_EXCEL', tempName + '.xlsx', 'Mengunduh file Excel 12 sheet (JAN-DES)');

  return {
    success: true,
    fileName: tempName + '.xlsx',
    base64: xlsxBase64
  };
}

function getAuditLogs(sessionUser) {
  if (sessionUser.role !== 'SUPER_ADMIN') return [];
  const ss = getDb_();
  const sh = ss.getSheetByName('AUDIT_LOG');
  const vals = sh.getDataRange().getValues();
  const logs = [];
  for (let i = vals.length - 1; i >= 1 && logs.length < 100; i--) {
    logs.push({
      logId: vals[i][0],
      waktu: vals[i][1] ? Utilities.formatDate(new Date(vals[i][1]), 'Asia/Makassar', 'dd/MM/yyyy HH:mm:ss') : '',
      user: vals[i][2],
      role: vals[i][3],
      aksi: vals[i][4],
      target: vals[i][5],
      detail: vals[i][6]
    });
  }
  return logs;
}

function writeAuditLog_(user, role, aksi, target, detail) {
  try {
    const ss = getDb_();
    const sh = ss.getSheetByName('AUDIT_LOG');
    if (sh) {
      sh.appendRow(['LOG-' + new Date().getTime(), new Date(), user, role, aksi, target, detail]);
    }
  } catch (e) {}
}