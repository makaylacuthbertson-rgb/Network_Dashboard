// Data Management
let partners = [];
let calendarEvents = [];
let currentEditId = null;
let currentEditEventId = null;
let currentSortColumn = 'organization';
let currentSortAsc = true;
let currentCalendarDate = new Date();
let teamRelevantFilterActive = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadPartnersFromStorage();
    loadEventsFromStorage();
    renderPartners();
    populateLocationFilter();
    populateEventPartnerFilter();
    renderCalendar();
});

// Toggle Other Role Field
function toggleOtherRoleField() {
    const mainRoleSelect = document.getElementById('mainRole');
    const otherRoleField = document.getElementById('otherRoleField');
    
    if (mainRoleSelect.value === 'Other') {
        otherRoleField.style.display = 'block';
        otherRoleField.focus();
    } else {
        otherRoleField.style.display = 'none';
        otherRoleField.value = '';
    }
}

// Local Storage Functions
function savePartnersToStorage() {
    localStorage.setItem('networkPartners', JSON.stringify(partners));
}

function loadPartnersFromStorage() {
    const stored = localStorage.getItem('networkPartners');
    partners = stored ? JSON.parse(stored) : [];
}

function saveEventsToStorage() {
    localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
}

function loadEventsFromStorage() {
    const stored = localStorage.getItem('calendarEvents');
    calendarEvents = stored ? JSON.parse(stored) : [];
}

// Modal Functions
function openAddPartnerModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Add New Partner';
    document.getElementById('partnerForm').reset();
    
    // Clear previous contact and event fields
    document.getElementById('contactsList').innerHTML = '';
    document.getElementById('pastEventsList').innerHTML = '';
    document.getElementById('upcomingEventsList').innerHTML = '';
    
    // Add one empty contact field
    addContactField();
    
    document.getElementById('partnerModal').classList.add('active');
}

function closeModal() {
    document.getElementById('partnerModal').classList.remove('active');
    currentEditId = null;
}

function closeDetailsModal() {
    document.getElementById('detailsModal').classList.remove('active');
}

// Event Modal Functions
function openAddEventModal() {
    currentEditEventId = null;
    document.getElementById('eventModalTitle').textContent = 'Add Event';
    document.getElementById('eventForm').reset();
    document.getElementById('attendeesList').innerHTML = '';
    addAttendeeField();
    document.getElementById('eventModal').classList.add('active');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.remove('active');
    currentEditEventId = null;
}

function openScrapingModal() {
    document.getElementById('scrapingModal').classList.add('active');
}

function closeScrapingModal() {
    document.getElementById('scrapingModal').classList.remove('active');
    document.getElementById('scrapingResults').style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    let modal = document.getElementById('partnerModal');
    if (event.target === modal) {
        closeModal();
    }
    
    let detailsModal = document.getElementById('detailsModal');
    if (event.target === detailsModal) {
        closeDetailsModal();
    }
}

// Contact Field Management
function addContactField(name = '', title = '', email = '', phone = '') {
    const contactsList = document.getElementById('contactsList');
    const contactId = Date.now();
    
    const contactItem = document.createElement('div');
    contactItem.className = 'contact-item';
    contactItem.innerHTML = `
        <div class="contact-fields">
            <input 
                type="text" 
                placeholder="Contact Name" 
                class="contact-name-${contactId}" 
                value="${name}"
            >
            <input 
                type="text" 
                placeholder="Job Title/Role" 
                class="contact-title-${contactId}" 
                value="${title}"
            >
            <input 
                type="email" 
                placeholder="Email (optional)" 
                class="contact-email-${contactId}" 
                value="${email}"
            >
            <input 
                type="tel" 
                placeholder="Phone (optional)" 
                class="contact-phone-${contactId}" 
                value="${phone}"
            >
        </div>
        <button 
            type="button" 
            class="remove-btn" 
            onclick="this.parentElement.remove()"
        >Remove</button>
    `;
    
    contactsList.appendChild(contactItem);
}

// Event Field Management
function addPastEventField(eventName = '', date = '', description = '') {
    const pastEventsList = document.getElementById('pastEventsList');
    const eventId = Date.now();
    
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';
    eventItem.innerHTML = `
        <div class="event-fields">
            <input 
                type="text" 
                placeholder="Event/Meeting Name" 
                class="event-name-${eventId}" 
                value="${eventName}"
            >
            <input 
                type="datetime-local" 
                placeholder="Date & Time" 
                class="event-date-${eventId}" 
                value="${date}"
            >
            <textarea 
                placeholder="Event Description/Notes" 
                class="event-desc-${eventId}"
            >${description}</textarea>
        </div>
        <button 
            type="button" 
            class="remove-btn" 
            onclick="this.parentElement.remove()"
        >Remove</button>
    `;
    
    pastEventsList.appendChild(eventItem);
}

