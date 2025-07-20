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

    // --- Functions ---
    function displayMessage(message, type) {
        messageArea.textContent = message;
        messageArea.className = `message-area ${type}`;
        messageArea.style.display = 'block';
        setTimeout(() => {
            messageArea.style.display = 'none';
        }, 5000); // Hide message after 5 seconds
    }

    async function generateLearningPath(goal) {
        displayMessage("Generating your personalized learning path...", "info");
        learningPathSection.style.display = 'none'; // Hide previous path

        try {
            const response = await fetch('/.netlify/functions/generatePath', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ goal }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch learning path.');
            }

            const aiGeneratedPath = await response.json();

            // Initialize currentLearningPath from AI response
            currentLearningPath = {
                goalId: goal.toLowerCase().replace(/\s/g, '-'), // Create a simple ID
                customName: goal,
                steps: aiGeneratedPath.map(step => ({
                    id: step.id,
                    name: step.name,
                    completed: false,
                    notes: '',
                    resources: step.resources || []
                }))
            };

            renderLearningPath(currentLearningPath);
            savePathToLocalStorage();
            displayMessage("Learning path generated successfully!", "success");
        } catch (error) {
            console.error("Error generating path:", error);
            displayMessage(`Error: ${error.message}. Please try again.`, "error");
        }
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
        const input = learningGoalInput.value.trim(); // No toLowerCase() here, send as is to AI

        if (input === '') {
            displayMessage("Please enter a learning goal.", "error");
            return;
        }

        generateLearningPath(input); // Call the async function
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