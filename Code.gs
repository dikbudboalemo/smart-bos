/**
 * ============================================================================
 * SMART-BOS KABUPATEN BOALEMO — BACKEND ENGINE (Code.gs v3.5)
 * Dinas Pendidikan dan Kebudayaan Kabupaten Boalemo — TA 2026
 * ============================================================================
 * Pembaruan v3.5:
 * - Fitur Rekomendasi "Siap Audit" oleh Admin Kecamatan untuk Super Admin
 * - Reset otomatis status SAH & Rekomendasi Kecamatan saat revisi disetujui
 * - Audit Read-Only Split-Screen Super Admin & Export Excel 15 Sheet aktif
 * ============================================================================
 */

const APP_CONFIG = {
  APP_NAME: 'SMART-BOS Kab. Boalemo',
  VERSION: '3.5',
  TAHUN_ANGGARAN: 2026,
  DRIVE_ROOT_FOLDER_NAME: 'SMART_BOS_BOALEMO_2026_DOKUMEN',
  SHEET_USERS: 'MASTER_USERS',
  SHEET_SEKOLAH: 'MASTER_SEKOLAH',
  SHEET_AKSES: 'KONTROL_AKSES_BULAN',
  SHEET_DOKUMEN: 'LOG_DOKUMEN_UPLOAD',
  SHEET_AUDIT: 'LOG_AUDIT_REVISI'
};

const BULAN_CONFIG = [
  { kode: 'JAN', nama: 'JANUARI', index: 1 },
  { kode: 'FEB', nama: 'FEBRUARI', index: 2 },
  { kode: 'MAR', nama: 'MARET', index: 3 },
  { kode: 'APR', nama: 'APRIL', index: 4 },
  { kode: 'MEI', nama: 'MEI', index: 5 },
  { kode: 'JUN', nama: 'JUNI', index: 6 },
  { kode: 'JUL', nama: 'JULI', index: 7 },
  { kode: 'AGU', nama: 'AGUSTUS', index: 8 },
  { kode: 'SEP', nama: 'SEPTEMBER', index: 9 },
  { kode: 'OKT', nama: 'OKTOBER', index: 10 },
  { kode: 'NOV', nama: 'NOVEMBER', index: 11 },
  { kode: 'DES', nama: 'DESEMBER', index: 12 }
];