function addUpcomingEventField(eventName = '', date = '', description = '') {
    const upcomingEventsList = document.getElementById('upcomingEventsList');
    const eventId = Date.now();
    
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';
    eventItem.innerHTML = `
        <div class="event-fields">
            <input 
                type="text" 
                placeholder="Event/Meeting Name" 
                class="event-name-${eventId}" 
                value="${eventName}"
            >
            <input 
                type="datetime-local" 
                placeholder="Date & Time" 
                class="event-date-${eventId}" 
                value="${date}"
            >
            <textarea 
                placeholder="Event Description/Notes" 
                class="event-desc-${eventId}"
            >${description}</textarea>
        </div>
        <button 
            type="button" 
            class="remove-btn" 
            onclick="this.parentElement.remove()"
        >Remove</button>
    `;
    
    upcomingEventsList.appendChild(eventItem);
}

// Attendee Field Management
function addAttendeeField(name = '', email = '') {
    const attendeesList = document.getElementById('attendeesList');
    const attendeeId = Date.now();
    
    const attendeeItem = document.createElement('div');
    attendeeItem.className = 'attendee-item';
    attendeeItem.innerHTML = `
        <div class="attendee-fields">
            <input 
                type="text" 
                placeholder="Team Member Name" 
                class="attendee-name-${attendeeId}" 
                value="${name}"
            >
            <input 
                type="email" 
                placeholder="Email (optional)" 
                class="attendee-email-${attendeeId}" 
                value="${email}"
            >
        </div>
        <button 
            type="button" 
            class="remove-btn" 
            onclick="this.parentElement.remove()"
        >Remove</button>
    `;
    
    attendeesList.appendChild(attendeeItem);
}

// Save Partner Function
function savePartner(event) {
    event.preventDefault();
    
    // Collect contact data
    const contacts = [];
    document.querySelectorAll('.contact-item').forEach(item => {
        const inputs = item.querySelectorAll('input');
        if (inputs[0].value) { // Only add if name is provided
            contacts.push({
                name: inputs[0].value,
                title: inputs[1].value,
                email: inputs[2].value,
                phone: inputs[3].value
            });
        }
    });
    
    // Collect past events
    const pastEvents = [];
    document.querySelectorAll('#pastEventsList .event-item').forEach(item => {
        const nameInput = item.querySelector('[class*="event-name"]');
        const dateInput = item.querySelector('[class*="event-date"]');
        const descInput = item.querySelector('[class*="event-desc"]');
        
        if (nameInput.value) {
            pastEvents.push({
                name: nameInput.value,
                date: dateInput.value,
                description: descInput.value
            });
        }
    });
    
    // Collect upcoming events
    const upcomingEvents = [];
    document.querySelectorAll('#upcomingEventsList .event-item').forEach(item => {
        const nameInput = item.querySelector('[class*="event-name"]');
        const dateInput = item.querySelector('[class*="event-date"]');
        const descInput = item.querySelector('[class*="event-desc"]');
        
        if (nameInput.value) {
            upcomingEvents.push({
                name: nameInput.value,
                date: dateInput.value,
                description: descInput.value
            });
        }
    });
    
    const partner = {
        id: currentEditId || Date.now(),
        organization: document.getElementById('organization').value,
        location: document.getElementById('location').value,
        mainRole: document.getElementById('mainRole').value === 'Other' 
            ? document.getElementById('otherRoleField').value 
            : document.getElementById('mainRole').value,
        expertise: document.getElementById('expertise').value,
        website: document.getElementById('website').value,
        industry: document.getElementById('industry').value,
        nextMeetingDate: document.getElementById('nextMeetingDate').value,
        nextMeetingTime: document.getElementById('nextMeetingTime').value,
        contacts: contacts,
        pastEvents: pastEvents,
        upcomingEvents: upcomingEvents,
        notes: document.getElementById('notes').value,
        partnerValue: document.getElementById('partnerValue').value,
        createdAt: currentEditId ? partners.find(p => p.id === currentEditId).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (currentEditId) {
        const index = partners.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
            partners[index] = partner;
        }
    } else {
        partners.push(partner);
    }
    
    savePartnersToStorage();
    renderPartners();
    closeModal();
}

