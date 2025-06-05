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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
    console.log("Received GET request to /api/notes");
    try {
        console.log(`Returning ${notes.length} notes`);
        return NextResponse.json(notes, { status: 200 });
    } catch (error) {
        console.error("Error processing GET request:", error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    console.log("Received DELETE request to /api/notes");
    try {
        const { searchParams } = new URL(request.url);
        const noteId = searchParams.get('id');

        if (!noteId) {
            console.log("Missing noteId for DELETE request");
            return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
        }

        const noteIndex = notes.findIndex(note => note.id === noteId);

        if (noteIndex === -1) {
            console.log(`Note with ID ${noteId} not found for DELETE request`);
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        const deletedNote = notes.splice(noteIndex, 1)[0];
        console.log("Note deleted:", deletedNote);
        return NextResponse.json({ message: 'Note deleted successfully', note: deletedNote }, { status: 200 }); // Or 204 if no content
    } catch (error) {
        console.error("Error processing DELETE request:", error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}