// Custom High-Performance Canvas Charts for Gym Analytics

const GymCharts = {
  renderAttendanceChart(canvasId, attendanceData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Support retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const values = attendanceData || [45, 68, 85, 72, 94, 110, 60];
    const maxVal = Math.max(...values, 120);

    const padding = { top: 25, right: 20, bottom: 35, left: 35 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Draw horizontal grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const y = padding.top + (chartHeight / gridSteps) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Axis label
      ctx.fillStyle = "rgba(156, 163, 175, 0.5)";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "right";
      const valLabel = Math.round(maxVal - (maxVal / gridSteps) * i);
      ctx.fillText(valLabel, padding.left - 8, y + 3);
    }

    // Draw Bars
    const barWidth = Math.min(28, (chartWidth / values.length) * 0.55);
    const step = chartWidth / values.length;

    values.forEach((val, idx) => {
      const x = padding.left + step * idx + (step - barWidth) / 2;
      const barHeight = (val / maxVal) * chartHeight;
      const y = padding.top + chartHeight - barHeight;

      // Gradient bar fill
      const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
      grad.addColorStop(0, '#bef264');
      grad.addColorStop(1, 'rgba(190, 242, 100, 0.2)');

      ctx.fillStyle = grad;
      // Rounded bar top
      const radius = 6;
      ctx.beginPath();
      ctx.moveTo(x, y + barHeight);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
      ctx.lineTo(x + barWidth, y + barHeight);
      ctx.closePath();
      ctx.fill();

      // Top glow dot
      ctx.fillStyle = "#bef264";
      ctx.shadowColor = "#bef264";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x + barWidth / 2, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // Value text above bar
      ctx.fillStyle = "#f3f4f6";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(val, x + barWidth / 2, y - 8);

      // Label at bottom
      ctx.fillStyle = "#9ca3af";
      ctx.font = "11px sans-serif";
      ctx.fillText(labels[idx], x + barWidth / 2, height - padding.bottom + 18);
    });
  },

  renderPlanDistribution(canvasId, members) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    // Calculate distribution
    let starter = 0, pro = 0, vip = 0;
    members.forEach(m => {
      const p = (m.plan || '').toLowerCase();
      if (p.includes('starter')) starter++;
      else if (p.includes('pro')) pro++;
      else if (p.includes('vip')) vip++;
    });

    const total = starter + pro + vip || 1;
    const data = [
      { label: "VIP Elite", count: vip, color: "#bef264" },
      { label: "Pro Beast", count: pro, color: "#f97316" },
      { label: "Starter", count: starter, color: "#38bdf8" }
    ];

    const centerX = width / 2;
    const centerY = height / 2 - 10;
    const outerRadius = Math.min(centerX, centerY) - 15;
    const innerRadius = outerRadius * 0.65;

    let startAngle = -Math.PI / 2;

    data.forEach(slice => {
      const sliceAngle = (slice.count / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = slice.color;
      ctx.shadowColor = slice.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      startAngle = endAngle;
    });

    // Inner text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px 'Outfit', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(total, centerX, centerY - 4);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "10px sans-serif";
    ctx.fillText("Members", centerX, centerY + 14);
  }
};