// Edit Partner Function
function editPartner(id) {
    const partner = partners.find(p => p.id === id);
    if (!partner) return;
    
    currentEditId = id;
    document.getElementById('modalTitle').textContent = 'Edit Partner';
    
    // Fill basic fields
    document.getElementById('organization').value = partner.organization || '';
    document.getElementById('location').value = partner.location || '';
    document.getElementById('expertise').value = partner.expertise || '';
    document.getElementById('website').value = partner.website || '';
    document.getElementById('industry').value = partner.industry || '';
    document.getElementById('notes').value = partner.notes || '';
    document.getElementById('partnerValue').value = partner.partnerValue || '';
    document.getElementById('nextMeetingDate').value = partner.nextMeetingDate || '';
    document.getElementById('nextMeetingTime').value = partner.nextMeetingTime || '';
    
    // Handle main role - check if it's a standard role or custom
    const standardRoles = ['Supplier', 'Customer', 'Community Partner', 'University Partner', 'Investor', 'Vendor', 'Service Provider', 'Technology Partner'];
    const mainRoleSelect = document.getElementById('mainRole');
    
    if (standardRoles.includes(partner.mainRole)) {
        mainRoleSelect.value = partner.mainRole;
        document.getElementById('otherRoleField').style.display = 'none';
        document.getElementById('otherRoleField').value = '';
    } else {
        mainRoleSelect.value = 'Other';
        document.getElementById('otherRoleField').style.display = 'block';
        document.getElementById('otherRoleField').value = partner.mainRole || '';
    }
    
    // Clear and fill contacts
    document.getElementById('contactsList').innerHTML = '';
    if (partner.contacts && partner.contacts.length) {
        partner.contacts.forEach(contact => {
            addContactField(contact.name, contact.title, contact.email, contact.phone);
        });
    } else {
        addContactField();
    }
    
    // Clear and fill past events
    document.getElementById('pastEventsList').innerHTML = '';
    if (partner.pastEvents && partner.pastEvents.length) {
        partner.pastEvents.forEach(event => {
            addPastEventField(event.name, event.date, event.description);
        });
    }
    
    // Clear and fill upcoming events
    document.getElementById('upcomingEventsList').innerHTML = '';
    if (partner.upcomingEvents && partner.upcomingEvents.length) {
        partner.upcomingEvents.forEach(event => {
            addUpcomingEventField(event.name, event.date, event.description);
        });
    }
    
    document.getElementById('partnerModal').classList.add('active');
}

// Delete Partner Function
function deletePartner(id) {
    if (confirm('Are you sure you want to delete this partner?')) {
        partners = partners.filter(p => p.id !== id);
        savePartnersToStorage();
        renderPartners();
    }
}

