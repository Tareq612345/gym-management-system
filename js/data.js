// Initial Mock Data and Storage Management for Gym Management System

const DEFAULT_MEMBERS = [
  {
    id: "GYM-801",
    name: "Ahmed Al-Mansoor",
    email: "ahmed.mansoor@example.com",
    phone: "+971 50 234 5678",
    plan: "VIP Elite",
    durationMonths: 12,
    startDate: "2026-01-15",
    endDate: "2027-01-15",
    status: "Active",
    paymentStatus: "Paid",
    trainer: "Captain Alex Stone",
    checkInsCount: 78,
    lastCheckIn: "2026-11-13 09:30",
    emergencyContact: "+971 50 999 1122",
    notes: "Focusing on competitive powerlifting and clean bulk."
  },
  {
    id: "GYM-802",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    phone: "+971 55 987 6543",
    plan: "Pro Beast",
    durationMonths: 6,
    startDate: "2026-06-01",
    endDate: "2026-12-01",
    status: "Active",
    paymentStatus: "Paid",
    trainer: "Coach Maya Lin",
    checkInsCount: 46,
    lastCheckIn: "2026-11-12 18:15",
    emergencyContact: "+971 55 444 3322",
    notes: "HIIT, stamina and functional mobility."
  },
  {
    id: "GYM-803",
    name: "Omar Farouk",
    email: "omar.f@example.com",
    phone: "+971 52 345 6789",
    plan: "Pro Beast",
    durationMonths: 1,
    startDate: "2026-10-17",
    endDate: "2026-11-17", // Expiring in 4 days!
    status: "Active",
    paymentStatus: "Paid",
    trainer: "Coach Sam Vance",
    checkInsCount: 19,
    lastCheckIn: "2026-11-13 07:15",
    emergencyContact: "+971 52 111 2233",
    notes: "Needs membership renewal follow-up this week."
  },
  {
    id: "GYM-804",
    name: "Layla Al-Sayed",
    email: "layla.sayed@example.com",
    phone: "+971 54 876 5432",
    plan: "Starter",
    durationMonths: 3,
    startDate: "2026-08-10",
    endDate: "2026-11-10", // Expired 3 days ago!
    status: "Expired",
    paymentStatus: "Paid",
    trainer: "None",
    checkInsCount: 28,
    lastCheckIn: "2026-11-08 19:45",
    emergencyContact: "+971 54 777 8899",
    notes: "Subscription expired. Sent automated reminder."
  },
  {
    id: "GYM-805",
    name: "Marcus Sterling",
    email: "marcus.s@example.com",
    phone: "+971 56 456 7890",
    plan: "VIP Elite",
    durationMonths: 12,
    startDate: "2026-03-01",
    endDate: "2027-03-01",
    status: "Active",
    paymentStatus: "Paid",
    trainer: "Captain Alex Stone",
    checkInsCount: 92,
    lastCheckIn: "2026-11-13 11:20",
    emergencyContact: "+971 56 333 4455",
    notes: "VIP locker #14. Custom dietary program assigned."
  },
  {
    id: "GYM-806",
    name: "Elena Rostova",
    email: "elena.r@example.com",
    phone: "+971 50 654 3210",
    plan: "Pro Beast",
    durationMonths: 3,
    startDate: "2026-09-15",
    endDate: "2026-12-15",
    status: "Active",
    paymentStatus: "Paid",
    trainer: "Coach Maya Lin",
    checkInsCount: 34,
    lastCheckIn: "2026-11-11 17:30",
    emergencyContact: "+971 50 222 9988",
    notes: "Cardio kickboxing enthusiast."
  },
  {
    id: "GYM-807",
    name: "Tariq Ziad",
    email: "tariq.z@example.com",
    phone: "+971 55 112 2334",
    plan: "Starter",
    durationMonths: 1,
    startDate: "2026-11-01",
    endDate: "2026-12-01",
    status: "Active",
    paymentStatus: "Paid",
    trainer: "None",
    checkInsCount: 8,
    lastCheckIn: "2026-11-13 14:10",
    emergencyContact: "+971 55 888 7766",
    notes: "New joiner. Requested introductory equipment tour."
  },
  {
    id: "GYM-808",
    name: "Chloe Dupont",
    email: "chloe.d@example.com",
    phone: "+971 58 778 8990",
    plan: "Starter",
    durationMonths: 1,
    startDate: "2026-10-05",
    endDate: "2026-11-05", // Expired
    status: "Expired",
    paymentStatus: "Paid",
    trainer: "None",
    checkInsCount: 11,
    lastCheckIn: "2026-11-04 16:50",
    emergencyContact: "+971 58 665 5443",
    notes: "Considering upgrade to Pro Beast."
  },
  {
    id: "GYM-809",
    name: "David Kim",
    email: "david.kim@example.com",
    phone: "+971 52 889 9001",
    plan: "Pro Beast",
    durationMonths: 6,
    startDate: "2026-11-10",
    endDate: "2027-05-10",
    status: "Pending",
    paymentStatus: "Pending",
    trainer: "Coach Sam Vance",
    checkInsCount: 1,
    lastCheckIn: "2026-11-10 10:00",
    emergencyContact: "+971 52 334 4556",
    notes: "Payment clearance pending via corporate sponsorship."
  },
  {
    id: "GYM-810",
    name: "Nour El-Din",
    email: "nour.eldin@example.com",
    phone: "+971 50 334 4556",
    plan: "VIP Elite",
    durationMonths: 12,
    startDate: "2026-05-20",
    endDate: "2027-05-20",
    status: "Active",
    paymentStatus: "Paid",
    trainer: "Captain Alex Stone",
    checkInsCount: 65,
    lastCheckIn: "2026-11-13 08:00",
    emergencyContact: "+971 50 111 0099",
    notes: "Includes 2 guest passes per month."
  }
];

