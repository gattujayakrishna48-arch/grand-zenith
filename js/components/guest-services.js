/* ==========================================================================
   GRAND ZENITH SMART HOTEL DASHBOARD - GUEST SERVICES & CSAT COMPONENT
   ========================================================================== */

class GuestServicesComponent {
    render(container) {
        const state = window.store.getState();
        const concierge = state.conciergeRequests;
        const feedback = state.guestFeedback;
        const csat = window.analyticsEngine.getCSATAnalysis(feedback);

        container.innerHTML = `
            <!-- Top Summary Cards -->
            <div class="grid-kpi">
                <div class="kpi-card">
                    <div class="kpi-header">
                        <span>GUEST CSAT SCORE</span>
                        <div class="kpi-icon-wrapper">★</div>
                    </div>
                    <div class="kpi-value-row">
                        <span class="kpi-value">4.88 / 5.0</span>
                        <span class="kpi-trend trend-up">▲ +0.12</span>
                    </div>
                    <div class="kpi-subtext">98% Positive Feedback Index</div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-header">
                        <span>OPEN CONCIERGE REQUESTS</span>
                        <div class="kpi-icon-wrapper">🛎️</div>
                    </div>
                    <div class="kpi-value-row">
                        <span class="kpi-value">${concierge.filter(r => r.status !== 'Fulfilled').length} Active</span>
                        <span class="kpi-trend trend-up">Avg SLA 8 mins</span>
                    </div>
                    <div class="kpi-subtext">VIP Amenity &amp; Transfer Queue</div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-header">
                        <span>VIP GUESTS IN-HOUSE</span>
                        <div class="kpi-icon-wrapper">👑</div>
                    </div>
                    <div class="kpi-value-row">
                        <span class="kpi-value">12 Royal/VIPs</span>
                        <span class="kpi-trend trend-up">High Value</span>
                    </div>
                    <div class="kpi-subtext">3 Diamond, 2 Royal Tier</div>
                </div>
            </div>

            <!-- Concierge Requests & CSAT Sentiment Grid -->
            <div style="display: grid; grid-template-columns: 3fr 2fr; gap: 1.5rem;">
                <!-- Live Concierge Queue -->
                <div class="glass-card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3 class="card-title">Live Concierge &amp; Room Service Queue</h3>
                            <span class="card-subtitle">Real-time guest requests from mobile app &amp; in-suite tablet</span>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th>Req ID</th>
                                    <th>Room</th>
                                    <th>Guest Name</th>
                                    <th>Request Details</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Fulfill</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${concierge.map(r => `
                                    <tr>
                                        <td style="font-family:'Outfit',sans-serif;font-weight:700;color:var(--gold-primary)">${r.id}</td>
                                        <td style="font-weight:700">Suite ${r.roomNumber}</td>
                                        <td style="font-weight:600">${r.guestName}</td>
                                        <td>${r.request}</td>
                                        <td><span class="badge badge-purple">${r.category}</span></td>
                                        <td>
                                            <span class="status-tag tag-${r.status === 'Fulfilled' ? 'clean' : 'reserved'}">
                                                ${r.status}
                                            </span>
                                        </td>
                                        <td>
                                            ${r.status !== 'Fulfilled' ? `
                                                <button class="btn btn-gold btn-sm btn-fulfill-request" data-req-id="${r.id}">Fulfill</button>
                                            ` : `
                                                <span style="color:var(--emerald-primary);font-size:0.8rem">✓ Done</span>
                                            `}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- CSAT Topic Sentiment Index -->
                <div class="glass-card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3 class="card-title">AI CSAT Sentiment Topics</h3>
                            <span class="card-subtitle">Automated text sentiment scoring</span>
                        </div>
                    </div>

                    <div style="display:flex;flex-direction:column;gap:1rem">
                        ${csat.topicScores.map(topic => `
                            <div>
                                <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.85rem;margin-bottom:0.3rem">
                                    <span style="font-weight:600">${topic.category}</span>
                                    <span style="font-weight:700;color:${topic.score > 90 ? 'var(--emerald-primary)' : 'var(--gold-primary)'}">${topic.score}%</span>
                                </div>
                                <div style="width:100%;height:8px;background:var(--bg-surface);border-radius:var(--radius-full);overflow:hidden">
                                    <div style="width:${topic.score}%;height:100%;background:linear-gradient(90deg, #F59E0B, #10B981)"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border-subtle)">
                        <h4 style="font-size:0.9rem;margin-bottom:0.75rem">Recent Verified Reviews</h4>
                        <div style="display:flex;flex-direction:column;gap:0.75rem;max-height:220px;overflow-y:auto">
                            ${feedback.map(f => `
                                <div style="background:var(--bg-surface);padding:0.75rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle)">
                                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.78rem;margin-bottom:0.2rem">
                                        <span style="font-weight:700">${f.guest} (Suite ${f.room})</span>
                                        <span style="color:var(--gold-primary)">★ ${f.rating}.0</span>
                                    </div>
                                    <div style="font-size:0.8rem;color:var(--text-secondary);font-style:italic">"${f.text}"</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Fulfill button
        container.querySelectorAll('.btn-fulfill-request').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reqId = e.target.dataset.reqId;
                window.store.resolveConciergeRequest(reqId);
                window.app.showToast(`🛎️ Request ${reqId} fulfilled by Concierge desk!`, "success");
                window.app.renderCurrentTab();
            });
        });
    }
}

window.guestServicesComponent = new GuestServicesComponent();
