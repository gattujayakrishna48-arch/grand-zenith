/* ==========================================================================
   GRAND ZENITH SMART HOTEL DASHBOARD - ROOM MATRIX & FLOOR PLAN COMPONENT
   ========================================================================== */

class RoomsComponent {
    constructor() {
        this.selectedFloor = "all";
        this.selectedStatus = "all";
        this.searchQuery = "";
    }

    render(container) {
        const state = window.store.getState();
        const fmt = (val) => window.store.formatCurrency(val);
        
        // Calculate counts per floor
        const floorCounts = {
            all: state.rooms.length,
            1: state.rooms.filter(r => r.floor === 1).length,
            2: state.rooms.filter(r => r.floor === 2).length,
            3: state.rooms.filter(r => r.floor === 3).length,
            4: state.rooms.filter(r => r.floor === 4).length,
            5: state.rooms.filter(r => r.floor === 5).length
        };

        // Calculate counts per status
        const statusCounts = {
            all: state.rooms.length,
            occupied: state.rooms.filter(r => r.status === "Occupied").length,
            clean: state.rooms.filter(r => r.status === "Clean" || r.clean === "Clean").length,
            dirty: state.rooms.filter(r => r.clean === "Dirty").length,
            maintenance: state.rooms.filter(r => r.status === "Maintenance").length,
            reserved: state.rooms.filter(r => r.status === "Reserved").length
        };

        // Comprehensive filter logic
        let filtered = state.rooms.filter(room => {
            // Floor filter
            const matchesFloor = this.selectedFloor === "all" || room.floor.toString() === this.selectedFloor.toString();
            
            // Status filter
            let matchesStatus = true;
            if (this.selectedStatus === "occupied") matchesStatus = room.status === "Occupied";
            else if (this.selectedStatus === "clean") matchesStatus = room.status === "Clean" || (room.clean === "Clean" && room.status !== "Occupied");
            else if (this.selectedStatus === "dirty") matchesStatus = room.clean === "Dirty" || room.status === "Dirty";
            else if (this.selectedStatus === "maintenance") matchesStatus = room.status === "Maintenance";
            else if (this.selectedStatus === "reserved") matchesStatus = room.status === "Reserved";

            // Search query filter
            const q = (this.searchQuery || "").toLowerCase().trim();
            const matchesSearch = !q || 
                room.id.includes(q) || 
                (room.guest && room.guest.toLowerCase().includes(q)) ||
                room.type.toLowerCase().includes(q) ||
                `floor ${room.floor}`.includes(q);
            
            return matchesFloor && matchesStatus && matchesSearch;
        });

        // Floor Name Map
        const floorNames = {
            all: "All Hotel Floors (Floors 1 - 5)",
            1: "Floor 1 - Garden Deluxe Suites",
            2: "Floor 2 - Executive Ocean Suites",
            3: "Floor 3 - Superior King Floor",
            4: "Floor 4 - Oceanfront Penthouse Suites",
            5: "Floor 5 - Presidential Royal Villas"
        };

        container.innerHTML = `
            <!-- Top Filter Control Panel -->
            <div class="glass-card" style="padding:1.25rem">
                <div style="display:flex;flex-direction:column;gap:1rem">
                    
                    <!-- Row 1: Floor Tabs Filter -->
                    <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap">
                        <span style="font-size:0.75rem;font-weight:700;color:var(--text-gold);letter-spacing:0.06em;min-width:90px">🏢 FLOOR SELECT:</span>
                        <div class="floor-filter-bar" style="flex:1">
                            <button class="filter-chip ${this.selectedFloor === 'all' ? 'active' : ''}" data-floor="all">
                                All Floors (${floorCounts.all})
                            </button>
                            <button class="filter-chip ${this.selectedFloor === '1' ? 'active' : ''}" data-floor="1">
                                Floor 1 - Garden (${floorCounts[1]})
                            </button>
                            <button class="filter-chip ${this.selectedFloor === '2' ? 'active' : ''}" data-floor="2">
                                Floor 2 - Executive (${floorCounts[2]})
                            </button>
                            <button class="filter-chip ${this.selectedFloor === '3' ? 'active' : ''}" data-floor="3">
                                Floor 3 - Superior (${floorCounts[3]})
                            </button>
                            <button class="filter-chip ${this.selectedFloor === '4' ? 'active' : ''}" data-floor="4">
                                Floor 4 - Penthouse (${floorCounts[4]})
                            </button>
                            <button class="filter-chip ${this.selectedFloor === '5' ? 'active' : ''}" data-floor="5">
                                Floor 5 - Royal Villas (${floorCounts[5]})
                            </button>
                        </div>
                    </div>

                    <!-- Row 2: Status Chips Filter -->
                    <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap">
                        <span style="font-size:0.75rem;font-weight:700;color:var(--text-gold);letter-spacing:0.06em;min-width:90px">🏷️ ROOM STATUS:</span>
                        <div class="floor-filter-bar" style="flex:1">
                            <button class="filter-chip ${this.selectedStatus === 'all' ? 'active' : ''}" data-status="all">
                                All Statuses (${statusCounts.all})
                            </button>
                            <button class="filter-chip ${this.selectedStatus === 'occupied' ? 'active' : ''}" data-status="occupied">
                                Occupied (${statusCounts.occupied})
                            </button>
                            <button class="filter-chip ${this.selectedStatus === 'clean' ? 'active' : ''}" data-status="clean">
                                Clean (${statusCounts.clean})
                            </button>
                            <button class="filter-chip ${this.selectedStatus === 'dirty' ? 'active' : ''}" data-status="dirty">
                                Dirty / Turnaround (${statusCounts.dirty})
                            </button>
                            <button class="filter-chip ${this.selectedStatus === 'maintenance' ? 'active' : ''}" data-status="maintenance">
                                Maintenance (${statusCounts.maintenance})
                            </button>
                            <button class="filter-chip ${this.selectedStatus === 'reserved' ? 'active' : ''}" data-status="reserved">
                                Reserved (${statusCounts.reserved})
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Active View Header -->
            <div style="display:flex;justify-content:space-between;align-items:center;padding:0.25rem 0.5rem">
                <div>
                    <h3 style="font-size:1.1rem;color:var(--text-primary)">${floorNames[this.selectedFloor]}</h3>
                    <span style="font-size:0.8rem;color:var(--text-muted)">Displaying ${filtered.length} of ${state.rooms.length} Suites Matrix</span>
                </div>
                ${this.selectedFloor !== 'all' || this.selectedStatus !== 'all' ? `
                    <button class="btn btn-secondary btn-sm" id="btn-reset-room-filters">✕ Reset All Filters</button>
                ` : ''}
            </div>

            <!-- Room Grid Matrix -->
            <div class="room-grid">
                ${filtered.map(room => `
                    <div class="room-card" data-room-id="${room.id}" title="Click to open Suite ${room.id} Telemetry &amp; Controls">
                        <div class="room-card-top">
                            <div>
                                <span class="room-number">Suite ${room.id}</span>
                                <div class="room-type">${room.type} • F${room.floor}</div>
                            </div>
                            <span class="status-tag tag-${room.status.toLowerCase().replace(/\s+/g, '-')}">
                                ${room.status}
                            </span>
                        </div>

                        <div class="room-guest-info">
                            <div class="room-guest-name">${room.guest || 'Available / Vacant'}</div>
                            ${room.vip ? `<span class="badge badge-purple" style="width:fit-content;font-size:0.65rem">${room.vip}</span>` : '<span style="font-size:0.7rem;color:var(--text-muted)">Standard Booking</span>'}
                        </div>

                        <!-- Telemetry Info -->
                        <div class="room-telemetry">
                            <div class="telemetry-item" title="Thermostat Ambient Temperature">
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
                                <button class="btn btn-rose btn-sm btn-checkout-action" data-room-id="${room.id}" style="flex:1">Express Checkout</button>
                            ` : room.status === 'Dirty' ? `
                                <button class="btn btn-emerald btn-sm btn-markclean-action" data-room-id="${room.id}" style="flex:1">Mark Cleaned</button>
                            ` : `
                                <button class="btn btn-gold btn-sm btn-checkin-action" data-room-id="${room.id}" style="flex:1">Express Check-In</button>
                            `}
                            <button class="btn btn-secondary btn-sm btn-room-details" data-room-id="${room.id}" title="Full Room IoT Controls">⚙️</button>
                        </div>
                    </div>
                `).join('')}

                ${filtered.length === 0 ? `
                    <div style="grid-column: 1 / -1; background:var(--bg-glass-card); border:1px dashed var(--border-medium); border-radius:var(--radius-lg); padding:3rem; text-align:center">
                        <div style="font-size:2rem;margin-bottom:0.5rem">🏨</div>
                        <h3>No Suites Match the Selected Criteria</h3>
                        <p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.25rem">Try switching floor levels or clearing your active filters.</p>
                        <button class="btn btn-gold btn-sm" id="btn-reset-filters-empty" style="margin-top:1rem">Show All Suites</button>
                    </div>
                ` : ''}
            </div>
        `;

        // Floor Filter Handler
        container.querySelectorAll('.filter-chip[data-floor]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectedFloor = e.currentTarget.dataset.floor;
                this.render(container);
            });
        });

        // Status Filter Handler
        container.querySelectorAll('.filter-chip[data-status]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectedStatus = e.currentTarget.dataset.status;
                this.render(container);
            });
        });

        // Reset Filter Buttons
        const resetBtn = container.querySelector('#btn-reset-room-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.selectedFloor = "all";
                this.selectedStatus = "all";
                this.searchQuery = "";
                this.render(container);
            });
        }

        const resetEmptyBtn = container.querySelector('#btn-reset-filters-empty');
        if (resetEmptyBtn) {
            resetEmptyBtn.addEventListener('click', () => {
                this.selectedFloor = "all";
                this.selectedStatus = "all";
                this.searchQuery = "";
                this.render(container);
            });
        }

        // Room Card Click -> Opens Room Control Modal
        container.querySelectorAll('.room-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // If button inside card was clicked, skip card click
                if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
                const roomId = card.dataset.roomId;
                window.app.openRoomDetailModal(roomId);
            });
        });

        // Express Check-In Action Button
        container.querySelectorAll('.btn-checkin-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const roomId = e.currentTarget.dataset.roomId;
                window.app.openCheckInModal(roomId);
            });
        });

        // Express Checkout Action Button
        container.querySelectorAll('.btn-checkout-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const roomId = e.currentTarget.dataset.roomId;
                window.store.checkOutGuest(roomId);
                window.app.showToast(`🚪 Express checkout completed for Suite ${roomId}. Housekeeping notified.`, "info");
                this.render(container);
            });
        });

        // Mark Clean Action Button
        container.querySelectorAll('.btn-markclean-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const roomId = e.currentTarget.dataset.roomId;
                window.store.updateRoomStatus(roomId, "Clean", "Clean");
                window.app.showToast(`✨ Suite ${roomId} marked Clean & Inspection Ready!`, "success");
                this.render(container);
            });
        });

        // Room Details Action Button
        container.querySelectorAll('.btn-room-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const roomId = e.currentTarget.dataset.roomId;
                window.app.openRoomDetailModal(roomId);
            });
        });
    }
}

window.roomsComponent = new RoomsComponent();