const CLASSES_DATA = [
  {
    id: "cls-1",
    title: "Iron Core Strength",
    category: "strength",
    trainer: "Captain Alex Stone",
    time: "Mon, Wed, Fri • 07:00 AM",
    duration: "60 Mins",
    intensity: "Extreme",
    calories: "650-800 kcal",
    description: "Heavy barbell mechanics, progressive overload, and hypertrophy foundations."
  },
  {
    id: "cls-2",
    title: "Apex HIIT & MetCon",
    category: "hiit",
    trainer: "Coach Maya Lin",
    time: "Daily • 06:00 PM",
    duration: "45 Mins",
    intensity: "High Intensity",
    calories: "500-750 kcal",
    description: "Explosive interval circuits designed for maximum cardiovascular burn and metabolic conditioning."
  },
  {
    id: "cls-3",
    title: "Titan Combat Boxing",
    category: "combat",
    trainer: "Coach Sam Vance",
    time: "Tue, Thu • 07:30 PM",
    duration: "60 Mins",
    intensity: "Hardcore",
    calories: "700-900 kcal",
    description: "Footwork, bag drills, technical mitt-work, and defense conditioning."
  },
  {
    id: "cls-4",
    title: "CrossFit WOD Mastery",
    category: "strength",
    trainer: "Captain Alex Stone",
    time: "Mon, Wed, Sat • 08:30 AM",
    duration: "55 Mins",
    intensity: "High",
    calories: "600-800 kcal",
    description: "Olympic lifting, gymnastics, and timed high-density functional sets."
  },
  {
    id: "cls-5",
    title: "Power Vinyasa & Mobility",
    category: "recovery",
    trainer: "Elena Vasquez",
    time: "Wed, Sat • 10:00 AM",
    duration: "50 Mins",
    intensity: "Moderate",
    calories: "300-400 kcal",
    description: "Deep myofascial release, joint decompression, hip opening, and breath control."
  },
  {
    id: "cls-6",
    title: "Athletic Speed & Agility",
    category: "hiit",
    trainer: "Coach Sam Vance",
    time: "Thu, Sun • 05:00 PM",
    duration: "50 Mins",
    intensity: "High",
    calories: "550-700 kcal",
    description: "Sled pushes, ladder agility, plyometrics, and reactive acceleration drills."
  }
];

