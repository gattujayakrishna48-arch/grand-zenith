/* ==========================================================================
   GRAND ZENITH SMART HOTEL DASHBOARD - MAINTENANCE & IOT COMPONENT
   ========================================================================== */

class MaintenanceComponent {
    render(container) {
        const state = window.store.getState();
        const tickets = state.maintenanceTickets;

        container.innerHTML = `
            <!-- Top Action Header -->
            <div class="glass-card" style="padding:1rem 1.25rem">
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
                    <div>
                        <h3 class="card-title">Facility Maintenance &amp; IoT Telemetry Hub</h3>
                        <span class="card-subtitle">Real-time IoT sensor network &amp; SLA ticket dispatcher</span>
                    </div>
                    <button class="btn btn-gold btn-sm" id="btn-create-ticket-modal">+ Create Maintenance Ticket</button>
                </div>
            </div>

            <!-- Service Tickets Grid -->
            <div class="glass-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3 class="card-title">Active Service Tickets &amp; SLA Countdown</h3>
                        <span class="card-subtitle">Facilities management dispatch queue</span>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>Room / Area</th>
                                <th>Reported Issue</th>
                                <th>Priority</th>
                                <th>IoT Sensor Reading</th>
                                <th>Assigned Tech</th>
                                <th>SLA Remaining</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tickets.map(t => `
                                <tr>
                                    <td style="font-family:'Outfit',sans-serif;font-weight:700;color:var(--rose-primary)">${t.id}</td>
                                    <td style="font-weight:700">Suite ${t.roomNumber}</td>
                                    <td>${t.issue}</td>
                                    <td>
                                        <span class="badge ${t.priority === 'Emergency' ? 'badge-rose' : 'badge-gold'}">
                                            ${t.priority}
                                        </span>
                                    </td>
                                    <td><span style="font-size:0.78rem;color:var(--cyan-primary)">${t.iotMetric}</span></td>
                                    <td style="font-weight:600">${t.technician}</td>
                                    <td>
                                        ${t.status === 'Resolved' ? `
                                            <span style="color:var(--emerald-primary);font-weight:700">✓ Met SLA</span>
                                        ` : `
                                            <span style="color:var(--rose-primary);font-weight:700">⏱ ${t.slaRemainingMins} mins</span>
                                        `}
                                    </td>
                                    <td>
                                        <span class="status-tag tag-${t.status === 'Resolved' ? 'clean' : 'maintenance'}">
                                            ${t.status}
                                        </span>
                                    </td>
                                    <td>
                                        ${t.status !== 'Resolved' ? `
                                            <button class="btn btn-emerald btn-sm btn-resolve-ticket" data-ticket-id="${t.id}">Mark Resolved</button>
                                        ` : `
                                            <button class="btn btn-secondary btn-sm" disabled>Closed</button>
                                        `}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- IoT Live Telemetry Stream Grid -->
            <div class="glass-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3 class="card-title">Live IoT Room Sensor Stream</h3>
                        <span class="card-subtitle">Real-time thermal, humidity, power, &amp; smart lock telemetry</span>
                    </div>
                    <span class="badge badge-emerald">Sensor Mesh Online (120 Nodes)</span>
                </div>

                <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:1rem">
                    ${state.rooms.slice(0, 8).map(room => `
                        <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:1rem;display:flex;flex-direction:column;gap:0.5rem">
                            <div style="display:flex;justify-content:space-between;align-items:center">
                                <span style="font-weight:700;font-family:'Outfit',sans-serif">Room ${room.id}</span>
                                <span class="badge badge-purple">${room.type}</span>
                            </div>
                            
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.78rem">
                                <div style="background:var(--bg-surface-elevated);padding:0.4rem;border-radius:var(--radius-sm)">
                                    <div style="color:var(--text-muted)">HVAC Temp</div>
                                    <div style="font-weight:700;color:${room.temp > 24 ? 'var(--rose-primary)' : 'var(--text-primary)'}">${room.temp}°C</div>
                                </div>
                                <div style="background:var(--bg-surface-elevated);padding:0.4rem;border-radius:var(--radius-sm)">
                                    <div style="color:var(--text-muted)">Humidity</div>
                                    <div style="font-weight:700">${room.humidity}%</div>
                                </div>
                                <div style="background:var(--bg-surface-elevated);padding:0.4rem;border-radius:var(--radius-sm)">
                                    <div style="color:var(--text-muted)">Lock Battery</div>
                                    <div style="font-weight:700;color:${room.lockBattery < 30 ? 'var(--rose-primary)' : 'var(--emerald-primary)'}">${room.lockBattery}%</div>
                                </div>
                                <div style="background:var(--bg-surface-elevated);padding:0.4rem;border-radius:var(--radius-sm)">
                                    <div style="color:var(--text-muted)">Sensor Link</div>
                                    <div style="font-weight:700;color:var(--emerald-primary)">Active (99%)</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Create Ticket Button
        const createBtn = container.querySelector('#btn-create-ticket-modal');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                window.app.openCreateTicketModal();
            });
        }

        // Resolve Ticket Buttons
        container.querySelectorAll('.btn-resolve-ticket').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ticketId = e.target.dataset.ticketId;
                window.store.resolveMaintenanceTicket(ticketId);
                window.app.showToast(`🔧 Ticket ${ticketId} resolved and closed!`, "success");
                window.app.renderCurrentTab();
            });
        });
    }
}

window.maintenanceComponent = new MaintenanceComponent();
