(function() {
    const e = React.createElement;

    const projects = [{
        id: 1,
        title: 'Open AI Health Care',
        date: '01/2025 – 03/2025',
        tagline: 'Integration of OpenAI with Chatbot System.',
        badges: ['OpenAI', 'Java', 'Spring Boot', 'React'],
        bullets: [
            'AI-Powered Healthcare Assistant – Chatbot built using OpenAI to provide quick and accurate responses to patient queries.',
            'Secure Data Handling – Focuses on protecting patient data with encryption and privacy measures to meet healthcare security standards.',
            'Real-World Applications – Assists with appointment scheduling, symptom checking, medication reminders, and telemedicine support.',
            'Patient History Management – Stores chat summaries and relevant details securely for continuity of care.',
            'User-Friendly Interface – Simple web/mobile UI for patients and practitioners.'
        ],
        repo: 'https://github.com/Pradeepjayaraman1/Pradeepjayaraman1',
        avatar: 'assets/project-ai.svg'
    }];

    function ProjectCard(props) {
        const p = props.project;
        return e('div', { className: 'react-project-card' },
            e('img', { src: p.avatar, alt: p.title + ' logo', className: 'react-project-avatar' }),
            e('div', { className: 'react-project-body' },
                e('div', { className: 'react-project-header' },
                    e('h3', null, p.title),
                    e('span', { className: 'project-date' }, p.date)
                ),
                e('p', { className: 'project-tagline' }, e('em', null, p.tagline)),
                e('div', { className: 'react-project-bullets' },
                    e('ul', null, p.bullets.map((b, i) => e('li', { key: i }, b)))
                ),
                e('div', { className: 'react-project-controls' },
                    e('div', { className: 'react-badges' }, p.badges.map((b, i) => e('span', { key: i, className: 'tech' }, b)))
                )
            )
        );
    }

    function ProjectsApp() {
        return e('div', { className: 'react-projects-grid' }, projects.map(p => e(ProjectCard, { key: p.id, project: p })));
    }

    function init() {
        const rootEl = document.getElementById('projects-root');
        if (!rootEl) return;
        const root = ReactDOM.createRoot(rootEl);
        root.render(e(ProjectsApp));
        // hide fallback static projects
        const sec = document.getElementById('projects-section');
        if (sec) sec.classList.add('js-enabled');
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();