const TRAINERS_DATA = [
  {
    name: "Alex 'The Titan' Stone",
    role: "Head Strength & Conditioning Coach",
    certifications: "CSCS, NSCA, Olympic Weightlifting L2",
    experience: "12+ Years Experience",
    bio: "Former national powerlifter specializing in biomechanics, muscle hypertrophy, and strength peaking."
  },
  {
    name: "Maya Lin",
    role: "Lead HIIT & Performance Specialist",
    certifications: "ACE Master Trainer, EXOS Performance",
    experience: "8+ Years Experience",
    bio: "Passionate about metabolic conditioning, athletic transformation, and high-energy group dynamics."
  },
  {
    name: "Sam Vance",
    role: "Combat Sports & Boxing Coach",
    certifications: "USA Boxing Certified, Golden Gloves Coach",
    experience: "10+ Years Experience",
    bio: "Trains amateurs and pro fighters in striking, agility, mental toughness, and core conditioning."
  },
  {
    name: "Elena Vasquez",
    role: "Physiotherapy & Mobility Director",
    certifications: "DPT, FMS Level 2, Yoga Alliance 500-RYT",
    experience: "9+ Years Experience",
    bio: "Focuses on injury rehabilitation, structural alignment, tissue recovery, and longevity training."
  }
];

// Storage Helper
const StorageManager = {
  KEYS: {
    MEMBERS: 'pulsefit_members_v2',
    CHECKINS: 'pulsefit_today_checkins_v2',
    INQUIRIES: 'pulsefit_inquiries_v2'
  },

  getMembers() {
    const raw = localStorage.getItem(this.KEYS.MEMBERS);
    if (!raw) {
      this.setMembers(DEFAULT_MEMBERS);
      return DEFAULT_MEMBERS;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse members, resetting to default", e);
      this.setMembers(DEFAULT_MEMBERS);
      return DEFAULT_MEMBERS;
    }
  },

  setMembers(members) {
    localStorage.setItem(this.KEYS.MEMBERS, JSON.stringify(members));
  },

  resetToDefault() {
    this.setMembers(DEFAULT_MEMBERS);
    localStorage.removeItem(this.KEYS.CHECKINS);
    return DEFAULT_MEMBERS;
  },

  addMember(memberData) {
    const members = this.getMembers();
    const newMember = {
      id: "GYM-" + Math.floor(100 + Math.random() * 900),
      checkInsCount: 0,
      lastCheckIn: "Never",
      ...memberData
    };
    members.unshift(newMember);
    this.setMembers(members);
    return newMember;
  },

  updateMember(id, updatedFields) {
    const members = this.getMembers();
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index] = { ...members[index], ...updatedFields };
      this.setMembers(members);
      return members[index];
    }
    return null;
  },

  deleteMember(id) {
    let members = this.getMembers();
    members = members.filter(m => m.id !== id);
    this.setMembers(members);
    return members;
  },

  checkInMember(id) {
    const members = this.getMembers();
    const member = members.find(m => m.id === id);
    if (!member) return null;

    member.checkInsCount = (member.checkInsCount || 0) + 1;
    const now = new Date();
    const timeStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    member.lastCheckIn = timeStr;
    
    // Also track in daily checkin list
    const checkinLogs = this.getTodayCheckIns();
    checkinLogs.unshift({
      memberId: member.id,
      name: member.name,
      plan: member.plan,
      timestamp: timeStr
    });
    localStorage.setItem(this.KEYS.CHECKINS, JSON.stringify(checkinLogs));

    this.setMembers(members);
    return { member, timeStr };
  },

  getTodayCheckIns() {
    const raw = localStorage.getItem(this.KEYS.CHECKINS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveInquiry(inquiry) {
    const raw = localStorage.getItem(this.KEYS.INQUIRIES);
    let list = [];
    try {
      list = raw ? JSON.parse(raw) : [];
    } catch {
      list = [];
    }
    list.unshift({ id: Date.now(), date: new Date().toISOString(), ...inquiry });
    localStorage.setItem(this.KEYS.INQUIRIES, JSON.stringify(list));
  }
};
