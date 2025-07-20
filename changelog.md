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

### Changed
- Refactored path generation and rendering logic in `script.js` to use a `currentLearningPath` object.
- Implemented local storage persistence in `script.js` to save and load the user's learning path.
- Enhanced resource display in `script.js` and `style.css` with icons based on resource type.
- Implemented learning style filtering in `script.js` to display resources relevant to the selected style.
- Integrated user feedback messages (success/error) in `script.js` and `style.css`.
- Added basic input validation for the learning goal input in `script.js`.
- Reverted from AI-powered path generation to local JavaScript data structures due to API integration challenges.
- Removed Netlify Function related files and configurations.
- Significantly expanded `resourcesData` in `script.js` with a much larger and more diverse set of resource paths for each learning topic.
- Improved accessibility in `index.html` by adding ARIA attributes and `sr-only` class for screen readers.
- Added `sr-only` CSS class in `style.css`.

### Fixed
- Resolved Netlify build error by adding `@google/generative-ai` to `package.json` dependencies.
