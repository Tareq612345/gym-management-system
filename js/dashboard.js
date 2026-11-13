// Admin Dashboard Logic & Member Management

const Dashboard = {
  currentFilter: 'all',
  currentPlanFilter: 'all',
  searchQuery: '',
  editingMemberId: null,

  init() {
    this.bindEvents();
    this.refresh();
  },

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('member-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderTable();
      });
    }

    // Status Filter buttons
    const filterTabs = document.querySelectorAll('.status-filter-btn');
    filterTabs.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterTabs.forEach(b => {
          b.classList.remove('bg-lime-400', 'text-black', 'font-bold');
          b.classList.add('text-gray-400', 'hover:text-white', 'bg-neutral-800/60');
        });
        const target = e.currentTarget;
        target.classList.remove('text-gray-400', 'hover:text-white', 'bg-neutral-800/60');
        target.classList.add('bg-lime-400', 'text-black', 'font-bold');
        this.currentFilter = target.dataset.status;
        this.renderTable();
      });
    });

    // Plan Filter Dropdown
    const planFilterSelect = document.getElementById('filter-plan-select');
    if (planFilterSelect) {
      planFilterSelect.addEventListener('change', (e) => {
        this.currentPlanFilter = e.target.value;
        this.renderTable();
      });
    }

    // Quick check-in input
    const quickCheckInBtn = document.getElementById('quick-checkin-btn');
    const quickCheckInInput = document.getElementById('quick-checkin-input');
    if (quickCheckInBtn && quickCheckInInput) {
      const executeCheckin = () => {
        const val = quickCheckInInput.value.trim().toLowerCase();
        if (!val) {
          App.showToast("Please enter a Member ID or Name", "warning");
          return;
        }
        const members = StorageManager.getMembers();
        const found = members.find(m => 
          m.id.toLowerCase() === val || 
          m.name.toLowerCase().includes(val) ||
          m.phone.includes(val)
        );

        if (!found) {
          App.showToast("No member found matching: " + val, "error");
          return;
        }

        if (found.status === 'Expired') {
          App.showToast(`Cannot check in ${found.name}: Membership Expired!`, "error");
          return;
        }

        StorageManager.checkInMember(found.id);
        App.showToast(`✅ Checked in: ${found.name} (${found.plan})`, "success");
        quickCheckInInput.value = '';
        this.refresh();
      };

      quickCheckInBtn.addEventListener('click', executeCheckin);
      quickCheckInInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeCheckin();
      });
    }

    // New Member Form submission
    const memberForm = document.getElementById('member-modal-form');
    if (memberForm) {
      memberForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }

    // Export CSV Button
    const exportBtn = document.getElementById('export-csv-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportCSV());
    }

    // Reset Demo Data Button
    const resetBtn = document.getElementById('reset-demo-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("Reset all data to default demo members? Any custom entries will be replaced.")) {
          StorageManager.resetToDefault();
          this.refresh();
          App.showToast("System reset to sample demo data", "info");
        }
      });
    }
  },

  refresh() {
    this.updateKPIs();
    this.renderTable();
    this.renderExpiryAlerts();
    this.renderCharts();
    this.renderRecentCheckins();
  },

  updateKPIs() {
    const members = StorageManager.getMembers();
    const total = members.length;
    const active = members.filter(m => m.status === 'Active').length;
    const expired = members.filter(m => m.status === 'Expired').length;
    const pending = members.filter(m => m.status === 'Pending').length;

    // Monthly revenue estimation
    const planPrices = { 'starter': 29, 'pro': 59, 'vip': 99 };
    const monthlyRev = members.reduce((sum, m) => {
      if (m.status !== 'Active') return sum;
      const key = (m.plan || '').toLowerCase();
      if (key.includes('vip')) return sum + planPrices.vip;
      if (key.includes('pro')) return sum + planPrices.pro;
      return sum + planPrices.starter;
    }, 0);

    const todayLogs = StorageManager.getTodayCheckIns();

    // DOM Updates
    this.setText('kpi-total-members', total);
    this.setText('kpi-active-members', active);
    this.setText('kpi-active-rate', total > 0 ? `${Math.round((active / total) * 100)}% Active` : '0%');
    this.setText('kpi-expired-members', expired);
    this.setText('kpi-monthly-revenue', `$${monthlyRev.toLocaleString()}`);
    this.setText('kpi-today-checkins', todayLogs.length);
  },

  setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  },

  renderTable() {
    const tbody = document.getElementById('members-table-body');
    if (!tbody) return;

    let list = StorageManager.getMembers();

    // Apply status filter
    if (this.currentFilter !== 'all') {
      list = list.filter(m => (m.status || '').toLowerCase() === this.currentFilter.toLowerCase());
    }

    // Apply plan filter
    if (this.currentPlanFilter !== 'all') {
      list = list.filter(m => (m.plan || '').toLowerCase().includes(this.currentPlanFilter.toLowerCase()));
    }

    // Apply search query
    if (this.searchQuery) {
      list = list.filter(m => 
        m.name.toLowerCase().includes(this.searchQuery) ||
        m.id.toLowerCase().includes(this.searchQuery) ||
        m.email.toLowerCase().includes(this.searchQuery) ||
        m.phone.includes(this.searchQuery)
      );
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-12 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-base font-medium">No gym members found matching criteria.</p>
            <p class="text-sm text-gray-600 mt-1">Try clearing your filters or add a new member.</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(member => {
      // Calculate remaining days
      const daysLeft = this.calculateDaysRemaining(member.endDate);
      let expiryBadge = '';
      if (member.status === 'Expired' || daysLeft < 0) {
        expiryBadge = `<span class="px-2 py-0.5 rounded text-xs bg-rose-500/20 text-rose-400 font-medium">Expired (${Math.abs(daysLeft)}d ago)</span>`;
      } else if (daysLeft <= 7) {
        expiryBadge = `<span class="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400 font-medium">Expiring (${daysLeft}d left)</span>`;
      } else {
        expiryBadge = `<span class="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 font-medium">${daysLeft}d left</span>`;
      }

      // Status pill
      let statusPill = '';
      if (member.status === 'Active') {
        statusPill = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
        </span>`;
      } else if (member.status === 'Expired') {
        statusPill = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Expired
        </span>`;
      } else {
        statusPill = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Pending
        </span>`;
      }

      // Plan Badge
      let planBadge = '';
      if (member.plan.includes('VIP')) {
        planBadge = `<span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-lime-400/20 text-lime-400 border border-lime-400/30 tracking-wide">⭐ ${member.plan}</span>`;
      } else if (member.plan.includes('Pro')) {
        planBadge = `<span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">🔥 ${member.plan}</span>`;
      } else {
        planBadge = `<span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">⚡ ${member.plan}</span>`;
      }

      const initials = member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

      return `
        <tr class="table-row-hover border-b border-neutral-800/60 transition-colors">
          <td class="py-3.5 px-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-neutral-700 flex items-center justify-center font-bold text-xs text-lime-400 shadow-sm">
                ${initials}
              </div>
              <div>
                <div class="font-bold text-white text-sm flex items-center gap-2">
                  ${member.name}
                  <span class="text-[11px] font-mono text-gray-500 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">${member.id}</span>
                </div>
                <div class="text-xs text-gray-400">${member.email}</div>
              </div>
            </div>
          </td>
          <td class="py-3.5 px-4 text-xs text-gray-300 font-mono">
            ${member.phone}
          </td>
          <td class="py-3.5 px-4">
            ${planBadge}
          </td>
          <td class="py-3.5 px-4">
            <div class="text-xs text-white font-medium">${member.endDate}</div>
            <div class="mt-0.5">${expiryBadge}</div>
          </td>
          <td class="py-3.5 px-4 text-center">
            <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800/80 text-xs font-semibold text-gray-200 border border-neutral-700">
              <svg class="w-3.5 h-3.5 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ${member.checkInsCount || 0}
            </div>
          </td>
          <td class="py-3.5 px-4">
            ${statusPill}
          </td>
          <td class="py-3.5 px-4 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="Dashboard.quickCheckInRow('${member.id}')" title="Check-in Now" class="p-1.5 rounded-lg bg-neutral-800 hover:bg-lime-400 hover:text-black text-lime-400 transition-colors border border-neutral-700 hover:border-lime-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
              <button onclick="Dashboard.openRenewModal('${member.id}')" title="Renew Plan" class="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sky-400 transition-colors border border-neutral-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.033 8.033 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button onclick="Dashboard.openEditModal('${member.id}')" title="Edit Member" class="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-gray-300 transition-colors border border-neutral-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button onclick="Dashboard.confirmDelete('${member.id}')" title="Delete Member" class="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-500/20 text-rose-400 transition-colors border border-neutral-700 hover:border-rose-500/50">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  calculateDaysRemaining(dateString) {
    if (!dateString) return 0;
    const target = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  },

  quickCheckInRow(id) {
    const res = StorageManager.checkInMember(id);
    if (res) {
      App.showToast(`⚡ Check-in successful: ${res.member.name}`, "success");
      this.refresh();
    }
  },

  renderExpiryAlerts() {
    const container = document.getElementById('expiry-alerts-list');
    if (!container) return;

    const members = StorageManager.getMembers();
    const urgent = members.filter(m => {
      const days = this.calculateDaysRemaining(m.endDate);
      return (days >= -7 && days <= 5) || m.status === 'Expired';
    });

    if (urgent.length === 0) {
      container.innerHTML = `
        <div class="text-xs text-gray-400 py-3 text-center flex items-center justify-center gap-2">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          All memberships are healthy! No immediate expirations pending.
        </div>
      `;
      return;
    }

    container.innerHTML = urgent.slice(0, 4).map(m => {
      const days = this.calculateDaysRemaining(m.endDate);
      const isPast = days < 0;
      return `
        <div class="flex items-center justify-between p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs">
          <div class="flex items-center gap-2.5">
            <div class="w-2 h-2 rounded-full ${isPast ? 'bg-rose-500' : 'bg-amber-400 animate-ping'}"></div>
            <div>
              <div class="font-bold text-white">${m.name} <span class="text-gray-400 font-normal">(${m.plan})</span></div>
              <div class="text-[11px] text-gray-400">${isPast ? `Expired ${Math.abs(days)} days ago` : `Expires in ${days} days`} • ${m.phone}</div>
            </div>
          </div>
          <button onclick="Dashboard.openRenewModal('${m.id}')" class="px-3 py-1 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-lg transition-colors text-xs shadow-sm">
            Renew
          </button>
        </div>
      `;
    }).join('');
  },

  renderRecentCheckins() {
    const listEl = document.getElementById('recent-checkins-list');
    if (!listEl) return;

    const checkins = StorageManager.getTodayCheckIns();
    if (checkins.length === 0) {
      listEl.innerHTML = `
        <div class="text-center py-6 text-gray-500 text-xs">
          No check-ins recorded yet today. Use the Quick Check-in bar above!
        </div>
      `;
      return;
    }

    listEl.innerHTML = checkins.slice(0, 5).map(c => `
      <div class="flex items-center justify-between py-2 border-b border-neutral-800/50 last:border-0 text-xs">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-neutral-800 text-lime-400 flex items-center justify-center font-bold text-[10px]">
            ${c.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
          </div>
          <div>
            <div class="font-semibold text-gray-200">${c.name}</div>
            <div class="text-[10px] text-gray-500">${c.plan}</div>
          </div>
        </div>
        <div class="text-[11px] text-lime-400/80 font-mono">${c.timestamp.split(' ')[1] || c.timestamp}</div>
      </div>
    `).join('');
  },

  renderCharts() {
    const members = StorageManager.getMembers();
    GymCharts.renderAttendanceChart('attendanceChartCanvas');
    GymCharts.renderPlanDistribution('planChartCanvas', members);
  },

  // Modal actions
  openCreateModal(prefillPlan = null) {
    this.editingMemberId = null;
    const modal = document.getElementById('member-modal');
    const title = document.getElementById('member-modal-title');
    const form = document.getElementById('member-modal-form');
    if (!modal || !form) return;

    form.reset();
    title.textContent = 'Register New Gym Member';

    // Set today as start date
    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('modal-field-start-date').value = todayStr;

    if (prefillPlan) {
      document.getElementById('modal-field-plan').value = prefillPlan;
    }

    this.recalculateModalDates();
    modal.classList.remove('hidden');
  },

  openEditModal(id) {
    this.editingMemberId = id;
    const members = StorageManager.getMembers();
    const member = members.find(m => m.id === id);
    if (!member) return;

    const modal = document.getElementById('member-modal');
    const title = document.getElementById('member-modal-title');
    if (!modal) return;

    title.textContent = `Edit Member: ${member.name} (${member.id})`;

    document.getElementById('modal-field-name').value = member.name;
    document.getElementById('modal-field-email').value = member.email;
    document.getElementById('modal-field-phone').value = member.phone;
    document.getElementById('modal-field-plan').value = member.plan;
    document.getElementById('modal-field-duration').value = member.durationMonths || 1;
    document.getElementById('modal-field-start-date').value = member.startDate;
    document.getElementById('modal-field-status').value = member.status;
    document.getElementById('modal-field-payment').value = member.paymentStatus || 'Paid';
    document.getElementById('modal-field-trainer').value = member.trainer || 'None';
    document.getElementById('modal-field-emergency').value = member.emergencyContact || '';
    document.getElementById('modal-field-notes').value = member.notes || '';

    this.recalculateModalDates();
    modal.classList.remove('hidden');
  },

  closeModal() {
    const modal = document.getElementById('member-modal');
    if (modal) modal.classList.add('hidden');
    this.editingMemberId = null;
  },

  recalculateModalDates() {
    const startDateVal = document.getElementById('modal-field-start-date').value;
    const durationMonths = parseInt(document.getElementById('modal-field-duration').value, 10) || 1;
    if (!startDateVal) return;

    const start = new Date(startDateVal);
    const end = new Date(start);
    end.setMonth(end.getMonth() + durationMonths);

    const endStr = end.toISOString().split('T')[0];
    const preview = document.getElementById('modal-end-date-preview');
    if (preview) {
      preview.textContent = endStr;
    }
  },

  handleFormSubmit() {
    const name = document.getElementById('modal-field-name').value.trim();
    const email = document.getElementById('modal-field-email').value.trim();
    const phone = document.getElementById('modal-field-phone').value.trim();
    const plan = document.getElementById('modal-field-plan').value;
    const durationMonths = parseInt(document.getElementById('modal-field-duration').value, 10);
    const startDate = document.getElementById('modal-field-start-date').value;
    const status = document.getElementById('modal-field-status').value;
    const paymentStatus = document.getElementById('modal-field-payment').value;
    const trainer = document.getElementById('modal-field-trainer').value;
    const emergencyContact = document.getElementById('modal-field-emergency').value.trim();
    const notes = document.getElementById('modal-field-notes').value.trim();

    // End date calculation
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + durationMonths);
    const endDate = end.toISOString().split('T')[0];

    const payload = {
      name, email, phone, plan, durationMonths,
      startDate, endDate, status, paymentStatus,
      trainer, emergencyContact, notes
    };

    if (this.editingMemberId) {
      StorageManager.updateMember(this.editingMemberId, payload);
      App.showToast(`Updated member details for ${name}`, "success");
    } else {
      const created = StorageManager.addMember(payload);
      App.showToast(`🎉 Successfully registered ${created.name} (${created.id})`, "success");
    }

    this.closeModal();
    this.refresh();
  },

  // Renewal Modal
  openRenewModal(id) {
    const members = StorageManager.getMembers();
    const member = members.find(m => m.id === id);
    if (!member) return;

    const modal = document.getElementById('renew-modal');
    if (!modal) return;

    document.getElementById('renew-member-name').textContent = member.name;
    document.getElementById('renew-member-id').textContent = member.id;
    document.getElementById('renew-current-plan').textContent = member.plan;
    document.getElementById('renew-current-expiry').textContent = member.endDate;
    modal.dataset.memberId = id;

    modal.classList.remove('hidden');
  },

  closeRenewModal() {
    const modal = document.getElementById('renew-modal');
    if (modal) modal.classList.add('hidden');
  },

  applyRenewal(monthsToAdd) {
    const modal = document.getElementById('renew-modal');
    const id = modal.dataset.memberId;
    if (!id) return;

    const members = StorageManager.getMembers();
    const member = members.find(m => m.id === id);
    if (!member) return;

    // Base date is max of (current endDate, today)
    const currentEnd = new Date(member.endDate);
    const today = new Date();
    const baseDate = currentEnd > today ? currentEnd : today;

    const newEnd = new Date(baseDate);
    newEnd.setMonth(newEnd.getMonth() + monthsToAdd);
    const newEndStr = newEnd.toISOString().split('T')[0];

    StorageManager.updateMember(id, {
      endDate: newEndStr,
      status: 'Active',
      durationMonths: (member.durationMonths || 0) + monthsToAdd
    });

    this.closeRenewModal();
    this.refresh();
    App.showToast(`✨ Renewed ${member.name} for +${monthsToAdd} months until ${newEndStr}!`, "success");
  },

  confirmDelete(id) {
    const members = StorageManager.getMembers();
    const member = members.find(m => m.id === id);
    if (!member) return;

    if (confirm(`Are you sure you want to delete member ${member.name} (${member.id})? This action cannot be undone.`)) {
      StorageManager.deleteMember(id);
      this.refresh();
      App.showToast(`Deleted member record: ${member.name}`, "info");
    }
  },

  exportCSV() {
    const members = StorageManager.getMembers();
    if (members.length === 0) {
      App.showToast("No members to export!", "warning");
      return;
    }

    const headers = ["Member ID", "Full Name", "Email", "Phone", "Plan", "Status", "Start Date", "End Date", "Total Check-ins", "Trainer", "Payment"];
    const rows = members.map(m => [
      m.id,
      `"${m.name.replace(/"/g, '""')}"`,
      m.email,
      m.phone,
      m.plan,
      m.status,
      m.startDate,
      m.endDate,
      m.checkInsCount || 0,
      `"${(m.trainer || '').replace(/"/g, '""')}"`,
      m.paymentStatus || 'Paid'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gym_members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    App.showToast("Downloaded members list as CSV file", "success");
  }
};
