# Requirements Document

## Introduction

Life Dashboard is a personal productivity web app built with pure HTML5, CSS3, and Vanilla JavaScript — no frameworks, no backend. It runs entirely in the browser and uses LocalStorage for data persistence. The app gives users a single-page view of their day: a real-time clock and personalised greeting, a Pomodoro focus timer, a to-do list, and a quick-access link grid. Three optional challenges are also implemented: light/dark mode, a custom name in the greeting, and duplicate-task prevention.

The project is a submission for Coding Camp Software Engineering Batch 18 May 2026 by Ahmad Romadhon. It must run without a build step — opening `index.html` in any modern browser is sufficient.

---

## Glossary

- **Dashboard**: The single-page web application described in this document.
- **Clock**: The real-time HH:MM:SS display in the header.
- **Greeting**: The time-of-day salutation shown in the header (e.g. "Good Morning, Ahmad! 👋").
- **Focus_Timer**: The 25-minute countdown timer implementing the Pomodoro technique.
- **Todo_List**: The task management component supporting create, read, update, delete, and done-toggle operations.
- **Quick_Links**: The grid of user-defined shortcut links to external websites.
- **Theme_Toggle**: The button that switches the UI between light mode and dark mode.
- **LocalStorage**: The browser's `localStorage` API used for all client-side persistence.
- **Validator**: The logic that checks user input before it is accepted (tasks, links, names).
- **Favicon_Loader**: The component that fetches a website's favicon via Google's favicon service.
- **Progress_Bar**: The horizontal bar beneath the Focus_Timer that visualises elapsed time.
- **Session**: A single 25-minute Focus_Timer run from Start to completion or Reset.

---

## Requirements

### Requirement 1: Real-Time Clock and Date Display

**User Story:** As a user, I want to see the current time and date at a glance, so that I always know what time it is without leaving the Dashboard.

#### Acceptance Criteria

1. THE Clock SHALL display the current local time in `HH:MM:SS` format on page load and on every subsequent tick, where HH is zero-padded hours (00–23), MM is zero-padded minutes (00–59), and SS is zero-padded seconds (00–59).
2. WHEN one second elapses, THE Clock SHALL update its displayed time without requiring a page reload.
3. THE Dashboard SHALL display the current date in the format `DayName, D Month YYYY` on page load and on every subsequent tick, where DayName is the full English day name, D is the numeric day without leading zero, Month is the full English month name, and YYYY is the four-digit year.
4. WHEN the date changes at midnight, THE Dashboard SHALL update the displayed date on the next Clock tick.

---

### Requirement 2: Dynamic Greeting Based on Time of Day

**User Story:** As a user, I want the greeting to reflect the time of day, so that the Dashboard feels contextually relevant throughout the day.

#### Acceptance Criteria

1. WHEN the local hour is between 05:00 (inclusive) and 11:00 (exclusive), THE Greeting SHALL display "Good Morning".
2. WHEN the local hour is between 11:00 (inclusive) and 15:00 (exclusive), THE Greeting SHALL display "Good Afternoon".
3. WHEN the local hour is between 15:00 (inclusive) and 18:00 (exclusive), THE Greeting SHALL display "Good Evening".
4. WHEN the local hour is between 18:00 (inclusive) and 05:00 (exclusive, wrapping midnight), THE Greeting SHALL display "Good Night".
5. WHEN the Clock tick fires, THE Greeting SHALL re-evaluate the current local hour and update the salutation phrase to match the applicable time-of-day range, where the Clock tick interval is 1 second, so that the phrase changes within 1 second of an hour boundary being crossed.

---

### Requirement 3: Custom Name in Greeting

**User Story:** As a user, I want to enter my name once and see it in the greeting, so that the Dashboard feels personal.

#### Acceptance Criteria

