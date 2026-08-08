/* ==========================================================================
   GRAND ZENITH SMART HOTEL DASHBOARD - EXECUTIVE BI OVERVIEW COMPONENT
   ========================================================================== */

class OverviewComponent {
    render(container) {
        const state = window.store.getState();
        const m = state.metrics;
        const fmt = (val) => window.store.formatCurrency(val);

        container.innerHTML = `
            <!-- Top AI Briefing Banner -->
            <div class="ai-briefing-banner">
                <div class="ai-briefing-text">
                    <span class="ai-badge">✨ Grand Zenith AI Executive Briefing</span>
                    <h3>High Performance Day: 87.5% Occupancy | RevPAR +12.4% vs Target</h3>
                    <p>Demand is trending strong ahead of the Riviera Yacht Race. Housekeeping is 75% complete with afternoon turnarounds. 1 HVAC unit in Room 204 requires immediate technician inspection.</p>
                </div>
                <div class="ai-briefing-action">
                    <button class="btn btn-gold btn-sm" id="overview-view-predictive">Open Predictive Engine &rarr;</button>
                </div>
            </div>

            <!-- KPI Cards Row -->
            <div class="grid-kpi">
                <!-- KPI 1: Occupancy Rate -->
                <div class="kpi-card">
                    <div class="kpi-header">
                        <span>OCCUPANCY RATE</span>
                        <div class="kpi-icon-wrapper">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path></svg>
                        </div>
                    </div>
                    <div class="kpi-value-row">
                        <span class="kpi-value">${m.occupancyRate}%</span>
                        <span class="kpi-trend trend-up">▲ +4.2%</span>
                    </div>
                    <div class="kpi-subtext">${m.occupiedCount} of ${state.hotelInfo.totalRooms} Rooms Occupied</div>
                </div>

                <!-- KPI 2: Average Daily Rate (ADR) -->
                <div class="kpi-card">
                    <div class="kpi-header">
                        <span>AVERAGE DAILY RATE (ADR)</span>
                        <div class="kpi-icon-wrapper">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                    </div>
                    <div class="kpi-value-row">
                        <span class="kpi-value">${fmt(m.adr)}</span>
                        <span class="kpi-trend trend-up">▲ +18</span>
                    </div>
                    <div class="kpi-subtext">Peak Suite Mix Optimizing Yield</div>
                </div>

                <!-- KPI 3: RevPAR -->
                <div class="kpi-card">
                    <div class="kpi-header">
                        <span>REVPAR (REVENUE / ROOM)</span>
                        <div class="kpi-icon-wrapper">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                        </div>
                    </div>
                    <div class="kpi-value-row">
                        <span class="kpi-value">${fmt(m.revpar)}</span>
                        <span class="kpi-trend trend-up">▲ +8.6%</span>
                    </div>
                    <div class="kpi-subtext">Target: ${fmt(275)} (+9.7% ahead)</div>
                </div>

                <!-- KPI 4: Daily Revenue -->
                <div class="kpi-card">
                    <div class="kpi-header">
                        <span>DAILY GROSS REVENUE</span>
                        <div class="kpi-icon-wrapper">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                        </div>
                    </div>
                    <div class="kpi-value-row">
                        <span class="kpi-value">${fmt(m.totalRevenueToday)}</span>
                        <span class="kpi-trend trend-up">▲ +14%</span>
                    </div>
                    <div class="kpi-subtext">Pacing ${fmt(420000)} Monthly Forecast</div>
                </div>

                <!-- KPI 5: CSAT Index -->
                <div class="kpi-card">
                    <div class="kpi-header">
                        <span>GUEST CSAT RATING</span>
                        <div class="kpi-icon-wrapper">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        </div>
                    </div>
                    <div class="kpi-value-row">
                        <span class="kpi-value">${m.csatScore} <small style="font-size:1rem;color:var(--text-muted)">/ 5.0</small></span>
                        <span class="kpi-trend trend-up">★ 98% Positive</span>
                    </div>
                    <div class="kpi-subtext">Based on 42 verified reviews today</div>
                </div>
            </div>

            <!-- Charts Section Grid -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
                <!-- Main Trend Line Chart -->
                <div class="glass-card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3 class="card-title">Revenue &amp; RevPAR Velocity (7 Days)</h3>
                            <span class="card-subtitle">Real-time financial yield comparison</span>
                        </div>
                        <span class="badge badge-emerald">Live Feed</span>
                    </div>
                    <div style="height: 300px; position: relative;">
                        <canvas id="chart-revenue-trend"></canvas>
                    </div>
                </div>

                <!-- Occupancy Donut Breakdown -->
                <div class="glass-card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3 class="card-title">Room Allocation Matrix</h3>
                            <span class="card-subtitle">120 Total Room Distribution</span>
                        </div>
                    </div>
                    <div style="height: 300px; position: relative;">
                        <canvas id="chart-occupancy-donut"></canvas>
                    </div>
                </div>
            </div>

            <!-- Recent Urgent Operational Activity Table -->
            <div class="glass-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3 class="card-title">Live VIP Arrivals &amp; Critical Operations</h3>
                        <span class="card-subtitle">Priority dispatch log for management overview</span>
                    </div>
                    <button class="btn btn-secondary btn-sm" id="btn-refresh-overview">Refresh Feed</button>
                </div>
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Room #</th>
                                <th>Guest / Operation</th>
                                <th>Category / Tier</th>
                                <th>Status</th>
                                <th>Action Priority</th>
                                <th>Quick Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.rooms.slice(0, 5).map(room => `
                                <tr>
                                    <td style="font-weight:700;font-family:'Outfit',sans-serif;">Room ${room.id}</td>
                                    <td>
                                        <div style="font-weight:600">${room.guest || 'Unoccupied'}</div>
                                        <div style="font-size:0.75rem;color:var(--text-muted)">Floor ${room.floor} - ${room.type}</div>
                                    </td>
                                    <td><span class="badge badge-purple">${room.vip || 'Standard'}</span></td>
                                    <td>
                                        <span class="status-tag tag-${room.status.toLowerCase().replace(/\s+/g, '-')}">
                                            ${room.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span style="font-size:0.8rem;color:${room.clean === 'Dirty' ? 'var(--rose-primary)' : 'var(--emerald-primary)'}">
                                            ${room.clean === 'Dirty' ? '⚡ Priority Cleaning' : '✓ Inspection Ready'}
                                        </span>
                                    </td>
                                    <td>
                                        <button class="btn btn-secondary btn-sm btn-room-modal" data-room-id="${room.id}">Manage Suite</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Initialize Charts
        setTimeout(() => {
            window.chartManager.renderRevenueTrendChart('chart-revenue-trend');
            window.chartManager.renderOccupancyDonutChart('chart-occupancy-donut', m);
        }, 50);

        // Attach local handlers
        const navPredictiveBtn = container.querySelector('#overview-view-predictive');
        if (navPredictiveBtn) {
            navPredictiveBtn.addEventListener('click', () => {
                window.app.switchTab('predictive');
            });
        }
    }
}

window.overviewComponent = new OverviewComponent();
