import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

interface Note {
    id: string;
    content: string;
    createdAt: Date;
}

// In-memory store for notes - export for testing
export const notes: Note[] = [];

export async function POST(request: NextRequest) {
    console.log("Received POST request to /api/notes");
    try {
        const body = await request.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const newNote: Note = {
            id: randomUUID(),
            content,
            createdAt: new Date(),
        };

        notes.push(newNote);
        console.log("Note created:", newNote);
        return NextResponse.json(newNote, { status: 201 });
    } catch (error) {
        console.error("Error processing POST request:", error);
        // Check if the error is due to invalid JSON body by its name
        if (error && typeof error === 'object' && (error as Error).name === 'SyntaxError') {
            return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    console.log("Received GET request to /api/notes");
    try {
        console.log(`Returning ${notes.length} notes`);
        return NextResponse.json(notes, { status: 200 });
    } catch (error) {
        console.error("Error processing GET request:", error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}