1. WHEN no name has been saved, THE Dashboard SHALL display a text input and a "Save Name" button so the user can enter their name.
2. WHEN the user submits a non-empty name via the "Save Name" button or the Enter key, THE Greeting SHALL update within 100 milliseconds to include the name in the format `{Salutation}, {Name}! 👋`, where `{Salutation}` is the applicable time-of-day phrase (Good Morning 05:00–10:59, Good Afternoon 11:00–14:59, Good Evening 15:00–17:59, Good Night 18:00–04:59).
3. WHEN the user submits a non-empty name, THE Dashboard SHALL hide the name input form and show an "Edit Name" button.
4. WHEN the user clicks "Edit Name", THE Dashboard SHALL show the name input form pre-filled with the saved name and hide the "Edit Name" button.
5. THE Dashboard SHALL persist the saved name to LocalStorage under the key `userName` so that the name survives a page reload.
6. WHEN the page loads and a name is found in LocalStorage, THE Greeting SHALL display the saved name without requiring the user to re-enter it.
7. IF the user submits a name that is empty or contains only whitespace characters, THEN THE Dashboard SHALL ignore the submission and keep the current state unchanged.
8. IF the user enters a name longer than 30 characters, THEN THE Dashboard SHALL prevent input beyond 30 characters via the `maxlength` attribute on the name input field.

---

### Requirement 4: Light / Dark Mode

**User Story:** As a user, I want to switch between light and dark themes, so that I can use the Dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL render in light mode by default when no theme preference has been saved.
2. WHEN the user clicks the Theme_Toggle button, THE Dashboard SHALL switch from light mode to dark mode, or from dark mode to light mode.
3. WHEN dark mode is active, THE Theme_Toggle SHALL display the label "Light Mode" and a sun icon (☀️).
4. WHEN light mode is active, THE Theme_Toggle SHALL display the label "Dark Mode" and a moon icon (🌙).
5. WHEN the user clicks the Theme_Toggle button, THE Dashboard SHALL persist the newly active theme to LocalStorage under the key `theme` so that the preference survives a page reload.
6. WHEN the page loads and a `theme` value of `"light"` or `"dark"` is found in LocalStorage, THE Dashboard SHALL apply that theme synchronously before the first paint so that no flash of the wrong theme is visible.
7. THE Theme_Toggle SHALL set the `aria-pressed` attribute to `"true"` when dark mode is active and `"false"` when light mode is active.
8. IF the value stored under `theme` in LocalStorage is neither `"light"` nor `"dark"`, or if LocalStorage is unavailable, THEN THE Dashboard SHALL fall back to light mode without throwing an error.

---

### Requirement 5: Focus Timer (Pomodoro)

**User Story:** As a user, I want a 25-minute countdown timer with Start, Pause, and Reset controls, so that I can structure my work into focused sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialise at 25 minutes (1500 seconds) and display `25:00` on page load.
2. WHEN the user clicks "Start" and the Focus_Timer is not already running, THE Focus_Timer SHALL begin counting down one second per second and disable the Start button while running.
3. WHEN the user clicks "Pause" WHILE the Focus_Timer is running, THE Focus_Timer SHALL stop the countdown, re-enable the Start button, and disable the Pause button.
4. WHEN the user clicks "Start" after a Pause, THE Focus_Timer SHALL resume the countdown from the paused time.
5. WHEN the user clicks "Reset", THE Focus_Timer SHALL stop any running or paused countdown, return the display to `25:00`, re-enable the Start button, and disable the Pause button.
6. WHEN the countdown reaches `00:00`, THE Focus_Timer SHALL stop the interval, re-enable the Start button, disable the Pause button, display an alert notifying the user that the session is complete, and then reset the display to `25:00`.
7. THE Focus_Timer SHALL display the remaining time in `MM:SS` format, where MM and SS are zero-padded.
8. THE Progress_Bar SHALL reflect elapsed time as a percentage of 1500 seconds, where width 0% corresponds to 0 elapsed seconds and width 100% corresponds to 1500 elapsed seconds.
9. WHILE the Focus_Timer is running, THE Progress_Bar SHALL update its width on each one-second tick.
10. THE Focus_Timer SHALL set the `aria-valuenow` attribute on the progress bar wrapper to the current elapsed percentage (rounded to the nearest integer) so that screen readers can announce progress.

---

### Requirement 6: To-Do List — Create and Read