const MASTER_SEKOLAH_DATA = [
  // ================= SD NEGERI (135 SEKOLAH) =================
  // Kecamatan Mananggu (1 - 15)
  { no: 1, nama: 'SD NEGERI 01 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SD' },
  { no: 2, nama: 'SD NEGERI 02 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SD' },
  { no: 3, nama: 'SD NEGERI 03 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SD' },
  { no: 4, nama: 'SD NEGERI 04 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SD' },
  { no: 5, nama: 'SD NEGERI 05 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SD' },
  { no: 6, nama: 'SD NEGERI 06 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SD' },
  { no: 7, nama: 'SD NEGERI 07 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SD' },
  { no: 8, nama: 'SD NEGERI 08 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SD' },
  { no: 9, nama: 'SD NEGERI 09 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SD' },
  { no: 10, nama: 'SD NEGERI 10 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SD' },
  { no: 11, nama: 'SD NEGERI 11 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SD' },
  { no: 12, nama: 'SD NEGERI 12 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SD' },
  { no: 13, nama: 'SD NEGERI 13 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SD' },
  { no: 14, nama: 'SD NEGERI 14 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SD' },
  { no: 15, nama: 'SD NEGERI 15 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SD' },

  // Kecamatan Botumoito (16 - 30)
  { no: 16, nama: 'SD NEGERI 01 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SD' },
  { no: 17, nama: 'SD NEGERI 02 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SD' },
  { no: 18, nama: 'SD NEGERI 03 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SD' },
  { no: 19, nama: 'SD NEGERI 04 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SD' },
  { no: 20, nama: 'SD NEGERI 05 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SD' },
  { no: 21, nama: 'SD NEGERI 06 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SD' },
  { no: 22, nama: 'SD NEGERI 07 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SD' },
  { no: 23, nama: 'SD NEGERI 08 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SD' },
  { no: 24, nama: 'SD NEGERI 09 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SD' },
  { no: 25, nama: 'SD NEGERI 10 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SD' },
  { no: 26, nama: 'SD NEGERI 11 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SD' },
  { no: 27, nama: 'SD NEGERI 12 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SD' },
  { no: 28, nama: 'SD NEGERI 13 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SD' },
  { no: 29, nama: 'SD NEGERI 14 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SD' },
  { no: 30, nama: 'SD NEGERI 15 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SD' },

  // Kecamatan Tilamuta (31 - 54)
  { no: 31, nama: 'SD NEGERI 01 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 32, nama: 'SD NEGERI 02 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 33, nama: 'SD NEGERI 03 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 34, nama: 'SD NEGERI 04 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 35, nama: 'SD NEGERI 05 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 36, nama: 'SD NEGERI 06 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 37, nama: 'SD NEGERI 07 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 38, nama: 'SD NEGERI 08 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 39, nama: 'SD NEGERI 09 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 40, nama: 'SD NEGERI 10 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 41, nama: 'SD NEGERI 11 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 42, nama: 'SD NEGERI 12 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 43, nama: 'SD NEGERI 13 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 44, nama: 'SD NEGERI 14 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 45, nama: 'SD NEGERI 15 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 46, nama: 'SD NEGERI 16 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 47, nama: 'SD NEGERI 17 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 48, nama: 'SD NEGERI 18 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 49, nama: 'SD NEGERI 19 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 50, nama: 'SD NEGERI 20 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 51, nama: 'SD NEGERI 21 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 52, nama: 'SD NEGERI 22 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 53, nama: 'SD NEGERI 23 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },
  { no: 54, nama: 'SD NEGERI 24 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SD' },

  // Kecamatan Dulupi (55 - 70)
  { no: 55, nama: 'SD NEGERI 01 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SD' },
  { no: 56, nama: 'SD NEGERI 02 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SD' },
  { no: 57, nama: 'SD NEGERI 03 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SD' },
  { no: 58, nama: 'SD NEGERI 04 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SD' },
  { no: 59, nama: 'SD NEGERI 05 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SD' },
  { no: 60, nama: 'SD NEGERI 06 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SD' },
  { no: 61, nama: 'SD NEGERI 07 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SD' },
  { no: 62, nama: 'SD NEGERI 08 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SD' },
  { no: 63, nama: 'SD NEGERI 09 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SD' },
  { no: 64, nama: 'SD NEGERI 10 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SD' },
  { no: 65, nama: 'SD NEGERI 11 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SD' },
  { no: 66, nama: 'SD NEGERI 12 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SD' },
  { no: 67, nama: 'SD NEGERI 13 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SD' },
  { no: 68, nama: 'SD NEGERI 14 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SD' },
  { no: 69, nama: 'SD NEGERI 15 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SD' },
  { no: 70, nama: 'SD NEGERI 16 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SD' },

  // Kecamatan Paguyaman (71 - 99)
  { no: 71, nama: 'SD NEGERI 01 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 72, nama: 'SD NEGERI 02 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 73, nama: 'SD NEGERI 03 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 74, nama: 'SD NEGERI 04 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 75, nama: 'SD NEGERI 05 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 76, nama: 'SD NEGERI 06 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 77, nama: 'SD NEGERI 07 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 78, nama: 'SD NEGERI 08 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 79, nama: 'SD NEGERI 09 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 80, nama: 'SD NEGERI 10 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 81, nama: 'SD NEGERI 11 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 82, nama: 'SD NEGERI 12 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 83, nama: 'SD NEGERI 13 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 84, nama: 'SD NEGERI 14 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 85, nama: 'SD NEGERI 15 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 86, nama: 'SD NEGERI 16 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 87, nama: 'SD NEGERI 17 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 88, nama: 'SD NEGERI 18 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 89, nama: 'SD NEGERI 19 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 90, nama: 'SD NEGERI 20 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 91, nama: 'SD NEGERI 21 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 92, nama: 'SD NEGERI 22 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 93, nama: 'SD NEGERI 23 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 94, nama: 'SD NEGERI 24 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 95, nama: 'SD NEGERI 25 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 96, nama: 'SD NEGERI 26 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 97, nama: 'SD NEGERI 27 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 98, nama: 'SD NEGERI 28 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },
  { no: 99, nama: 'SD NEGERI 29 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SD' },

  // Kecamatan Paguyaman Pantai (100 - 108)
  { no: 100, nama: 'SD NEGERI 01 PAGUYAMAN PANTAI', kec: 'Kecamatan Paguyaman Pantai', jenjang: 'SD' },
  { no: 101, nama: 'SD NEGERI 02 PAGUYAMAN PANTAI', kec: 'Kecamatan Paguyaman Pantai', jenjang: 'SD' },
  { no: 102, nama: 'SD NEGERI 03 PAGUYAMAN PANTAI', kec: 'Kecamatan Paguyaman Pantai', jenjang: 'SD' },
  { no: 103, nama: 'SD NEGERI 04 PAGUYAMAN PANTAI', kec: 'Kecamatan Paguyaman Pantai', jenjang: 'SD' },
  { no: 104, nama: 'SD NEGERI 05 PAGUYAMAN PANTAI', kec: 'Kecamatan Paguyaman Pantai', jenjang: 'SD' },
  { no: 105, nama: 'SD NEGERI 06 PAGUYAMAN PANTAI', kec: 'Kecamatan Paguyaman Pantai', jenjang: 'SD' },
  { no: 106, nama: 'SD NEGERI 07 PAGUYAMAN PANTAI', kec: 'Kecamatan Paguyaman Pantai', jenjang: 'SD' },
  { no: 107, nama: 'SD NEGERI 08 PAGUYAMAN PANTAI', kec: 'Kecamatan Paguyaman Pantai', jenjang: 'SD' },
  { no: 108, nama: 'SD NEGERI 09 PAGUYAMAN PANTAI', kec: 'Kecamatan Paguyaman Pantai', jenjang: 'SD' },

  // Kecamatan Wonosari (109 - 135)
  { no: 109, nama: 'SD NEGERI 01 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 110, nama: 'SD NEGERI 02 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 111, nama: 'SD NEGERI 03 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 112, nama: 'SD NEGERI 04 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 113, nama: 'SD NEGERI 05 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 114, nama: 'SD NEGERI 06 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 115, nama: 'SD NEGERI 07 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 116, nama: 'SD NEGERI 08 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 117, nama: 'SD NEGERI 09 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 118, nama: 'SD NEGERI 10 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 119, nama: 'SD NEGERI 11 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 120, nama: 'SD NEGERI 12 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 121, nama: 'SD NEGERI 13 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 122, nama: 'SD NEGERI 14 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 123, nama: 'SD NEGERI 15 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 124, nama: 'SD NEGERI 16 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 125, nama: 'SD NEGERI 17 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 126, nama: 'SD NEGERI 18 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 127, nama: 'SD NEGERI 19 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 128, nama: 'SD NEGERI 20 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 129, nama: 'SD NEGERI 21 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 130, nama: 'SD NEGERI 22 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 131, nama: 'SD NEGERI 23 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 132, nama: 'SD NEGERI 24 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 133, nama: 'SD NEGERI 25 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 134, nama: 'SD NEGERI 26 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },
  { no: 135, nama: 'SD NEGERI 27 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SD' },

  // ================= SMP NEGERI (48 SEKOLAH) =================
  { no: 136, nama: 'SMP NEGERI 1 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SMP' },
  { no: 137, nama: 'SMP NEGERI 2 MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SMP' },
  { no: 138, nama: 'SMP NEGERI 3 SATU ATAP MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SMP' },
  { no: 139, nama: 'SMP NEGERI 4 SATU ATAP MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SMP' },
  { no: 140, nama: 'SMP NEGERI 5 SATU ATAP MANANGGU', kec: 'Kecamatan Mananggu', jenjang: 'SMP' },
  { no: 141, nama: 'SMP NEGERI 1 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SMP' },
  { no: 142, nama: 'SMP NEGERI 2 BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SMP' },
  { no: 143, nama: 'SMP NEGERI 3 SATU ATAP BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SMP' },
  { no: 144, nama: 'SMP NEGERI 4 SATU ATAP BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SMP' },
  { no: 145, nama: 'SMP NEGERI 5 SATU ATAP BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SMP' },
  { no: 146, nama: 'SMP NEGERI 6 SATU ATAP BOTUMOITO', kec: 'Kecamatan Botumoito', jenjang: 'SMP' },
  { no: 147, nama: 'SMP NEGERI 1 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SMP' },
  { no: 148, nama: 'SMP NEGERI 2 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SMP' },
  { no: 149, nama: 'SMP NEGERI 3 TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SMP' },
  { no: 150, nama: 'SMP NEGERI 4 SATU ATAP TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SMP' },
  { no: 151, nama: 'SMP NEGERI 5 SATU ATAP TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SMP' },
  { no: 152, nama: 'SMP NEGERI 6 SATU ATAP TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SMP' },
  { no: 153, nama: 'SMP NEGERI 7 SATU ATAP TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SMP' },
  { no: 154, nama: 'SMP NEGERI 1 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SMP' },
  { no: 155, nama: 'SMP NEGERI 2 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SMP' },
  { no: 156, nama: 'SMP NEGERI 3 DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SMP' },
  { no: 157, nama: 'SMP NEGERI 4 SATU ATAP DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SMP' },
  { no: 158, nama: 'SMP NEGERI 5 SATU ATAP DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SMP' },
  { no: 159, nama: 'SMP NEGERI 6 SATU ATAP DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SMP' },
  { no: 160, nama: 'SMP NEGERI 7 SATU ATAP DULUPI', kec: 'Kecamatan Dulupi', jenjang: 'SMP' },
  { no: 161, nama: 'SMP NEGERI 1 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SMP' },
  { no: 162, nama: 'SMP NEGERI 2 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SMP' },
  { no: 163, nama: 'SMP NEGERI 3 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SMP' },
  { no: 164, nama: 'SMP NEGERI 4 PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SMP' },
  { no: 165, nama: 'SMP NEGERI 5 SATU ATAP PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SMP' },
  { no: 166, nama: 'SMP NEGERI 6 SATU ATAP PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SMP' },
  { no: 167, nama: 'SMP NEGERI 7 SATU ATAP PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SMP' },
  { no: 168, nama: 'SMP NEGERI 8 SATU ATAP PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SMP' },
  { no: 169, nama: 'SMP NEGERI 9 SATU ATAP PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SMP' },
  { no: 170, nama: 'SMP NEGERI 10 SATU ATAP PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SMP' },
  { no: 171, nama: 'SMP NEGERI 1 PAGUYAMAN PANTAI', kec: 'Kecamatan Paguyaman Pantai', jenjang: 'SMP' },
  { no: 172, nama: 'SMP NEGERI 2 PAGUYAMAN PANTAI', kec: 'Kecamatan Paguyaman Pantai', jenjang: 'SMP' },
  { no: 173, nama: 'SMP NEGERI 3 SATU ATAP PAGUYAMAN PANTAI', kec: 'Kecamatan Paguyaman Pantai', jenjang: 'SMP' },
  { no: 174, nama: 'SMP NEGERI 1 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SMP' },
  { no: 175, nama: 'SMP NEGERI 2 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SMP' },
  { no: 176, nama: 'SMP NEGERI 3 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SMP' },
  { no: 177, nama: 'SMP NEGERI 4 WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SMP' },
  { no: 178, nama: 'SMP NEGERI 5 SATU ATAP WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SMP' },
  { no: 179, nama: 'SMP NEGERI 6 SATU ATAP WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SMP' },
  { no: 180, nama: 'SMP NEGERI 7 SATU ATAP WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SMP' },
  { no: 181, nama: 'SMP NEGERI 8 SATU ATAP WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SMP' },
  { no: 182, nama: 'SMP NEGERI 9 SATU ATAP WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SMP' },
  { no: 183, nama: 'SMP NEGERI 10 SATU ATAP WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SMP' },

  // ================= SEKOLAH SWASTA (7 SEKOLAH) =================
  { no: 184, nama: 'SD MUHAMMADIYAH WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SWASTA' },
  { no: 185, nama: 'SD ISLAM TERPADU AL-IZZAH TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SWASTA' },
  { no: 186, nama: 'SD KRISTEN HARAPAN PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SWASTA' },
  { no: 187, nama: 'SMP MUHAMMADIYAH TILAMUTA', kec: 'Kecamatan Tilamuta', jenjang: 'SWASTA' },
  { no: 188, nama: 'SMP MUHAMMADIYAH WONOSARI', kec: 'Kecamatan Wonosari', jenjang: 'SWASTA' },
  { no: 189, nama: 'SMP ISLAM TERPADU BOALEMO', kec: 'Kecamatan Tilamuta', jenjang: 'SWASTA' },
  { no: 190, nama: 'SMP KRISTEN PAGUYAMAN', kec: 'Kecamatan Paguyaman', jenjang: 'SWASTA' }
];

function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('SMART-BOS Kab. Boalemo — Rekonsiliasi BOSP TA 2026')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getSpreadsheet_() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSheetRowForSchool_(sekolahNo) {
  const no = Number(sekolahNo);
  if (no >= 1 && no <= 135) return 6 + no;
  if (no >= 136 && no <= 183) return 8 + no;
  if (no >= 184 && no <= 190) return 10 + no;
  throw new Error('Nomor urut sekolah tidak valid: ' + sekolahNo);
}

/**
 * Jalankan fungsi ini SEKALI dari editor Apps Script untuk membuat seluruh struktur sheet
 * (12 Sheet Bulan + 3 Sheet Rekap + Master Users + Kontrol Akses + Log Dokumen + Log Audit)
 */
function setupSmartBosDatabase() {
  const ss = getSpreadsheet_();

  // 1. MASTER_SEKOLAH
  let shSek = ss.getSheetByName(APP_CONFIG.SHEET_SEKOLAH);
  if (!shSek) shSek = ss.insertSheet(APP_CONFIG.SHEET_SEKOLAH);
  shSek.clear();
  shSek.appendRow(['NO_URUT', 'NAMA_SATUAN_PENDIDIKAN', 'KECAMATAN', 'JENJANG', 'BARIS_SHEET']);
  const sekRows = MASTER_SEKOLAH_DATA.map(s => [s.no, s.nama, s.kec, s.jenjang, getSheetRowForSchool_(s.no)]);
  shSek.getRange(2, 1, sekRows.length, 5).setValues(sekRows);

  // 2. MASTER_USERS (1 Super Admin + 7 Admin Kecamatan + 190 Sekolah = 198 Akun)
  let shUsers = ss.getSheetByName(APP_CONFIG.SHEET_USERS);
  if (!shUsers) shUsers = ss.insertSheet(APP_CONFIG.SHEET_USERS);
  shUsers.clear();
  shUsers.appendRow(['USER_ID', 'ROLE', 'SEKOLAH_NO', 'NAMA_LENGKAP', 'KECAMATAN', 'USERNAME', 'PASSWORD', 'STATUS_AKUN']);
  const userRows = [];
  userRows.push(['ADM-00', 'SUPER_ADMIN', 0, 'Super Admin Dinas Pendidikan Kab. Boalemo', 'ALL', 'superadmin', 'bosboalemo2026', 'AKTIF']);

  const kecList = [
    { code: 'mananggu', name: 'Kecamatan Mananggu' },
    { code: 'botumoito', name: 'Kecamatan Botumoito' },
    { code: 'tilamuta', name: 'Kecamatan Tilamuta' },
    { code: 'dulupi', name: 'Kecamatan Dulupi' },
    { code: 'paguyaman', name: 'Kecamatan Paguyaman' },
    { code: 'pagpantai', name: 'Kecamatan Paguyaman Pantai' },
    { code: 'wonosari', name: 'Kecamatan Wonosari' }
  ];
  kecList.forEach((k, idx) => {
    userRows.push(['KEC-0' + (idx + 1), 'ADMIN_KEC', 0, 'Admin ' + k.name, k.name, 'kec_' + k.code, 'kec' + (idx + 1) + '2026', 'AKTIF']);
  });

  MASTER_SEKOLAH_DATA.forEach(s => {
    const pad = String(s.no).padStart(3, '0');
    userRows.push(['SEK-' + pad, 'SEKOLAH', s.no, s.nama, s.kec, 'sekolah' + pad, 'bos' + pad, 'AKTIF']);
  });
  shUsers.getRange(2, 1, userRows.length, 8).setValues(userRows);

  // 3. KONTROL_AKSES_BULAN
  let shAkses = ss.getSheetByName(APP_CONFIG.SHEET_AKSES);
  if (!shAkses) shAkses = ss.insertSheet(APP_CONFIG.SHEET_AKSES);
  shAkses.clear();
  shAkses.appendRow(['SEKOLAH_NO', 'NAMA_SEKOLAH', 'KECAMATAN', ...BULAN_CONFIG.map(b => b.kode)]);
  const aksesRows = MASTER_SEKOLAH_DATA.map(s => [
    s.no, s.nama, s.kec,
    'TERBUKA', 'TERKUNCI', 'TERKUNCI', 'TERKUNCI', 'TERKUNCI', 'TERKUNCI',
    'TERKUNCI', 'TERKUNCI', 'TERKUNCI', 'TERKUNCI', 'TERKUNCI', 'TERKUNCI'
  ]);
  shAkses.getRange(2, 1, aksesRows.length, 15).setValues(aksesRows);

  // 4. LOG_DOKUMEN_UPLOAD
  let shDok = ss.getSheetByName(APP_CONFIG.SHEET_DOKUMEN);
  if (!shDok) shDok = ss.insertSheet(APP_CONFIG.SHEET_DOKUMEN);
  if (shDok.getLastRow() === 0) {
    shDok.appendRow(['DOC_ID', 'SEKOLAH_NO', 'NAMA_SEKOLAH', 'BULAN', 'JENIS_DOKUMEN', 'NAMA_FILE', 'FILE_ID', 'FILE_URL', 'UKURAN_KB', 'WAKTU_UPLOAD', 'STATUS_DOC']);
  }

  // 5. LOG_AUDIT_REVISI (Kolom 14 = STATUS_KEC, Kolom 15 = CATATAN_KEC, Kolom 16 = DIPROSES_KEC_OLEH)
  let shAudit = ss.getSheetByName(APP_CONFIG.SHEET_AUDIT);
  if (!shAudit) shAudit = ss.insertSheet(APP_CONFIG.SHEET_AUDIT);
  if (shAudit.getLastRow() === 0) {
    shAudit.appendRow([
      'LOG_ID', 'SEKOLAH_NO', 'NAMA_SEKOLAH', 'BULAN', 'STATUS_VERIF', 'STATUS_REVISI',
      'ALASAN_REVISI', 'CATATAN_VERIFIKATOR', 'DIPROSES_OLEH', 'WAKTU_UPDATE',
      'KODE_PENGESAHAN', 'ACTIVE_REVIEWER', 'REVIEW_TIMESTAMP',
      'STATUS_KEC', 'CATATAN_KEC', 'DIPROSES_KEC_OLEH'
    ]);
  }

  // 6. Buat 12 Sheet Bulan & 3 Sheet Rekap
  BULAN_CONFIG.forEach(b => createOrResetRekonSheet_(ss, b.kode, 'BULAN ' + b.nama + ' 2026', false, null));
  createOrResetRekonSheet_(ss, 'SEMESTER_1', 'SEMESTER I (JANUARI - JUNI 2026)', true, ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN']);
  createOrResetRekonSheet_(ss, 'SEMESTER_2', 'SEMESTER II (JULI - DESEMBER 2026)', true, ['JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES']);
  createOrResetRekonSheet_(ss, 'TAHUNAN_2026', 'REKAPITULASI TAHUNAN (JANUARI - DESEMBER 2026)', true, BULAN_CONFIG.map(b => b.kode));

  return 'Database SMART-BOS v3.5 berhasil diinisialisasi!';
}/**
 * ============================================================================
 * BAGIAN 2: PEMBUATAN SHEET REKONSILIASI 90 KOLOM & OTENTIKASI USER
 * ============================================================================
 */

function createOrResetRekonSheet_(ss, sheetName, titleSubtitle, isRecap, monthList) {
  let sh = ss.getSheetByName(sheetName);
  if (!sh) sh = ss.insertSheet(sheetName);
  sh.clear();

  // Kop Judul (Baris 1-2)
  sh.getRange(1, 1).setValue('LAMPIRAN BERITA ACARA REKONSILIASI DANA BOSP TAHUN ANGGARAN 2026');
  sh.getRange(2, 1).setValue('DINAS PENDIDIKAN DAN KEBUDAYAAN KABUPATEN BOALEMO — ' + titleSubtitle);
  sh.getRange(1, 1, 2, 15).setFontWeight('bold').setFontSize(11);

  // Header Kolom (Baris 4-6)
  const hRow4 = new Array(90).fill('');
  const hRow5 = new Array(90).fill('');
  const hRow6 = [];
  for (let i = 1; i <= 90; i++) hRow6.push(i);

  hRow4[0] = 'NO';
  hRow4[1] = 'NAMA SATUAN PENDIDIKAN';
  hRow4[2] = 'SALDO AWAL KAS & PAJAK TERHUTANG 2019-2025 (KOLOM 3 - 14)';
  hRow4[14] = 'PENAMBAHAN / PENERIMAAN & PUNGUTAN PAJAK 2026 (KOLOM 15 - 26)';
  hRow4[26] = 'PENARIKAN TUNAI (KOL 27-31)';
  hRow4[31] = 'SETOR / NON-TUNAI (KOL 32-36)';
  hRow4[36] = 'PENGURANGAN / BELANJA & SETORAN PAJAK (KOLOM 37 - 66)';
  hRow4[66] = 'SALDO AKHIR KAS & SISA PAJAK BELUM SETOR (KOLOM 67 - 90)';

  const subLabels = [
    'NO', 'NAMA SATUAN PENDIDIKAN',
    'Reguler Tunai', 'Reguler Bank', 'Kinerja Tunai', 'Kinerja Bank',
    'Afirmasi Tunai', 'Afirmasi Bank', 'Lainnya Tunai', 'Lainnya Bank',
    'Pajak 19-25 PPN', 'Pajak 19-25 PPh21', 'Pajak 19-25 PPh23', 'Pajak 19-25 SSPD',
    'Terima Reguler', 'Terima Kinerja', 'SiLPA Kinerja', 'Terima Afirmasi', 'SiLPA Afirmasi',
    'Terima Lainnya', 'Bunga/Jasa Giro', 'Pungut PPN 26', 'Pungut PPh21 26', 'Pungut PPh23 26', 'Pungut SSPD 26',
    'JML PENAMBAHAN',
    'Tarik Reguler', 'Tarik Kinerja', 'Tarik Afirmasi', 'Tarik Lainnya', 'JML PENARIKAN',
    'NonTunai Reguler', 'NonTunai Kinerja', 'NonTunai Afirmasi', 'NonTunai Lainnya', 'JML NON-TUNAI',
    'Operasi Reguler', 'Operasi Kinerja', 'Operasi SiLPA Kin', 'Operasi Afirmasi', 'Operasi SiLPA Afir', 'Operasi Lainnya',
    'Modal Mesin Reg', 'Modal Mesin Kin', 'Modal Mesin SiLPA Kin', 'Modal Mesin Afir', 'Modal Mesin SiLPA Afir', 'Modal Mesin Lain',
    'Modal Aset Reg', 'Modal Aset Kin', 'Modal Aset SiLPA Kin', 'Modal Aset Afir', 'Modal Aset SiLPA Afir', 'Modal Aset Lain',
    'Setor Giro', 'Admin/Pajak Bank', 'Kembali ke RKUD',
    'Setor PPN 19-25', 'Setor PPh21 19-25', 'Setor PPh23 19-25', 'Setor SSPD 19-25',
    'Setor PPN 26', 'Setor PPh21 26', 'Setor PPh23 26', 'Setor SSPD 26',
    'JML PENGURANGAN',
    'Saldo Akhir Reg', 'Akhir Reg Tunai', 'Akhir Reg Bank',
    'Saldo Akhir Kin', 'Akhir Kin Tunai', 'Akhir Kin Bank',
    'Saldo Akhir Afir', 'Akhir Afir Tunai', 'Akhir Afir Bank',
    'Saldo Akhir Lain', 'Akhir Lain Tunai', 'Akhir Lain Bank',
    'TOTAL SALDO BKU', 'TOTAL TUNAI', 'TOTAL BANK',
    'TOTAL SISA PAJAK',
    'Sisa PPN 26', 'Sisa PPh21 26', 'Sisa PPh23 26', 'Sisa SSPD 26',
    'Sisa PPN 19-25', 'Sisa PPh21 19-25', 'Sisa PPh23 19-25', 'Sisa SSPD 19-25'
  ];
  for (let i = 0; i < 90; i++) hRow5[i] = subLabels[i] || '';

  sh.getRange(4, 1, 3, 90).setValues([hRow4, hRow5, hRow6]);
  sh.getRange(4, 1, 3, 90)
    .setBackground('#0F294A')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);

  const grid = Array.from({ length: 196 }, () => new Array(90).fill(''));

  MASTER_SEKOLAH_DATA.forEach(s => {
    const rIdx = getSheetRowForSchool_(s.no) - 7;
    const rowNum = getSheetRowForSchool_(s.no);
    grid[rIdx][0] = s.no;
    grid[rIdx][1] = s.nama;

    for (let c = 2; c < 90; c++) grid[rIdx][c] = 0;

    if (isRecap && monthList && monthList.length > 0) {
      const firstMonth = monthList[0];
      for (let col = 3; col <= 14; col++) {
        const letCol = colToLetter_(col);
        grid[rIdx][col - 1] = `=${firstMonth}!${letCol}${rowNum}`;
      }
      for (let col = 15; col <= 65; col++) {
        if ([26, 31, 36].includes(col)) continue;
        const letCol = colToLetter_(col);
        const terms = monthList.map(m => `${m}!${letCol}${rowNum}`);
        grid[rIdx][col - 1] = '=' + terms.join('+');
      }
    }

    // Formula Aktif Standar per Baris Sekolah
    grid[rIdx][25] = `=SUM(O${rowNum}:Y${rowNum})`; // Col 26
    grid[rIdx][30] = `=SUM(AA${rowNum}:AD${rowNum})`; // Col 31
    grid[rIdx][35] = `=SUM(AF${rowNum}:AI${rowNum})`; // Col 36
    grid[rIdx][65] = `=SUM(AK${rowNum}:BM${rowNum})`; // Col 66

    // Saldo Akhir Reguler (67, 68, 69)
    grid[rIdx][67] = `=(C${rowNum}+AA${rowNum}+AF${rowNum})-(AK${rowNum}+AQ${rowNum}+AW${rowNum})`;
    grid[rIdx][68] = `=(D${rowNum}+O${rowNum}+U${rowNum})-(AA${rowNum}+AF${rowNum}+BC${rowNum}+BD${rowNum}+BE${rowNum})`;
    grid[rIdx][66] = `=BP${rowNum}+BQ${rowNum}`;

    // Saldo Akhir Kinerja (70, 71, 72)
    grid[rIdx][70] = `=(E${rowNum}+AB${rowNum}+AG${rowNum})-(AL${rowNum}+AM${rowNum}+AR${rowNum}+AS${rowNum}+AX${rowNum}+AY${rowNum})`;
    grid[rIdx][71] = `=(F${rowNum}+P${rowNum}+Q${rowNum})-(AB${rowNum}+AG${rowNum})`;
    grid[rIdx][69] = `=BS${rowNum}+BT${rowNum}`;

    // Saldo Akhir Afirmasi (73, 74, 75)
    grid[rIdx][73] = `=(G${rowNum}+AC${rowNum}+AH${rowNum})-(AN${rowNum}+AO${rowNum}+AT${rowNum}+AU${rowNum}+AZ${rowNum}+BA${rowNum})`;
    grid[rIdx][74] = `=(H${rowNum}+R${rowNum}+S${rowNum})-(AC${rowNum}+AH${rowNum})`;
    grid[rIdx][72] = `=BV${rowNum}+BW${rowNum}`;

    // Saldo Akhir Lainnya (76, 77, 78)
    grid[rIdx][76] = `=(I${rowNum}+AD${rowNum}+AI${rowNum})-(AP${rowNum}+AV${rowNum}+BB${rowNum})`;
    grid[rIdx][77] = `=(J${rowNum}+T${rowNum})-(AD${rowNum}+AI${rowNum})`;
    grid[rIdx][75] = `=BY${rowNum}+BZ${rowNum}`;

    // Total BKU, Tunai, Bank (79, 80, 81)
    grid[rIdx][78] = `=BO${rowNum}+BR${rowNum}+BU${rowNum}+BX${rowNum}`;
    grid[rIdx][79] = `=BP${rowNum}+BS${rowNum}+BV${rowNum}+BY${rowNum}`;
    grid[rIdx][80] = `=BQ${rowNum}+BT${rowNum}+BW${rowNum}+BZ${rowNum}`;

    // Sisa Pajak 2026 & 2019-2025 (82..90)
    grid[rIdx][82] = `=V${rowNum}-BJ${rowNum}`; // Col 83
    grid[rIdx][83] = `=W${rowNum}-BK${rowNum}`; // Col 84
    grid[rIdx][84] = `=X${rowNum}-BL${rowNum}`; // Col 85
    grid[rIdx][85] = `=Y${rowNum}-BM${rowNum}`; // Col 86
    grid[rIdx][86] = `=K${rowNum}-BF${rowNum}`; // Col 87
    grid[rIdx][87] = `=L${rowNum}-BG${rowNum}`; // Col 88
    grid[rIdx][88] = `=M${rowNum}-BH${rowNum}`; // Col 89
    grid[rIdx][89] = `=N${rowNum}-BI${rowNum}`; // Col 90
    grid[rIdx][81] = `=SUM(CE${rowNum}:CL${rowNum})`; // Col 82
  });

  // Baris Subtotal & Grand Total
  const setSumRow = (targetRow, label, startR, endR) => {
    const idx = targetRow - 7;
    grid[idx][1] = label;
    for (let c = 3; c <= 90; c++) {
      const letCol = colToLetter_(c);
      grid[idx][c - 1] = `=SUM(${letCol}${startR}:${letCol}${endR})`;
    }
  };
  setSumRow(142, 'JUMLAH SD NEGERI', 7, 141);
  setSumRow(192, 'JUMLAH SMP NEGERI', 144, 191);
  setSumRow(201, 'JUMLAH SWASTA', 194, 200);

  // Baris 202: JUMLAH TOTAL
  const totIdx = 202 - 7;
  grid[totIdx][1] = 'JUMLAH TOTAL';
  for (let c = 3; c <= 90; c++) {
    const letCol = colToLetter_(c);
    grid[totIdx][c - 1] = `=${letCol}142+${letCol}192+${letCol}201`;
  }

  sh.getRange(7, 1, 196, 90).setValues(grid);
  sh.getRange(7, 3, 196, 88).setNumberFormat('#,##0.00');

  [142, 192, 201].forEach(r => {
    sh.getRange(r, 1, 1, 90).setBackground('#E0F2FE').setFontWeight('bold');
  });
  sh.getRange(202, 1, 1, 90).setBackground('#FEF08A').setFontWeight('bold');
  sh.setFrozenRows(6);
  sh.setFrozenColumns(2);
}

function colToLetter_(col) {
  let temp = '';
  let letter = '';
  while (col > 0) {
    temp = (col - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    col = (col - temp - 1) / 26;
  }
  return letter;
}

/**
 * ============================================================================
 * OTENTIKASI & MANAJEMEN AKUN
 * ============================================================================
 */
function loginUser(username, password, petugasName) {
  const ss = getSpreadsheet_();
  const sh = ss.getSheetByName(APP_CONFIG.SHEET_USERS);
  if (!sh) return { success: false, message: 'Database belum diinisialisasi. Jalankan setupSmartBosDatabase() terlebih dahulu.' };

  const data = sh.getDataRange().getValues();
  const uClean = String(username || '').trim().toLowerCase();
  const pClean = String(password || '').trim();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (String(row[5]).trim().toLowerCase() === uClean && String(row[6]).trim() === pClean) {
      if (String(row[7]).trim().toUpperCase() !== 'AKTIF') {
        return { success: false, message: 'Akun Anda berstatus NONAKTIF. Hubungi Super Admin Dinas.' };
      }
      const role = String(row[1]).trim();
      const petugas = role === 'SUPER_ADMIN'
        ? (String(petugasName || '').trim() || 'Super Admin Dinas')
        : String(row[3]).trim();

      return {
        success: true,
        user: {
          userId: String(row[0]),
          role: role,
          sekolahNo: Number(row[2]) || 0,
          namaLengkap: String(row[3]),
          kecamatan: String(row[4]),
          username: String(row[5]),
          petugasName: petugas
        }
      };
    }
  }
  return { success: false, message: 'Username atau Password tidak sesuai.' };
}

function getAllUsers(currentUser) {
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') return [];
  const ss = getSpreadsheet_();
  const sh = ss.getSheetByName(APP_CONFIG.SHEET_USERS);
  const data = sh.getDataRange().getValues();
  const result = [];
  for (let i = 1; i < data.length; i++) {
    result.push({
      rowIndex: i + 1,
      userId: String(data[i][0]),
      role: String(data[i][1]),
      sekolahNo: Number(data[i][2]) || 0,
      namaLengkap: String(data[i][3]),
      kecamatan: String(data[i][4]),
      username: String(data[i][5]),
      password: String(data[i][6]),
      statusAkun: String(data[i][7])
    });
  }
  return result;
}

function updateUserAccount(payload, currentUser) {
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    return { success: false, message: 'Akses ditolak.' };
  }
  const ss = getSpreadsheet_();
  const sh = ss.getSheetByName(APP_CONFIG.SHEET_USERS);
  const r = Number(payload.rowIndex);
  sh.getRange(r, 4).setValue(payload.namaLengkap);
  sh.getRange(r, 6).setValue(payload.username);
  sh.getRange(r, 7).setValue(payload.password);
  sh.getRange(r, 8).setValue(payload.statusAkun);
  return { success: true, message: 'Perubahan akun ' + payload.username + ' berhasil disimpan!' };
}

