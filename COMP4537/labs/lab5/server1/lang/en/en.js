export const STRINGS = {
    // UI Labels
    TITLE: "Patient Database Management",
    INSERT_BUTTON: "Insert Default Patients",
    QUERY_HEADER: "Run SELECT Query",
    QUERY_PLACEHOLDER: "SELECT * FROM patient",
    SUBMIT_BUTTON: "Submit Query",

    // API & Feedback
    API_URL: "http://localhost:8888/COMP4537/labs/lab5/api/v1/sql",
    INSERT_SUCCESS: "Table verified and data inserted.",
    INSERT_ERROR: "Error inserting data: ",
    QUERY_ERROR: "Error executing query: ",

    // Data
    DEFAULT_PATIENTS: [
        { name: "Sara Brown", dateOfBirth: "1901-01-01" },
        { name: "John Smith", dateOfBirth: "1941-01-01" },
        { name: "Jack Ma", dateOfBirth: "1961-01-30" },
        { name: "Elon Musk", dateOfBirth: "1999-01-01" }
    ]
};