// View Partner Details
function viewPartner(id) {
    const partner = partners.find(p => p.id === id);
    if (!partner) return;
    
    let html = `
        <div class="details-section">
            <div class="details-section-title">Basic Information</div>
            <div class="details-row">
                <div class="details-label">Organization:</div>
                <div class="details-value">${partner.organization}</div>
            </div>
            <div class="details-row">
                <div class="details-label">Location:</div>
                <div class="details-value">${partner.location}</div>
            </div>
            <div class="details-row">
                <div class="details-label">Industry:</div>
                <div class="details-value">${partner.industry || 'N/A'}</div>
            </div>
            <div class="details-row">
                <div class="details-label">Main Role:</div>
                <div class="details-value"><span class="tag role">${partner.mainRole}</span></div>
            </div>
            <div class="details-row">
                <div class="details-label">Priority:</div>
                <div class="details-value">${partner.partnerValue ? '★'.repeat(partner.partnerValue === 'High' ? 3 : partner.partnerValue === 'Medium' ? 2 : 1) : 'N/A'}</div>
            </div>
            ${partner.nextMeetingDate ? `
            <div class="details-row">
                <div class="details-label">Next Meeting:</div>
                <div class="details-value">${new Date(partner.nextMeetingDate + ' ' + (partner.nextMeetingTime || '00:00')).toLocaleString()}</div>
            </div>
            ` : ''}
            ${partner.website ? `
            <div class="details-row">
                <div class="details-label">Website:</div>
                <div class="details-value"><a href="${partner.website}" target="_blank">${partner.website}</a></div>
            </div>
            ` : ''}
        </div>
        
        <div class="details-section">
            <div class="details-section-title">Expertise</div>
            <div class="details-value">${partner.expertise}</div>
        </div>
    `;
    
    if (partner.contacts && partner.contacts.length) {
        html += `
        <div class="details-section">
            <div class="details-section-title">Key Contacts</div>
        `;
        partner.contacts.forEach(contact => {
            html += `
            <div class="event-badge">
                <strong>${contact.name}</strong>${contact.title ? ` - ${contact.title}` : ''}
                ${contact.email ? `<br>Email: ${contact.email}` : ''}
                ${contact.phone ? `<br>Phone: ${contact.phone}` : ''}
            </div>
            `;
        });
        html += `</div>`;
    }
    
    if (partner.pastEvents && partner.pastEvents.length) {
        html += `
        <div class="details-section">
            <div class="details-section-title">Past Events/Meetings</div>
        `;
        partner.pastEvents.forEach(event => {
            const dateStr = event.date ? new Date(event.date).toLocaleString() : 'No date';
            html += `
            <div class="event-badge past">
                <strong>${event.name}</strong><br>
                ${dateStr}
                ${event.description ? `<br>${event.description}` : ''}
            </div>
            `;
        });
        html += `</div>`;
    }
    
    if (partner.upcomingEvents && partner.upcomingEvents.length) {
        html += `
        <div class="details-section">
            <div class="details-section-title">Upcoming Events/Meetings</div>
        `;
        partner.upcomingEvents.forEach(event => {
            const dateStr = event.date ? new Date(event.date).toLocaleString() : 'No date';
            html += `
            <div class="event-badge upcoming">
                <strong>${event.name}</strong><br>
                ${dateStr}
                ${event.description ? `<br>${event.description}` : ''}
            </div>
            `;
        });
        html += `</div>`;
    }
    
    if (partner.notes) {
        html += `
        <div class="details-section">
            <div class="details-section-title">Notes</div>
            <div class="details-value">${partner.notes}</div>
        </div>
        `;
    }
    
    document.getElementById('detailsTitle').textContent = partner.organization;
    document.getElementById('detailsContent').innerHTML = html;
    document.getElementById('detailsModal').classList.add('active');
}

// Filter and Search Functions
function filterPartners() {
    renderPartners();
}

function getFilteredPartners() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const roleFilter = document.getElementById('filterRole').value;
    const locationFilter = document.getElementById('filterLocation').value;
    
    return partners.filter(partner => {
        const matchesSearch = 
            partner.organization.toLowerCase().includes(searchTerm) ||
            partner.location.toLowerCase().includes(searchTerm) ||
            (partner.contacts && partner.contacts.some(c => c.name.toLowerCase().includes(searchTerm)));
        
        const matchesRole = !roleFilter || partner.mainRole === roleFilter;
        const matchesLocation = !locationFilter || partner.location === locationFilter;
        
        return matchesSearch && matchesRole && matchesLocation;
    });
}

// Populate Location Filter
function populateLocationFilter() {
    const locations = [...new Set(partners.map(p => p.location).filter(Boolean))].sort();
    const filterSelect = document.getElementById('filterLocation');
    
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        filterSelect.appendChild(option);
    });
}

// Switch View
function switchView(view) {
    // Update button active states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.view-btn[data-view="${view}"]`).classList.add('active');
    
    // Hide all views
    document.getElementById('gridView').classList.add('hidden');
    document.getElementById('listView').classList.add('hidden');
    document.getElementById('tableView').classList.add('hidden');
    document.getElementById('calendarView').classList.add('hidden');
    
    // Show selected view
    if (view === 'grid') {
        document.getElementById('gridView').classList.remove('hidden');
    } else if (view === 'list') {
        document.getElementById('listView').classList.remove('hidden');
    } else if (view === 'table') {
        document.getElementById('tableView').classList.remove('hidden');
    } else if (view === 'calendar') {
        document.getElementById('calendarView').classList.remove('hidden');
        renderCalendar();
    }
}

// Sort Table
function sortTable(column) {
    if (currentSortColumn === column) {
        currentSortAsc = !currentSortAsc;
    } else {
        currentSortColumn = column;
        currentSortAsc = true;
    }
    renderPartners();
}

// Render Partners
function renderPartners() {
    const filteredPartners = getFilteredPartners();
    
    // Show/hide empty state
    if (filteredPartners.length === 0) {
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('gridView').classList.add('hidden');
        document.getElementById('listView').classList.add('hidden');
        document.getElementById('tableView').classList.add('hidden');
        return;
    } else {
        document.getElementById('emptyState').style.display = 'none';
    }
    
    // Render all views (they'll be hidden/shown by the view toggle)
    renderGridView(filteredPartners);
    renderListView(filteredPartners);
    renderTableView(filteredPartners);
}

