/* ==========================================================================
   GRAND ZENITH SMART HOTEL DASHBOARD - HOUSEKEEPING COMPONENT
   ========================================================================== */

class HousekeepingComponent {
    render(container) {
        const state = window.store.getState();
        const tasks = state.housekeepingTasks;

        const pendingTasks = tasks.filter(t => t.status === "Pending");
        const inProgressTasks = tasks.filter(t => t.status === "In Progress");
        const completedTasks = tasks.filter(t => t.status === "Completed");

        container.innerHTML = `
            <!-- Top Controls & Auto Dispatch -->
            <div class="glass-card" style="padding:1rem 1.25rem">
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
                    <div>
                        <h3 class="card-title">Housekeeping Operations &amp; Inspection Board</h3>
                        <span class="card-subtitle">Real-time room turnaround tracking &amp; AI priority dispatch</span>
                    </div>
                    <div style="display:flex;gap:0.75rem">
                        <button class="btn btn-gold btn-sm" id="btn-auto-dispatch-hk">⚡ Auto-Assign AI Priority Queue</button>
                        <button class="btn btn-secondary btn-sm" id="btn-add-hk-task">+ Dispatch Manual Request</button>
                    </div>
                </div>
            </div>

            <!-- Kanban Board Grid -->
            <div class="kanban-board">
                <!-- Column 1: Pending / Unassigned -->
                <div class="kanban-col">
                    <div class="kanban-header">
                        <span class="kanban-title">
                            <span style="color:var(--rose-primary)">🔴 Pending Turnaround</span>
                        </span>
                        <span class="badge badge-rose">${pendingTasks.length}</span>
                    </div>

                    ${pendingTasks.map(task => `
                        <div class="kanban-card">
                            <div style="display:flex;justify-content:space-between;align-items:center">
                                <span style="font-family:'Outfit',sans-serif;font-weight:800;font-size:1.1rem">Suite ${task.roomNumber}</span>
                                <span class="badge badge-gold" style="font-size:0.68rem">${task.priority}</span>
                            </div>
                            <div style="font-size:0.8rem;color:var(--text-secondary)">Assigned: <strong>${task.housekeeper}</strong></div>
                            <div style="font-size:0.75rem;color:var(--text-muted)">Est. Duration: ${task.estimatedMins} mins</div>
                            <div style="margin-top:0.4rem;display:flex;gap:0.4rem">
                                <button class="btn btn-emerald btn-sm btn-start-hk" data-task-id="${task.id}" style="width:100%">Start Cleaning</button>
                            </div>
                        </div>
                    `).join('')}
                    ${pendingTasks.length === 0 ? `<div style="text-align:center;padding:2rem;color:var(--text-muted);font-size:0.85rem">No pending dirty rooms</div>` : ''}
                </div>

                <!-- Column 2: In Progress -->
                <div class="kanban-col">
                    <div class="kanban-header">
                        <span class="kanban-title">
                            <span style="color:var(--gold-primary)">🟡 Cleaning in Progress</span>
                        </span>
                        <span class="badge badge-gold">${inProgressTasks.length}</span>
                    </div>

                    ${inProgressTasks.map(task => `
                        <div class="kanban-card" style="border-left:4px solid var(--gold-primary)">
                            <div style="display:flex;justify-content:space-between;align-items:center">
                                <span style="font-family:'Outfit',sans-serif;font-weight:800;font-size:1.1rem">Suite ${task.roomNumber}</span>
                                <span class="badge badge-purple" style="font-size:0.68rem">${task.priority}</span>
                            </div>
                            <div style="font-size:0.8rem;color:var(--text-secondary)">Housekeeper: <strong>${task.housekeeper}</strong></div>
                            <div style="font-size:0.75rem;color:var(--emerald-primary)">⏱ Timer active: ~12 mins elapsed</div>
                            <div style="margin-top:0.4rem;display:flex;gap:0.4rem">
                                <button class="btn btn-gold btn-sm btn-complete-hk" data-task-id="${task.id}" style="width:100%">Verify &amp; Pass Inspection</button>
                            </div>
                        </div>
                    `).join('')}
                    ${inProgressTasks.length === 0 ? `<div style="text-align:center;padding:2rem;color:var(--text-muted);font-size:0.85rem">No rooms currently being cleaned</div>` : ''}
                </div>

                <!-- Column 3: Completed & Inspected -->
                <div class="kanban-col">
                    <div class="kanban-header">
                        <span class="kanban-title">
                            <span style="color:var(--emerald-primary)">🟢 Clean &amp; Inspection Ready</span>
                        </span>
                        <span class="badge badge-emerald">${completedTasks.length}</span>
                    </div>

                    ${completedTasks.map(task => `
                        <div class="kanban-card" style="border-left:4px solid var(--emerald-primary)">
                            <div style="display:flex;justify-content:space-between;align-items:center">
                                <span style="font-family:'Outfit',sans-serif;font-weight:800;font-size:1.1rem">Suite ${task.roomNumber}</span>
                                <span class="badge badge-emerald">Score: ${task.score}%</span>
                            </div>
                            <div style="font-size:0.8rem;color:var(--text-secondary)">Completed by: <strong>${task.housekeeper}</strong></div>
                            <div style="font-size:0.75rem;color:var(--text-muted)">Quality Verified</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Housekeeper Efficiency & Inspection Scoreboard -->
            <div class="glass-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3 class="card-title">Housekeeping Performance &amp; Inspection Scores</h3>
                        <span class="card-subtitle">Staff workload efficiency &amp; quality audits</span>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Staff Member</th>
                                <th>Rooms Completed Today</th>
                                <th>Avg Turnaround Time</th>
                                <th>Audit Quality Score</th>
                                <th>Current Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="font-weight:600">Maria Santos</td>
                                <td>8 Rooms</td>
                                <td>22 mins / room</td>
                                <td style="color:var(--emerald-primary);font-weight:700">98% (Excellence)</td>
                                <td><span class="badge badge-emerald">On Floor 1</span></td>
                            </tr>
                            <tr>
                                <td style="font-weight:600">Jean-Luc Dubois</td>
                                <td>6 Rooms</td>
                                <td>26 mins / room</td>
                                <td style="color:var(--emerald-primary);font-weight:700">96%</td>
                                <td><span class="badge badge-gold">Cleaning Suite 203</span></td>
                            </tr>
                            <tr>
                                <td style="font-weight:600">Amina Yusuf</td>
                                <td>7 Rooms</td>
                                <td>21 mins / room</td>
                                <td style="color:var(--emerald-primary);font-weight:700">99% (Top Performer)</td>
                                <td><span class="badge badge-purple">Inspection Audit</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Handlers
        const autoDispatchBtn = container.querySelector('#btn-auto-dispatch-hk');
        if (autoDispatchBtn) {
            autoDispatchBtn.addEventListener('click', () => {
                tasks.forEach(t => {
                    if (t.housekeeper === "Unassigned") {
                        t.housekeeper = "Maria Santos";
                    }
                });
                window.app.showToast("⚡ AI Dispatcher assigned optimal housekeepers based on VIP arrival ETA!", "success");
                window.app.renderCurrentTab();
            });
        }

        container.querySelectorAll('.btn-start-hk').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.dataset.taskId;
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    task.status = "In Progress";
                    if (task.housekeeper === "Unassigned") task.housekeeper = "Jean-Luc Dubois";
                    window.app.showToast(`🧹 Cleaning started on Suite ${task.roomNumber}!`, "info");
                    window.app.renderCurrentTab();
                }
            });
        });

        container.querySelectorAll('.btn-complete-hk').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.dataset.taskId;
                window.store.completeHousekeepingTask(taskId, 98);
                window.app.showToast(`✨ Suite inspection verified! Room marked clean.`, "success");
                window.app.renderCurrentTab();
            });
        });
    }
}

window.housekeepingComponent = new HousekeepingComponent();
