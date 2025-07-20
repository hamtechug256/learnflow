document.addEventListener('DOMContentLoaded', () => {
    const learningGoalInput = document.getElementById('learning-goal-input');
    const generatePathButton = document.getElementById('generate-path-button');
    const learningPathSection = document.querySelector('.learning-path-section');
    const currentGoalDisplay = document.getElementById('current-goal-display');
    const overallProgressBar = document.getElementById('overall-progress-bar');
    const learningPathList = document.getElementById('learning-path-list');
    const learningStyleRadios = document.querySelectorAll('input[name="learning-style"]');
    const messageArea = document.getElementById('message-area');

    let currentLearningPath = null; // To store the active learning path data
    let selectedLearningStyle = 'reading'; // Default learning style

    // --- Data Structures (Pre-defined Learning Goals and Resources) ---
    const learningGoalsData = {
        "web-development": {
            name: "Become a Web Developer",
            description: "Learn the fundamentals of front-end and back-end web development.",
            defaultPath: [
                { id: "html-basics", name: "HTML Basics", type: "topic" },
                { id: "css-fundamentals", name: "CSS Fundamentals", type: "topic" },
                { id: "js-core", name: "JavaScript Core Concepts", type: "topic" },
                { id: "dom-manipulation", name: "DOM Manipulation", type: "topic" },
                { id: "git-basics", name: "Git & GitHub Basics", type: "topic" },
                { id: "responsive-design", name: "Responsive Design", type: "topic" },
                { id: "frontend-frameworks", name: "Frontend Frameworks (React/Vue)", type: "topic" },
                { id: "backend-basics", name: "Backend Basics (Node.js/Python)", type: "topic" },
                { id: "databases", name: "Databases (SQL/NoSQL)", type: "topic" },
                { id: "api-integration", name: "API Integration", type: "topic" }
            ]
        },
        "data-science": {
            name: "Learn Data Science",
            description: "Explore data analysis, machine learning, and statistical modeling.",
            defaultPath: [
                { id: "python-basics", name: "Python Basics", type: "topic" },
                { id: "stats-intro", name: "Introduction to Statistics", type: "topic" },
                { id: "linear-algebra", name: "Linear Algebra for DS", type: "topic" },
                { id: "data-manipulation", name: "Data Manipulation (Pandas)", type: "topic" },
                { id: "data-viz", name: "Data Visualization (Matplotlib/Seaborn)", type: "topic" },
                { id: "ml-basics", name: "Machine Learning Fundamentals", type: "topic" },
                { id: "deep-learning", name: "Deep Learning Intro", type: "topic" }
            ]
        },
        "digital-marketing": {
            name: "Master Digital Marketing",
            description: "Understand SEO, SEM, Social Media, and Content Marketing.",
            defaultPath: [
                { id: "marketing-fundamentals", name: "Marketing Fundamentals", type: "topic" },
                { id: "seo-basics", name: "SEO Basics", type: "topic" },
                { id: "sem-intro", name: "SEM & Google Ads", type: "topic" },
                { id: "social-media-strategy", name: "Social Media Strategy", type: "topic" },
                { id: "content-marketing", name: "Content Marketing", type: "topic" },
                { id: "email-marketing", name: "Email Marketing", type: "topic" },
                { id: "analytics-tracking", name: "Analytics & Tracking", type: "topic" }
            ]
        }
        // Add more learning goals here
    };

    const resourcesData = {
        "html-basics": [
            { name: "MDN Web Docs: HTML Basics", url: "https://developer.mozilla.org/en-US/docs/Web/HTML", type: "article", style: "reading" },
            { name: "freeCodeCamp: Responsive Web Design (HTML section)", url: "https://www.freecodecamp.org/learn/responsive-web-design/", type: "course", style: "reading" },
            { name: "W3Schools HTML Tutorial", url: "https://www.w3schools.com/html/", type: "article", style: "reading" },
            { name: "HTML Crash Course For Absolute Beginners (YouTube)", url: "https://www.youtube.com/watch?v=UB1O30fR-EE", type: "video", style: "video" },
            { name: "HTML Full Course - Build a Website (freeCodeCamp.org)", url: "https://www.youtube.com/watch?v=pQN-pnX-9MU", type: "video", style: "video" }
        ],
        "css-fundamentals": [
            { name: "MDN Web Docs: CSS Basics", url: "https://developer.mozilla.org/en-US/docs/Web/CSS", type: "article", style: "reading" },
            { name: "CSS-Tricks: A Complete Guide to Flexbox", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", type: "article", style: "reading" },
            { name: "W3Schools CSS Tutorial", url: "https://www.w3schools.com/css/", type: "article", style: "reading" },
            { name: "CSS Crash Course For Absolute Beginners (YouTube)", url: "https://www.youtube.com/watch?v=yfoY53QXx1g", type: "video", style: "video" },
            { name: "Flexbox Froggy (Interactive Game)", url: "https://flexboxfroggy.com/", type: "course", style: "kinesthetic" },
            { name: "Grid Garden (Interactive Game)", url: "https://cssgridgarden.com/", type: "course", style: "kinesthetic" }
        ],
        "js-core": [
            { name: "MDN Web Docs: JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", type: "article", style: "reading" },
            { name: "JavaScript.info: The Modern JavaScript Tutorial", url: "https://javascript.info/", type: "article", style: "reading" },
            { name: "W3Schools JavaScript Tutorial", url: "https://www.w3schools.com/js/", type: "article", style: "reading" },
            { name: "JavaScript Crash Course For Beginners (YouTube)", url: "https://www.youtube.com/watch?v=hdI2bqOjy04", type: "video", style: "video" },
            { name: "Eloquent JavaScript (Online Book)", url: "https://eloquentjavascript.net/", type: "article", style: "reading" }
        ],
        "dom-manipulation": [
            { name: "MDN Web Docs: Introduction to the DOM", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction", type: "article", style: "reading" },
            { name: "Traversing the DOM (CSS-Tricks)", url: "https://css-tricks.com/traversing-the-dom/", type: "article", style: "reading" },
            { name: "DOM Manipulation Crash Course (YouTube)", url: "https://www.youtube.com/watch?v=5_5oE5lgrhw", type: "video", style: "video" }
        ],
        "git-basics": [
            { name: "Git Handbook (GitHub Guides)", url: "https://guides.github.com/introduction/git-handbook/", type: "article", style: "reading" },
            { name: "Git - The Simple Guide (Website)", url: "http://rogerdudler.github.io/git-guide/", type: "article", style: "reading" },
            { name: "Git & GitHub Crash Course For Beginners (YouTube)", url: "https://www.youtube.com/watch?v=SWYPm_J4s4g", type: "video", style: "video" },
            { name: "Learn Git Branching (Interactive Tutorial)", url: "https://learngitbranching.js.org/", type: "course", style: "kinesthetic" }
        ],
        "responsive-design": [
            { name: "Google Developers: Responsive Web Design Basics", url: "https://developers.google.com/web/fundamentals/design-and-ui/responsive/basics", type: "article", style: "reading" },
            { name: "Responsive Web Design Tutorial (W3Schools)", url: "https://www.w3schools.com/css/css_rwd_intro.asp", type: "article", style: "reading" },
            { name: "Responsive Web Design Crash Course (YouTube)", url: "https://www.youtube.com/watch?v=B-ytMtvLk88", type: "video", style: "video" }
        ],
        "frontend-frameworks": [
            { name: "React Official Documentation", url: "https://react.dev/", type: "article", style: "reading" },
            { name: "Vue.js Official Documentation", url: "https://vuejs.org/", type: "article", style: "reading" },
            { name: "Angular Official Documentation", url: "https://angular.io/", type: "article", style: "reading" },
            { name: "Svelte Official Documentation", url: "https://svelte.dev/", type: "article", style: "reading" },
            { name: "React Crash Course (YouTube)", url: "https://www.youtube.com/watch?v=Dorf8i6EX4U", type: "video", style: "video" },
            { name: "Vue.js Crash Course (YouTube)", url: "https://www.youtube.com/watch?v=FXpIoQ_rT_c", type: "video", style: "video" }
        ],
        "backend-basics": [
            { name: "Node.js Official Documentation", url: "https://nodejs.org/en/docs/", type: "article", style: "reading" },
            { name: "Flask Documentation (Python)", url: "https://flask.palletsprojects.com/", type: "article", style: "reading" },
            { name: "Django Documentation (Python)", url: "https://docs.djangoproject.com/en/stable/", type: "article", style: "reading" },
            { name: "Express.js Official Website", url: "https://expressjs.com/", type: "article", style: "reading" },
            { name: "Node.js Crash Course (YouTube)", url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4", type: "video", style: "video" }
        ],
        "databases": [
            { name: "SQL Tutorial (W3Schools)", url: "https://www.w3schools.com/sql/", type: "article", style: "reading" },
            { name: "MongoDB Documentation", url: "https://www.mongodb.com/docs/", type: "article", style: "reading" },
            { name: "PostgreSQL Official Documentation", url: "https://www.postgresql.org/docs/", type: "article", style: "reading" },
            { name: "MySQL Official Documentation", url: "https://dev.mysql.com/doc/", type: "article", style: "reading" },
            { name: "SQL Crash Course (YouTube)", url: "https://www.youtube.com/watch?v=2w_2_0_D_cE", type: "video", style: "video" }
        ],
        "api-integration": [
            { name: "MDN Web Docs: Using Fetch", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch", type: "article", style: "reading" },
            { name: "What is an API? (Postman Blog)", url: "https://www.postman.com/api-platform/api-what-is-api/", type: "article", style: "reading" },
            { name: "REST API Crash Course (YouTube)", url: "https://www.youtube.com/watch?v=L72fhGm1tfE", type: "video", style: "video" }
        ],
        "python-basics": [
            { name: "Python Official Docs: Tutorial", url: "https://docs.python.org/3/tutorial/", type: "article", style: "reading" },
            { name: "Coursera: Python for Everybody (University of Michigan)", url: "https://www.coursera.org/specializations/python", type: "course", style: "video" },
            { name: "W3Schools Python Tutorial", url: "https://www.w3schools.com/python/", type: "article", style: "reading" },
            { name: "Python Crash Course (YouTube)", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", type: "video", style: "video" }
        ],
        "stats-intro": [
            { name: "Khan Academy: Statistics and Probability", url: "https://www.khanacademy.org/math/statistics-probability", type: "course", style: "video" },
            { name: "StatQuest with Josh Starmer (YouTube Channel)", url: "https://www.youtube.com/c/joshstarmer", type: "video", style: "video" },
            { name: "Introduction to Statistical Learning (Book)", url: "https://www.statlearning.com/", type: "article", style: "reading" }
        ],
        "linear-algebra": [
            { name: "3Blue1Brown: Essence of Linear Algebra", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", type: "course", style: "video" },
            { name: "MIT OpenCourseWare: Linear Algebra (Gilbert Strang)", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", type: "course", style: "video" }
        ],
        "data-manipulation": [
            { name: "Pandas Documentation", url: "https://pandas.pydata.org/docs/", type: "article", style: "reading" },
            { name: "Pandas Tutorial (Corey Schafer YouTube)", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTsN5UeFVw2APh5bQAthD_x8", type: "video", style: "video" }
        ],
        "data-viz": [
            { name: "Matplotlib Documentation", url: "https://matplotlib.org/stable/contents.html", type: "article", style: "reading" },
            { name: "Seaborn Documentation", url: "https://seaborn.pydata.org/", type: "article", style: "reading" },
            { name: "Data Visualization with Python (freeCodeCamp.org)", url: "https://www.youtube.com/watch?v=x-A_0jJg20Y", type: "video", style: "video" }
        ],
        "ml-basics": [
            { name: "Scikit-learn Documentation", url: "https://scikit-learn.org/stable/", type: "article", style: "reading" },
            { name: "Coursera: Machine Learning (Stanford University)", url: "https://www.coursera.org/learn/machine-learning", type: "course", style: "video" },
            { name: "Machine Learning Crash Course (Google Developers)", url: "https://developers.google.com/machine-learning/crash-course", type: "course", style: "reading" }
        ],
        "deep-learning": [
            { name: "Deep Learning Book (Goodfellow, Bengio, Courville)", url: "https://www.deeplearningbook.org/", type: "article", style: "reading" },
            { name: "Deep Learning Specialization (Coursera by Andrew Ng)", url: "https://www.coursera.org/specializations/deep-learning", type: "course", style: "video" }
        ],
        "marketing-fundamentals": [
            { name: "HubSpot: Inbound Marketing Certification", url: "https://academy.hubspot.com/courses/inbound-marketing", type: "course", style: "reading" },
            { name: "The Ultimate Guide to Digital Marketing (Neil Patel)", url: "https://neilpatel.com/blog/digital-marketing-guide/", type: "article", style: "reading" }
        ],
        "seo-basics": [
            { name: "Moz: The Beginner's Guide to SEO", url: "https://moz.com/beginners-guide-to-seo", type: "article", style: "reading" },
            { name: "Google SEO Starter Guide", url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide", type: "article", style: "reading" }
        ],
        "sem-intro": [
            { name: "Google Ads Help", url: "https://support.google.com/google-ads/", type: "article", style: "reading" },
            { name: "Google Ads Tutorial for Beginners (YouTube)", url: "https://www.youtube.com/watch?v=a_j0_y_y_y_y", type: "video", style: "video" }
        ],
        "social-media-strategy": [
            { name: "Hootsuite Blog: Social Media Marketing", url: "https://blog.hootsuite.com/social-media-marketing/", type: "article", style: "reading" },
            { name: "Social Media Marketing Course (HubSpot)", url: "https://academy.hubspot.com/courses/social-media", type: "course", style: "reading" }
        ],
        "content-marketing": [
            { name: "Content Marketing Institute", url: "https://contentmarketinginstitute.com/", type: "article", style: "reading" },
            { name: "Content Marketing Strategy (HubSpot)", url: "https://blog.hubspot.com/marketing/content-marketing-strategy", type: "article", style: "reading" }
        ],
        "email-marketing": [
            { name: "Mailchimp: Email Marketing Guide", url: "https://mailchimp.com/marketing-glossary/email-marketing/", type: "article", style: "reading" },
            { name: "Email Marketing Tutorial for Beginners (YouTube)", url: "https://www.youtube.com/watch?v=y_y_y_y_y_y", type: "video", style: "video" }
        ],
        "analytics-tracking": [
            { name: "Google Analytics Help", url: "https://support.google.com/analytics/", type: "article", style: "reading" },
            { name: "Google Analytics for Beginners (Google Analytics Academy)", url: "https://analytics.google.com/analytics/academy/course/6", type: "course", style: "reading" }
        ]
        // Add more resources here, categorized by topic ID
    };

    // --- Functions ---
    function displayMessage(message, type) {
        messageArea.textContent = message;
        messageArea.className = `message-area ${type}`;
        messageArea.style.display = 'block';
        setTimeout(() => {
            messageArea.style.display = 'none';
        }, 5000); // Hide message after 5 seconds
    }

    function generateLearningPath(goalKey) {
        const goal = learningGoalsData[goalKey];
        if (!goal) {
            displayMessage("Sorry, I don't have a predefined path for that goal yet.", "error");
            return;
        }

        currentGoalDisplay.textContent = goal.name;
        learningPathList.innerHTML = ''; // Clear previous path
        learningPathSection.style.display = 'block'; // Show the section

        // Initialize currentLearningPath
        currentLearningPath = {
            goalId: goalKey,
            customName: goal.name, // Default to predefined name
            steps: goal.defaultPath.map(step => ({
                id: step.id,
                name: step.name,
                completed: false,
                notes: '',
                resources: resourcesData[step.id] || []
            }))
        };

        renderLearningPath(currentLearningPath);
        savePathToLocalStorage();
        displayMessage("Learning path generated successfully!", "success");
    }

    function renderLearningPath(path) {
        currentGoalDisplay.textContent = path.customName;
        learningPathList.innerHTML = '';
        learningPathSection.style.display = 'block';

        path.steps.forEach(step => {
            const listItem = document.createElement('li');
            listItem.classList.toggle('completed', step.completed);
            listItem.innerHTML = `
                <span class="step-name">${step.name}</span>
                <input type="checkbox" data-step-id="${step.id}" ${step.completed ? 'checked' : ''}>
            `;

            if (step.resources && step.resources.length > 0) {
                const resourcesUl = document.createElement('ul');
                resourcesUl.className = 'resources-list';
                // Filter resources based on selected learning style
                const filteredResources = step.resources.filter(resource => {
                    return !selectedLearningStyle || !resource.style || resource.style === selectedLearningStyle;
                });

                filteredResources.forEach(resource => {
                    const resourceLi = document.createElement('li');
                    resourceLi.classList.add(`resource-type-${resource.type}`);
                    resourceLi.innerHTML = `<a href="${resource.url}" target="_blank"><span class="resource-icon"></span>${resource.name} (${resource.type})</a>`;
                    resourcesUl.appendChild(resourceLi);
                });
                listItem.appendChild(resourcesUl);
            }

            learningPathList.appendChild(listItem);
        });
        updateProgressBar();
    }

    function savePathToLocalStorage() {
        if (currentLearningPath) {
            localStorage.setItem('learnFlowPath', JSON.stringify(currentLearningPath));
        }
    }

    function updateProgressBar() {
        const checkboxes = learningPathList.querySelectorAll('input[type="checkbox"]');
        let completedCount = 0;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                completedCount++;
                checkbox.closest('li').classList.add('completed');
            } else {
                checkbox.closest('li').classList.remove('completed');
            }
        });

        const progress = (completedCount / checkboxes.length) * 100;
        overallProgressBar.style.width = `${progress || 0}%`;
        savePathToLocalStorage();
    }

    function loadPathFromLocalStorage() {
        const savedPath = localStorage.getItem('learnFlowPath');
        if (savedPath) {
            currentLearningPath = JSON.parse(savedPath);
            renderLearningPath(currentLearningPath);
        }
    }

    // --- Event Listeners ---
    learningStyleRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            selectedLearningStyle = event.target.value;
            // Re-render the path to apply the new filter if a path is active
            if (currentLearningPath) {
                renderLearningPath(currentLearningPath);
            }
        });
    });

    generatePathButton.addEventListener('click', () => {
        const input = learningGoalInput.value.trim().toLowerCase();

        if (input === '') {
            displayMessage("Please enter a learning goal.", "error");
            return;
        }

        // Simple mapping for now, can be expanded with more robust matching
        if (input.includes("web dev") || input.includes("web development")) {
            generateLearningPath("web-development");
            displayMessage("Learning path generated for Web Development!", "success");
        } else if (input.includes("data science") || input.includes("ds")) {
            generateLearningPath("data-science");
            displayMessage("Learning path generated for Data Science!", "success");
        } else if (input.includes("digital marketing") || input.includes("dm")) {
            generateLearningPath("digital-marketing");
            displayMessage("Learning path generated for Digital Marketing!", "success");
        } else {
            displayMessage("Sorry, I don't have a predefined path for that goal yet. Please try one of these: Web Development, Data Science, or Digital Marketing.", "error");
        }
    });

    learningPathList.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            const stepId = event.target.dataset.stepId;
            const stepIndex = currentLearningPath.steps.findIndex(step => step.id === stepId);
            if (stepIndex !== -1) {
                currentLearningPath.steps[stepIndex].completed = event.target.checked;
            }
            updateProgressBar();
        }
    });

    // Load path on initial load
    loadPathFromLocalStorage();
});