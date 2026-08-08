/* ==========================================================================
   GRAND ZENITH SMART HOTEL DASHBOARD - CENTRAL REACTIVE STORE
   ========================================================================== */

class HotelStore {
    constructor() {
        this.listeners = [];
        
        // Supported Global Currencies & Live Exchange Rates
        this.currencies = {
            USD: { symbol: '$', rate: 1.0, name: 'USD ($)', code: 'USD' },
            EUR: { symbol: '€', rate: 0.92, name: 'EUR (€)', code: 'EUR' },
            GBP: { symbol: '£', rate: 0.78, name: 'GBP (£)', code: 'GBP' },
            INR: { symbol: '₹', rate: 83.5, name: 'INR (₹)', code: 'INR' },
            JPY: { symbol: '¥', rate: 155.0, name: 'JPY (¥)', code: 'JPY' },
            CAD: { symbol: 'CA$', rate: 1.36, name: 'CAD (CA$)', code: 'CAD' },
            AUD: { symbol: 'AU$', rate: 1.51, name: 'AUD (AU$)', code: 'AUD' },
            CHF: { symbol: 'CHF ', rate: 0.90, name: 'CHF (CHF)', code: 'CHF' },
            AED: { symbol: 'AED ', rate: 3.67, name: 'AED (AED)', code: 'AED' },
            SGD: { symbol: 'S$', rate: 1.35, name: 'SGD (S$)', code: 'SGD' }
        };

        // Initial Dataset
        this.state = {
            currentUser: null,
            selectedCurrency: 'USD',

            hotelInfo: {
                name: "Grand Zenith Royal Resort & Spa",
                location: "French Riviera",
                totalRooms: 120,
                targetOccupancy: 85
            },
            
            metrics: {
                occupancyRate: 87.5,
                adr: 345, // Base Average Daily Rate ($)
                revpar: 301.88, // Base Revenue Per Available Room ($)
                totalRevenueToday: 36225, // Base Daily Revenue ($)
                csatScore: 4.88,
                outOfOrderCount: 2,
                cleanCount: 13,
                dirtyCount: 4,
                occupiedCount: 101
            },

            // Floor & Room Inventory
            rooms: [
                { id: "101", floor: 1, type: "Deluxe King", status: "Occupied", clean: "Clean", guest: "Lord Jonathan Sterling", vip: "VIP Platinum", checkIn: "2026-08-06", checkOut: "2026-08-10", temp: 21.5, humidity: 45, lockBattery: 92, rate: 320 },
                { id: "102", floor: 1, type: "Superior Twin", status: "Clean", clean: "Clean", guest: null, vip: null, checkIn: null, checkOut: null, temp: 22.0, humidity: 42, lockBattery: 88, rate: 260 },
                { id: "103", floor: 1, type: "Deluxe King", status: "Dirty", clean: "Dirty", guest: "Needs Turnaround", vip: "Standard", checkIn: "2026-08-08", checkOut: "2026-08-09", temp: 23.0, humidity: 50, lockBattery: 78, rate: 320 },
                { id: "104", floor: 1, type: "Executive Suite", status: "Occupied", clean: "Clean", guest: "Dr. Elena Rostova", vip: "Gold", checkIn: "2026-08-07", checkOut: "2026-08-12", temp: 21.0, humidity: 44, lockBattery: 95, rate: 480 },
                { id: "201", floor: 2, type: "Deluxe King", status: "Occupied", clean: "Clean", guest: "Marcus Brody", vip: "Silver", checkIn: "2026-08-05", checkOut: "2026-08-09", temp: 20.5, humidity: 46, lockBattery: 64, rate: 340 },
                { id: "202", floor: 2, type: "Executive Suite", status: "Occupied", clean: "Clean", guest: "Sophia Chen", vip: "VIP Platinum", checkIn: "2026-08-08", checkOut: "2026-08-15", temp: 22.0, humidity: 48, lockBattery: 90, rate: 520 },
                { id: "203", floor: 2, type: "Deluxe King", status: "Dirty", clean: "Dirty", guest: "Due Arrival 15:00", vip: "Gold", checkIn: null, checkOut: null, temp: 24.0, humidity: 52, lockBattery: 82, rate: 340 },
                { id: "204", floor: 2, type: "Maintenance", clean: "Dirty", guest: "HVAC Sensor Fault", vip: null, checkIn: null, checkOut: null, temp: 26.5, humidity: 62, lockBattery: 15, rate: 340 },
                { id: "301", floor: 3, type: "Executive Suite", status: "Occupied", clean: "Clean", guest: "Capt. Henrik Lindqvist", vip: "VIP Platinum", checkIn: "2026-08-04", checkOut: "2026-08-11", temp: 21.0, humidity: 45, lockBattery: 89, rate: 550 },
                { id: "302", floor: 3, type: "Superior Twin", status: "Clean", clean: "Clean", guest: null, vip: null, checkIn: null, checkOut: null, temp: 22.0, humidity: 40, lockBattery: 96, rate: 290 },
                { id: "303", floor: 3, type: "Deluxe King", status: "Occupied", clean: "Clean", guest: "Isabella Martinez", vip: "Gold", checkIn: "2026-08-07", checkOut: "2026-08-10", temp: 21.8, humidity: 43, lockBattery: 72, rate: 360 },
                { id: "304", floor: 3, type: "Executive Suite", status: "Reserved", clean: "Clean", guest: "Ambassador K. Al-Mansoor", vip: "VIP Diamond", checkIn: "2026-08-08", checkOut: "2026-08-14", temp: 20.0, humidity: 45, lockBattery: 99, rate: 600 },
                { id: "401", floor: 4, type: "Ocean Penthouse", status: "Occupied", clean: "Clean", guest: "Sir Richard Thorne", vip: "VIP Diamond", checkIn: "2026-08-01", checkOut: "2026-08-15", temp: 20.0, humidity: 42, lockBattery: 94, rate: 1250 },
                { id: "402", floor: 4, type: "Ocean Penthouse", status: "Occupied", clean: "Clean", guest: "Victoria & David Beckham", vip: "VIP Diamond", checkIn: "2026-08-05", checkOut: "2026-08-12", temp: 21.0, humidity: 44, lockBattery: 91, rate: 1350 },
                { id: "403", floor: 4, type: "Executive Suite", status: "Dirty", clean: "Dirty", guest: "Checkout Completed", vip: "Gold", checkIn: null, checkOut: null, temp: 23.5, humidity: 55, lockBattery: 85, rate: 580 },
                { id: "404", floor: 4, type: "Deluxe King", status: "Clean", clean: "Clean", guest: null, vip: null, checkIn: null, checkOut: null, temp: 22.0, humidity: 41, lockBattery: 90, rate: 380 },
                { id: "501", floor: 5, type: "Presidential Royal Villa", status: "Occupied", clean: "Clean", guest: "Princess Beatrice of York", vip: "Royal VIP", checkIn: "2026-08-03", checkOut: "2026-08-17", temp: 19.5, humidity: 40, lockBattery: 98, rate: 2500 },
                { id: "502", floor: 5, type: "Presidential Royal Villa", status: "Maintenance", clean: "Clean", guest: "Smart Water Valve Calibration", vip: null, checkIn: null, checkOut: null, temp: 22.5, humidity: 50, lockBattery: 45, rate: 2500 }
            ],

            // Active Bookings
            bookings: [
                { id: "BK-9021", guestName: "Lord Jonathan Sterling", roomNumber: "101", checkIn: "2026-08-06", checkOut: "2026-08-10", status: "Checked In", totalAmount: 1280, channel: "Direct VIP Web", vipTier: "VIP Platinum" },
                { id: "BK-9022", guestName: "Dr. Elena Rostova", roomNumber: "104", checkIn: "2026-08-07", checkOut: "2026-08-12", status: "Checked In", totalAmount: 2400, channel: "Booking.com", vipTier: "Gold" },
                { id: "BK-9023", guestName: "Marcus Brody", roomNumber: "201", checkIn: "2026-08-05", checkOut: "2026-08-09", status: "Checked In", totalAmount: 1360, channel: "Expedia", vipTier: "Silver" },
                { id: "BK-9024", guestName: "Sophia Chen", roomNumber: "202", checkIn: "2026-08-08", checkOut: "2026-08-15", status: "Checked In", totalAmount: 3640, channel: "Direct VIP Web", vipTier: "VIP Platinum" },
                { id: "BK-9025", guestName: "Ambassador K. Al-Mansoor", roomNumber: "304", checkIn: "2026-08-08", checkOut: "2026-08-14", status: "Due Arrival", totalAmount: 3600, channel: "Amex Fine Hotels", vipTier: "VIP Diamond" },
                { id: "BK-9026", guestName: "Sir Richard Thorne", roomNumber: "401", checkIn: "2026-08-01", checkOut: "2026-08-15", status: "Checked In", totalAmount: 17500, channel: "Direct VIP Call", vipTier: "VIP Diamond" },
                { id: "BK-9027", guestName: "Princess Beatrice of York", roomNumber: "501", checkIn: "2026-08-03", checkOut: "2026-08-17", status: "Checked In", totalAmount: 35000, channel: "Diplomatic Concierge", vipTier: "Royal VIP" }
            ],

            // Housekeeping Tasks
            housekeepingTasks: [
                { id: "HK-101", roomNumber: "103", housekeeper: "Maria Santos", priority: "High (Arrival Soon)", status: "In Progress", estimatedMins: 25, score: null },
                { id: "HK-102", roomNumber: "203", housekeeper: "Jean-Luc Dubois", priority: "High (VIP Arrival)", status: "Pending", estimatedMins: 30, score: null },
                { id: "HK-103", roomNumber: "403", housekeeper: "Unassigned", priority: "Normal", status: "Pending", estimatedMins: 35, score: null },
                { id: "HK-104", roomNumber: "204", housekeeper: "Amina Yusuf", priority: "Post-Maintenance", status: "Pending", estimatedMins: 20, score: null },
                { id: "HK-100", roomNumber: "101", housekeeper: "Maria Santos", priority: "Routine", status: "Completed", estimatedMins: 20, score: 98 }
            ],

            // Maintenance Tickets & IoT Sensoring
            maintenanceTickets: [
                { id: "MT-402", roomNumber: "204", issue: "HVAC Compressor Pressure Anomaly", priority: "Emergency", status: "In Repair", technician: "Dave Miller", slaRemainingMins: 45, iotMetric: "Vibration: 4.8g (High)" },
                { id: "MT-403", roomNumber: "502", issue: "Smart Water Flow Meter Calibration", priority: "Normal", status: "Assigned", technician: "Samantha Reed", slaRemainingMins: 180, iotMetric: "Flow: +12% Drift" },
                { id: "MT-401", roomNumber: "102", issue: "Smart Lock Battery Replacement", priority: "Low", status: "Resolved", technician: "Dave Miller", slaRemainingMins: 0, iotMetric: "Battery: Restored 100%" }
            ],

            // Guest Concierge & CSAT Feed
            conciergeRequests: [
                { id: "CR-701", roomNumber: "401", guestName: "Sir Richard Thorne", request: "Organic Lavender Bath Oil & Dom Pérignon 2012 to suite", status: "Pending", time: "10 mins ago", category: "VIP Amenity" },
                { id: "CR-702", roomNumber: "501", guestName: "Princess Beatrice", request: "Private Helicopter Airport Transfer for tomorrow 10:00 AM", status: "In Progress", time: "25 mins ago", category: "Transport" },
                { id: "CR-703", roomNumber: "202", guestName: "Sophia Chen", request: "Extra Feather Pillows & Air Purifier set to 20°C", status: "Pending", time: "40 mins ago", category: "Housekeeping" }
            ],

            // CSAT Feedback Streams
            guestFeedback: [
                { guest: "Lord Jonathan Sterling", room: "101", rating: 5, sentiment: "Positive", text: "The automated ambient lighting and thermal controls in Suite 101 are magnificent. Exceptional service!", time: "Today 10:15 AM" },
                { guest: "Dr. Elena Rostova", room: "104", rating: 5, sentiment: "Positive", text: "Check-in was seamless. The predictive spa booking recommendation was spot on.", time: "Today 09:30 AM" },
                { guest: "Marcus Brody", room: "201", rating: 4, sentiment: "Neutral", text: "Lovely ocean view. Wi-Fi speed was slightly slow during peak evening hours.", time: "Yesterday 08:45 PM" }
            ],

            // Live Operational Notifications & AI Alerts
            notifications: [
                { id: 1, title: "Dynamic Price Alert", desc: "Local Monaco Yacht Race lead pace surge (+24%). Recommended ADR bump to $385 for Executive Suites.", type: "ai", time: "5m ago" },
                { id: 2, title: "HVAC Sensor Anomaly", desc: "Room 204 HVAC unit drawing 28% excess wattage. Emergency dispatch initiated.", type: "warning", time: "12m ago" },
                { id: 3, title: "VIP Express Check-In", desc: "Ambassador Al-Mansoor (Room 304) is 15 mins away. Digital key generated.", type: "success", time: "22m ago" }
            ]
        };
    }