**User Story:** As a user, I want to add tasks and see them listed, so that I can track what needs to be done.

#### Acceptance Criteria

1. THE Todo_List SHALL provide a text input (max 100 characters) and an "Add" button for entering new tasks.
2. WHEN the user submits a non-empty, non-whitespace-only task via the "Add" button or the Enter key, THE Todo_List SHALL append the task to the list and clear the input field.
3. THE Todo_List SHALL render each task as a list item containing a checkbox, the task text, an edit button, and a delete button.
4. THE Todo_List SHALL display a task count in the format `{done}/{total} done` where `done` is the count of tasks whose checkbox is checked and `total` is the total task count, or `0 tasks` when the list is empty.
5. IF the user submits an empty or whitespace-only task, THEN THE Validator SHALL display the error message "Please enter a task." and focus the input.

---

### Requirement 7: To-Do List — Update and Delete

**User Story:** As a user, I want to edit, complete, and delete tasks, so that I can keep my list accurate and up to date.

#### Acceptance Criteria

1. WHEN the user clicks the edit button on a task, THE Todo_List SHALL replace the task text with an inline text input (max 100 characters) pre-filled with the current task text.
2. WHEN the user confirms an edit via the Enter key or by moving focus away from the edit input, and the new text is non-empty and non-duplicate, THE Todo_List SHALL update the task text and return to the normal display.
3. WHEN the user presses Escape while editing, THE Todo_List SHALL cancel the edit and restore the original task text.
4. WHEN the user clicks the checkbox on a task, THE Todo_List SHALL toggle the task's done state, where done is defined as the checkbox being checked, and apply a strikethrough style to done tasks.
5. WHEN the user clicks the delete button on a task, THE Todo_List SHALL remove that task from the list.
6. WHEN the user clicks "Clear Done", THE Todo_List SHALL remove all tasks whose checkbox is checked.
7. IF the user confirms an edit with empty text or with text that duplicates a different existing task (case-insensitive), THEN THE Validator SHALL reject the edit, display an appropriate error message, and retain focus on the edit input.

---

### Requirement 8: Prevent Duplicate Tasks

**User Story:** As a user, I want the app to prevent me from adding the same task twice, so that my list stays clean and unambiguous.

#### Acceptance Criteria

1. WHEN the user attempts to add a task whose trimmed text matches the trimmed text of an existing task (case-insensitive), THE Validator SHALL reject the submission and display an error message indicating the task already exists.
2. WHEN the user attempts to save an edited task whose trimmed new text matches the trimmed text of a different existing task (case-insensitive), THE Validator SHALL reject the edit, display an error message indicating the task already exists, and retain the rejected text in the edit input field.
3. WHEN the user edits a task and saves it with the same trimmed text as the original (case-insensitive), THE Todo_List SHALL accept the edit without showing a duplicate error.
4. WHEN the user changes the value of the task input field, THE Todo_List SHALL clear any displayed error message on that input.

---

### Requirement 9: To-Do List Persistence

**User Story:** As a user, I want my tasks to be saved automatically, so that they are still there after I refresh or reopen the browser tab.

#### Acceptance Criteria

1. THE Todo_List SHALL persist the full tasks array — including each task's text, unique identifier, and completion status — to LocalStorage under the key `tasks` after every create, update, toggle, delete, or clear-done operation.
2. WHEN the page loads, THE Todo_List SHALL read the tasks array from LocalStorage and render all saved tasks before any user interaction is processed.
3. IF LocalStorage does not contain a `tasks` entry, THEN THE Todo_List SHALL initialise with an empty array and render an empty list.
4. IF the value stored under `tasks` in LocalStorage is malformed JSON, THEN THE Todo_List SHALL fall back to an empty array without throwing an error.
5. IF a LocalStorage write operation fails due to storage quota being exceeded or LocalStorage being unavailable, THEN THE Todo_List SHALL display an error message informing the user that the task could not be saved, and SHALL NOT silently discard the failure.

---

### Requirement 10: Quick Links — Add and Display

**User Story:** As a user, I want to add shortcut links to my favourite websites, so that I can open them with a single click from the Dashboard.

