/* ==========================================================================
   GRAND ZENITH SMART HOTEL DASHBOARD - CUSTOMER / GUEST PORTAL COMPONENT
   ========================================================================== */

class CustomerComponent {
    render(container) {
        const state = window.store.getState();
        const fmt = (val) => window.store.formatCurrency(val);
        const user = state.currentUser || { username: "Lord Jonathan Sterling", roomNumber: "101" };
        
        // Find guest room details
        const room = state.rooms.find(r => r.id === (user.roomNumber || "101")) || state.rooms[0];
        const myRequests = state.conciergeRequests.filter(r => r.roomNumber === room.id);

        container.innerHTML = `
            <!-- Top Guest Welcome Banner -->
            <div class="ai-briefing-banner" style="background: linear-gradient(135deg, rgba(6, 78, 59, 0.85), rgba(15, 23, 42, 0.95)); border-color: rgba(16, 185, 129, 0.4);">
                <div class="ai-briefing-text">
                    <span class="ai-badge" style="background:rgba(16, 185, 129, 0.25);color:#A7F3D0">🏨 Guest Suite Experience Portal</span>
                    <h3>Welcome to Grand Zenith, ${user.username}!</h3>
                    <p>Suite ${room.id} (${room.type}) • Floor ${room.floor} • VIP Tier: <strong style="color:var(--gold-primary)">${room.vip || 'VIP Platinum'}</strong></p>
                </div>
                <div style="text-align:right">
                    <div style="font-size:0.75rem;color:var(--text-muted)">DIGITAL RFID ROOM KEY</div>
                    <div class="badge badge-emerald" style="font-size:0.9rem;padding:0.4rem 0.8rem;margin-top:0.3rem">
                        🔑 Keycard Active &amp; Encrypted
                    </div>
                </div>
            </div>

            <!-- Suite IoT Remote & Digital Key Controls -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <!-- Suite Climate & Lock Controls -->
                <div class="glass-card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3 class="card-title">In-Suite Smart Controls</h3>
                            <span class="card-subtitle">Suite ${room.id} Thermostat &amp; Digital Door Lock</span>
                        </div>
                    </div>

                    <div style="display:flex;flex-direction:column;gap:1.25rem">
                        <!-- Thermostat Slider -->
                        <div class="form-group" style="background:var(--bg-surface);padding:1.1rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle)">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
                                <span class="form-label" style="margin-bottom:0">HVAC Thermostat Temperature</span>
                                <span style="font-weight:700;color:var(--gold-primary);font-size:1.3rem" id="guest-temp-val">${room.temp}°C</span>
                            </div>
                            <div class="slider-container">
                                <span style="font-size:0.75rem;color:var(--text-muted)">18°C (Cool)</span>
                                <input type="range" min="18" max="28" step="0.5" value="${room.temp}" class="custom-slider" id="guest-thermostat-slider">
                                <span style="font-size:0.75rem;color:var(--gold-primary)">28°C (Warm)</span>
                            </div>
                        </div>

                        <!-- Room Stats & Digital Key -->
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
                            <div style="background:var(--bg-surface);padding:1rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle)">
                                <div style="font-size:0.75rem;color:var(--text-muted)">Humidity Sensor</div>
                                <div style="font-weight:700;font-size:1.1rem">${room.humidity}% Optimal</div>
                            </div>

                            <div style="background:var(--bg-surface);padding:1rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle)">
                                <div style="font-size:0.75rem;color:var(--text-muted)">Digital Lock Battery</div>
                                <div style="font-weight:700;font-size:1.1rem;color:var(--emerald-primary)">${room.lockBattery}% Full</div>
                            </div>
                        </div>

                        <button class="btn btn-gold" id="btn-guest-unlock-door" style="padding:0.75rem;font-size:0.95rem">
                            🔓 Unlock Door via Mobile Digital Key
                        </button>
                    </div>
                </div>

                <!-- Stay Details & Folio Summary -->
                <div class="glass-card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3 class="card-title">Reservation &amp; Folio Summary</h3>
                            <span class="card-subtitle">Verified Booking Details</span>
                        </div>
                        <span class="badge badge-purple">${room.status}</span>
                    </div>

                    <div style="display:flex;flex-direction:column;gap:0.9rem">
                        <div style="display:flex;justify-content:space-between;padding:0.65rem 0;border-bottom:1px solid var(--border-subtle)">
                            <span style="color:var(--text-muted)">Assigned Suite:</span>
                            <span style="font-weight:700">Suite ${room.id} (${room.type})</span>
                        </div>

                        <div style="display:flex;justify-content:space-between;padding:0.65rem 0;border-bottom:1px solid var(--border-subtle)">
                            <span style="color:var(--text-muted)">Check-In Date:</span>
                            <span style="font-weight:600">${room.checkIn || '2026-08-06'}</span>
                        </div>

                        <div style="display:flex;justify-content:space-between;padding:0.65rem 0;border-bottom:1px solid var(--border-subtle)">
                            <span style="color:var(--text-muted)">Check-Out Date:</span>
                            <span style="font-weight:600">${room.checkOut || '2026-08-10'}</span>
                        </div>

                        <div style="display:flex;justify-content:space-between;padding:0.65rem 0;border-bottom:1px solid var(--border-subtle)">
                            <span style="color:var(--text-muted)">Nightly Suite Rate:</span>
                            <span style="font-weight:700;color:var(--emerald-primary)">${fmt(room.rate)} / night</span>
                        </div>

                        <div style="display:flex;justify-content:space-between;padding:0.65rem 0;font-size:1.05rem">
                            <span style="font-weight:700">Total Stay Folio Bill:</span>
                            <span style="font-weight:800;color:var(--gold-primary)">${fmt(room.rate * 4)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Concierge Service Creator & Active Requests -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <!-- Order Concierge Services -->
                <div class="glass-card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3 class="card-title">Order Concierge Services</h3>
                            <span class="card-subtitle">Request room service, amenities, or transfers</span>
                        </div>
                    </div>

                    <form id="form-guest-concierge">
                        <div class="form-group">
                            <label class="form-label">Service Category</label>
                            <select id="guest-req-category" class="form-select">
                                <option value="In-Suite Dining">In-Suite Gourmet Dining</option>
                                <option value="VIP Amenity" selected>VIP Amenity & Champagne</option>
                                <option value="Housekeeping">Housekeeping & Extra Pillows</option>
                                <option value="Transport">Private Helicopter / Limousine Transfer</option>
                                <option value="Spa Booking">Riviera Spa Massage Reservation</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Request Details</label>
                            <input type="text" id="guest-req-text" class="form-input" placeholder="e.g. Chilled Dom Pérignon 2012 & extra silk pillows to Suite 101" required>
                        </div>

                        <button type="submit" class="btn btn-gold" style="width:100%;margin-top:0.5rem">
                            🛎️ Dispatch Request to Concierge Desk
                        </button>
                    </form>

                    <!-- Fast Quick Order Buttons -->
                    <div style="margin-top:1.25rem;padding-top:1rem;border-top:1px solid var(--border-subtle)">
                        <div style="font-size:0.75rem;color:var(--text-muted);font-weight:700;margin-bottom:0.6rem">EXPRESS 1-TAP REQUESTS</div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">
                            <button class="btn btn-secondary btn-sm btn-quick-guest-req" data-req="Chilled Dom Pérignon Champagne to Suite">🍾 Champange to Suite</button>
                            <button class="btn btn-secondary btn-sm btn-quick-guest-req" data-req="Extra Feather Pillows & Air Purifier">🛏️ Extra Feather Pillows</button>
                            <button class="btn btn-secondary btn-sm btn-quick-guest-req" data-req="Turndown Service & Lavender Spray">✨ Evening Turndown</button>
                            <button class="btn btn-secondary btn-sm btn-quick-guest-req" data-req="Express Luggage Pickup for Checkout">🧳 Luggage Express</button>
                        </div>
                    </div>
                </div>

                <!-- Submit Review & Active Requests -->
                <div class="glass-card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3 class="card-title">Your Active Concierge Orders</h3>
                            <span class="card-subtitle">Live fulfillment status updates</span>
                        </div>
                        <span class="badge badge-gold">${myRequests.length} Orders</span>
                    </div>

                    <div style="display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1.5rem;max-height:180px;overflow-y:auto">
                        ${myRequests.map(r => `
                            <div style="background:var(--bg-surface);padding:0.75rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center">
                                <div>
                                    <div style="font-weight:600;font-size:0.85rem">${r.request}</div>
                                    <div style="font-size:0.72rem;color:var(--text-muted)">Category: ${r.category} • ${r.time}</div>
                                </div>
                                <span class="status-tag tag-${r.status === 'Fulfilled' ? 'clean' : 'reserved'}">${r.status}</span>
                            </div>
                        `).join('')}
                        ${myRequests.length === 0 ? `<div style="text-align:center;color:var(--text-muted);font-size:0.85rem">No active concierge orders</div>` : ''}
                    </div>

                    <!-- CSAT Guest Review Box -->
                    <div style="padding-top:1rem;border-top:1px solid var(--border-subtle)">
                        <h4 style="font-size:0.95rem;margin-bottom:0.4rem">Rate Your Resort Stay Experience</h4>
                        <form id="form-guest-csat">
                            <div class="form-row" style="margin-bottom:0.75rem">
                                <div class="form-group">
                                    <label class="form-label">Star Rating</label>
                                    <select id="csat-rating" class="form-select">
                                        <option value="5">★★★★★ 5 Stars (Exceptional)</option>
                                        <option value="4">★★★★☆ 4 Stars (Very Good)</option>
                                        <option value="3">★★★☆☆ 3 Stars (Average)</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Review Category</label>
                                    <input type="text" class="form-input" value="Thermal Comfort & Suite Controls" readonly>
                                </div>
                            </div>

                            <div class="form-group">
                                <input type="text" id="csat-text" class="form-input" placeholder="Share your feedback with resort management..." required>
                            </div>

                            <button type="submit" class="btn btn-emerald" style="width:100%">
                                ★ Submit Verified CSAT Review
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Thermostat Slider Handler
        const slider = container.querySelector('#guest-thermostat-slider');
        const display = container.querySelector('#guest-temp-val');
        if (slider) {
            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value).toFixed(1);
                room.temp = parseFloat(val);
                display.textContent = `${val}°C`;
            });
        }

        // Unlock Door Handler
        const unlockBtn = container.querySelector('#btn-guest-unlock-door');
        if (unlockBtn) {
            unlockBtn.addEventListener('click', () => {
                window.app.showToast(`🔓 Digital RFID Key Verified: Suite ${room.id} door unlocked!`, "success");
            });
        }

        // Concierge Request Form
        const conciergeForm = container.querySelector('#form-guest-concierge');
        if (conciergeForm) {
            conciergeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const category = container.querySelector('#guest-req-category').value;
                const text = container.querySelector('#guest-req-text').value;

                window.store.state.conciergeRequests.unshift({
                    id: `CR-${Math.floor(700 + Math.random() * 200)}`,
                    roomNumber: room.id,
                    guestName: user.username,
                    request: text,
                    status: "Pending",
                    time: "Just now",
                    category: category
                });

                window.app.showToast(`🛎️ Request dispatched! Concierge team notified for Suite ${room.id}.`, "success");
                window.app.renderCurrentTab();
            });
        }

        // Quick 1-Tap Buttons
        container.querySelectorAll('.btn-quick-guest-req').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reqText = e.target.dataset.req;
                window.store.state.conciergeRequests.unshift({
                    id: `CR-${Math.floor(700 + Math.random() * 200)}`,
                    roomNumber: room.id,
                    guestName: user.username,
                    request: reqText,
                    status: "Pending",
                    time: "Just now",
                    category: "VIP Amenity"
                });

                window.app.showToast(`✨ Express request sent: "${reqText}"`, "success");
                window.app.renderCurrentTab();
            });
        });

        // CSAT Review Form
        const csatForm = container.querySelector('#form-guest-csat');
        if (csatForm) {
            csatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const rating = parseInt(container.querySelector('#csat-rating').value);
                const text = container.querySelector('#csat-text').value;

                window.store.state.guestFeedback.unshift({
                    guest: user.username,
                    room: room.id,
                    rating: rating,
                    sentiment: rating >= 4 ? "Positive" : "Neutral",
                    text: text,
                    time: "Just now"
                });

                window.app.showToast("★ Thank you! Your verified CSAT review has been shared with Management.", "success");
                window.app.renderCurrentTab();
            });
        }
    }
}

window.customerComponent = new CustomerComponent();
