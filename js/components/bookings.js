/* ==========================================================================
   GRAND ZENITH SMART HOTEL DASHBOARD - BOOKINGS & SCHEDULE COMPONENT
   ========================================================================== */

class BookingsComponent {
    constructor() {
        this.filterStatus = "all";
    }

    render(container) {
        const state = window.store.getState();
        const fmt = (val) => window.store.formatCurrency(val);
        let bookings = state.bookings;

        if (this.filterStatus !== "all") {
            bookings = bookings.filter(b => b.status.toLowerCase() === this.filterStatus.toLowerCase());
        }

        container.innerHTML = `
            <div class="glass-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3 class="card-title">Active Reservations &amp; Schedule Timeline</h3>
                        <span class="card-subtitle">Integrated PMS Booking Records (${bookings.length} Displayed)</span>
                    </div>
                    <div style="display:flex;gap:0.75rem">
                        <select class="form-select" id="booking-status-filter" style="width:auto;padding:0.4rem 0.8rem">
                            <option value="all">All Booking Statuses</option>
                            <option value="Checked In">Checked In</option>
                            <option value="Due Arrival">Due Arrival</option>
                            <option value="Checked Out">Checked Out</option>
                        </select>
                        <button class="btn btn-gold btn-sm" id="btn-create-booking-modal">+ New Reservation</button>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Guest Name</th>
                                <th>Assigned Room</th>
                                <th>Stay Dates (Check-In / Out)</th>
                                <th>VIP Tier</th>
                                <th>Booking Channel</th>
                                <th>Total Revenue</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bookings.map(b => `
                                <tr>
                                    <td style="font-family:'Outfit',sans-serif;font-weight:700;color:var(--gold-primary)">${b.id}</td>
                                    <td>
                                        <div style="font-weight:600">${b.guestName}</div>
                                    </td>
                                    <td style="font-weight:700">Suite ${b.roomNumber}</td>
                                    <td>
                                        <span style="font-size:0.8rem;color:var(--text-secondary)">
                                            ${b.checkIn} &rarr; ${b.checkOut}
                                        </span>
                                    </td>
                                    <td><span class="badge badge-purple">${b.vipTier}</span></td>
                                    <td><span style="font-size:0.78rem;color:var(--text-muted)">${b.channel}</span></td>
                                    <td style="font-weight:700;color:var(--emerald-primary)">${fmt(b.totalAmount)}</td>
                                    <td>
                                        <span class="status-tag tag-${b.status === 'Checked In' ? 'clean' : b.status === 'Due Arrival' ? 'reserved' : 'dirty'}">
                                            ${b.status}
                                        </span>
                                    </td>
                                    <td>
                                        ${b.status === 'Due Arrival' ? `
                                            <button class="btn btn-gold btn-sm btn-express-checkin" data-room="${b.roomNumber}" data-guest="${b.guestName}">Express Check-In</button>
                                        ` : `
                                            <button class="btn btn-secondary btn-sm" disabled>Active Stay</button>
                                        `}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Booking Schedule Timeline Visualizer -->
            <div class="glass-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3 class="card-title">7-Day Suite Occupancy Timeline</h3>
                        <span class="card-subtitle">Visual Gantt Schedule across Key Penthouse &amp; Executive Suites</span>
                    </div>
                </div>

                <div style="display:flex;flex-direction:column;gap:0.75rem">
                    <div style="display:grid;grid-template-columns:120px repeat(7, 1fr);font-size:0.75rem;color:var(--text-muted);font-weight:700;padding-bottom:0.5rem;border-bottom:1px solid var(--border-subtle)">
                        <div>SUITE</div>
                        <div>AUG 8 (TODAY)</div>
                        <div>AUG 9</div>
                        <div>AUG 10</div>
                        <div>AUG 11</div>
                        <div>AUG 12</div>
                        <div>AUG 13</div>
                        <div>AUG 14</div>
                    </div>

                    ${state.rooms.slice(0, 8).map(room => `
                        <div style="display:grid;grid-template-columns:120px 1fr;align-items:center;gap:0.5rem">
                            <div style="font-weight:700;font-size:0.82rem">Room ${room.id}</div>
                            <div style="position:relative;height:32px;background:var(--bg-surface);border-radius:var(--radius-sm);border:1px solid var(--border-subtle);overflow:hidden">
                                ${room.status === 'Occupied' ? `
                                    <div style="position:absolute;left:0;top:0;width:75%;height:100%;background:linear-gradient(90deg, #F59E0B, #D97706);border-radius:var(--radius-sm);padding:0.4rem 0.6rem;font-size:0.72rem;font-weight:700;color:#0F172A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                        Occupied: ${room.guest}
                                    </div>
                                ` : room.status === 'Reserved' ? `
                                    <div style="position:absolute;left:25%;top:0;width:60%;height:100%;background:linear-gradient(90deg, #06B6D4, #0891B2);border-radius:var(--radius-sm);padding:0.4rem 0.6rem;font-size:0.72rem;font-weight:700;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                        Reserved: ${room.guest}
                                    </div>
                                ` : `
                                    <div style="position:absolute;left:0;top:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:0.72rem;color:var(--emerald-primary)">
                                        Available for Direct Booking
                                    </div>
                                `}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Event Handlers
        const filterSelect = container.querySelector('#booking-status-filter');
        if (filterSelect) {
            filterSelect.value = this.filterStatus;
            filterSelect.addEventListener('change', (e) => {
                this.filterStatus = e.target.value;
                this.render(container);
            });
        }

        const newBookingBtn = container.querySelector('#btn-create-booking-modal');
        if (newBookingBtn) {
            newBookingBtn.addEventListener('click', () => {
                window.app.openCreateBookingModal();
            });
        }

        container.querySelectorAll('.btn-express-checkin').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const room = e.target.dataset.room;
                const guest = e.target.dataset.guest;
                window.store.checkInGuest(room, guest, "VIP Platinum", "2026-08-14");
                window.app.showToast(`✨ Guest ${guest} checked into Suite ${room}!`, "success");
                window.app.renderCurrentTab();
            });
        });
    }
}

window.bookingsComponent = new BookingsComponent();