#### Acceptance Criteria

1. THE Quick_Links SHALL provide a name input (max 30 characters), a URL input (max 2048 characters), and an "Add" button for creating new links.
2. WHEN the user submits a non-empty name and a non-empty URL with a valid `http` or `https` scheme, THE Quick_Links SHALL add the link to the grid and clear both input fields.
3. IF the user submits an invalid name or URL, THEN THE Validator SHALL display an appropriate error message and reject the submission without clearing the input fields.
4. THE Quick_Links SHALL render each link as a card displaying the site's favicon and the link name.
5. WHEN the user clicks a link card, THE Quick_Links SHALL open the link's URL in a new browser tab.
6. THE Quick_Links SHALL open external links with `rel="noopener noreferrer"` to prevent tab-napping.
7. THE Favicon_Loader SHALL construct the favicon URL as `https://www.google.com/s2/favicons?domain={origin}&sz=64` where `{origin}` is the URL's origin.
8. IF the favicon image fails to load, THEN THE Favicon_Loader SHALL hide the broken image element without displaying a broken-image icon.
9. IF no saved links exist in LocalStorage, THEN THE Quick_Links SHALL pre-populate with three default links: GitHub (`https://github.com`), Google (`https://google.com`), and YouTube (`https://youtube.com`).
10. THE Quick_Links SHALL enforce a maximum of 20 saved links; IF the user attempts to add a link when 20 links already exist, THEN THE Validator SHALL reject the submission and display an error message indicating the limit has been reached.

---

### Requirement 11: Quick Links — URL Validation

**User Story:** As a user, I want the app to validate URLs before saving them, so that I don't accidentally add broken links.

#### Acceptance Criteria

1. IF the user submits a URL that does not begin with `http://` or `https://`, THEN THE Validator SHALL prepend `https://` to the URL and proceed to criterion 2 validation.
2. IF the resulting URL is not parseable by the browser's `URL` constructor, THEN THE Validator SHALL display the error message "Please enter a valid URL.", reject the submission, and preserve the user's original input in the URL field.
3. IF the user submits an empty name or an empty URL, THEN THE Validator SHALL display the error message "Please fill in both name and URL.", reject the submission, and preserve the content of both input fields.
4. WHEN the user changes the value of either the name or URL input, THE Quick_Links SHALL clear all displayed validation error messages.
5. IF the user submits a name longer than 30 characters or a URL longer than 2048 characters, THEN THE Validator SHALL reject the submission and display an error message indicating which field exceeds the allowed length.

---

### Requirement 12: Quick Links — Delete and Persistence

**User Story:** As a user, I want to remove links I no longer need and have my link list saved automatically, so that my Quick Links stay relevant across sessions.

#### Acceptance Criteria

1. WHEN the user hovers over a link card, THE Quick_Links SHALL reveal a delete button (✕) in the top-right corner of the card.
2. WHEN the user clicks the delete button on a link card, THE Quick_Links SHALL remove that link from the grid without navigating away from the page.
3. THE Quick_Links SHALL persist the full links array to LocalStorage under the key `quickLinks` after every add or delete operation.
4. WHEN the page loads, THE Quick_Links SHALL read the links array from LocalStorage and render all saved links.
5. IF LocalStorage does not contain a `quickLinks` entry, THEN THE Quick_Links SHALL initialise with the three default links: GitHub (`https://github.com`), Google (`https://google.com`), and YouTube (`https://youtube.com`).
6. WHEN the last link is deleted, THE Quick_Links SHALL render an empty grid state without reverting to the default links.
7. IF a LocalStorage write operation fails, THEN THE Quick_Links SHALL display an error message informing the user that the change could not be saved.

---

### Requirement 13: Accessibility

**User Story:** As a user who relies on keyboard navigation or a screen reader, I want the Dashboard to be fully operable without a mouse, so that I can use all features regardless of my input method.

#### Acceptance Criteria

