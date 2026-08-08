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
        
        // Filter logic
        let filtered = state.rooms.filter(room => {
            const matchesFloor = this.selectedFloor === "all" || room.floor.toString() === this.selectedFloor;
            const matchesStatus = this.selectedStatus === "all" || room.status.toLowerCase() === this.selectedStatus.toLowerCase();
            const matchesSearch = !this.searchQuery || 
                room.id.includes(this.searchQuery) || 
                (room.guest && room.guest.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
                room.type.toLowerCase().includes(this.searchQuery.toLowerCase());
            
            return matchesFloor && matchesStatus && matchesSearch;
        });

        container.innerHTML = `
            <!-- Top Controls Bar -->
            <div class="glass-card" style="padding:1rem 1.25rem">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap">
                    <!-- Floor Tabs -->
                    <div class="floor-filter-bar">
                        <button class="filter-chip ${this.selectedFloor === 'all' ? 'active' : ''}" data-floor="all">All Floors (5)</button>
                        <button class="filter-chip ${this.selectedFloor === '1' ? 'active' : ''}" data-floor="1">Floor 1 (Garden)</button>
                        <button class="filter-chip ${this.selectedFloor === '2' ? 'active' : ''}" data-floor="2">Floor 2 (Executive)</button>
                        <button class="filter-chip ${this.selectedFloor === '3' ? 'active' : ''}" data-floor="3">Floor 3 (Superior)</button>
                        <button class="filter-chip ${this.selectedFloor === '4' ? 'active' : ''}" data-floor="4">Floor 4 (Penthouse)</button>
                        <button class="filter-chip ${this.selectedFloor === '5' ? 'active' : ''}" data-floor="5">Floor 5 (Royal Villa)</button>
                    </div>

                    <!-- Status Filter Chips -->
                    <div class="floor-filter-bar">
                        <button class="filter-chip ${this.selectedStatus === 'all' ? 'active' : ''}" data-status="all">All Statuses</button>
                        <button class="filter-chip ${this.selectedStatus === 'occupied' ? 'active' : ''}" data-status="occupied">Occupied (${state.metrics.occupiedCount})</button>
                        <button class="filter-chip ${this.selectedStatus === 'clean' ? 'active' : ''}" data-status="clean">Clean (${state.metrics.cleanCount})</button>
                        <button class="filter-chip ${this.selectedStatus === 'dirty' ? 'active' : ''}" data-status="dirty">Dirty (${state.metrics.dirtyCount})</button>
                        <button class="filter-chip ${this.selectedStatus === 'maintenance' ? 'active' : ''}" data-status="maintenance">Maintenance (${state.metrics.outOfOrderCount})</button>
                    </div>
                </div>
            </div>

            <!-- Room Grid Matrix -->
            <div class="room-grid">
                ${filtered.map(room => `
                    <div class="room-card" data-room-id="${room.id}">
                        <div class="room-card-top">
                            <div>
                                <span class="room-number">Suite ${room.id}</span>
                                <div class="room-type">${room.type}</div>
                            </div>
                            <span class="status-tag tag-${room.status.toLowerCase().replace(/\s+/g, '-')}">
                                ${room.status}
                            </span>
                        </div>

                        <div class="room-guest-info">
                            <div class="room-guest-name">${room.guest || 'Available / Vacant'}</div>
                            ${room.vip ? `<span class="badge badge-purple" style="width:fit-content;font-size:0.65rem">${room.vip}</span>` : ''}
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
                                <span>${fmt(room.rate)}/nt</span>
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
            </div>
        `;

        // Floor Filter Handler
        container.querySelectorAll('.filter-chip[data-floor]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectedFloor = e.target.dataset.floor;
                this.render(container);
            });
        });

        // Status Filter Handler
        container.querySelectorAll('.filter-chip[data-status]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectedStatus = e.target.dataset.status;
                this.render(container);
            });
        });

        // Express Check-In Action
        container.querySelectorAll('.btn-checkin-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const roomId = e.target.dataset.roomId;
                window.app.openCheckInModal(roomId);
            });
        });

        // Express Checkout Action
        container.querySelectorAll('.btn-checkout-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const roomId = e.target.dataset.roomId;
                window.store.checkOutGuest(roomId);
                window.app.showToast(`🚪 Express checkout completed for Room ${roomId}. Housekeeping notified.`, "info");
                window.app.renderCurrentTab();
            });
        });

        // Mark Clean Action
        container.querySelectorAll('.btn-markclean-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const roomId = e.target.dataset.roomId;
                window.store.updateRoomStatus(roomId, "Clean", "Clean");
                window.app.showToast(`✨ Room ${roomId} marked Clean & Inspection Ready!`, "success");
                window.app.renderCurrentTab();
            });
        });

        // Room Details Modal
        container.querySelectorAll('.btn-room-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const roomId = e.target.dataset.roomId;
                window.app.openRoomDetailModal(roomId);
            });
        });
    }
}

window.roomsComponent = new RoomsComponent();