/**
 * ============================================================================
 * AMBIL DATA BULANAN SEKOLAH, SALDO BULAN LALU, & SIMPAN REALISASI
 * ============================================================================
 */
function getSchoolMonthData(sekolahNo, bulanKode, currentUser) {
  const ss = getSpreadsheet_();
  const no = Number(sekolahNo);
  const rowNum = getSheetRowForSchool_(no);
  const shBulan = ss.getSheetByName(bulanKode);
  const values = shBulan.getRange(rowNum, 1, 1, 90).getValues()[0];

  // Cek status akses bulan
  const shAkses = ss.getSheetByName(APP_CONFIG.SHEET_AKSES);
  const colIdx = BULAN_CONFIG.findIndex(b => b.kode === bulanKode) + 4;
  const statusBulan = String(shAkses.getRange(no + 1, colIdx).getValue() || 'TERKUNCI');

  // Ambil metadata audit, revisi & rekomendasi kecamatan
  const meta = getAuditMetaForSchoolMonth_(ss, no, bulanKode);

  // Ambil dokumen bulan ini + carry-over RKAS jika ada
  const docs = getDocumentsForSchoolMonth_(ss, no, bulanKode);

  return {
    sekolahNo: no,
    bulanKode: bulanKode,
    statusBulan: statusBulan,
    statusVerif: meta.statusVerif || 'BELUM',
    meta: meta,
    values: values,
    documents: docs
  };
}

