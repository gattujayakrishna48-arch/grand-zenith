/* ==========================================================================
   GRAND ZENITH SMART HOTEL DASHBOARD - FLOOR PLANS & LEVELS COMPONENT
   ========================================================================== */

class FloorsComponent {
    render(container) {
        const state = window.store.getState();
        const fmt = (val) => window.store.formatCurrency(val);
        const rooms = state.rooms || [];

        // Floor metadata configuration
        const floorConfigs = [
            { level: 1, title: "Floor 1 • Garden Deluxe Suites", desc: "Private terrace & tropical botanical garden access", icon: "🌿" },
            { level: 2, title: "Floor 2 • Executive Ocean Suites", desc: "Panoramic Riviera sea view with executive lounge access", icon: "🌊" },
            { level: 3, title: "Floor 3 • Superior King Suites", desc: "King suite floor with dedicated spa bath amenities", icon: "👑" },
            { level: 4, title: "Floor 4 • Oceanfront Penthouses", desc: "Ultra-luxury double balcony penthouses with infinity jacuzzi", icon: "💎" },
            { level: 5, title: "Floor 5 • Presidential Royal Villas", desc: "Diplomatic private floor with dedicated butler & helicopter pad access", icon: "🏰" }
        ];

        // Process floor stats
        const floorStats = floorConfigs.map(config => {
            const floorRooms = rooms.filter(r => r.floor === config.level);
            const total = floorRooms.length;
            const occupied = floorRooms.filter(r => r.status === "Occupied").length;
            const clean = floorRooms.filter(r => r.status === "Clean" || (r.clean === "Clean" && r.status !== "Occupied")).length;
            const dirty = floorRooms.filter(r => r.clean === "Dirty" || r.status === "Dirty").length;
            const maintenance = floorRooms.filter(r => r.status === "Maintenance").length;
            
            const occupancyPct = total > 0 ? Math.round((occupied / total) * 100) : 0;
            const avgTemp = total > 0 ? (floorRooms.reduce((sum, r) => sum + r.temp, 0) / total).toFixed(1) : 22.0;
            const avgBattery = total > 0 ? Math.round(floorRooms.reduce((sum, r) => sum + r.lockBattery, 0) / total) : 90;
            const avgRate = total > 0 ? Math.round(floorRooms.reduce((sum, r) => sum + r.rate, 0) / total) : 350;

            return {
                ...config,
                rooms: floorRooms,
                total, occupied, clean, dirty, maintenance,
                occupancyPct, avgTemp, avgBattery, avgRate
            };
        });

        container.innerHTML = `
            <!-- Top Floor Intelligence Summary -->
            <div class="ai-briefing-banner" style="background: linear-gradient(135deg, rgba(30, 58, 138, 0.85), rgba(15, 23, 42, 0.95)); border-color: rgba(59, 130, 246, 0.4);">
                <div class="ai-briefing-text">
                    <span class="ai-badge" style="background:rgba(59, 130, 246, 0.25);color:#BFDBFE">🏢 Resort Floor Architecture &amp; Level Telemetry</span>
                    <h3>5 Hotel Floors • 120 Total Suite Capacity</h3>
                    <p>Real-time floor occupancy distribution, environmental thermal stability, and IoT hardware diagnostics across all 5 resort levels.</p>
                </div>
            </div>

            <!-- Floor Cards List -->
            <div style="display:flex;flex-direction:column;gap:1.5rem">
                ${floorStats.map(floor => `
                    <div class="glass-card" style="padding:1.5rem">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.25rem;gap:1rem;flex-wrap:wrap">
                            <div style="display:flex;align-items:center;gap:0.85rem">
                                <div style="width:48px;height:48px;border-radius:var(--radius-md);background:var(--bg-surface-elevated);border:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:center;font-size:1.4rem">
                                    ${floor.icon}
                                </div>
                                <div>
                                    <h3 style="font-size:1.15rem;color:var(--text-primary)">${floor.title}</h3>
                                    <p style="font-size:0.82rem;color:var(--text-muted)">${floor.desc}</p>
                                </div>
                            </div>

                            <!-- Key Metrics Pill -->
                            <div style="display:flex;align-items:center;gap:1rem;background:var(--bg-surface-elevated);padding:0.6rem 1rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle)">
                                <div style="text-align:center">
                                    <div style="font-size:0.7rem;color:var(--text-muted)">SUITES</div>
                                    <div style="font-weight:700;font-size:0.95rem;color:var(--text-primary)">${floor.total}</div>
                                </div>
                                <div style="height:24px;width:1px;background:var(--border-subtle)"></div>
                                <div style="text-align:center">
                                    <div style="font-size:0.7rem;color:var(--text-muted)">AVG RATE</div>
                                    <div style="font-weight:700;font-size:0.95rem;color:var(--emerald-primary)">${fmt(floor.avgRate)}</div>
                                </div>
                                <div style="height:24px;width:1px;background:var(--border-subtle)"></div>
                                <div style="text-align:center">
                                    <div style="font-size:0.7rem;color:var(--text-muted)">AVG TEMP</div>
                                    <div style="font-weight:700;font-size:0.95rem;color:var(--gold-primary)">${floor.avgTemp}°C</div>
                                </div>
                            </div>
                        </div>

                        <!-- Occupancy Progress Bar -->
                        <div style="margin-bottom:1.25rem">
                            <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:0.4rem;font-weight:600">
                                <span>Floor Occupancy Rate: <strong style="color:var(--gold-primary)">${floor.occupancyPct}%</strong> (${floor.occupied} of ${floor.total} Occupied)</span>
                                <span>${floor.clean} Clean • ${floor.dirty} Dirty • ${floor.maintenance} Maintenance</span>
                            </div>
                            <div style="height:10px;background:var(--bg-surface-elevated);border-radius:var(--radius-full);overflow:hidden;border:1px solid var(--border-subtle)">
                                <div style="height:100%;width:${floor.occupancyPct}%;background:linear-gradient(90deg, #F59E0B, #10B981);border-radius:var(--radius-full);transition:width 0.5s ease"></div>
                            </div>
                        </div>

                        <!-- Floor Rooms List Grid -->
                        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));gap:1rem">
                            ${floor.rooms.map(room => `
                                <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:0.85rem;display:flex;flex-direction:column;gap:0.4rem">
                                    <div style="display:flex;justify-content:space-between;align-items:center">
                                        <span style="font-weight:800;font-family:'Outfit',sans-serif;font-size:0.95rem">Suite ${room.id}</span>
                                        <span class="status-tag tag-${room.status.toLowerCase().replace(/\s+/g, '-')}">${room.status}</span>
                                    </div>
                                    <div style="font-size:0.78rem;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                        ${room.guest || 'Vacant / Available'}
                                    </div>
                                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.72rem;color:var(--text-muted);margin-top:0.2rem">
                                        <span>🌡️ ${room.temp}°C</span>
                                        <span style="color:var(--emerald-primary);font-weight:700">${fmt(room.rate)}</span>
                                        <button class="btn btn-secondary btn-sm btn-floor-room-ctrl" data-room-id="${room.id}" style="padding:0.15rem 0.45rem;font-size:0.7rem">Manage</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Event listener for room control buttons inside floor cards
        container.querySelectorAll('.btn-floor-room-ctrl').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const roomId = e.target.dataset.roomId;
                if (roomId) window.app.openRoomDetailModal(roomId);
            });
        });
    }
}

window.floorsComponent = new FloorsComponent();
