# One Day One Juz Tracker

Aplikasi web untuk memantau progress membaca Al-Qur'an bersama dalam program "One Day One Juz Ibnu Katsir".

## ✨ Fitur

- **Tracking Harian**: Centang progress harian setiap peserta
- **Sistem Rotasi**: Otomatis rotate peserta setiap hari untuk juz yang berbeda
- **Timer Countdown**: Countdown real-time sampai reset harian berikutnya
- **Firebase Integration**: Sinkronisasi data real-time antar pengguna
- **Rekap Bulanan**: Lihat statistik dan progress bulanan
- **Admin Panel**: Kelola peserta dan data dengan mudah
- **Responsive Design**: Tampilan optimal di desktop dan mobile
- **Offline Support**: Bekerja dengan localStorage sebagai backup

## 🚀 Teknologi

- **React 18** - Frontend framework
- **Firebase Firestore** - Real-time database
- **CSS3** - Styling dengan gradients dan animations
- **JavaScript ES6+** - Modern JavaScript features

## 📦 Instalasi

### Prasyarat
- Node.js (v14 atau lebih baru)
- npm atau yarn
- Git

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/one-day-one-juz-tracker.git
   cd one-day-one-juz-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi Firebase (Opsional)**
   - Buka `src/firebase/config.js`
   - Ganti konfigurasi Firebase dengan project Anda sendiri jika diperlukan
   - Saat ini menggunakan project "ibkangaji"

4. **Jalankan aplikasi**
   ```bash
   npm start
   ```

5. **Buka browser**
   - Aplikasi akan berjalan di `http://localhost:3000`

## 📱 Penggunaan

### Untuk Peserta
1. **Lihat juz hari ini** - Setiap peserta mendapat juz sesuai rotasi harian
2. **Centang progress** - Klik kartu peserta untuk menandai selesai
3. **Lihat countdown** - Timer menunjukkan kapan reset berikutnya

### Untuk Admin
1. **Login admin** - Klik tombol "Admin" (username: admin, password: admin123)
2. **Edit peserta** - Ubah nama atau kelola progress individual
3. **Export data** - Download data dalam format JSON
4. **Reset sistem** - Reset ulang jika diperlukan

## 🔧 Konfigurasi

### Mengubah Nama Peserta
Edit file `src/data/constants.js`:
```javascript
export const PARTICIPANT_NAMES = [
  'Nama Peserta 1',
  'Nama Peserta 2',
  // ... 30 nama peserta
];
```

### Mengubah Detail Juz
Edit file `src/data/constants.js` bagian `JUZ_DETAILS`:
```javascript
export const JUZ_DETAILS = {
  1: { 
    surah: "Al-Fatihah - Al-Baqarah : 141", 
    pages: "1-21",
    description: "Keterangan tambahan"
  },
  // ... detail juz lainnya
};
```

## 🌐 Deploy ke GitHub Pages

### Menggunakan GitHub Desktop (GUI)

1. **Setup Repository di GitHub**
   - Buka [GitHub.com](https://github.com)
   - Klik "New repository"
   - Nama repository: `one-day-one-juz-tracker`
   - Centang "Public"
   - Klik "Create repository"

2. **Download GitHub Desktop**
   - Download dari [desktop.github.com](https://desktop.github.com)
   - Install dan login dengan akun GitHub Anda

3. **Clone Repository**
   - Di GitHub Desktop, klik "Clone a repository from the Internet"
   - Pilih repository yang baru dibuat
   - Pilih folder lokal untuk menyimpan project

4. **Siapkan Project**
   - Copy semua file React ke folder repository
   - Edit `package.json`, ganti `yourusername` dengan username GitHub Anda:
     ```json
     "homepage": "https://yourusername.github.io/one-day-one-juz-tracker"
     ```

5. **Install Dependencies**
   - Buka Command Prompt atau Terminal
   - Navigate ke folder project
   - Jalankan: `npm install`
   - Jalankan: `npm install --save-dev gh-pages`

6. **Commit dan Push**
   - Di GitHub Desktop, tulis commit message: "Initial commit"
   - Klik "Commit to main"
   - Klik "Publish branch"

7. **Deploy**
   - Di Command Prompt, jalankan: `npm run deploy`
   - Tunggu proses selesai

8. **Aktifkan GitHub Pages**
   - Buka repository di GitHub.com
   - Klik tab "Settings"
   - Scroll ke "Pages"
   - Source: pilih "Deploy from a branch"
   - Branch: pilih "gh-pages"
   - Klik "Save"

9. **Akses Website**
   - Website akan tersedia di: `https://yourusername.github.io/one-day-one-juz-tracker`
   - Tunggu 5-10 menit untuk deployment selesai

### Update Website
Untuk update website:
1. Edit file yang diperlukan
2. Di GitHub Desktop: commit changes
3. Push ke GitHub
4. Jalankan `npm run deploy` di terminal

## 🛠️ Struktur Project

```
src/
├── components/          # React components
│   ├── Header.js
│   ├── Navigation.js
│   ├── DailyTab.js
│   ├── MonthlyTab.js
│   ├── ParticipantCard.js
│   ├── UtilityComponents.js
│   ├── AdminComponents.js
│   └── index.js
├── data/               # Data constants
│   └── constants.js
├── firebase/           # Firebase configuration
│   ├── config.js
│   └── services.js
├── utils/              # Utility functions
│   ├── timeUtils.js
│   ├── participantUtils.js
│   └── localStorage.js
├── App.js              # Main app component
├── App.css             # Main stylesheet
├── index.js            # React entry point
└── index.css           # Global styles
```

## 🔄 Sistem Rotasi

Aplikasi menggunakan sistem rotasi harian:
- **Hari 0**: Peserta 1 → Juz 1, Peserta 2 → Juz 2, ..., Peserta 30 → Juz 30
- **Hari 1**: Peserta 30 → Juz 1, Peserta 1 → Juz 2, ..., Peserta 29 → Juz 30
- **Hari 2**: Peserta 29 → Juz 1, Peserta 30 → Juz 2, ..., Peserta 28 → Juz 30

Reset otomatis setiap hari pukul 00:00 WIB.

## 🔐 Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

Untuk mengubah credentials, edit `src/data/constants.js`.

## 🐛 Troubleshooting

### Firebase Error
- Pastikan konfigurasi Firebase benar
- Cek Firebase security rules
- Aplikasi akan fallback ke localStorage jika Firebase gagal

### Deployment Error
- Pastikan `homepage` di `package.json` sudah benar
- Pastikan `gh-pages` branch sudah dibuat
- Cek GitHub Pages settings

### Timezone Issues
- Aplikasi menggunakan timezone Jakarta (WIB)
- Reset otomatis pukul 00:00 WIB

## 📄 License

MIT License - bebas digunakan dan dimodifikasi.

## 🤝 Contributing

1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📞 Support

Jika ada pertanyaan atau issue, buat GitHub issue atau hubungi developer.

---

**May Allah bless this project and help us in reading Al-Qur'an consistently.** 🤲