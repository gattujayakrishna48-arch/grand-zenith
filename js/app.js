/* ==========================================================================
   GRAND ZENITH SMART HOTEL DASHBOARD - MAIN APPLICATION CONTROLLER
   ========================================================================== */

class AppController {
    constructor() {
        this.currentTab = 'overview';
        this.theme = 'dark';
    }

    init() {
        console.log("Initializing Grand Zenith Smart Hotel Dashboard...");
        
        this.setupAuthHandlers();
        this.setupCurrencyHandler();
        this.setupNavigation();
        this.setupLiveClock();
        this.setupThemeToggle();
        this.setupNotifications();
        this.setupModals();
        this.setupGlobalSearch();
        
        // Listen to store events
        window.store.subscribe((event, data) => {
            if (event === "AUTH_LOGIN") {
                this.onUserLoggedIn(data);
            } else if (event === "AUTH_LOGOUT") {
                this.onUserLoggedOut();
            } else if (event === "PROFILE_UPDATED") {
                this.onProfileUpdated(data);
            } else if (event === "CURRENCY_CHANGED") {
                this.onCurrencyChanged(data);
            } else {
                this.updateSidebarBadges();
            }
        });

        // Default: Auto-login as Executive Manager so dashboard loads immediately
        window.store.login("Manager", "Alexandra Vance");
        this.startRealtimeSimulation();
    }

    setupCurrencyHandler() {
        const select = document.getElementById('currency-select');
        if (select) {
            select.value = window.store.getState().selectedCurrency;
            select.addEventListener('change', (e) => {
                const code = e.target.value;
                window.store.setCurrency(code);
            });
        }
    }

    onCurrencyChanged(currencyObj) {
        this.showToast(`💱 Active Currency set to ${currencyObj.name}`, "info");
        this.renderCurrentTab();
    }

    setupThemeToggle() {
        const select = document.getElementById('theme-select');
        if (select) {
            select.value = this.theme;
            select.addEventListener('change', (e) => {
                const themeVal = e.target.value;
                this.setTheme(themeVal);
            });
        }
    }

    setTheme(themeName) {
        this.theme = themeName;
        document.documentElement.setAttribute('data-theme', themeName);
        
        const labels = {
            'dark': '🌙 Obsidian Gold (Dark)',
            'light': '☀️ Royal Ivory (Light)',
            'ocean': '🌊 Monaco Ocean (Sapphire)'
        };
        
        this.showToast(`🎨 Theme changed to ${labels[themeName] || themeName}`, "info");
        this.renderCurrentTab();
    }

