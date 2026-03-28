// assets/js/kanban.js

const createTaskBtn = document.querySelector('.board-meta .btn-primary');
const todoColumn = document.querySelector('.kanban-column:nth-child(1) .column-body');
const inProgressColumn = document.querySelector('.kanban-column:nth-child(2) .column-body');
const doneColumn = document.querySelector('.kanban-column:nth-child(3) .column-body');
const columns = document.querySelectorAll('.column-body');

const taskModal = document.getElementById('task-modal');
const closeTaskModalBtn = document.getElementById('cancel-task-btn');
const saveTaskForm = document.getElementById('task-form');

let currentUser = null;

// Priority Weighting for Sorting
const priorityWeight = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };

async function initBoard() {
    const isGuest = localStorage.getItem('guestMode') === 'true';
    if(isGuest) {
        checkEmptyStates();
        return; 
    }

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return;
    currentUser = session.user;

    const { data: tasks, error } = await supabaseClient
        .from('tasks').select('*').order('created_at', { ascending: true });

    if (!error && tasks) {
        tasks.forEach(task => renderTaskCard(task));
    }
    
    updateColumnCounts();
    checkEmptyStates();
}

function handleCreateTask() {
    if(localStorage.getItem('guestMode') === 'true') {
        alert("Task creation is disabled in Demo Mode.");
        return;
    }
    taskModal.showModal();
}

if(createTaskBtn) createTaskBtn.addEventListener('click', handleCreateTask);
if(closeTaskModalBtn) closeTaskModalBtn.addEventListener('click', () => taskModal.close());

if(saveTaskForm) {
    saveTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const desc = document.getElementById('task-desc').value;
        const priority = document.getElementById('task-priority').value;

        const newTaskData = {
            user_id: currentUser.id, title: title, description: desc,
            status: 'TO DO', priority: priority, xp_value: 25
        };

        const { data, error } = await supabaseClient.from('tasks').insert([newTaskData]).select();

        if (!error && data) {
            renderTaskCard(data[0]);
            updateColumnCounts();
            checkEmptyStates();
            saveTaskForm.reset();
            taskModal.close();
        } else {
            alert("Failed to create task.");
        }
    });
}