function getPreviousMonthEndingBalances(sekolahNo, bulanKode) {
  const bIdx = BULAN_CONFIG.findIndex(b => b.kode === bulanKode);
  if (bIdx <= 0) {
    return { success: false, message: 'Bulan Januari tidak memiliki bulan sebelumnya dalam TA 2026.' };
  }
  const prevBulan = BULAN_CONFIG[bIdx - 1];
  const ss = getSpreadsheet_();
  const shPrev = ss.getSheetByName(prevBulan.kode);
  const rowNum = getSheetRowForSchool_(Number(sekolahNo));
  const v = shPrev.getRange(rowNum, 1, 1, 90).getValues()[0];

  // Mapping Saldo Akhir Bulan Lalu (Kol 68..90) -> Saldo Awal Bulan Ini (Kol 3..14)
  const saldoAwal = {
    c3: Number(v[67]) || 0, // Reguler Tunai <- Col 68
    c4: Number(v[68]) || 0, // Reguler Bank <- Col 69
    c5: Number(v[70]) || 0, // Kinerja Tunai <- Col 71
    c6: Number(v[71]) || 0, // Kinerja Bank <- Col 72
    c7: Number(v[73]) || 0, // Afirmasi Tunai <- Col 74
    c8: Number(v[74]) || 0, // Afirmasi Bank <- Col 75
    c9: Number(v[76]) || 0, // Lainnya Tunai <- Col 77
    c10: Number(v[77]) || 0, // Lainnya Bank <- Col 78
    c11: (Number(v[82]) || 0) + (Number(v[86]) || 0), // PPN
    c12: (Number(v[83]) || 0) + (Number(v[87]) || 0), // PPh 21
    c13: (Number(v[84]) || 0) + (Number(v[88]) || 0), // PPh 23
    c14: (Number(v[85]) || 0) + (Number(v[89]) || 0)  // SSPD
  };

  return {
    success: true,
    prevBulanNama: prevBulan.nama,
    saldoAwal: saldoAwal
  };
}
/**
 * ============================================================================
 * BAGIAN 3: SIMPAN DATA, UPLOAD DOKUMEN, AUDIT BERJENJANG & EXPORT EXCEL 15 SHEET
 * ============================================================================
 */