function renderGridView(filteredPartners) {
    const grid = document.getElementById('partnerGrid');
    grid.innerHTML = '';
    
    filteredPartners.forEach(partner => {
        const lastMeeting = partner.pastEvents && partner.pastEvents.length 
            ? new Date(partner.pastEvents[partner.pastEvents.length - 1].date).toLocaleDateString()
            : 'No meetings recorded';
        
        const nextEvent = partner.upcomingEvents && partner.upcomingEvents.length
            ? new Date(partner.upcomingEvents[0].date).toLocaleDateString()
            : 'No upcoming events';
        
        const card = document.createElement('div');
        card.className = `partner-card ${partner.partnerValue ? partner.partnerValue.toLowerCase() : ''}`;
        card.innerHTML = `
            <div class="partner-card-header" onclick="viewPartner(${partner.id})">
                <h3>${partner.organization}</h3>
                <p>${partner.mainRole}</p>
            </div>
            <div class="partner-card-body">
                <div class="card-field">
                    <div class="card-field-label">Location</div>
                    <div class="card-field-value">${partner.location}</div>
                </div>
                <div class="card-field">
                    <div class="card-field-label">Expertise</div>
                    <div class="card-field-value">${partner.expertise.substring(0, 100)}${partner.expertise.length > 100 ? '...' : ''}</div>
                </div>
                ${partner.contacts && partner.contacts.length ? `
                <div class="card-field">
                    <div class="card-field-label">Key Contact</div>
                    <div class="card-field-value">${partner.contacts[0].name}${partner.contacts[0].title ? ` - ${partner.contacts[0].title}` : ''}</div>
                </div>
                ` : ''}
                <div class="card-field">
                    <div class="card-field-label">Last Meeting</div>
                    <div class="card-field-value">${lastMeeting}</div>
                </div>
                <div class="card-field">
                    <div class="card-field-label">Next Event</div>
                    <div class="card-field-value">${nextEvent}</div>
                </div>
                ${partner.website ? `
                <div class="card-field">
                    <div class="card-field-label">Website</div>
                    <div class="card-field-value"><a href="${partner.website}" target="_blank">Visit Site</a></div>
                </div>
                ` : ''}
            </div>
            <div class="partner-card-footer">
                <button class="card-action-btn" onclick="editPartner(${partner.id})">Edit</button>
                <button class="card-action-btn" onclick="viewPartner(${partner.id})">View</button>
                <button class="card-action-btn delete" onclick="deletePartner(${partner.id})">Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderListView(filteredPartners) {
    const list = document.getElementById('partnerList');
    list.innerHTML = '';
    
    filteredPartners.forEach(partner => {
        const lastMeeting = partner.pastEvents && partner.pastEvents.length 
            ? new Date(partner.pastEvents[partner.pastEvents.length - 1].date).toLocaleDateString()
            : 'No meetings';
        
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-main" onclick="viewPartner(${partner.id})">
                <div class="list-item-title">${partner.organization}</div>
                <div class="list-item-subtitle">${partner.mainRole} • ${partner.location}</div>
                <div class="list-item-meta">
                    <span>${partner.expertise.substring(0, 50)}${partner.expertise.length > 50 ? '...' : ''}</span>
                    <span>${lastMeeting}</span>
                </div>
            </div>
            <div class="list-item-actions">
                <button class="btn btn-secondary btn-small" onclick="editPartner(${partner.id})">Edit</button>
                <button class="btn btn-secondary btn-small" onclick="deletePartner(${partner.id})">Delete</button>
            </div>
        `;
        list.appendChild(item);
    });
}

