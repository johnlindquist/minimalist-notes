/**
 * @jest-environment node
 */
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock crypto.randomUUID to ensure predictable IDs in tests
jest.mock('crypto', () => ({
    ...jest.requireActual('crypto'),
    randomUUID: jest.fn(() => 'test-uuid-123'),
}));

// Helper to create a mock NextRequest
const createMockRequest = (body: any, method: string = 'POST'): NextRequest => {
    return new NextRequest('http://localhost/api/notes', {
        method,
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    }) as NextRequest;
};

describe('POST /api/notes', () => {
    // Clear mocks before each test to reset call counts, etc.
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset notes array before each test to ensure test isolation
        // This requires exporting and importing the notes array, or having a reset function.
        // For now, we acknowledge this limitation as the array is module-scoped in route.ts
        // and not easily resettable without modifying the main route file for testability.
    });

    it('should create a note successfully and return 201', async () => {
        const req = createMockRequest({ content: 'My first test note' });
        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.id).toBe('test-uuid-123');
        expect(data.content).toBe('My first test note');
        expect(data.createdAt).toBeDefined();
    });

    it('should return 400 if content is missing', async () => {
        const req = createMockRequest({}); // No content field
        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Content is required');
    });

    it('should return 400 if content is an empty string', async () => {
        const req = createMockRequest({ content: '' }); // Empty content string
        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Content is required');
    });

    it('should return 500 if request body is not valid JSON', async () => {
        const req = new NextRequest('http://localhost/api/notes', {
            method: 'POST',
            body: 'not json',
            headers: { 'Content-Type': 'application/json' },
        }) as NextRequest;
        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Error processing request');
    });
}); 