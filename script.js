/**
 * SIMPER CORE ENGINE v2.0
 * Fokus: Modularitas, Performa, dan Akurasi Model Matematis
 */

// 1. Inisialisasi Objek Global untuk Grafik agar mudah diakses/update
const AppState = {
    charts: {
        dashboard: null,
        simulasi: null
    },
    weights: {
        x1: 0.6, // Bobot Kepemimpinan
        x2: 0.4  // Bobot Komunikasi
    }
};

// 2. Modul Navigasi (SPA Logic)
const Navigation = {
    init() {
        // Tambahkan event listener jika diperlukan, atau panggil manual via onclick
        console.log("Navigation System Initialized");
    },
    
    showSection(sectionId) {
        // Sembunyikan semua section & reset state tombol
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
        
        // Aktifkan section & tombol yang dipilih
        const targetSection = document.getElementById(sectionId);
        const targetBtn = document.getElementById(`btn-${sectionId}`);
        
        if (targetSection && targetBtn) {
            targetSection.classList.add('active');
            targetBtn.classList.add('active');
        }
    }
};

// 3. Modul Model Matematis (Simulation Logic)
const ModelEngine = {
    calculate() {
        // Ambil nilai Input (Variabel Independen)
        const x1 = parseFloat(document.getElementById('inputX1').value);
        const x2 = parseFloat(document.getElementById('inputX2').value);

        // Update Label UI
        document.getElementById('valX1').innerText = x1;
        document.getElementById('valX2').innerText = x2;

        // FORMULA MATEMATIS: Linear Weighted Scoring
        // Y = (W1 * X1) + (W2 * X2)
        const y = (AppState.weights.x1 * x1) + (AppState.weights.x2 * x2);
        
        this.updateDisplay(y, x1, x2);
    },

    updateDisplay(y, x1, x2) {
        const resultEl = document.getElementById('resultY');
        const statusEl = document.getElementById('statusY');
        
        // Animasi angka hasil
        resultEl.innerText = y.toFixed(1);

        // Logika Klasifikasi Status (Threshold)
        if (y >= 85) {
            statusEl.innerText = "Superior Performance";
            statusEl.className = "mt-4 inline-block px-4 py-1.5 bg-green-500 rounded-full text-[10px] font-black uppercase";
        } else if (y >= 70) {
            statusEl.innerText = "Strong Competency";
            statusEl.className = "mt-4 inline-block px-4 py-1.5 bg-blue-400 rounded-full text-[10px] font-black uppercase";
        } else {
            statusEl.innerText = "Development Needed";
            statusEl.className = "mt-4 inline-block px-4 py-1.5 bg-slate-400 rounded-full text-[10px] font-black uppercase";
        }

        this.syncChart(x1, x2, y);
    },

    syncChart(x1, x2, y) {
        const ctx = document.getElementById('chartSim').getContext('2d');
        const dataSet = [x1, x2, y];

        if (AppState.charts.simulasi) {
            AppState.charts.simulasi.data.datasets[0].data = dataSet;
            AppState.charts.simulasi.update('none'); // Update tanpa animasi berlebih agar smooth
        } else {
            AppState.charts.simulasi = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Kepemimpinan (X1)', 'Komunikasi (X2)', 'Hasil Prediksi (Y)'],
                    datasets: [{
                        data: dataSet,
                        backgroundColor: ['#f1f5f9', '#f1f5f9', '#2563eb'],
                        borderRadius: 12
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, max: 100 } },
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }
};

// 4. Modul Visualisasi & Animasi
const Visuals = {
    initDashboardChart() {
        const ctx = document.getElementById('chartDash').getContext('2d');
        AppState.charts.dashboard = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
                datasets: [{
                    data: [65, 82, 78, 94],
                    borderColor: '#2563eb',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(37, 99, 235, 0.05)',
                    borderWidth: 4
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: { 
                    y: { display: false },
                    x: { grid: { display: false } }
                }
            }
        });
    },

    animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerText = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
};

// 5. Entry Point (Main Execution)
window.onload = () => {
    // Jalankan Simulasi Awal
    ModelEngine.calculate();
    
    // Inisialisasi Chart Dashboard
    Visuals.initDashboardChart();

    // Sembunyikan Loader dengan transisi halus
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
        
        // Jalankan animasi angka setelah loader hilang
        Visuals.animateValue('val-keputusan', 0, 1255, 1500);
    }, 800);
};

// Expose fungsi ke Global Scope agar bisa dipanggil via HTML onclick/oninput
window.showSection = Navigation.showSection;
window.calculate = () => ModelEngine.calculate();