function saveSchoolMonthData(payload, currentUser) {
  const ss = getSpreadsheet_();
  const no = Number(payload.sekolahNo);
  const bulanKode = String(payload.bulanKode);
  const inputs = payload.inputs || {};

  // Cek hak akses simpan
  const shAkses = ss.getSheetByName(APP_CONFIG.SHEET_AKSES);
  const colIdx = BULAN_CONFIG.findIndex(b => b.kode === bulanKode) + 4;
  const statusBulan = String(shAkses.getRange(no + 1, colIdx).getValue() || 'TERKUNCI');

  if (currentUser.role === 'SEKOLAH' && statusBulan !== 'TERBUKA') {
    return { success: false, message: 'Akses bulan ' + bulanKode + ' dalam status TERKUNCI. Silakan ajukan permohonan izin revisi.' };
  }

  // Validasi kelengkapan dokumen (4 Dokumen Wajib + Bukti Pajak wajib jika Kolom 58-65 > 0)
  const docs = getDocumentsForSchoolMonth_(ss, no, bulanKode);
  const hasPdfArkas = docs.some(d => d.jenisDokumen === 'BKU_ARKAS_PDF');
  const hasBkuManual = docs.some(d => d.jenisDokumen === 'BKU_MANUAL_XLS' || d.jenisDokumen === 'BKU_MANUAL');
  const hasRekKoran = docs.some(d => d.jenisDokumen === 'REKENING_KORAN');
  const hasRkas = docs.some(d => d.jenisDokumen === 'RKAS_TERAKHIR');
  const hasBuktiPajak = docs.some(d => d.jenisDokumen === 'BUKTI_PAJAK');

  const totalSetorPajak =
    (Number(inputs.c58) || 0) + (Number(inputs.c59) || 0) + (Number(inputs.c60) || 0) + (Number(inputs.c61) || 0) +
    (Number(inputs.c62) || 0) + (Number(inputs.c63) || 0) + (Number(inputs.c64) || 0) + (Number(inputs.c65) || 0);

  const missing = [];
  if (!hasPdfArkas) missing.push('1. BKU ARKAS (PDF)');
  if (!hasBkuManual) missing.push('2. BKU Manual');
  if (!hasRekKoran) missing.push('3. Rekening Koran Bank');
  if (!hasRkas) missing.push('4. RKAS Induk / Pergeseran');
  if (totalSetorPajak > 0.009 && !hasBuktiPajak) {
    missing.push('5. Bukti Setoran Pajak / NTPN (Wajib karena Setoran Pajak > Rp 0)');
  }

  if (missing.length > 0) {
    return {
      success: false,
      message: 'Gagal menyimpan! Dokumen lampiran wajib belum lengkap: ' + missing.join(', ')
    };
  }

  // Tulis nilai ke baris sekolah (hanya kolom input, tanpa menimpa rumus)
  const shBulan = ss.getSheetByName(bulanKode);
  const rowNum = getSheetRowForSchool_(no);
  const inputCols = [
    3,4,5,6,7,8,9,10,11,12,13,14,
    15,16,17,18,19,20,21,22,23,24,25,
    27,28,29,30,
    32,33,34,35,
    37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65
  ];

  inputCols.forEach(c => {
    const val = Number(inputs['c' + c]) || 0;
    shBulan.getRange(rowNum, c).setValue(val);
  });

  // Kunci otomatis setelah sekolah menyimpan realisasi
  if (currentUser.role === 'SEKOLAH') {
    shAkses.getRange(no + 1, colIdx).setValue('TERKUNCI');
  }

  // Reset status revisi jika sebelumnya dalam mode revisi terbuka
  upsertAuditMeta_(ss, no, bulanKode, {
    statusRevisi: 'SELESAI_REVISI',
    waktuUpdate: new Date().toISOString()
  });

  SpreadsheetApp.flush();
  return {
    success: true,
    message: 'Data realisasi BKU & lampiran bulan ' + bulanKode + ' 2026 berhasil disimpan dan dikunci!'
  };
}