    // Currency Conversion Engine
    getCurrency() {
        return this.currencies[this.state.selectedCurrency] || this.currencies.USD;
    }

    setCurrency(currencyCode) {
        if (this.currencies[currencyCode]) {
            this.state.selectedCurrency = currencyCode;
            this.notify("CURRENCY_CHANGED", this.getCurrency());
        }
    }

    formatCurrency(usdAmount) {
        if (usdAmount === null || usdAmount === undefined || isNaN(usdAmount)) return "$0";
        const c = this.getCurrency();
        const converted = Math.round(usdAmount * c.rate);
        return `${c.symbol}${converted.toLocaleString()}`;
    }

    // Helper: Compute Initials Avatar
    getInitials(name) {
        if (!name) return "US";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    // Subscribe to state changes
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify(event, data) {
        this.listeners.forEach(listener => listener(event, data, this.state));
    }

    getState() {
        return this.state;
    }

    // Authentication & RBAC (All profiles granted access to operational views)
    login(role, customName) {
        const initials = this.getInitials(customName);

        if (role === "Manager") {
            this.state.currentUser = {
                username: customName || "Alexandra Vance",
                role: "Manager",
                title: "General Manager",
                avatar: initials || "GM"
            };
        } else if (role === "Staff") {
            this.state.currentUser = {
                username: customName || "Jean-Luc Dubois",
                role: "Staff",
                title: "Operations Staff",
                avatar: initials || "ST"
            };
        } else if (role === "Customer") {
            this.state.currentUser = {
                username: customName || "Lord Jonathan Sterling",
                role: "Customer",
                roomNumber: "101",
                title: `VIP Guest (Suite 101)`,
                avatar: initials || "JS"
            };

            const room101 = this.state.rooms.find(r => r.id === "101");
            if (room101 && customName) {
                room101.guest = customName;
            }
        }
        this.notify("AUTH_LOGIN", this.state.currentUser);
    }

    updateUserProfile(newName, newTitle) {
        if (this.state.currentUser) {
            if (newName) {
                this.state.currentUser.username = newName;
                this.state.currentUser.avatar = this.getInitials(newName);
            }
            if (newTitle) {
                this.state.currentUser.title = newTitle;
            }
            this.notify("PROFILE_UPDATED", this.state.currentUser);
        }
    }

    logout() {
        const prevUser = this.state.currentUser;
        this.state.currentUser = null;
        this.notify("AUTH_LOGOUT", prevUser);
    }

    hasAccess(tabId) {
        // All authenticated users can access all dashboard tabs
        return true;
    }

    // Actions & State Mutations
    checkInGuest(roomId, guestName, vipTier, checkOutDate) {
        const room = this.state.rooms.find(r => r.id === roomId);
        if (room) {
            room.status = "Occupied";
            room.clean = "Clean";
            room.guest = guestName;
            room.vip = vipTier || "Standard";
            room.checkIn = new Date().toISOString().split('T')[0];
            room.checkOut = checkOutDate || "2026-08-12";
            
            const newBooking = {
                id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
                guestName: guestName,
                roomNumber: roomId,
                checkIn: room.checkIn,
                checkOut: room.checkOut,
                status: "Checked In",
                totalAmount: room.rate * 3,
                channel: "Direct Express",
                vipTier: room.vip
            };
            this.state.bookings.unshift(newBooking);
            
            this.recalculateMetrics();
            this.notify("CHECK_IN", { room, booking: newBooking });
        }
    }

    checkOutGuest(roomId) {
        const room = this.state.rooms.find(r => r.id === roomId);
        if (room) {
            const previousGuest = room.guest;
            room.status = "Dirty";
            room.clean = "Dirty";
            room.guest = "Due Housekeeping";
            room.vip = null;
            room.checkIn = null;
            room.checkOut = null;

            const hkTask = {
                id: `HK-${Math.floor(100 + Math.random() * 900)}`,
                roomNumber: roomId,
                housekeeper: "Unassigned",
                priority: "High (Turnaround)",
                status: "Pending",
                estimatedMins: 30,
                score: null
            };
            this.state.housekeepingTasks.unshift(hkTask);

            this.recalculateMetrics();
            this.notify("CHECK_OUT", { room, previousGuest });
        }
    }

    updateRoomStatus(roomId, newStatus, cleanState) {
        const room = this.state.rooms.find(r => r.id === roomId);
        if (room) {
            if (newStatus) room.status = newStatus;
            if (cleanState) room.clean = cleanState;
            this.recalculateMetrics();
            this.notify("ROOM_STATUS_CHANGE", { room });
        }
    }

    completeHousekeepingTask(taskId, score = 95) {
        const task = this.state.housekeepingTasks.find(t => t.id === taskId);
        if (task) {
            task.status = "Completed";
            task.score = score;
            const room = this.state.rooms.find(r => r.id === task.roomNumber);
            if (room) {
                room.clean = "Clean";
                if (room.status === "Dirty") room.status = "Clean";
            }
            this.recalculateMetrics();
            this.notify("HOUSEKEEPING_COMPLETE", { task, room });
        }
    }

    createMaintenanceTicket(roomNumber, issue, priority, technician) {
        const ticket = {
            id: `MT-${Math.floor(100 + Math.random() * 900)}`,
            roomNumber,
            issue,
            priority,
            status: "In Repair",
            technician: technician || "Dave Miller",
            slaRemainingMins: priority === "Emergency" ? 45 : 120,
            iotMetric: "Manual Report"
        };
        this.state.maintenanceTickets.unshift(ticket);
        
        if (priority === "Emergency") {
            const room = this.state.rooms.find(r => r.id === roomNumber);
            if (room) room.status = "Maintenance";
        }
        
        this.recalculateMetrics();
        this.notify("MAINTENANCE_CREATED", { ticket });
    }

    resolveMaintenanceTicket(ticketId) {
        const ticket = this.state.maintenanceTickets.find(t => t.id === ticketId);
        if (ticket) {
            ticket.status = "Resolved";
            ticket.slaRemainingMins = 0;
            const room = this.state.rooms.find(r => r.id === ticket.roomNumber);
            if (room && room.status === "Maintenance") {
                room.status = "Clean";
                room.clean = "Clean";
            }
            this.recalculateMetrics();
            this.notify("MAINTENANCE_RESOLVED", { ticket });
        }
    }

    resolveConciergeRequest(reqId) {
        const req = this.state.conciergeRequests.find(r => r.id === reqId);
        if (req) {
            req.status = "Fulfilled";
            this.notify("CONCIERGE_RESOLVED", { req });
        }
    }

    createReservation(bookingData) {
        const newBooking = {
            id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
            guestName: bookingData.guestName,
            roomNumber: bookingData.roomNumber,
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            status: "Due Arrival",
            totalAmount: bookingData.totalAmount || 1500,
            channel: bookingData.channel || "Direct Web",
            vipTier: bookingData.vipTier || "Standard"
        };
        this.state.bookings.unshift(newBooking);
        
        const room = this.state.rooms.find(r => r.id === bookingData.roomNumber);
        if (room && room.status === "Clean") {
            room.status = "Reserved";
            room.guest = bookingData.guestName;
        }

        this.notify("RESERVATION_CREATED", { booking: newBooking });
    }

    recalculateMetrics() {
        const total = this.state.rooms.length;
        const occupied = this.state.rooms.filter(r => r.status === "Occupied").length;
        const clean = this.state.rooms.filter(r => r.clean === "Clean" && r.status !== "Occupied").length;
        const dirty = this.state.rooms.filter(r => r.clean === "Dirty").length;
        const maintenance = this.state.rooms.filter(r => r.status === "Maintenance").length;

        this.state.metrics.occupiedCount = occupied;
        this.state.metrics.cleanCount = clean;
        this.state.metrics.dirtyCount = dirty;
        this.state.metrics.outOfOrderCount = maintenance;
        this.state.metrics.occupancyRate = parseFloat(((occupied / total) * 100).toFixed(1));
        this.state.metrics.revpar = parseFloat((this.state.metrics.occupancyRate / 100 * this.state.metrics.adr).toFixed(2));
    }
}

// Global Store Instance
window.store = new HotelStore();
