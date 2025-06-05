# Task: Create Simple Backend for First Note

<!-- TODO: [Project documentation (docs/ directory) not found. Planning based on general Next.js/TypeScript best practices. Key information needed: Preferred database, ORM, API style (e.g., REST, GraphQL), specific logging/testing libraries if any.] -->

## Commit 1: feat: initialize basic Next.js API route for notes [docs/tasks/2025-06-05-08-27-create-first-note-backend.md]
**Description:**
Create a new Next.js API route file `app/api/notes/route.ts`.
This route will initially handle POST requests to create a new note.
Define a simple TypeScript interface for a `Note` (e.g., `{ id: string, content: string, createdAt: Date }`).
The initial POST handler will accept a `content` field in the request body, generate an ID and timestamp, and return the created note object.
For now, data will be stored in-memory (e.g., a simple array).
Add basic console logging for request received and note creation.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `pnpm test --filter app/api/notes/route.test.ts` (File to be created in next commit)
    *   **Expected Outcome:** A new test file `app/api/notes/route.test.ts` will be set up. Initial tests will focus on the structure of the API route and basic non-functional aspects, as the actual logic with testing will be added in subsequent commits.
2.  **Logging Check:**
    *   **Action:** Send a POST request to `/api/notes` with `{"content": "My first note"}` using a tool like `curl` or Postman.
    *   **Expected Log:** Console logs showing "Received POST request to /api/notes" and "Note created: { id: ..., content: 'My first note', ... }".
    *   **Toggle Mechanism:** Basic `console.log`. (<!-- TODO: Implement configurable logging, e.g., using a simple environment variable like `LOG_LEVEL=debug` and a lightweight logger if project grows. -->)

---

## Commit 2: test: add unit tests for POST /api/notes endpoint [docs/tasks/2025-06-05-08-27-create-first-note-backend.md]
**Description:**
Create `app/api/notes/route.test.ts` using Jest (assuming Jest is or will be the project's test runner, as `tsconfig.json` implies a modern setup often paired with Jest or Vitest. If not, adapt to the chosen runner).
Write unit tests for the POST `/api/notes` handler:
    - Test successful note creation (status 201, correct response body structure).
    - Test validation: missing `content` in request body (status 400).
    - Test with empty `content` (status 400 or appropriate handling).
Update `app/api/notes/route.ts` to include basic input validation for the `content` field.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `pnpm test app/api/notes/route.test.ts`
    *   **Expected Outcome:** All tests pass, verifying successful creation and error handling for the POST endpoint. Test coverage for `app/api/notes/route.ts` significantly increases.
2.  **Logging Check:**
    *   **Action:** Run the test suite. Trigger validation errors by sending invalid POST requests.
    *   **Expected Log:** Console logs showing request details and error messages for invalid inputs, e.g., "Validation error: content is required".
    *   **Toggle Mechanism:** `console.log` or integrated with test runner output.

---

## Commit 3: feat: implement basic data persistence for notes (in-memory) [docs/tasks/2025-06-05-08-27-create-first-note-backend.md]
**Description:**
Modify `app/api/notes/route.ts` to store notes in a simple in-memory array within the module scope.
Implement a GET `/api/notes` handler to retrieve all stored notes.
Update the POST `/api/notes` handler to add new notes to this array.
Ensure IDs are unique (e.g., use `crypto.randomUUID()`).
Add logging for GET requests.

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `pnpm test app/api/notes/route.test.ts`
    *   **Expected Outcome:** Existing tests for POST pass. New tests for GET `/api/notes` pass, verifying that:
        - An empty array is returned initially.
        - After POSTing a note, GET returns an array containing that note.
        - Multiple notes can be created and retrieved.
2.  **Logging Check:**
    *   **Action:** 
        1. Send a GET request to `/api/notes`.
        2. Send a POST request to create a note.
        3. Send another GET request to `/api/notes`.
    *   **Expected Log:** 
        - "Received GET request to /api/notes"
        - "Returning X notes"
        - Logs from the POST request as per Commit 1.
    *   **Toggle Mechanism:** `console.log`.

---
## Commit 4: chore: add basic OpenAPI/Swagger documentation stub [docs/tasks/2025-06-05-08-27-create-first-note-backend.md]
**Description:**
Create a basic OpenAPI specification file, e.g., `docs/openapi/notes-api.yaml`.
Define the `/api/notes` path with GET and POST operations.
Specify request body for POST (Note content) and response schemas for both (Note object, array of Note objects).
This is a starting point for API documentation.
<!-- TODO: Integrate with a Swagger UI or a tool to generate interactive documentation if desired later. -->

**Verification:**
1.  **Automated Test(s):**
    *   **Command:** `npx @redocly/cli lint docs/openapi/notes-api.yaml` (or a similar OpenAPI linter). Assumes Redocly CLI is available or can be installed via npx.
    *   **Expected Outcome:** The OpenAPI file is valid.
2.  **Logging Check:**
    *   **Action:** Not directly applicable for documentation changes. Review the generated `notes-api.yaml` file manually.
    *   **Expected Log:** N/A.
    *   **Toggle Mechanism:** N/A. 