/**
 * ============================================================================
 * MANAJEMEN DOKUMEN GOOGLE DRIVE & AUTO CARRY-OVER RKAS
 * ============================================================================
 */
function getOrCreateRootDriveFolder_() {
  const folders = DriveApp.getFoldersByName(APP_CONFIG.DRIVE_ROOT_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(APP_CONFIG.DRIVE_ROOT_FOLDER_NAME);
}

function getOrCreateSubFolder_(parentFolder, name) {
  const it = parentFolder.getFoldersByName(name);
  if (it.hasNext()) return it.next();
  return parentFolder.createFolder(name);
}

function uploadSchoolDocument(payload, currentUser) {
  const ss = getSpreadsheet_();
  const no = Number(payload.sekolahNo);
  const bulanKode = String(payload.bulanKode);
  const jenis = String(payload.jenisDokumen);
  const sekObj = MASTER_SEKOLAH_DATA.find(s => s.no === no);
  const namaSek = sekObj ? sekObj.nama : ('SEKOLAH_' + no);

  // Cek kunci bulan jika yang upload adalah sekolah
  const shAkses = ss.getSheetByName(APP_CONFIG.SHEET_AKSES);
  const colIdx = BULAN_CONFIG.findIndex(b => b.kode === bulanKode) + 4;
  const statusBulan = String(shAkses.getRange(no + 1, colIdx).getValue() || 'TERKUNCI');
  if (currentUser.role === 'SEKOLAH' && statusBulan !== 'TERBUKA') {
    return { success: false, message: 'Akses bulan ' + bulanKode + ' sedang TERKUNCI.' };
  }

  const root = getOrCreateRootDriveFolder_();
  const sekFolder = getOrCreateSubFolder_(root, String(no).padStart(3, '0') + '_' + namaSek);
  const bulFolder = getOrCreateSubFolder_(sekFolder, bulanKode + '_2026');

  const decoded = Utilities.base64Decode(payload.base64Data);
  const blob = Utilities.newBlob(decoded, payload.mimeType, payload.fileName);
  const file = bulFolder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Access.VIEW);

  const fileId = file.getId();
  const previewUrl = 'https://drive.google.com/file/d/' + fileId + '/preview';
  const sizeKB = Math.max(1, Math.round(decoded.length / 1024));

  // Nonaktifkan dokumen lama pada slot jenis yang sama di bulan tersebut
  const shDok = ss.getSheetByName(APP_CONFIG.SHEET_DOKUMEN);
  const rows = shDok.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (Number(rows[i][1]) === no && String(rows[i][3]) === bulanKode && String(rows[i][4]) === jenis && String(rows[i][10]) === 'AKTIF') {
      shDok.getRange(i + 1, 11).setValue('DIGANTI');
    }
  }

  const docId = 'DOC-' + new Date().getTime() + '-' + no;
  shDok.appendRow([
    docId, no, namaSek, bulanKode, jenis, payload.fileName,
    fileId, previewUrl, sizeKB, new Date().toISOString(), 'AKTIF'
  ]);

  return { success: true, message: 'Dokumen ' + payload.fileName + ' berhasil diunggah!' };
}

function deleteSchoolDocument(docId, currentUser) {
  const ss = getSpreadsheet_();
  const shDok = ss.getSheetByName(APP_CONFIG.SHEET_DOKUMEN);
  const rows = shDok.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(docId)) {
      const no = Number(rows[i][1]);
      const bulanKode = String(rows[i][3]);
      const shAkses = ss.getSheetByName(APP_CONFIG.SHEET_AKSES);
      const colIdx = BULAN_CONFIG.findIndex(b => b.kode === bulanKode) + 4;
      const statusBulan = String(shAkses.getRange(no + 1, colIdx).getValue() || 'TERKUNCI');

      if (currentUser.role === 'SEKOLAH' && statusBulan !== 'TERBUKA') {
        return { success: false, message: 'Tidak dapat menghapus dokumen karena bulan sudah TERKUNCI.' };
      }

      try {
        DriveApp.getFileById(String(rows[i][6])).setTrashed(true);
      } catch (e) {}

      shDok.getRange(i + 1, 11).setValue('DIHAPUS');
      return { success: true, message: 'Dokumen berhasil dihapus.' };
    }
  }
  return { success: false, message: 'Dokumen tidak ditemukan.' };
}

function getDocumentsForSchoolMonth_(ss, sekolahNo, bulanKode) {
  const shDok = ss.getSheetByName(APP_CONFIG.SHEET_DOKUMEN);
  if (!shDok) return [];
  const rows = shDok.getDataRange().getValues();
  const docs = [];
  let hasDirectRkas = false;

  for (let i = 1; i < rows.length; i++) {
    if (Number(rows[i][1]) === Number(sekolahNo) && String(rows[i][3]) === bulanKode && String(rows[i][10]) === 'AKTIF') {
      const jenis = String(rows[i][4]);
      if (jenis === 'RKAS_TERAKHIR') hasDirectRkas = true;
      docs.push({
        docId: String(rows[i][0]),
        sekolahNo: Number(rows[i][1]),
        bulanKode: String(rows[i][3]),
        jenisDokumen: jenis,
        namaFile: String(rows[i][5]),
        fileId: String(rows[i][6]),
        fileUrl: String(rows[i][7]),
        ukuranKB: Number(rows[i][8]) || 0,
        isCarriedOver: false,
        sourceBulan: bulanKode
      });
    }
  }

  // Auto Carry-Over RKAS dari bulan sebelumnya jika bulan ini belum unggah RKAS baru
  if (!hasDirectRkas) {
    const targetIdx = BULAN_CONFIG.findIndex(b => b.kode === bulanKode);
    for (let b = targetIdx - 1; b >= 0; b--) {
      const prevCode = BULAN_CONFIG[b].kode;
      for (let i = rows.length - 1; i >= 1; i--) {
        if (
          Number(rows[i][1]) === Number(sekolahNo) &&
          String(rows[i][3]) === prevCode &&
          String(rows[i][4]) === 'RKAS_TERAKHIR' &&
          String(rows[i][10]) === 'AKTIF'
        ) {
          docs.push({
            docId: String(rows[i][0]),
            sekolahNo: Number(rows[i][1]),
            bulanKode: bulanKode,
            jenisDokumen: 'RKAS_TERAKHIR',
            namaFile: String(rows[i][5]),
            fileId: String(rows[i][6]),
            fileUrl: String(rows[i][7]),
            ukuranKB: Number(rows[i][8]) || 0,
            isCarriedOver: true,
            sourceBulan: prevCode
          });
          hasDirectRkas = true;
          break;
        }
      }
      if (hasDirectRkas) break;
    }
  }

  return docs;
}

/**
 * ============================================================================
 * AUDIT BERJENJANG: REKOMENDASI KECAMATAN, PENGESAHAN SUPER ADMIN & REVISI
 * ============================================================================
 */
function getAuditMetaForSchoolMonth_(ss, sekolahNo, bulanKode) {
  const shAudit = ss.getSheetByName(APP_CONFIG.SHEET_AUDIT);
  if (!shAudit) return {};
  const rows = shAudit.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (Number(rows[i][1]) === Number(sekolahNo) && String(rows[i][3]) === bulanKode) {
      return {
        rowIndex: i + 1,
        logId: String(rows[i][0]),
        statusVerif: String(rows[i][4] || 'BELUM'),
        statusRevisi: String(rows[i][5] || ''),
        alasan: String(rows[i][6] || ''),
        catatanVerifikator: String(rows[i][7] || ''),
        diprosesOleh: String(rows[i][8] || ''),
        waktuUpdate: String(rows[i][9] || ''),
        kodePengesahan: String(rows[i][10] || ''),
        activeReviewer: String(rows[i][11] || ''),
        reviewTimestamp: String(rows[i][12] || ''),
        statusKec: String(rows[i][13] || 'BELUM'),
        catatanKec: String(rows[i][14] || ''),
        diprosesKecOleh: String(rows[i][15] || '')
      };
    }
  }
  return { statusVerif: 'BELUM', statusKec: 'BELUM' };
}

function upsertAuditMeta_(ss, sekolahNo, bulanKode, patch) {
  const shAudit = ss.getSheetByName(APP_CONFIG.SHEET_AUDIT);
  const existing = getAuditMetaForSchoolMonth_(ss, sekolahNo, bulanKode);
  const sekObj = MASTER_SEKOLAH_DATA.find(s => s.no === Number(sekolahNo));
  const namaSek = sekObj ? sekObj.nama : ('SEKOLAH_' + sekolahNo);

  if (existing.rowIndex) {
    const r = existing.rowIndex;
    if (patch.statusVerif !== undefined) shAudit.getRange(r, 5).setValue(patch.statusVerif);
    if (patch.statusRevisi !== undefined) shAudit.getRange(r, 6).setValue(patch.statusRevisi);
    if (patch.alasan !== undefined) shAudit.getRange(r, 7).setValue(patch.alasan);
    if (patch.catatanVerifikator !== undefined) shAudit.getRange(r, 8).setValue(patch.catatanVerifikator);
    if (patch.diprosesOleh !== undefined) shAudit.getRange(r, 9).setValue(patch.diprosesOleh);
    if (patch.waktuUpdate !== undefined) shAudit.getRange(r, 10).setValue(patch.waktuUpdate);
    if (patch.kodePengesahan !== undefined) shAudit.getRange(r, 11).setValue(patch.kodePengesahan);
    if (patch.activeReviewer !== undefined) shAudit.getRange(r, 12).setValue(patch.activeReviewer);
    if (patch.reviewTimestamp !== undefined) shAudit.getRange(r, 13).setValue(patch.reviewTimestamp);
    if (patch.statusKec !== undefined) shAudit.getRange(r, 14).setValue(patch.statusKec);
    if (patch.catatanKec !== undefined) shAudit.getRange(r, 15).setValue(patch.catatanKec);
    if (patch.diprosesKecOleh !== undefined) shAudit.getRange(r, 16).setValue(patch.diprosesKecOleh);
  } else {
    shAudit.appendRow([
      'LOG-' + new Date().getTime() + '-' + sekolahNo,
      Number(sekolahNo),
      namaSek,
      bulanKode,
      patch.statusVerif || 'BELUM',
      patch.statusRevisi || '',
      patch.alasan || '',
      patch.catatanVerifikator || '',
      patch.diprosesOleh || '',
      patch.waktuUpdate || new Date().toISOString(),
      patch.kodePengesahan || '',
      patch.activeReviewer || '',
      patch.reviewTimestamp || '',
      patch.statusKec || 'BELUM',
      patch.catatanKec || '',
      patch.diprosesKecOleh || ''
    ]);
  }
}