function renderTaskCard(task) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.setAttribute('draggable', 'true');
    taskCard.id = task.id; 
    // Store priority for sorting
    taskCard.dataset.priority = task.priority; 

    const tagClass = task.priority === 'HIGH' ? 'tag-purple' : 'tag-blue';
    const isClaimed = task.status === 'CLAIMED';
    const isDone = task.status === 'DONE';

    taskCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <span class="task-tag ${tagClass}">${task.priority}</span>
            <button onclick="deleteTask('${task.id}')" aria-label="Delete Task" style="background:none; border:none; color: var(--danger-red); cursor: pointer; padding: 4px;">
                <i data-feather="trash-2" style="width: 14px; height: 14px;"></i>
            </button>
        </div>
        <h4>${task.title}</h4>
        <p>${task.description || 'No description provided.'}</p>
        <div class="task-footer" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f3f4f6; padding-top: 12px;">
            <span class="task-xp" style="font-size: 12px; font-weight: 700; color: var(--warning-orange);">+${task.xp_value} XP</span>
            
            ${isClaimed 
                ? `<span style="font-size: 11px; color: var(--success-green); font-weight: bold;"><i data-feather="check" style="width:12px;"></i> Claimed</span>` 
                : `<button class="claim-xp-btn btn btn-primary" style="display: ${isDone ? 'block' : 'none'}; padding: 4px 10px; font-size: 11px;" onclick="claimTaskXP('${task.id}', ${task.xp_value}, this)">Complete & Claim</button>`
            }
        </div>
    `;

    attachDragEvents(taskCard);

    let targetColumn = todoColumn;
    if (task.status === 'IN PROGRESS') targetColumn = inProgressColumn;
    if (task.status === 'DONE' || task.status === 'CLAIMED') targetColumn = doneColumn;

    const emptyState = targetColumn.querySelector('.column-empty');
    if (emptyState) emptyState.style.display = 'none';

    targetColumn.appendChild(taskCard);
    sortColumnByPriority(targetColumn); // Sort immediately after adding
    
    if(window.renderIcons) window.renderIcons();
}

// Automatically sorts a column based on High -> Medium -> Low priority
function sortColumnByPriority(column) {
    const cards = Array.from(column.querySelectorAll('.task-card'));
    cards.sort((a, b) => priorityWeight[b.dataset.priority] - priorityWeight[a.dataset.priority]);
    cards.forEach(card => column.appendChild(card)); // Re-appending moves it to the correct spot
}

// Global XP Claiming Function (Fixes the Points System)
window.claimTaskXP = async function(taskId, xpValue, btnElement) {
    btnElement.disabled = true;
    btnElement.textContent = 'Claiming...';
    
    // 1. Fetch exact current XP from database to prevent overwriting
    const { data: profile } = await supabaseClient.from('profiles').select('xp').eq('id', currentUser.id).single();
    const currentXp = profile ? profile.xp : 0;
    const newXp = currentXp + xpValue;
    
    // 2. Add points to profile
    await supabaseClient.from('profiles').update({ xp: newXp }).eq('id', currentUser.id);
    
    // 3. Mark task as CLAIMED in database so it can't be clicked twice
    await supabaseClient.from('tasks').update({ status: 'CLAIMED' }).eq('id', taskId);
    
    // 4. Update UI
    btnElement.style.display = 'none';
    const claimedText = document.createElement('span');
    claimedText.innerHTML = '<i data-feather="check" style="width:12px;"></i> Claimed';
    claimedText.style.cssText = 'font-size: 11px; color: var(--success-green); font-weight: bold; display: flex; align-items: center; gap: 4px;';
    btnElement.parentNode.appendChild(claimedText);
    if(window.renderIcons) window.renderIcons();
}

window.deleteTask = async function(taskId) {
    if(!confirm("Are you sure you want to delete this task?")) return;
    
    const card = document.getElementById(taskId);
    if(card) card.remove();
    updateColumnCounts();
    checkEmptyStates();

    await supabaseClient.from('tasks').delete().eq('id', taskId);
};

function attachDragEvents(task) {
    task.addEventListener('dragstart', (e) => {
        task.classList.add('is-dragging');
        e.dataTransfer.setData('text/plain', task.id);
    });
    task.addEventListener('dragend', () => {
        task.classList.remove('is-dragging');
        updateColumnCounts();
    });
}

columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault(); 
        column.style.backgroundColor = '#e5e7eb';
    });
    column.addEventListener('dragleave', () => {
        column.style.backgroundColor = ''; 
    });
    column.addEventListener('drop', async (e) => {
        e.preventDefault();
        column.style.backgroundColor = ''; 

        const draggedTaskId = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(draggedTaskId);
        if(!draggedElement) return;

        const emptyState = column.querySelector('.column-empty');
        if (emptyState) emptyState.style.display = 'none';
        
        column.appendChild(draggedElement);
        sortColumnByPriority(column); // Re-sort after dropping
        checkEmptyStates();

        let newStatus = 'TO DO';
        if (column === inProgressColumn) newStatus = 'IN PROGRESS';
        if (column === doneColumn) newStatus = 'DONE';

        // Show/Hide the Claim button based on column
        const claimBtn = draggedElement.querySelector('.claim-xp-btn');
        if (claimBtn) {
            claimBtn.style.display = (newStatus === 'DONE') ? 'block' : 'none';
        }

        if(localStorage.getItem('guestMode') !== 'true') {
            await supabaseClient.from('tasks').update({ status: newStatus }).eq('id', draggedTaskId);
        }
    });
});

function updateColumnCounts() {
    document.querySelectorAll('.kanban-column').forEach(col => {
        const countBadge = col.querySelector('.column-count');
        const taskCount = col.querySelectorAll('.task-card').length;
        if(countBadge) countBadge.textContent = taskCount;
    });
}

function checkEmptyStates() {
    columns.forEach(col => {
        const tasks = col.querySelectorAll('.task-card');
        const emptyState = col.querySelector('.column-empty');
        if (emptyState) emptyState.style.display = tasks.length === 0 ? 'flex' : 'none';
    });
}

initBoard();