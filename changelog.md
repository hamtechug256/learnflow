# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Initial project setup for "LearnFlow: Your Personalized Skill Navigator".
- Created `index.html` with basic UI for goal input and path display.
- Created `style.css` with modern and responsive styling.
- Created `script.js` with core logic for:
    - Pre-defined learning goals and resources data structures.
    - Generating and displaying learning paths based on user input.
    - Basic progress tracking with checkboxes and a progress bar.
- Added UI for learning style selection in `index.html`.
- Added a message area in `index.html` for user feedback.
- Initialized Node.js project in the root directory (`package.json`).
- Installed `node-fetch` and `dotenv` for Netlify Function.
- Created `netlify/functions` directory structure.
- Implemented `netlify/functions/generatePath.js` for AI-powered path generation using Gemini API.

### Changed
- Refactored path generation and rendering logic in `script.js` to use a `currentLearningPath` object.
- Implemented local storage persistence in `script.js` to save and load the user's learning path.
- Enhanced resource display in `script.js` and `style.css` with icons based on resource type.
- Implemented learning style filtering in `script.js` to display resources relevant to the selected style.
- Integrated user feedback messages (success/error) in `script.js` and `style.css`.
- Added basic input validation for the learning goal input in `script.js`.
- Modified `script.js` to call the Netlify Function for path generation instead of using local predefined data.
- Removed local `learningGoalsData` and `resourcesData` from `script.js` as data now comes from AI.