    setupAuthHandlers() {
        const getCustomName = () => {
            const input = document.getElementById('custom-user-name');
            return input && input.value.trim() ? input.value.trim() : null;
        };

        // Profile 1: Executive Manager Login
        document.getElementById('btn-login-manager').addEventListener('click', () => {
            const name = getCustomName() || "Alexandra Vance";
            window.store.login("Manager", name);
            this.showToast(`👑 Welcome, ${name}! Signed in as Executive Manager`, "success");
        });

        // Profile 2: Operations Staff Login
        document.getElementById('btn-login-staff').addEventListener('click', () => {
            const name = getCustomName() || "Jean-Luc Dubois";
            window.store.login("Staff", name);
            this.showToast(`🧹 Welcome, ${name}! Signed in as Operations Staff`, "info");
        });

        // Profile 3: Customer / Guest Login
        document.getElementById('btn-login-customer').addEventListener('click', () => {
            const name = getCustomName() || "Lord Jonathan Sterling";
            window.store.login("Customer", name);
            this.showToast(`🏨 Welcome, ${name}! Opened Guest Suite 101 Portal`, "success");
        });

        // Form Manual Login
        document.getElementById('form-manual-login').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = getCustomName();
            const role = document.getElementById('login-role-select').value;
            window.store.login(role, name);
            this.showToast(`✨ Welcome! Authenticated as ${role}`, "success");
        });

        // Sign Out Buttons
        document.querySelectorAll('.signout-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.store.logout();
            });
        });

        // Clickable Profile Card & Role Pill in Topbar
        const profileCard = document.getElementById('sidebar-user-profile');
        if (profileCard) {
            profileCard.addEventListener('click', () => {
                this.openUserProfileModal();
            });
        }

        const rolePill = document.getElementById('role-pill-tag');
        if (rolePill) {
            rolePill.addEventListener('click', () => {
                this.openUserProfileModal();
            });
        }
    }

    onUserLoggedIn(user) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');

        // Update User Profile UI
        document.getElementById('user-name-display').textContent = user.username;
        document.getElementById('user-role-display').textContent = user.title;
        document.getElementById('user-avatar-display').textContent = user.avatar;

        const rolePill = document.getElementById('role-pill-tag');
        const sidebarRoleBadge = document.getElementById('sidebar-role-badge');
        
        if (user.role === "Manager") {
            rolePill.className = "role-pill pill-manager";
            rolePill.innerHTML = "👑 Executive Manager Access";
            sidebarRoleBadge.textContent = "Manager Portal";
        } else if (user.role === "Staff") {
            rolePill.className = "role-pill pill-staff";
            rolePill.innerHTML = "🧹 Operations Staff Access";
            sidebarRoleBadge.textContent = "Staff Portal";
        } else if (user.role === "Customer") {
            rolePill.className = "role-pill pill-customer";
            rolePill.innerHTML = "🏨 Customer / Guest Portal";
            sidebarRoleBadge.textContent = "Guest Portal";
        }

        // Apply RBAC tab visibility to sidebar items
        document.querySelectorAll('.nav-item').forEach(item => {
            const reqRole = item.dataset.roleReq;
            
            if (user.role === "Manager") {
                if (reqRole === "Customer") item.classList.add('hidden-role');
                else item.classList.remove('hidden-role');
            } else if (user.role === "Staff") {
                if (reqRole === "StaffManager" || reqRole === "All") item.classList.remove('hidden-role');
                else item.classList.add('hidden-role');
            } else if (user.role === "Customer") {
                if (reqRole === "Customer") item.classList.remove('hidden-role');
                else item.classList.add('hidden-role');
            }
        });

        // Switch to initial tab based on profile
        const initialTab = user.role === "Manager" ? 'overview' : user.role === "Staff" ? 'rooms' : 'customer-portal';
        this.switchTab(initialTab);
        this.updateSidebarBadges();
    }

    onProfileUpdated(user) {
        document.getElementById('user-name-display').textContent = user.username;
        document.getElementById('user-role-display').textContent = user.title;
        document.getElementById('user-avatar-display').textContent = user.avatar;
        this.renderCurrentTab();
    }

    onUserLoggedOut() {
        document.getElementById('app-container').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
        this.showToast("👋 Signed out. Returned to Login Screen.", "info");
    }

    // Modal: Edit User Profile & Switch Account
    openUserProfileModal() {
        const user = window.store.getState().currentUser || { username: "Guest User", role: "Manager", title: "General Manager", avatar: "GM" };

        const html = `
            <div style="text-align:center;margin-bottom:1.25rem">
                <div class="avatar" style="width:64px;height:64px;font-size:1.5rem;margin:0 auto 0.75rem">${user.avatar}</div>
                <h2>My Account Profile</h2>
                <span class="badge ${user.role === 'Manager' ? 'badge-gold' : user.role === 'Staff' ? 'badge-purple' : 'badge-emerald'}">${user.title}</span>
            </div>

            <form id="form-edit-user-profile">
                <div class="form-group">
                    <label class="form-label">Full Name / Profile Display Name</label>
                    <input type="text" id="edit-user-name" class="form-input" value="${user.username}" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Job Title / Designation</label>
                    <input type="text" id="edit-user-title" class="form-input" value="${user.title}" required>
                </div>

                <div class="form-group" style="background:var(--bg-surface-elevated);padding:0.9rem;border-radius:var(--radius-md);margin-bottom:1.25rem">
                    <label class="form-label">Select Dashboard Theme Palette:</label>
                    <select id="modal-theme-select" class="form-select" style="margin-top:0.4rem">
                        <option value="dark" ${this.theme === 'dark' ? 'selected' : ''}>🌙 Obsidian Gold (Dark)</option>
                        <option value="light" ${this.theme === 'light' ? 'selected' : ''}>☀️ Royal Ivory (Light)</option>
                        <option value="ocean" ${this.theme === 'ocean' ? 'selected' : ''}>🌊 Monaco Ocean (Sapphire)</option>
                    </select>
                </div>

                <div class="form-group" style="background:var(--bg-surface-elevated);padding:0.9rem;border-radius:var(--radius-md);margin-bottom:1.25rem">
                    <label class="form-label">Switch Active Profile Role Tier:</label>
                    <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:0.5rem;margin-top:0.4rem">
                        <button type="button" class="btn btn-secondary btn-sm ${user.role === 'Manager' ? 'btn-gold' : ''}" id="profile-switch-manager">👑 Manager</button>
                        <button type="button" class="btn btn-secondary btn-sm ${user.role === 'Staff' ? 'btn-gold' : ''}" id="profile-switch-staff">🧹 Staff</button>
                        <button type="button" class="btn btn-secondary btn-sm ${user.role === 'Customer' ? 'btn-gold' : ''}" id="profile-switch-customer">🏨 Guest</button>
                    </div>
                </div>

                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.5rem">
                    <button type="button" class="btn btn-rose btn-sm" id="btn-profile-signout">Sign Out</button>
                    <div style="display:flex;gap:0.5rem">
                        <button type="button" class="btn btn-secondary btn-sm" onclick="window.app.closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-gold btn-sm">Save Profile Changes</button>
                    </div>
                </div>
            </form>
        `;

        this.openModal(html);

        // Theme select listener inside modal
        const modalThemeSelect = document.getElementById('modal-theme-select');
        if (modalThemeSelect) {
            modalThemeSelect.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
                const topbarSelect = document.getElementById('theme-select');
                if (topbarSelect) topbarSelect.value = e.target.value;
            });
        }

        // Save profile
        document.getElementById('form-edit-user-profile').addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = document.getElementById('edit-user-name').value.trim();
            const newTitle = document.getElementById('edit-user-title').value.trim();
            window.store.updateUserProfile(newName, newTitle);
            this.closeModal();
            this.showToast(`✨ Profile updated! Name set to "${newName}"`, "success");
        });

        // Switch role buttons
        document.getElementById('profile-switch-manager').addEventListener('click', () => {
            const name = document.getElementById('edit-user-name').value.trim();
            window.store.login("Manager", name);
            this.closeModal();
            this.showToast("👑 Switched to Executive Manager Profile", "success");
        });

        document.getElementById('profile-switch-staff').addEventListener('click', () => {
            const name = document.getElementById('edit-user-name').value.trim();
            window.store.login("Staff", name);
            this.closeModal();
            this.showToast("🧹 Switched to Operations Staff Profile", "info");
        });

        document.getElementById('profile-switch-customer').addEventListener('click', () => {
            const name = document.getElementById('edit-user-name').value.trim();
            window.store.login("Customer", name);
            this.closeModal();
            this.showToast("🏨 Switched to Customer / Guest Profile", "success");
        });

        // Sign Out inside modal
        document.getElementById('btn-profile-signout').addEventListener('click', () => {
            this.closeModal();
            window.store.logout();
        });
    }

    switchTab(tabId) {
        // Enforce RBAC access check
        if (!window.store.hasAccess(tabId)) {
            this.showToast("🔒 Profile Restriction: Permission required for this module.", "error");
            return;
        }

        this.currentTab = tabId;
        
        // Update sidebar UI
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.dataset.tab === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update topbar title
        const titles = {
            'overview': 'Executive BI Overview',
            'predictive': 'Predictive BI & Dynamic Pricing Engine',
            'rooms': 'Room Occupancy Matrix',
            'floors': 'Floor Plans & Level Architecture',
            'bookings': 'Bookings & Schedule Timeline',
            'housekeeping': 'Housekeeping Operations Dispatch',
            'maintenance': 'Facility Maintenance & IoT Sensors',
            'guest-services': 'Guest Concierge & CSAT Experience',
            'customer-portal': 'Customer & Guest Suite Portal'
        };
        document.getElementById('current-view-title').textContent = titles[tabId] || 'Dashboard';

        // Toggle pane visibility
        document.querySelectorAll('.tab-pane').forEach(pane => {
            if (pane.id === `tab-${tabId}`) {
                pane.classList.remove('hidden');
                pane.classList.add('active');
                this.renderComponent(tabId, pane);
            } else {
                pane.classList.add('hidden');
                pane.classList.remove('active');
            }
        });
    }

    renderCurrentTab() {
        const pane = document.getElementById(`tab-${this.currentTab}`);
        if (pane) {
            this.renderComponent(this.currentTab, pane);
        }
    }

    renderComponent(tabId, container) {
        switch (tabId) {
            case 'overview':
                window.overviewComponent.render(container);
                break;
            case 'predictive':
                window.predictiveComponent.render(container);
                break;
            case 'rooms':
                window.roomsComponent.render(container);
                break;
            case 'floors':
                window.floorsComponent.render(container);
                break;
            case 'bookings':
                window.bookingsComponent.render(container);
                break;
            case 'housekeeping':
                window.housekeepingComponent.render(container);
                break;
            case 'maintenance':
                window.maintenanceComponent.render(container);
                break;
            case 'guest-services':
                window.guestServicesComponent.render(container);
                break;
            case 'customer-portal':
                window.customerComponent.render(container);
                break;
        }
    }

    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                if (tab) this.switchTab(tab);
            });
        });

        document.getElementById('btn-quick-booking').addEventListener('click', () => {
            this.openCreateBookingModal();
        });
    }

    setupLiveClock() {
        const clockEl = document.getElementById('live-clock');
        const updateTime = () => {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false }) + " UTC+5:30";
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    setupGlobalSearch() {
        const input = document.getElementById('global-search');
        if (input) {
            input.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                if (window.roomsComponent) {
                    window.roomsComponent.searchQuery = query;
                    if (this.currentTab === 'rooms') {
                        window.roomsComponent.render(document.getElementById('tab-rooms'));
                    }
                }
            });
        }
    }

    setupNotifications() {
        const btn = document.getElementById('notifications-btn');
        const dropdown = document.getElementById('notification-dropdown');
        const list = document.getElementById('notification-list');

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            dropdown.classList.add('hidden');
        });

        dropdown.addEventListener('click', (e) => e.stopPropagation());

        // Render initial notifications
        const state = window.store.getState();
        list.innerHTML = state.notifications.map(n => `
            <div class="notification-item">
                <div class="notification-icon" style="background:${n.type === 'ai' ? 'rgba(168,85,247,0.2)' : 'rgba(244,63,94,0.2)'}">
                    ${n.type === 'ai' ? '🔮' : '⚠️'}
                </div>
                <div>
                    <div class="notif-title">${n.title}</div>
                    <div class="notif-desc">${n.desc}</div>
                    <div class="notif-time">${n.time}</div>
                </div>
            </div>
        `).join('');
    }

    updateSidebarBadges() {
        const state = window.store.getState();
        const m = state.metrics;
        
        document.getElementById('badge-occupancy').textContent = `${m.occupancyRate}%`;
        document.getElementById('badge-housekeeping').textContent = `${m.dirtyCount} Dirty`;
        document.getElementById('badge-maintenance').textContent = `${m.outOfOrderCount} Active`;
        document.getElementById('badge-concierge').textContent = `${state.conciergeRequests.filter(r => r.status !== 'Fulfilled').length} Pending`;
    }

    setupModals() {
        const backdrop = document.getElementById('modal-backdrop');
        const closeBtn = document.getElementById('modal-close-btn');

        closeBtn.addEventListener('click', () => {
            backdrop.classList.add('hidden');
        });

        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) backdrop.classList.add('hidden');
        });
    }

    openModal(htmlContent) {
        const backdrop = document.getElementById('modal-backdrop');
        const content = document.getElementById('modal-content');
        content.innerHTML = htmlContent;
        backdrop.classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('modal-backdrop').classList.add('hidden');
    }

    // Modal 1: Express Check-In Modal
    openCheckInModal(roomId) {
        const room = window.store.getState().rooms.find(r => r.id === roomId);
        const html = `
            <h2 style="margin-bottom:0.25rem">Express Check-In &amp; Key Issuance</h2>
            <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1.25rem">Suite ${roomId} (${room ? room.type : 'Deluxe'})</p>

            <form id="form-checkin">
                <div class="form-group">
                    <label class="form-label">Guest Full Name</label>
                    <input type="text" id="checkin-guest-name" class="form-input" placeholder="e.g. Lady Genevieve Vance" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">VIP Tier</label>
                        <select id="checkin-vip" class="form-select">
                            <option value="Standard">Standard Guest</option>
                            <option value="Silver">Silver Member</option>
                            <option value="Gold">Gold Elite</option>
                            <option value="VIP Platinum" selected>VIP Platinum</option>
                            <option value="VIP Diamond">VIP Diamond</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Check-Out Date</label>
                        <input type="date" id="checkin-date" class="form-input" value="2026-08-12">
                    </div>
                </div>

                <div style="background:var(--bg-surface-elevated);padding:0.85rem;border-radius:var(--radius-md);margin-bottom:1.25rem;font-size:0.8rem;border:1px solid var(--border-subtle)">
                    <div style="font-weight:600;color:var(--gold-primary);margin-bottom:0.2rem">🔑 Digital Key Card Status</div>
                    <div>AES-256 Encrypted RFID Token ready for mobile wallet transfer.</div>
                </div>

                <div style="display:flex;justify-content:flex-end;gap:0.75rem">
                    <button type="button" class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-gold">Confirm Express Check-In</button>
                </div>
            </form>
        `;

        this.openModal(html);

        document.getElementById('form-checkin').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('checkin-guest-name').value;
            const vip = document.getElementById('checkin-vip').value;
            const date = document.getElementById('checkin-date').value;

            window.store.checkInGuest(roomId, name, vip, date);
            this.closeModal();
            this.showToast(`✨ Express Check-In complete for ${name} (Suite ${roomId})!`, "success");
            this.renderCurrentTab();
        });
    }

    // Modal 2: Create Reservation Modal
    openCreateBookingModal() {
        const rooms = window.store.getState().rooms.filter(r => r.status === "Clean" || r.status === "Clean");
        const html = `
            <h2 style="margin-bottom:0.25rem">Create New Reservation</h2>
            <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1.25rem">Integrated PMS Reservation System</p>

            <form id="form-create-booking">
                <div class="form-group">
                    <label class="form-label">Guest Full Name</label>
                    <input type="text" id="bk-guest-name" class="form-input" placeholder="e.g. Admiral Arthur Pendelton" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Assign Suite</label>
                        <select id="bk-room-select" class="form-select">
                            ${rooms.map(r => `<option value="${r.id}">Suite ${r.id} - ${r.type} ($${r.rate}/nt)</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">VIP Category</label>
                        <select id="bk-vip" class="form-select">
                            <option value="Standard">Standard</option>
                            <option value="Gold">Gold Elite</option>
                            <option value="VIP Platinum">VIP Platinum</option>
                            <option value="VIP Diamond">VIP Diamond</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Check-In Date</label>
                        <input type="date" id="bk-checkin" class="form-input" value="2026-08-08">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Check-Out Date</label>
                        <input type="date" id="bk-checkout" class="form-input" value="2026-08-12">
                    </div>
                </div>

                <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1.25rem">
                    <button type="button" class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-gold">Confirm Booking</button>
                </div>
            </form>
        `;

        this.openModal(html);

        document.getElementById('form-create-booking').addEventListener('submit', (e) => {
            e.preventDefault();
            const guestName = document.getElementById('bk-guest-name').value;
            const roomNumber = document.getElementById('bk-room-select').value;
            const vipTier = document.getElementById('bk-vip').value;
            const checkIn = document.getElementById('bk-checkin').value;
            const checkOut = document.getElementById('bk-checkout').value;

            window.store.createReservation({
                guestName, roomNumber, checkIn, checkOut, vipTier, totalAmount: 1850
            });

            this.closeModal();
            this.showToast(`📅 Reservation confirmed for ${guestName}!`, "success");
            this.renderCurrentTab();
        });
    }

    // Modal 3: Create Ticket Modal
    openCreateTicketModal() {
        const rooms = window.store.getState().rooms;
        const html = `
            <h2 style="margin-bottom:0.25rem">Dispatch Maintenance Ticket</h2>
            <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1.25rem">Facility &amp; IoT Ticket Management</p>

            <form id="form-create-ticket">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Select Room / Suite</label>
                        <select id="tk-room" class="form-select">
                            ${rooms.map(r => `<option value="${r.id}">Suite ${r.id} (${r.type})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Priority SLA</label>
                        <select id="tk-priority" class="form-select">
                            <option value="Normal">Normal (SLA 4h)</option>
                            <option value="High">High (SLA 2h)</option>
                            <option value="Emergency" selected>Emergency (SLA 45m)</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Issue Description</label>
                    <input type="text" id="tk-issue" class="form-input" placeholder="e.g. HVAC thermostat thermal drift anomaly" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Assign Technician</label>
                    <select id="tk-tech" class="form-select">
                        <option value="Dave Miller">Dave Miller (HVAC Specialist)</option>
                        <option value="Samantha Reed">Samantha Reed (Plumbing Lead)</option>
                        <option value="Alexandre Moreau">Alexandre Moreau (IoT & Network)</option>
                    </select>
                </div>

                <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1.25rem">
                    <button type="button" class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-rose">Dispatch Ticket</button>
                </div>
            </form>
        `;

        this.openModal(html);

        document.getElementById('form-create-ticket').addEventListener('submit', (e) => {
            e.preventDefault();
            const room = document.getElementById('tk-room').value;
            const priority = document.getElementById('tk-priority').value;
            const issue = document.getElementById('tk-issue').value;
            const tech = document.getElementById('tk-tech').value;

            window.store.createMaintenanceTicket(room, issue, priority, tech);
            this.closeModal();
            this.showToast(`🔧 Maintenance ticket dispatched for Suite ${room}!`, "info");
            this.renderCurrentTab();
        });
    }

    // Modal 4: Room Control & IoT Modal
    openRoomDetailModal(roomId) {
        const room = window.store.getState().rooms.find(r => r.id === roomId);
        if (!room) return;

        const html = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
                <div>
                    <h2>Suite ${room.id} Control Hub</h2>
                    <span class="badge badge-purple">${room.type} - Floor ${room.floor}</span>
                </div>
                <span class="status-tag tag-${room.status.toLowerCase().replace(/\s+/g, '-')}">${room.status}</span>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem">
                <div style="background:var(--bg-surface-elevated);padding:1rem;border-radius:var(--radius-md)">
                    <div style="font-weight:600;margin-bottom:0.4rem">Guest Details</div>
                    <div style="font-size:0.88rem;color:var(--gold-primary);font-weight:700">${room.guest || 'Vacant'}</div>
                    <div style="font-size:0.78rem;color:var(--text-muted)">VIP Tier: ${room.vip || 'None'}</div>
                    <div style="font-size:0.78rem;color:var(--text-muted)">Daily Rate: $${room.rate}</div>
                </div>

                <div style="background:var(--bg-surface-elevated);padding:1rem;border-radius:var(--radius-md)">
                    <div style="font-weight:600;margin-bottom:0.4rem">IoT Mesh Hardware</div>
                    <div style="font-size:0.8rem">Lock Battery: <strong>${room.lockBattery}%</strong></div>
                    <div style="font-size:0.8rem">Humidity: <strong>${room.humidity}%</strong></div>
                    <div style="font-size:0.8rem">Thermostat Temp: <strong id="thermo-val">${room.temp}°C</strong></div>
                </div>
            </div>

            <div class="form-group" style="background:var(--bg-surface-elevated);padding:1rem;border-radius:var(--radius-md);margin-bottom:1.25rem">
                <label class="form-label" style="display:flex;justify-content:space-between">
                    <span>Remote HVAC Thermostat Override</span>
                    <span style="color:var(--gold-primary);font-weight:700" id="slider-temp-display">${room.temp}°C</span>
                </label>
                <input type="range" min="18" max="28" step="0.5" value="${room.temp}" class="custom-slider" id="thermostat-slider">
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center">
                <button class="btn btn-secondary" id="btn-toggle-lock">
                    🔒 RFID Lock: ${room.lockBattery > 0 ? 'LOCKED' : 'UNLOCKED'}
                </button>
                <button class="btn btn-gold" onclick="window.app.closeModal()">Close Control Panel</button>
            </div>
        `;

        this.openModal(html);

        const slider = document.getElementById('thermostat-slider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value).toFixed(1);
                room.temp = parseFloat(val);
                document.getElementById('thermo-val').textContent = `${val}°C`;
                document.getElementById('slider-temp-display').textContent = `${val}°C`;
            });
        }

        const lockBtn = document.getElementById('btn-toggle-lock');
        if (lockBtn) {
            lockBtn.addEventListener('click', () => {
                this.showToast(`🔓 Door Lock toggled remotely for Suite ${roomId}`, "info");
            });
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <div>${message}</div>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    startRealtimeSimulation() {
        setInterval(() => {
            const state = window.store.getState();
            const room = state.rooms[Math.floor(Math.random() * state.rooms.length)];
            if (room) {
                room.temp = parseFloat((room.temp + (Math.random() * 0.4 - 0.2)).toFixed(1));
            }
        }, 45000);
    }
}

// Instantiate Global Controller
window.app = new AppController();
document.addEventListener('DOMContentLoaded', () => window.app.init());