/**
 * Fitur Baru v3.5: Admin Kecamatan menandai sekolah sudah SIAP_AUDIT untuk Super Admin
 */
function toggleRekomendasiKecamatan(sekolahNo, bulanKode, isReady, catatanKec, currentUser) {
  if (!currentUser || (currentUser.role !== 'ADMIN_KEC' && currentUser.role !== 'SUPER_ADMIN')) {
    return { success: false, message: 'Akses ditolak.' };
  }
  const ss = getSpreadsheet_();
  const no = Number(sekolahNo);
  const sekObj = MASTER_SEKOLAH_DATA.find(s => s.no === no);

  if (currentUser.role === 'ADMIN_KEC' && sekObj && sekObj.kec !== currentUser.kecamatan) {
    return { success: false, message: 'Anda hanya dapat merekomendasikan sekolah di wilayah ' + currentUser.kecamatan + '.' };
  }

  if (isReady) {
    // Pastikan 4 dokumen wajib sudah lengkap sebelum direkomendasikan siap audit
    const docs = getDocumentsForSchoolMonth_(ss, no, bulanKode);
    const hasPdfArkas = docs.some(d => d.jenisDokumen === 'BKU_ARKAS_PDF');
    const hasBkuManual = docs.some(d => d.jenisDokumen === 'BKU_MANUAL_XLS' || d.jenisDokumen === 'BKU_MANUAL');
    const hasRekKoran = docs.some(d => d.jenisDokumen === 'REKENING_KORAN');
    const hasRkas = docs.some(d => d.jenisDokumen === 'RKAS_TERAKHIR');
    if (!hasPdfArkas || !hasBkuManual || !hasRekKoran || !hasRkas) {
      return {
        success: false,
        message: 'Belum dapat ditandai Siap Audit! Kelengkapan 4 dokumen wajib sekolah belum terpenuhi.'
      };
    }
  }

  upsertAuditMeta_(ss, no, bulanKode, {
    statusKec: isReady ? 'SIAP_AUDIT' : 'BELUM',
    catatanKec: isReady ? String(catatanKec || '').trim() : '',
    diprosesKecOleh: isReady ? currentUser.namaLengkap : '',
    waktuUpdate: new Date().toISOString()
  });

  return {
    success: true,
    message: isReady
      ? 'Sekolah berhasil ditandai SIAP AUDIT dan diteruskan ke Super Admin!'
      : 'Tanda Siap Audit dari kecamatan dibatalkan.'
  };
}

function claimReviewSchoolMonth(sekolahNo, bulanKode, currentUser) {
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') return { lockedByOther: false };
  const ss = getSpreadsheet_();
  const meta = getAuditMetaForSchoolMonth_(ss, sekolahNo, bulanKode);
  const now = new Date().getTime();
  const lastTs = Number(meta.reviewTimestamp) || 0;
  const myName = currentUser.petugasName || 'Super Admin';

  if (meta.activeReviewer && meta.activeReviewer !== myName && (now - lastTs) < 10 * 60 * 1000) {
    return {
      lockedByOther: true,
      message: 'Perhatian: Berkas sekolah ini sedang dibuka oleh Verifikator "' + meta.activeReviewer + '".'
    };
  }

  upsertAuditMeta_(ss, sekolahNo, bulanKode, {
    activeReviewer: myName,
    reviewTimestamp: String(now)
  });
  return { lockedByOther: false };
}

function toggleVerifikasiSekolah(sekolahNo, bulanKode, isVerified, catatan, currentUser) {
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    return { success: false, message: 'Hanya Super Admin yang berhak mengesahkan rekonsiliasi.' };
  }
  const ss = getSpreadsheet_();
  const no = Number(sekolahNo);
  const petugas = currentUser.petugasName || 'Super Admin Dinas';
  const kodeSah = isVerified
    ? ('SAH-' + bulanKode + '-' + String(no).padStart(3, '0') + '-' + Math.floor(1000 + Math.random() * 9000))
    : '';

  upsertAuditMeta_(ss, no, bulanKode, {
    statusVerif: isVerified ? 'TERVERIFIKASI' : 'BELUM',
    catatanVerifikator: String(catatan || '').trim(),
    diprosesOleh: petugas,
    kodePengesahan: kodeSah,
    waktuUpdate: new Date().toISOString()
  });

  // Pastikan bulan terkunci saat disahkan
  if (isVerified) {
    const shAkses = ss.getSheetByName(APP_CONFIG.SHEET_AKSES);
    const colIdx = BULAN_CONFIG.findIndex(b => b.kode === bulanKode) + 4;
    shAkses.getRange(no + 1, colIdx).setValue('TERKUNCI');
  }

  return {
    success: true,
    message: isVerified
      ? 'Rekonsiliasi disahkan (SAH)! Kode Pengesahan: ' + kodeSah
      : 'Pengesahan rekonsiliasi dibatalkan. Status kembali menjadi Belum Diaudit.'
  };
}

function ajukanIzinRevisiSekolah(sekolahNo, bulanKode, alasan, currentUser) {
  const ss = getSpreadsheet_();
  upsertAuditMeta_(ss, sekolahNo, bulanKode, {
    statusRevisi: 'MENUNGGU_IZIN',
    alasan: String(alasan || '').trim(),
    waktuUpdate: new Date().toISOString()
  });
  return { success: true, message: 'Permohonan izin perubahan data berhasil dikirim ke Super Admin Dinas.' };
}

function prosesIzinRevisiSuperAdmin(sekolahNo, bulanKode, keputusan, catatan, currentUser) {
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    return { success: false, message: 'Akses ditolak.' };
  }
  const ss = getSpreadsheet_();
  const no = Number(sekolahNo);
  const isIzinkan = keputusan === 'IZINKAN';
  const petugas = currentUser.petugasName || 'Super Admin Dinas';

  if (isIzinkan) {
    // 1. Buka kembali kunci akses bulan sekolah
    const shAkses = ss.getSheetByName(APP_CONFIG.SHEET_AKSES);
    const colIdx = BULAN_CONFIG.findIndex(b => b.kode === bulanKode) + 4;
    shAkses.getRange(no + 1, colIdx).setValue('TERBUKA');

    // 2. AUTO-RESET: Jika sebelumnya sudah SAH atau SIAP_AUDIT, wajib di-reset agar diaudit ulang!
    upsertAuditMeta_(ss, no, bulanKode, {
      statusVerif: 'BELUM',
      kodePengesahan: '',
      statusKec: 'BELUM',
      catatanKec: '',
      diprosesKecOleh: '',
      statusRevisi: 'DIIZINKAN',
      catatanVerifikator: catatan ? ('Izin Revisi Disetujui: ' + catatan) : 'Izin revisi disetujui. Silakan perbaiki data dan simpan ulang.',
      diprosesOleh: petugas,
      waktuUpdate: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Kunci bulan ' + bulanKode + ' dibuka & status pengesahan di-reset agar diaudit ulang setelah revisi.'
    };
  } else {
    upsertAuditMeta_(ss, no, bulanKode, {
      statusRevisi: 'DITOLAK',
      catatanVerifikator: catatan ? ('Permohonan Revisi Ditolak: ' + catatan) : 'Permohonan revisi ditolak oleh Super Admin.',
      diprosesOleh: petugas,
      waktuUpdate: new Date().toISOString()
    });
    return { success: true, message: 'Permohonan izin revisi ditolak.' };
  }
}

function updateBulanAccess(scope, sekolahNo, bulanKode, status, currentUser) {
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    return { success: false, message: 'Hanya Super Admin yang dapat mengubah akses bulan.' };
  }
  const ss = getSpreadsheet_();
  const shAkses = ss.getSheetByName(APP_CONFIG.SHEET_AKSES);
  const colIdx = BULAN_CONFIG.findIndex(b => b.kode === bulanKode) + 4;

  if (scope === 'ALL') {
    const vals = Array.from({ length: MASTER_SEKOLAH_DATA.length }, () => [status]);
    shAkses.getRange(2, colIdx, vals.length, 1).setValues(vals);
    return { success: true, message: 'Status akses bulan ' + bulanKode + ' 2026 untuk 190 sekolah diubah menjadi ' + status + '.' };
  } else {
    shAkses.getRange(Number(sekolahNo) + 1, colIdx).setValue(status);
    return { success: true, message: 'Status akses sekolah diperbarui menjadi ' + status + '.' };
  }
}