1. WHEN the skip link (the first focusable element in the DOM) is activated, THE Dashboard SHALL move focus to the element with `id="main-content"` so that keyboard users can bypass the header.
2. THE Dashboard SHALL apply a visible focus indicator (2px solid blue outline) to every interactive element when it receives keyboard focus via the `:focus-visible` CSS pseudo-class.
3. THE Clock SHALL carry `aria-live="polite"` and `aria-atomic="true"` so that screen readers announce time updates without interrupting the user.
4. WHEN the Focus_Timer starts running, THE Focus_Timer SHALL set `aria-live="polite"` and `aria-atomic="true"` on the timer display so that screen readers can announce the countdown.
5. WHEN the Focus_Timer is stopped, THE Focus_Timer SHALL set `aria-live="off"` on the timer display to suppress unnecessary announcements.
6. WHEN the Focus_Timer is reset, THE Focus_Timer SHALL set `aria-live="off"` on the timer display to suppress unnecessary announcements.
7. THE Todo_List error message container SHALL carry `role="alert"` so that validation errors are announced immediately by screen readers.
8. THE Quick_Links error message container SHALL carry `role="alert"` so that validation errors are announced immediately by screen readers.
9. THE Dashboard SHALL provide visually-hidden `<label>` elements for all text inputs that do not have a visible label.
10. THE Todo_List SHALL set a descriptive `aria-label` on each checkbox (e.g. `Mark "{task}" as done`) and on each action button (e.g. `Edit task "{task}"`, `Delete task "{task}"`).
11. THE Quick_Links SHALL set a descriptive `aria-label` on each link card `<a>` element (e.g. `Open {name}`) and on each delete button (e.g. `Delete link "{name}"`).

---

### Requirement 14: Responsive Layout

**User Story:** As a user on a mobile device, I want the Dashboard to adapt to my screen size, so that all features are usable on small screens.

#### Acceptance Criteria

1. THE Dashboard SHALL use a single-column layout for all sections — Greeting, Clock, Focus_Timer, Todo_List, and Quick_Links — on viewports narrower than 768px, except where more specific breakpoint rules below take precedence.
2. WHEN the viewport is narrower than 768px, THE Dashboard SHALL stack all form input grids (name input, timer controls, task input, link input) into a single column.
3. WHEN the viewport is between 480px (inclusive) and 768px (exclusive), THE Quick_Links grid SHALL display a two-column layout.
4. WHEN the viewport is narrower than 480px, THE Quick_Links grid SHALL display exactly two columns.
5. WHEN the viewport is narrower than 480px, THE Theme_Toggle SHALL hide the text label and display only the icon.
6. THE Dashboard SHALL honour the `prefers-reduced-motion` media query by disabling CSS transitions and animations for users who have requested reduced motion.
7. THE Dashboard SHALL honour the `prefers-contrast: more` media query by increasing border widths to 2px on all interactive elements.

---

### Requirement 15: Technical Constraints

**User Story:** As the project assessor, I want the submission to comply with the course constraints, so that the project can be evaluated fairly.

#### Acceptance Criteria

1. THE Dashboard SHALL be implemented using only HTML5, CSS3, and Vanilla JavaScript — no JavaScript frameworks, libraries, preprocessors, or external scripts loaded via CDN, `import`, or any other mechanism.
2. THE Dashboard SHALL use exactly one CSS file located at `css/style.css`.
3. THE Dashboard SHALL use exactly one JavaScript file located at `js/script.js`.
4. THE Dashboard SHALL function correctly without a build step — opening `index.html` directly in a browser SHALL result in no uncaught JavaScript errors, all widgets rendering visibly, and all interactive controls responding to user input.
5. THE Dashboard SHALL function correctly in the latest stable release of Chrome, Firefox, Edge, and Safari at the time of submission.
6. THE Dashboard SHALL use the browser `localStorage` API as the sole persistence mechanism — no cookies, IndexedDB, or server-side storage.
7. THE Dashboard SHALL include the `.kiro` folder in the repository root so that the Kiro Builder ID is present in the submitted repository.
8. IF `localStorage` is unavailable (e.g. private browsing mode with storage blocked), THEN THE Dashboard SHALL degrade gracefully — all features SHALL remain functional for the current session without persisting data, and no uncaught errors SHALL be thrown.
