// Central Application Coordinator & Toast Notification Engine

const App = {
  currentView: 'public', // 'public' | 'dashboard'

  init() {
    // Check URL hash for initial view
    const hash = window.location.hash.replace('#', '');
    if (hash === 'dashboard') {
      this.switchView('dashboard');
    } else {
      this.switchView('public');
    }

    // Initialize submodules
    PublicSite.init();
    Dashboard.init();

    // Bind navigation buttons
    this.bindNavButtons();

    // Listen to hash changes
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '');
      if (h === 'dashboard' || h === 'public') {
        this.switchView(h);
      }
    });

    // Window resize for charts
    window.addEventListener('resize', () => {
      if (this.currentView === 'dashboard') {
        Dashboard.renderCharts();
      }
    });
  },

  bindNavButtons() {
    // Header navigation view toggle buttons
    const navDashboardBtns = document.querySelectorAll('.action-go-dashboard');
    navDashboardBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('dashboard');
        window.location.hash = 'dashboard';
      });
    });

    const navPublicBtns = document.querySelectorAll('.action-go-public');
    navPublicBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('public');
        window.location.hash = 'public';
      });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
      // Close menu when clicking link
      mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
      });
    }

    // Modal close events
    const closeMemberModalBtn = document.getElementById('close-member-modal');
    if (closeMemberModalBtn) {
      closeMemberModalBtn.addEventListener('click', () => Dashboard.closeModal());
    }

    const closeRenewModalBtn = document.getElementById('close-renew-modal');
    if (closeRenewModalBtn) {
      closeRenewModalBtn.addEventListener('click', () => Dashboard.closeRenewModal());
    }

    // Click outside modal backdrop to close
    window.addEventListener('click', (e) => {
      const memberModal = document.getElementById('member-modal');
      const renewModal = document.getElementById('renew-modal');
      if (e.target === memberModal) Dashboard.closeModal();
      if (e.target === renewModal) Dashboard.closeRenewModal();
    });

    // Duration change inside modal recalculates date
    const durationSelect = document.getElementById('modal-field-duration');
    const startDateInput = document.getElementById('modal-field-start-date');
    if (durationSelect && startDateInput) {
      durationSelect.addEventListener('change', () => Dashboard.recalculateModalDates());
      startDateInput.addEventListener('change', () => Dashboard.recalculateModalDates());
    }
  },

  switchView(viewName) {
    this.currentView = viewName;
    const publicContainer = document.getElementById('view-public');
    const dashboardContainer = document.getElementById('view-dashboard');
    const navPublicPills = document.querySelectorAll('.nav-indicator-public');
    const navDashboardPills = document.querySelectorAll('.nav-indicator-dashboard');

    if (viewName === 'dashboard') {
      if (publicContainer) publicContainer.classList.add('hidden');
      if (dashboardContainer) {
        dashboardContainer.classList.remove('hidden');
        dashboardContainer.classList.add('animate-fade-in-up');
      }
      
      navPublicPills.forEach(el => el.classList.remove('text-lime-400', 'font-bold'));
      navDashboardPills.forEach(el => el.classList.add('text-lime-400', 'font-bold'));

      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Refresh dashboard data & charts
      setTimeout(() => {
        Dashboard.refresh();
      }, 50);
    } else {
      if (dashboardContainer) dashboardContainer.classList.add('hidden');
      if (publicContainer) {
        publicContainer.classList.remove('hidden');
        publicContainer.classList.add('animate-fade-in-up');
      }

      navDashboardPills.forEach(el => el.classList.remove('text-lime-400', 'font-bold'));
      navPublicPills.forEach(el => el.classList.add('text-lime-400', 'font-bold'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-4 opacity-0 text-sm font-medium pointer-events-auto`;

    let typeStyles = '';
    let iconSvg = '';

    if (type === 'success') {
      typeStyles = 'bg-neutral-900/95 text-white border-lime-400/50 shadow-lime-900/30';
      iconSvg = `<div class="w-6 h-6 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
      </div>`;
    } else if (type === 'error') {
      typeStyles = 'bg-neutral-900/95 text-white border-rose-500/50 shadow-rose-900/30';
      iconSvg = `<div class="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </div>`;
    } else if (type === 'warning') {
      typeStyles = 'bg-neutral-900/95 text-white border-amber-500/50 shadow-amber-900/30';
      iconSvg = `<div class="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>`;
    } else {
      typeStyles = 'bg-neutral-900/95 text-white border-sky-500/50 shadow-sky-900/30';
      iconSvg = `<div class="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>`;
    }

    toast.className += ` ${typeStyles}`;
    toast.innerHTML = `
      ${iconSvg}
      <div class="flex-1 text-xs sm:text-sm text-gray-200">${message}</div>
      <button class="text-gray-500 hover:text-white shrink-0 ml-2">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => {
      toast.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => toast.remove(), 300);
    });

    container.appendChild(toast);

    // Trigger animation in
    requestAnimationFrame(() => {
      toast.classList.remove('opacity-0', 'translate-y-4');
    });

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
