/* ==========================================================================
   GRAND ZENITH SMART HOTEL DASHBOARD - ROOM MATRIX COMPONENT
   ========================================================================== */

class RoomsComponent {
    constructor() {
        this.selectedStatus = "all";
        this.searchQuery = "";
    }

    setStatus(statusName) {
        this.selectedStatus = statusName.toString().toLowerCase();
        const container = document.getElementById('tab-rooms');
        if (container) this.render(container);
    }

    resetFilters() {
        this.selectedStatus = "all";
        this.searchQuery = "";
        const searchInput = document.getElementById('global-search');
        if (searchInput) searchInput.value = "";
        const container = document.getElementById('tab-rooms');
        if (container) this.render(container);
    }

    render(container) {
        const state = window.store.getState();
        const fmt = (val) => window.store.formatCurrency(val);
        const rooms = state.rooms || [];

        // Exact Status Counts
        const statusCounts = {
            all: rooms.length,
            occupied: rooms.filter(r => r.status === "Occupied").length,
            clean: rooms.filter(r => r.status === "Clean" || (r.clean === "Clean" && r.status !== "Occupied")).length,
            dirty: rooms.filter(r => r.clean === "Dirty" || r.status === "Dirty").length,
            maintenance: rooms.filter(r => r.status === "Maintenance").length,
            reserved: rooms.filter(r => r.status === "Reserved").length
        };

        // Filtering
        const currentStatus = this.selectedStatus.toString().toLowerCase();
        const query = (this.searchQuery || "").toLowerCase().trim();

        const filtered = rooms.filter(room => {
            let matchesStatus = true;
            if (currentStatus === "occupied") matchesStatus = (room.status === "Occupied");
            else if (currentStatus === "clean") matchesStatus = (room.status === "Clean" || (room.clean === "Clean" && room.status !== "Occupied"));
            else if (currentStatus === "dirty") matchesStatus = (room.clean === "Dirty" || room.status === "Dirty");
            else if (currentStatus === "maintenance") matchesStatus = (room.status === "Maintenance");
            else if (currentStatus === "reserved") matchesStatus = (room.status === "Reserved");

            const matchesSearch = !query || 
                room.id.includes(query) || 
                (room.guest && room.guest.toLowerCase().includes(query)) ||
                room.type.toLowerCase().includes(query);

            return matchesStatus && matchesSearch;
        });

        container.innerHTML = `
            <!-- Top Status Filter Panel -->
            <div class="glass-card" style="padding:1.25rem" id="rooms-filter-panel">
                <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap">
                    <span style="font-size:0.78rem;font-weight:700;color:var(--gold-primary);letter-spacing:0.06em;min-width:110px;display:flex;align-items:center;gap:0.3rem">
                        🏷️ ROOM STATUS:
                    </span>
                    <div class="floor-filter-bar" style="flex:1">
                        <button type="button" class="filter-chip ${currentStatus === 'all' ? 'active' : ''}" data-status-btn="all">
                            All Rooms (${statusCounts.all})
                        </button>
                        <button type="button" class="filter-chip ${currentStatus === 'occupied' ? 'active' : ''}" data-status-btn="occupied">
                            Occupied (${statusCounts.occupied})
                        </button>
                        <button type="button" class="filter-chip ${currentStatus === 'clean' ? 'active' : ''}" data-status-btn="clean">
                            Clean Ready (${statusCounts.clean})
                        </button>
                        <button type="button" class="filter-chip ${currentStatus === 'dirty' ? 'active' : ''}" data-status-btn="dirty">
                            Dirty Turnaround (${statusCounts.dirty})
                        </button>
                        <button type="button" class="filter-chip ${currentStatus === 'maintenance' ? 'active' : ''}" data-status-btn="maintenance">
                            Maintenance (${statusCounts.maintenance})
                        </button>
                        <button type="button" class="filter-chip ${currentStatus === 'reserved' ? 'active' : ''}" data-status-btn="reserved">
                            Reserved (${statusCounts.reserved})
                        </button>
                    </div>
                </div>
            </div>

            <!-- Active Header Bar -->
            <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-glass-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:0.85rem 1.25rem">
                <div>
                    <h3 style="font-size:1.15rem;color:var(--text-primary)">Resort Suite Occupancy Matrix</h3>
                    <span style="font-size:0.8rem;color:var(--text-muted)">Displaying ${filtered.length} of ${rooms.length} Suites</span>
                </div>

                ${currentStatus !== 'all' || query ? `
                    <button type="button" class="btn btn-secondary btn-sm" id="btn-reset-rooms-filters">✕ Reset Filters</button>
                ` : ''}
            </div>

            <!-- Room Grid Matrix -->
            <div class="room-grid" id="room-cards-grid">
                ${filtered.map(room => `
                    <div class="room-card" data-room-id="${room.id}" style="cursor:pointer" title="Click to view Suite ${room.id} details">
                        <div class="room-card-top">
                            <div>
                                <span class="room-number">Suite ${room.id}</span>
                                <div class="room-type">${room.type} • Floor ${room.floor}</div>
                            </div>
                            <span class="status-tag tag-${room.status.toLowerCase().replace(/\s+/g, '-')}">
                                ${room.status}
                            </span>
                        </div>

                        <div class="room-guest-info">
                            <div class="room-guest-name">${room.guest || 'Available / Vacant'}</div>
                            ${room.vip ? `<span class="badge badge-purple" style="width:fit-content;font-size:0.65rem">${room.vip}</span>` : '<span style="font-size:0.7rem;color:var(--text-muted)">Standard Rate</span>'}
                        </div>

                        <!-- Telemetry Info -->
                        <div class="room-telemetry">
                            <div class="telemetry-item" title="Ambient Thermostat Temperature">
                                🌡️ <span>${room.temp}°C</span>
                            </div>
                            <div class="telemetry-item" title="Smart RFID Lock Battery">
                                🔋 <span>${room.lockBattery}%</span>
                            </div>
                            <div class="telemetry-item">
                                <span style="color:var(--emerald-primary);font-weight:700">${fmt(room.rate)}/nt</span>
                            </div>
                        </div>

                        <!-- Quick Control Action Row -->
                        <div style="display:flex;gap:0.4rem;margin-top:0.4rem;padding-top:0.4rem;border-top:1px solid var(--border-subtle)">
                            ${room.status === 'Occupied' ? `
                                <button type="button" class="btn btn-rose btn-sm btn-action-checkout" data-room-id="${room.id}" style="flex:1">Express Checkout</button>
                            ` : room.status === 'Dirty' ? `
                                <button type="button" class="btn btn-emerald btn-sm btn-action-markclean" data-room-id="${room.id}" style="flex:1">Mark Cleaned</button>
                            ` : `
                                <button type="button" class="btn btn-gold btn-sm btn-action-checkin" data-room-id="${room.id}" style="flex:1">Express Check-In</button>
                            `}
                            <button type="button" class="btn btn-secondary btn-sm btn-action-details" data-room-id="${room.id}" title="Full Room IoT Controls">⚙️</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Event Delegation
        const filterPanel = container.querySelector('#rooms-filter-panel');
        if (filterPanel) {
            filterPanel.addEventListener('click', (e) => {
                const statusBtn = e.target.closest('[data-status-btn]');
                if (statusBtn) {
                    this.setStatus(statusBtn.dataset.statusBtn);
                }
            });
        }

        const resetBtn = container.querySelector('#btn-reset-rooms-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }

        const grid = container.querySelector('#room-cards-grid');
        if (grid) {
            grid.addEventListener('click', (e) => {
                const actionBtn = e.target.closest('button');
                if (actionBtn) {
                    const roomId = actionBtn.dataset.roomId;
                    if (!roomId) return;

                    if (actionBtn.classList.contains('btn-action-checkin')) {
                        window.app.openCheckInModal(roomId);
                    } else if (actionBtn.classList.contains('btn-action-checkout')) {
                        window.store.checkOutGuest(roomId);
                        window.app.showToast(`🚪 Express checkout completed for Suite ${roomId}. Housekeeping notified.`, "info");
                        this.render(container);
                    } else if (actionBtn.classList.contains('btn-action-markclean')) {
                        window.store.updateRoomStatus(roomId, "Clean", "Clean");
                        window.app.showToast(`✨ Suite ${roomId} marked Clean & Inspection Ready!`, "success");
                        this.render(container);
                    } else if (actionBtn.classList.contains('btn-action-details')) {
                        window.app.openRoomDetailModal(roomId);
                    }
                    return;
                }

                const roomCard = e.target.closest('.room-card');
                if (roomCard) {
                    const roomId = roomCard.dataset.roomId;
                    if (roomId) window.app.openRoomDetailModal(roomId);
                }
            });
        }
    }
}

window.roomsComponent = new RoomsComponent();
