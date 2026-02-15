import { STRINGS } from '../lang/en/en.js';

class PatientManager {
    constructor() {
        // UI Elements
        this.h1 = document.querySelector('h1');
        this.insertBtn = document.getElementById('insertBtn');
        this.queryHeader = document.querySelector('h3');
        this.sqlTextArea = document.getElementById('sqlQuery');
        this.submitBtn = document.getElementById('submitQuery');
        this.responseDiv = document.getElementById('response');

        this.init();
    }

    init() {
        // Populate UI from en.js
        this.h1.textContent = STRINGS.TITLE;
        this.insertBtn.textContent = STRINGS.INSERT_BUTTON;
        this.queryHeader.textContent = STRINGS.QUERY_HEADER;
        this.sqlTextArea.placeholder = STRINGS.QUERY_PLACEHOLDER;
        this.submitBtn.textContent = STRINGS.SUBMIT_BUTTON;

        // Listeners
        this.insertBtn.addEventListener('click', () => this.insertPatients());
        this.submitBtn.addEventListener('click', () => this.submitQuery());
    }

    async insertPatients() {
        try {
            const response = await fetch(STRINGS.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(STRINGS.DEFAULT_PATIENTS)
            });
            const data = await response.text();
            this.displayResponse(data);
        } catch (error) {
            this.displayResponse(`${STRINGS.INSERT_ERROR}${error.message}`);
        }
    }

    async submitQuery() {
        const rawQuery = this.sqlTextArea.value;
        const encodedQuery = encodeURIComponent(rawQuery);
        const finalUrl = `${STRINGS.API_URL}/${encodedQuery}`;

        try {
            const response = await fetch(finalUrl, { method: 'GET' });
            const data = await response.text();
            this.displayResponse(data);
        } catch (error) {
            this.displayResponse(`${STRINGS.QUERY_ERROR}${error.message}`);
        }
    }

    displayResponse(message) {
        this.responseDiv.innerHTML = `<pre>${message}</pre>`;
    }
}

new PatientManager();