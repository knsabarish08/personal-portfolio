const API_BASE_URL = 'http://localhost:5000'; // Explicit backend URL so it works with Live Server

document.addEventListener('DOMContentLoaded', () => {
    
    // Page: Projects
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
        fetchProjects();
    }

    // Page: Contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', submitContactForm);
    }
});

// Fetch projects from backend
async function fetchProjects() {
    const loadingEl = document.getElementById('loading');
    const projectsGrid = document.getElementById('projects-grid');
    
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const projects = await response.json();
        
        loadingEl.style.display = 'none';
        
        if (projects.length === 0) {
            projectsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--text-secondary);">No projects found.</p>';
            return;
        }

        projectsGrid.innerHTML = projects.map(project => {
            let imgUrl = project.image;
            if (!imgUrl) {
                const titleLower = (project.title || '').toLowerCase();
                if (titleLower.includes('ai') || titleLower.includes('dashboard')) imgUrl = 'images/ai_dashboard.png';
                else if (titleLower.includes('weather')) imgUrl = 'images/weather.png';
                else if (titleLower.includes('commerce') || titleLower.includes('shop')) imgUrl = 'images/ecommerce.png';
                else imgUrl = 'images/ai_dashboard.png';
            }
            return `
            <div class="glass-card project-card fade-in">
                <div class="project-img-container">
                    <img src="${escapeHTML(imgUrl)}" alt="${escapeHTML(project.title)}" class="project-img" onerror="this.src='images/ai_dashboard.png'">
                </div>
                <h3>${escapeHTML(project.title)}</h3>
                <p>${escapeHTML(project.description)}</p>
                <a href="${escapeHTML(project.link)}" target="_blank" rel="noopener noreferrer" class="btn">View Live Demo</a>
            </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error:', error);
        loadingEl.innerHTML = 'Failed to connect to the digital backend server. Please make sure the server is running on port 5000.';
        loadingEl.style.color = '#f87171';
    }
}

// Submit contact form to backend
async function submitContactForm(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const statusEl = document.getElementById('form-status');
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;
    statusEl.className = 'form-status';
    statusEl.innerText = '';

    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        });

        const data = await response.json();

        if (response.ok) {
            statusEl.innerText = data.message;
            statusEl.classList.add('success');
            e.target.reset(); // Clear the form
        } else {
            throw new Error(data.error || 'Failed to send message');
        }
    } catch (error) {
        console.error('Error:', error);
        statusEl.innerText = error.message;
        statusEl.classList.add('error');
    } finally {
        submitBtn.innerText = 'Send Message';
        submitBtn.disabled = false;
    }
}

// Utility to prevent XSS
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
