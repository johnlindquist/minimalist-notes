/**
 * @jest-environment node
 */
import { POST, GET, notes as notesStore } from './route';
import { NextRequest } from 'next/server';
import { randomUUID as mockRandomUUID } from 'crypto';

// Mock crypto.randomUUID to ensure predictable IDs in tests
jest.mock('crypto', () => ({
    ...jest.requireActual('crypto'),
    randomUUID: jest.fn(),
}));

// Helper to create a mock NextRequest
const createMockRequest = (body?: any, method: string = 'POST', url: string = 'http://localhost/api/notes'): NextRequest => {
    const requestOptions: any = { method };
    if (body) {
        requestOptions.body = JSON.stringify(body);
        requestOptions.headers = { 'Content-Type': 'application/json' };
    }
    return new NextRequest(url, requestOptions) as NextRequest;
};

describe('API /api/notes', () => {
    beforeEach(() => {
        notesStore.length = 0;
        (mockRandomUUID as jest.Mock).mockClear();
        (mockRandomUUID as jest.Mock).mockReturnValue('test-uuid-123');
    });

    describe('POST /api/notes', () => {
        it('should create a note successfully and return 201', async () => {
            const req = createMockRequest({ content: 'My first test note' });
            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.id).toBe('test-uuid-123');
            expect(data.content).toBe('My first test note');
            expect(data.createdAt).toBeDefined();
            expect(notesStore.length).toBe(1);
            expect(notesStore[0].content).toBe('My first test note');
        });

        it('should return 400 if content is missing', async () => {
            const req = createMockRequest({});
            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Content is required');
            expect(notesStore.length).toBe(0);
        });

        it('should return 400 if content is an empty string', async () => {
            const req = createMockRequest({ content: '' });
            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Content is required');
            expect(notesStore.length).toBe(0);
        });

        it('should return 400 if request body is not valid JSON', async () => {
            const req = new NextRequest('http://localhost/api/notes', {
                method: 'POST',
                body: 'not a valid json string',
                headers: { 'Content-Type': 'application/json' },
            }) as NextRequest;
            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Invalid JSON in request body');
            expect(notesStore.length).toBe(0);
        });
    });

    describe('GET /api/notes', () => {
        it('should return an empty array initially when no notes exist', async () => {
            const req = createMockRequest(undefined, 'GET');
            const response = await GET(req);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual([]);
        });

        it('should return notes after they are created', async () => {
            await POST(createMockRequest({ content: 'Note 1 for GET test' }));

            const req = createMockRequest(undefined, 'GET');
            const response = await GET(req);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(1);
            expect(data[0].content).toBe('Note 1 for GET test');
            expect(data[0].id).toBe('test-uuid-123');
        });

        it('should return multiple notes correctly', async () => {
            (mockRandomUUID as jest.Mock)
                .mockReturnValueOnce('uuid-get-multi-1')
                .mockReturnValueOnce('uuid-get-multi-2');

            await POST(createMockRequest({ content: 'Multi-note 1' }));
            await POST(createMockRequest({ content: 'Multi-note 2' }));

            const req = createMockRequest(undefined, 'GET');
            const response = await GET(req);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(2);
            const note1 = data.find(note => note.content === 'Multi-note 1');
            const note2 = data.find(note => note.content === 'Multi-note 2');
            expect(note1).toBeDefined();
            expect(note2).toBeDefined();
            expect(note1.id).toBe('uuid-get-multi-1');
            expect(note2.id).toBe('uuid-get-multi-2');
        });
    });
}); 