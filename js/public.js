// Public Landing Page Interactive Features

const PublicSite = {
  selectedCategory: 'all',
  isAnnualBilling: false,

  init() {
    this.renderClasses();
    this.renderTrainers();
    this.bindEvents();
  },

  bindEvents() {
    // Classes filter buttons
    const filterBtns = document.querySelectorAll('.class-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => {
          b.classList.remove('bg-lime-400', 'text-black', 'font-bold');
          b.classList.add('text-gray-400', 'hover:text-white', 'bg-neutral-900');
        });
        const target = e.currentTarget;
        target.classList.remove('text-gray-400', 'hover:text-white', 'bg-neutral-900');
        target.classList.add('bg-lime-400', 'text-black', 'font-bold');
        this.selectedCategory = target.dataset.category;
        this.renderClasses();
      });
    });

    // Pricing Billing Toggle (Monthly vs Annual)
    const billingToggle = document.getElementById('billing-toggle');
    if (billingToggle) {
      billingToggle.addEventListener('change', (e) => {
        this.isAnnualBilling = e.target.checked;
        this.updatePricing();
      });
    }

    // BMI Calculator
    const bmiForm = document.getElementById('bmi-form');
    if (bmiForm) {
      bmiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.calculateBMI();
      });
    }

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleContactSubmit();
      });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input[type="email"]');
        if (input && input.value) {
          App.showToast("🔥 Thanks for subscribing to our fitness newsletter!", "success");
          input.value = '';
        }
      });
    }
  },

  renderClasses() {
    const container = document.getElementById('classes-grid');
    if (!container) return;

    let items = CLASSES_DATA;
    if (this.selectedCategory !== 'all') {
      items = items.filter(c => c.category === this.selectedCategory);
    }

    container.innerHTML = items.map(cls => `
      <div class="glass-card rounded-2xl p-6 flex flex-col justify-between border border-neutral-800 hover:border-lime-400/50 transition-all duration-300 group">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-lime-400/10 text-lime-400 border border-lime-400/20">
              ${cls.intensity}
            </span>
            <span class="text-xs text-gray-400 flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ${cls.duration}
            </span>
          </div>

          <h3 class="text-xl font-bold text-white group-hover:text-lime-400 transition-colors mb-2">
            ${cls.title}
          </h3>

          <p class="text-sm text-gray-400 mb-4 line-clamp-2">
            ${cls.description}
          </p>

          <div class="space-y-2 py-3 border-y border-neutral-800/80 text-xs">
            <div class="flex items-center justify-between text-gray-300">
              <span class="text-gray-500">Coach:</span>
              <span class="font-semibold text-white">${cls.trainer}</span>
            </div>
            <div class="flex items-center justify-between text-gray-300">
              <span class="text-gray-500">Schedule:</span>
              <span class="text-gray-300 font-mono">${cls.time}</span>
            </div>
            <div class="flex items-center justify-between text-gray-300">
              <span class="text-gray-500">Avg Burn:</span>
              <span class="font-semibold text-orange-400">🔥 ${cls.calories}</span>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-2">
          <button onclick="PublicSite.bookClassPreview('${cls.title}')" class="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-lime-400 hover:text-black text-white font-semibold text-xs tracking-wider transition-all duration-200 border border-neutral-700 hover:border-lime-400 flex items-center justify-center gap-2 group-hover:shadow-lg">
            <span>Book Class Pass</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    `).join('');
  },

  renderTrainers() {
    const container = document.getElementById('trainers-grid');
    if (!container) return;

    container.innerHTML = TRAINERS_DATA.map(t => `
      <div class="glass-card rounded-2xl p-6 border border-neutral-800 hover:border-neutral-700 transition-all">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-lime-400/20 to-neutral-800 border border-lime-400/30 flex items-center justify-center font-bold text-lime-400 text-lg shadow-inner">
            ${t.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
          </div>
          <div>
            <h4 class="font-bold text-white text-base">${t.name}</h4>
            <p class="text-xs text-lime-400 font-medium">${t.role}</p>
            <span class="inline-block mt-0.5 text-[10px] text-gray-500 font-mono">${t.experience}</span>
          </div>
        </div>
        <p class="text-xs text-gray-400 mb-4 leading-relaxed">${t.bio}</p>
        <div class="pt-3 border-t border-neutral-800/80">
          <span class="text-[11px] font-semibold text-gray-300 block mb-1">Certifications:</span>
          <span class="text-[11px] text-gray-400 bg-neutral-900/90 px-2 py-1 rounded border border-neutral-800 inline-block font-mono">
            ${t.certifications}
          </span>
        </div>
      </div>
    `).join('');
  },

  updatePricing() {
    const isYearly = this.isAnnualBilling;
    
    // Starter: 29/mo or 279/yr (approx $23/mo)
    const starterPriceEl = document.getElementById('price-starter');
    const starterPeriodEl = document.getElementById('period-starter');
    if (starterPriceEl && starterPeriodEl) {
      starterPriceEl.textContent = isYearly ? '$279' : '$29';
      starterPeriodEl.textContent = isYearly ? '/year' : '/month';
    }

    // Pro: 59/mo or 569/yr (approx $47/mo)
    const proPriceEl = document.getElementById('price-pro');
    const proPeriodEl = document.getElementById('period-pro');
    if (proPriceEl && proPeriodEl) {
      proPriceEl.textContent = isYearly ? '$569' : '$59';
      proPeriodEl.textContent = isYearly ? '/year' : '/month';
    }

    // VIP: 99/mo or 950/yr (approx $79/mo)
    const vipPriceEl = document.getElementById('price-vip');
    const vipPeriodEl = document.getElementById('period-vip');
    if (vipPriceEl && vipPeriodEl) {
      vipPriceEl.textContent = isYearly ? '$950' : '$99';
      vipPeriodEl.textContent = isYearly ? '/year' : '/month';
    }
  },

  calculateBMI() {
    const height = parseFloat(document.getElementById('bmi-height').value);
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const resultBox = document.getElementById('bmi-result-box');
    const scoreEl = document.getElementById('bmi-score');
    const categoryEl = document.getElementById('bmi-category');
    const adviceEl = document.getElementById('bmi-advice');

    if (!height || !weight || height <= 0 || weight <= 0) {
      App.showToast("Please enter valid height and weight values", "warning");
      return;
    }

    // BMI = weight(kg) / (height(m))^2
    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    let category = '';
    let advice = '';
    let colorClass = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      advice = 'Recommended: Focus on progressive strength training with surplus caloric intake and lean mass builders.';
      colorClass = 'text-sky-400';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = 'Healthy & Optimal Weight';
      advice = 'Excellent condition! Recommended: Hypertrophy & functional endurance to peak athletic performance.';
      colorClass = 'text-lime-400';
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Overweight';
      advice = 'Recommended: High-Intensity Interval Training (HIIT) paired with resistance training and steady deficit.';
      colorClass = 'text-amber-400';
    } else {
      category = 'Obesity Category';
      advice = 'Recommended: Low-impact cardio, full-body circuits, and supervised personal coaching.';
      colorClass = 'text-rose-400';
    }

    scoreEl.textContent = bmi;
    categoryEl.textContent = category;
    categoryEl.className = `font-bold text-sm ${colorClass}`;
    adviceEl.textContent = advice;

    resultBox.classList.remove('hidden');
    App.showToast(`BMI Calculated: ${bmi} (${category})`, "info");
  },

  handleContactSubmit() {
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      App.showToast("Please fill in all required fields", "warning");
      return;
    }

    StorageManager.saveInquiry({ name, email, phone, message });
    App.showToast(`Thank you ${name}! Your inquiry has been received. Our team will contact you shortly.`, "success");

    document.getElementById('contact-form').reset();
  },

  bookClassPreview(className) {
    App.showToast(`Reserved trial pass for "${className}". See you on the gym floor!`, "success");
  },

  selectPlanFromPricing(planName) {
    // Switch to Dashboard and open registration modal prefilled with this plan
    App.switchView('dashboard');
    Dashboard.openCreateModal(planName);
  }
};