function renderTableView(filteredPartners) {
    const tbody = document.getElementById('partnerTableBody');
    tbody.innerHTML = '';
    
    // Sort partners
    let sortedPartners = [...filteredPartners];
    sortedPartners.sort((a, b) => {
        let aValue = a[currentSortColumn];
        let bValue = b[currentSortColumn];
        
        // Handle nested properties
        if (currentSortColumn === 'role') {
            aValue = a.mainRole;
            bValue = b.mainRole;
        }
        
        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
        }
        if (typeof bValue === 'string') {
            bValue = bValue.toLowerCase();
        }
        
        let comparison = 0;
        if (aValue < bValue) {
            comparison = -1;
        } else if (aValue > bValue) {
            comparison = 1;
        }
        
        return currentSortAsc ? comparison : -comparison;
    });
    
    sortedPartners.forEach(partner => {
        const lastMeeting = partner.pastEvents && partner.pastEvents.length 
            ? new Date(partner.pastEvents[partner.pastEvents.length - 1].date).toLocaleDateString()
            : '-';
        
        const nextEvent = partner.upcomingEvents && partner.upcomingEvents.length
            ? new Date(partner.upcomingEvents[0].date).toLocaleDateString()
            : '-';
        
        const firstContact = partner.contacts && partner.contacts.length
            ? partner.contacts[0].name
            : '-';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td onclick="viewPartner(${partner.id})" style="cursor: pointer; color: var(--primary-color); font-weight: 600;">${partner.organization}</td>
            <td>${partner.location}</td>
            <td><span class="tag role">${partner.mainRole}</span></td>
            <td>${firstContact}</td>
            <td>${lastMeeting}</td>
            <td>${nextEvent}</td>
            <td>
                <button class="btn btn-secondary btn-small" onclick="editPartner(${partner.id})">Edit</button>
                <button class="btn btn-secondary btn-small" onclick="deletePartner(${partner.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Export and Import Functions
function exportData() {
    const dataStr = JSON.stringify(partners, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `network-dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const imported = JSON.parse(event.target.result);
                if (Array.isArray(imported)) {
                    // Option to merge or replace
                    if (confirm('Do you want to merge with existing data? Click OK to merge, Cancel to replace.')) {
                        partners = [...partners, ...imported];
                    } else {
                        partners = imported;
                    }
                    savePartnersToStorage();
                    renderPartners();
                    populateLocationFilter();
                    alert('Data imported successfully!');
                } else {
                    alert('Invalid file format. Please export from this dashboard.');
                }
            } catch (err) {
                alert('Error importing file: ' + err.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Sample Data Function (for demonstration)
function loadSampleData() {
    const samplePartners = [
        {
            id: 1,
            organization: 'TechCorp Solutions',
            location: 'San Francisco, USA',
            mainRole: 'Technology Partner',
            expertise: 'Cloud infrastructure, AI/ML solutions, and enterprise software development',
            website: 'https://techcorp.com',
            industry: 'Technology',
            contacts: [
                { name: 'John Smith', title: 'VP Sales', email: 'john@techcorp.com', phone: '+1-415-555-0100' },
                { name: 'Sarah Johnson', title: 'Account Manager', email: 'sarah@techcorp.com', phone: '+1-415-555-0101' }
            ],
            pastEvents: [
                { name: 'Q3 Product Review Meeting', date: '2026-09-15T14:00', description: 'Discussed new API capabilities and pricing' },
                { name: 'Annual Partnership Summit', date: '2026-06-20T09:00', description: 'Strategic planning for 2026' }
            ],
            upcomingEvents: [
                { name: 'Q1 Planning Session', date: '2026-01-15T10:00', description: 'Q1 roadmap and initiatives' }
            ],
            notes: 'Strong partnership. Looking to expand collaboration in AI/ML.',
            partnerValue: 'High',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
    
    partners = samplePartners;
    savePartnersToStorage();
    renderPartners();
    populateLocationFilter();
}

// Event Management Functions
function saveEvent(event) {
    event.preventDefault();
    
    // Collect attendees
    const attendees = [];
    document.querySelectorAll('.attendee-item').forEach(item => {
        const nameInput = item.querySelector('[class*="attendee-name"]');
        const emailInput = item.querySelector('[class*="attendee-email"]');
        if (nameInput.value) {
            attendees.push({
                name: nameInput.value,
                email: emailInput.value
            });
        }
    });
    
    const eventData = {
        id: currentEditEventId || Date.now(),
        name: document.getElementById('eventName').value,
        partnerId: document.getElementById('eventPartner').value,
        startDate: document.getElementById('eventStartDate').value,
        startTime: document.getElementById('eventStartTime').value,
        endDate: document.getElementById('eventEndDate').value,
        endTime: document.getElementById('eventEndTime').value,
        location: document.getElementById('eventLocation').value,
        registrationLink: document.getElementById('eventRegistrationLink').value,
        description: document.getElementById('eventDescription').value,
        cost: document.getElementById('eventCost').value || 0,
        teamRelevant: document.getElementById('teamRelevant').checked,
        attendees: attendees,
        createdAt: currentEditEventId ? calendarEvents.find(e => e.id === currentEditEventId).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (currentEditEventId) {
        const index = calendarEvents.findIndex(e => e.id === currentEditEventId);
        if (index !== -1) {
            calendarEvents[index] = eventData;
        }
    } else {
        calendarEvents.push(eventData);
    }
    
    saveEventsToStorage();
    renderCalendar();
    closeEventModal();
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        calendarEvents = calendarEvents.filter(e => e.id !== eventId);
        saveEventsToStorage();
        renderCalendar();
    }
}

function populateEventPartnerFilter() {
    const select = document.getElementById('eventPartner');
    if (!select) return;
    
    partners.forEach(partner => {
        const option = document.createElement('option');
        option.value = partner.id;
        option.textContent = partner.organization;
        select.appendChild(option);
    });
}

// Calendar Functions
function renderCalendar() {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
    
    // Create calendar grid
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    
    // Day headers
    const dayHeaders = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day.substring(0, 3);
        grid.appendChild(header);
    });
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.innerHTML = `<div class="calendar-day-number">${daysInPrevMonth - i}</div>`;
        grid.appendChild(day);
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        let dayEvents = calendarEvents.filter(e => {
            const eventStartDate = e.startDate || e.date;
            const eventEndDate = e.endDate || e.date;
            return eventStartDate <= dateStr && eventEndDate >= dateStr;
        });
        
        if (teamRelevantFilterActive) {
            dayEvents = dayEvents.filter(e => e.teamRelevant);
        }
        
        let html = `<div class="calendar-day-number">${i}</div>`;
        dayEvents.forEach(evt => {
            const partner = partners.find(p => p.id == evt.partnerId);
            html += `<div class="calendar-event" onclick="viewEvent(${evt.id})" title="${evt.name}">${evt.name}</div>`;
        });
        
        day.innerHTML = html;
        grid.appendChild(day);
    }
    
    // Next month days
    const totalCells = grid.children.length - 7; // Subtract day headers
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.innerHTML = `<div class="calendar-day-number">${i}</div>`;
        grid.appendChild(day);
    }
    
    // Update upcoming events sidebar
    updateUpcomingEventsList();
}

function updateUpcomingEventsList() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let filteredEvents = calendarEvents.filter(e => {
        const eventStart = new Date(e.startDate + ' ' + e.startTime);
        return eventStart >= today;
    });
    
    if (teamRelevantFilterActive) {
        filteredEvents = filteredEvents.filter(e => e.teamRelevant);
    }
    
    const sortedEvents = filteredEvents
        .sort((a, b) => new Date(a.startDate + ' ' + a.startTime) - new Date(b.startDate + ' ' + b.startTime))
        .slice(0, 10);
    
    const list = document.getElementById('upcomingEventsList');
    if (!list) return;
    
    list.innerHTML = '';
    
    if (sortedEvents.length === 0) {
        list.innerHTML = '<p style="color: var(--text-light); text-align: center;">No upcoming events</p>';
        return;
    }
    
    sortedEvents.forEach(evt => {
        const partner = partners.find(p => p.id == evt.partnerId);
        const eventDate = new Date(evt.startDate + ' ' + evt.startTime);
        const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const timeStr = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        const item = document.createElement('div');
        item.className = 'event-item-card';
        item.onclick = () => viewEvent(evt.id);
        item.innerHTML = `
            <div class="event-title">${evt.name}${evt.teamRelevant ? ' (Team)' : ''}</div>
            <div class="event-meta">${partner ? partner.organization : 'Unknown'}</div>
            <div class="event-meta">${dateStr} at ${timeStr}</div>
            <div class="event-meta">${evt.location}</div>
        `;
        list.appendChild(item);
    });
}

function previousMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
}

function toggleTeamRelevantFilter() {
    teamRelevantFilterActive = !teamRelevantFilterActive;
    const btn = document.getElementById('teamEventsFilterBtn');
    if (teamRelevantFilterActive) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
    renderCalendar();
    updateUpcomingEventsList();
}

function viewEvent(eventId) {
    const event = calendarEvents.find(e => e.id === eventId);
    if (!event) return;
    
    const partner = partners.find(p => p.id == event.partnerId);
    const startDate = new Date(event.startDate + ' ' + event.startTime);
    const endDate = new Date(event.endDate + ' ' + event.endTime);
    
    let attendeesHtml = '<div>';
    if (event.attendees && event.attendees.length) {
        event.attendees.forEach(att => {
            attendeesHtml += `<div style="padding: 6px 0;">${att.name}${att.email ? ` (${att.email})` : ''}</div>`;
        });
    }
    attendeesHtml += '</div>';
    
    const startDateStr = startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const startTimeStr = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const endDateStr = endDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const endTimeStr = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    const html = `
        <div class="details-section">
            <div class="details-section-title">${event.name}</div>
            <div class="details-row">
                <div class="details-label">Host Organization:</div>
                <div class="details-value">${partner ? partner.organization : 'Unknown'}</div>
            </div>
            <div class="details-row">
                <div class="details-label">Date:</div>
                <div class="details-value">${startDateStr} - ${endDateStr}</div>
            </div>
            <div class="details-row">
                <div class="details-label">Time:</div>
                <div class="details-value">${startTimeStr} - ${endTimeStr}</div>
            </div>
            <div class="details-row">
                <div class="details-label">Location:</div>
                <div class="details-value">${event.location}</div>
            </div>
            <div class="details-row" style="display: flex; gap: 20px; align-items: center;">
                ${event.cost ? `
                <div style="flex: 1;">
                    <div class="details-label">Cost:</div>
                    <div class="details-value">$${parseFloat(event.cost).toFixed(2)}</div>
                </div>
                ` : ''}
            </div>
            ${event.registrationLink ? `
            <div class="details-row">
                <div class="details-label">Registration:</div>
                <div class="details-value"><a href="${event.registrationLink}" target="_blank">Register Here</a></div>
            </div>
            ` : ''}
            <div class="details-row">
                <div style="display: flex; align-items: center; gap: 8px; white-space: nowrap;">
                    <input type="checkbox" id="teamRelevantView" ${event.teamRelevant ? 'checked' : ''} disabled>
                    <label for="teamRelevantView" style="margin: 0; white-space: nowrap;">Team Relevant Event</label>
                </div>
            </div>
            ${event.description ? `
            <div class="details-section">
                <div class="details-section-title">Description</div>
                <div class="details-value">${event.description}</div>
            </div>
            ` : ''}
            ${event.attendees && event.attendees.length ? `
            <div class="details-section">
                <div class="details-section-title">Attending Team Members</div>
                ${attendeesHtml}
            </div>
            ` : ''}
        </div>
        <div style="margin-top: 20px; display: flex; gap: 10px;">
            <button class="btn btn-secondary" onclick="closeDetailsModal()">Close</button>
            <button class="btn btn-secondary" onclick="deleteEvent(${event.id})">Delete Event</button>
        </div>
    `;
    
    document.getElementById('detailsTitle').textContent = 'Event Details';
    document.getElementById('detailsContent').innerHTML = html;
    document.getElementById('detailsModal').classList.add('active');
}

// Web Scraping Simulation
function performWebSearch() {
    const keywords = document.getElementById('searchKeywords').value;
    const location = document.getElementById('searchLocation').value;
    
    if (!keywords) {
        alert('Please enter search keywords');
        return;
    }
    
    // Show loading state
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '<p>Searching for events... (This is a simulation)</p>';
    document.getElementById('scrapingResults').style.display = 'block';
    
    // Simulate API call with timeout
    setTimeout(() => {
        const mockResults = generateMockEventResults(keywords, location);
        displaySearchResults(mockResults);
    }, 1500);
}

function generateMockEventResults(keywords, location) {
    const events = [
        { title: 'Tech Summit 2026', description: 'Annual tech conference', date: '2026-12-15', link: 'https://example.com' },
        { title: 'Business Networking Event', description: 'Q1 networking mixer', date: '2026-01-20', link: 'https://example.com' },
        { title: 'Industry Conference', description: 'Leading industry conference', date: '2026-03-28', link: 'https://example.com' }
    ];
    return events;
}

function displaySearchResults(results) {
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';
    
    results.forEach((result, index) => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
            <div class="result-title">${result.title}</div>
            <div class="result-meta">${result.description}</div>
            <div class="result-meta">Date: ${result.date}</div>
            <button class="btn btn-primary btn-small" style="margin-top: 8px;" onclick="addEventFromSearch('${result.title}', '${result.date}', '${result.link}')">Add to Calendar</button>
        `;
        resultsList.appendChild(item);
    });
}

function addEventFromSearch(eventName, date, link) {
    document.getElementById('eventName').value = eventName;
    document.getElementById('eventDate').value = date;
    document.getElementById('eventRegistrationLink').value = link;
    closeScrapingModal();
    document.getElementById('eventModal').classList.add('active');
}