/**
 * ============================================================================
 * LIVE MONITORING REAL-TIME (SUPER ADMIN & ADMIN KECAMATAN)
 * ============================================================================
 */
function getLiveMonitoringData(bulanKode, filterKec, filterJenjang, currentUser) {
  const ss = getSpreadsheet_();
  const shBulan = ss.getSheetByName(bulanKode);
  const shAkses = ss.getSheetByName(APP_CONFIG.SHEET_AKSES);
  const shDok = ss.getSheetByName(APP_CONFIG.SHEET_DOKUMEN);
  const shAudit = ss.getSheetByName(APP_CONFIG.SHEET_AUDIT);

  const bulanVals = shBulan.getRange(1, 1, 202, 90).getValues();
  const aksesVals = shAkses.getDataRange().getValues();
  const dokVals = shDok ? shDok.getDataRange().getValues() : [];
  const auditVals = shAudit ? shAudit.getDataRange().getValues() : [];

  const colAksesIdx = BULAN_CONFIG.findIndex(b => b.kode === bulanKode) + 3;
  const targetBulanIdx = BULAN_CONFIG.findIndex(b => b.kode === bulanKode);

  // Map metadata audit terbaru per sekolah
  const auditMap = {};
  for (let i = 1; i < auditVals.length; i++) {
    if (String(auditVals[i][3]) === bulanKode) {
      auditMap[Number(auditVals[i][1])] = {
        statusVerif: String(auditVals[i][4] || 'BELUM'),
        statusRevisi: String(auditVals[i][5] || ''),
        alasan: String(auditVals[i][6] || ''),
        catatanVerifikator: String(auditVals[i][7] || ''),
        diprosesOleh: String(auditVals[i][8] || ''),
        kodePengesahan: String(auditVals[i][10] || ''),
        activeReviewer: String(auditVals[i][11] || ''),
        statusKec: String(auditVals[i][13] || 'BELUM'),
        catatanKec: String(auditVals[i][14] || ''),
        diprosesKecOleh: String(auditVals[i][15] || '')
      };
    }
  }

  // Map dokumen per sekolah
  const dokMap = {};
  const rkasHistoryMap = {};
  for (let i = 1; i < dokVals.length; i++) {
    if (String(dokVals[i][10]) !== 'AKTIF') continue;
    const sNo = Number(dokVals[i][1]);
    const bCode = String(dokVals[i][3]);
    const jenis = String(dokVals[i][4]);
    const bIdx = BULAN_CONFIG.findIndex(b => b.kode === bCode);

    if (bCode === bulanKode) {
      if (!dokMap[sNo]) dokMap[sNo] = {};
      dokMap[sNo][jenis] = true;
    }
    if (jenis === 'RKAS_TERAKHIR' && bIdx >= 0 && bIdx <= targetBulanIdx) {
      rkasHistoryMap[sNo] = true;
    }
  }

  const effectiveKec = (currentUser && currentUser.role === 'ADMIN_KEC') ? currentUser.kecamatan : filterKec;

  const schools = [];
  let sudahInput = 0;
  let terverifikasi = 0;
  let siapAuditCount = 0;
  let ajuanRevisi = 0;
  let totalBku = 0;
  let totalTunai = 0;
  let totalBank = 0;
  let totalPajak = 0;

  MASTER_SEKOLAH_DATA.forEach(s => {
    if (effectiveKec && effectiveKec !== 'ALL' && s.kec !== effectiveKec) return;
    if (filterJenjang && filterJenjang !== 'ALL' && s.jenjang !== filterJenjang) return;

    const rIdx = getSheetRowForSchool_(s.no) - 1;
    const row = bulanVals[rIdx];
    const aksesStatus = String(aksesVals[s.no] ? aksesVals[s.no][colAksesIdx] : 'TERKUNCI');
    const meta = auditMap[s.no] || { statusVerif: 'BELUM', statusKec: 'BELUM' };
    const dFlags = dokMap[s.no] || {};

    const bku = Number(row[78]) || 0;
    const tunai = Number(row[79]) || 0;
    const bank = Number(row[80]) || 0;
    const pajak = Number(row[81]) || 0;

    const totalSetorPajak =
      (Number(row[57]) || 0) + (Number(row[58]) || 0) + (Number(row[59]) || 0) + (Number(row[60]) || 0) +
      (Number(row[61]) || 0) + (Number(row[62]) || 0) + (Number(row[63]) || 0) + (Number(row[64]) || 0);

    const hasPdfArkas = !!dFlags['BKU_ARKAS_PDF'];
    const hasExcelManual = !!(dFlags['BKU_MANUAL_XLS'] || dFlags['BKU_MANUAL']);
    const hasRekKoran = !!dFlags['REKENING_KORAN'];
    const hasRkas = !!(dFlags['RKAS_TERAKHIR'] || rkasHistoryMap[s.no]);
    const hasBuktiPajak = !!dFlags['BUKTI_PAJAK'];
    const wajibPajak = totalSetorPajak > 0.009;

    const requiredSlotsCount = wajibPajak ? 5 : 4;
    let uploadedSlotsCount = (hasPdfArkas ? 1 : 0) + (hasExcelManual ? 1 : 0) + (hasRekKoran ? 1 : 0) + (hasRkas ? 1 : 0);
    if (wajibPajak && hasBuktiPajak) uploadedSlotsCount++;

    const isDocsComplete = uploadedSlotsCount >= requiredSlotsCount;
    const isInputDone = (aksesStatus === 'TERKUNCI' && isDocsComplete) || bku > 0 || (Number(row[25]) || 0) > 0 || (Number(row[65]) || 0) > 0;

    if (isInputDone) sudahInput++;
    if (meta.statusVerif === 'TERVERIFIKASI') terverifikasi++;
    if (meta.statusKec === 'SIAP_AUDIT' && meta.statusVerif !== 'TERVERIFIKASI') siapAuditCount++;
    if (meta.statusRevisi === 'MENUNGGU_IZIN') ajuanRevisi++;

    totalBku += bku;
    totalTunai += tunai;
    totalBank += bank;
    totalPajak += pajak;

    schools.push({
      sekolahNo: s.no,
      namaSekolah: s.nama,
      kecamatan: s.kec,
      jenjang: s.jenjang,
      statusBulan: aksesStatus,
      statusVerif: meta.statusVerif || 'BELUM',
      statusKec: meta.statusKec || 'BELUM',
      meta: meta,
      hasPdfArkas: hasPdfArkas,
      hasExcelManual: hasExcelManual,
      hasRekKoran: hasRekKoran,
      hasRkas: hasRkas,
      hasBuktiPajak: hasBuktiPajak,
      wajibPajak: wajibPajak,
      uploadedSlotsCount: uploadedSlotsCount,
      requiredSlotsCount: requiredSlotsCount,
      isDocsComplete: isDocsComplete,
      totalBku: bku,
      totalTunai: tunai,
      totalBank: bank,
      totalPajak: pajak
    });
  });

  return {
    bulanKode: bulanKode,
    summary: {
      totalSekolah: schools.length,
      sudahInput: sudahInput,
      belumInput: schools.length - sudahInput,
      terverifikasi: terverifikasi,
      belumTerverifikasi: schools.length - terverifikasi,
      siapAuditCount: siapAuditCount,
      ajuanRevisi: ajuanRevisi,
      totalBku: totalBku,
      totalTunai: totalTunai,
      totalBank: totalBank,
      totalPajak: totalPajak
    },
    schools: schools
  };
}

/**
 * ============================================================================
 * EXPORT WORKBOOK EXCEL 15 SHEET (JAN-DES + SEMESTER 1, 2 & TAHUNAN 2026)
 * ============================================================================
 */
function exportExcelWorkbook(currentUser) {
  const ss = getSpreadsheet_();
  const tempSs = SpreadsheetApp.create('TEMP_EXPORT_SMART_BOS_' + new Date().getTime());
  const defaultSheet = tempSs.getSheets()[0];

  const orderedSheets = [
    'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'SEMESTER_1',
    'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES', 'SEMESTER_2', 'TAHUNAN_2026'
  ];

  orderedSheets.forEach(name => {
    const src = ss.getSheetByName(name);
    if (src) {
      const copied = src.copyTo(tempSs);
      copied.setName(name);
    }
  });
  tempSs.deleteSheet(defaultSheet);
  SpreadsheetApp.flush();

  const tempId = tempSs.getId();
  const url = 'https://docs.google.com/spreadsheets/d/' + tempId + '/export?format=xlsx';
  const token = ScriptApp.getOAuthToken();
  const resp = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + token }
  });
  const blob = resp.getBlob();
  const base64 = Utilities.base64Encode(blob.getBytes());

  try {
    DriveApp.getFileById(tempId).setTrashed(true);
  } catch (e) {}

  return {
    success: true,
    fileName: 'LAMPIRAN_BA_REKONSILIASI_BOSP_BOALEMO_2026_LENGKAP.xlsx',
    base64: base64
  };
}