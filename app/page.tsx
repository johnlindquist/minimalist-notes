"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Tag, Trash2, Eye, Edit3 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";

interface Note {
	id: string;
	title: string;
	content: string;
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}

export default function MarkdownNotesApp() {
	const [notes, setNotes] = useState<Note[]>([]);
	const [selectedNote, setSelectedNote] = useState<Note | null>(null);
	const [isPreviewMode, setIsPreviewMode] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [newTag, setNewTag] = useState("");
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

	// Initialize with sample notes
	useEffect(() => {
		const sampleNotes: Note[] = [
			{
				id: "1",
				title: "Welcome to Markdown Notes",
				content:
					"# Welcome to Markdown Notes\n\nThis is a **minimalist** markdown notes app. You can:\n\n- Write in *markdown*\n- Organize with tags\n- Switch between edit and preview modes\n\n## Features\n\n- Clean, distraction-free interface\n- Live markdown preview\n- Tag-based organization\n- Search functionality\n\n> Start writing your thoughts!",
				tags: ["welcome", "tutorial"],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: "2",
				title: "Quick Notes",
				content:
					"## Daily Tasks\n\n- [ ] Review project requirements\n- [x] Update documentation\n- [ ] Plan next sprint\n\n### Ideas\n\n- Implement dark mode\n- Add export functionality\n- Cloud sync feature",
				tags: ["tasks", "ideas"],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];
		setNotes(sampleNotes);
		setSelectedNote(sampleNotes[0]);
	}, []);

	const createNewNote = () => {
		const newNote: Note = {
			id: Date.now().toString(),
			title: "Untitled Note",
			content: "# New Note\n\nStart writing...",
			tags: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		setNotes([newNote, ...notes]);
		setSelectedNote(newNote);
		setIsPreviewMode(false);
	};

	const updateNote = (updates: Partial<Note>) => {
		if (!selectedNote) return;

		const updatedNote = {
			...selectedNote,
			...updates,
			updatedAt: new Date(),
		};

		setNotes(
			notes.map((note) => (note.id === selectedNote.id ? updatedNote : note)),
		);
		setSelectedNote(updatedNote);
	};

	const openDeleteDialog = (note: Note) => {
		setNoteToDelete(note);
		setIsDeleteDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!noteToDelete) return;

		setNotes(notes.filter((note) => note.id !== noteToDelete.id));
		if (selectedNote?.id === noteToDelete.id) {
			const newSelectedNote =
				notes.find((note) => note.id !== noteToDelete.id && notes.length > 1) ||
				null;
			setSelectedNote(newSelectedNote);
		}
		setNoteToDelete(null);
		setIsDeleteDialogOpen(false);
	};

	const addTag = () => {
		if (!selectedNote || !newTag.trim()) return;

		const tag = newTag.trim().toLowerCase();
		if (!selectedNote.tags.includes(tag)) {
			updateNote({ tags: [...selectedNote.tags, tag] });
		}
		setNewTag("");
	};

	const removeTag = (tagToRemove: string) => {
		if (!selectedNote) return;
		updateNote({
			tags: selectedNote.tags.filter((tag) => tag !== tagToRemove),
		});
	};

	const getAllTags = () => {
		const allTags = notes.flatMap((note) => note.tags);
		return [...new Set(allTags)];
	};

	const filteredNotes = notes.filter((note) => {
		const matchesSearch =
			note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			note.content.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesTags =
			selectedTags.length === 0 ||
			selectedTags.some((tag) => note.tags.includes(tag));
		return matchesSearch && matchesTags;
	});

	const toggleTagFilter = (tag: string) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
		);
	};

	return (
		<div className="flex h-screen bg-background">
			{/* Sidebar */}
			<div className="w-80 border-r bg-muted/30 flex flex-col">
				{/* Header */}
				<div className="p-4 border-b">
					<div className="flex items-center justify-between mb-4">
						<h1 className="text-xl font-semibold">Notes</h1>
						<Button onClick={createNewNote} size="sm">
							<Plus className="w-4 h-4" />
						</Button>
					</div>

					{/* Search */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search notes..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>
				</div>

				{/* Tag Filters */}
				<div className="p-4 border-b">
					<div className="flex items-center gap-2 mb-2">
						<Tag className="w-4 h-4 text-muted-foreground" />
						<span className="text-sm font-medium">Tags</span>
					</div>
					<div className="flex flex-wrap gap-1">
						{getAllTags().map((tag) => (
							<Badge
								key={tag}
								variant={selectedTags.includes(tag) ? "default" : "secondary"}
								className="cursor-pointer text-xs"
								onClick={() => toggleTagFilter(tag)}
							>
								{tag}
							</Badge>
						))}
					</div>
				</div>

				{/* Notes List */}
				<ScrollArea className="flex-1">
					<div className="p-2">
						{filteredNotes.map((note) => (
							<Card
								key={note.id}
								className={`p-3 mb-2 cursor-pointer transition-colors hover:bg-muted/50 ${
									selectedNote?.id === note.id ? "bg-muted border-primary" : ""
								}`}
								onClick={() => setSelectedNote(note)}
							>
								<div className="flex items-start justify-between group">
									<div className="flex-1 min-w-0">
										<h3 className="font-medium text-sm truncate">
											{note.title}
										</h3>
										<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
											{note.content.replace(/[#*`]/g, "").substring(0, 100)}...
										</p>
										<div className="flex flex-wrap gap-1 mt-2">
											{note.tags.slice(0, 3).map((tag) => (
												<Badge key={tag} variant="outline" className="text-xs">
													{tag}
												</Badge>
											))}
											{note.tags.length > 3 && (
												<Badge variant="outline" className="text-xs">
													+{note.tags.length - 3}
												</Badge>
											)}
										</div>
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={(e) => {
											e.stopPropagation();
											openDeleteDialog(note);
										}}
										className="opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<Trash2 className="w-3 h-3" />
									</Button>
								</div>
							</Card>
						))}
					</div>
				</ScrollArea>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{selectedNote ? (
					<>
						{/* Editor Header */}
						<div className="p-4 border-b">
							<div className="flex items-center justify-between mb-4">
								<Input
									value={selectedNote.title}
									onChange={(e) => updateNote({ title: e.target.value })}
									className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0"
									placeholder="Note title..."
								/>
								<div className="flex items-center gap-2">
									<Button
										variant={isPreviewMode ? "outline" : "default"}
										size="sm"
										onClick={() => setIsPreviewMode(false)}
									>
										<Edit3 className="w-4 h-4" />
									</Button>
									<Button
										variant={isPreviewMode ? "default" : "outline"}
										size="sm"
										onClick={() => setIsPreviewMode(true)}
									>
										<Eye className="w-4 h-4" />
									</Button>
								</div>
							</div>

							{/* Tags Management */}
							<div className="flex items-center gap-2 flex-wrap">
								{selectedNote.tags.map((tag) => (
									<Badge key={tag} variant="secondary" className="text-xs">
										{tag}
										<button
											onClick={() => removeTag(tag)}
											className="ml-1 hover:text-destructive"
										>
											×
										</button>
									</Badge>
								))}
								<div className="flex items-center gap-1">
									<Input
										placeholder="Add tag..."
										value={newTag}
										onChange={(e) => setNewTag(e.target.value)}
										onKeyDown={(e) => e.key === "Enter" && addTag()}
										className="h-6 text-xs w-20"
									/>
									<Button
										onClick={addTag}
										size="sm"
										variant="ghost"
										className="h-6 px-2"
									>
										<Plus className="w-3 h-3" />
									</Button>
								</div>
							</div>
						</div>

						{/* Editor/Preview Content */}
						<div className="flex-1 overflow-hidden">
							{isPreviewMode ? (
								<ScrollArea className="h-full">
									<div className="p-6 max-w-4xl mx-auto">
										<ReactMarkdown
											className="prose prose-neutral dark:prose-invert max-w-none"
											components={{
												h1: ({ children }) => (
													<h1 className="text-3xl font-bold mb-4">
														{children}
													</h1>
												),
												h2: ({ children }) => (
													<h2 className="text-2xl font-semibold mb-3 mt-6">
														{children}
													</h2>
												),
												h3: ({ children }) => (
													<h3 className="text-xl font-medium mb-2 mt-4">
														{children}
													</h3>
												),
												p: ({ children }) => (
													<p className="mb-4 leading-relaxed">{children}</p>
												),
												ul: ({ children }) => (
													<ul className="mb-4 pl-6 space-y-1">{children}</ul>
												),
												ol: ({ children }) => (
													<ol className="mb-4 pl-6 space-y-1">{children}</ol>
												),
												li: ({ children }) => (
													<li className="list-disc">{children}</li>
												),
												blockquote: ({ children }) => (
													<blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4">
														{children}
													</blockquote>
												),
												code: ({ children }) => (
													<code className="bg-muted px-1 py-0.5 rounded text-sm">
														{children}
													</code>
												),
												pre: ({ children }) => (
													<pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
														{children}
													</pre>
												),
											}}
										>
											{selectedNote.content}
										</ReactMarkdown>
									</div>
								</ScrollArea>
							) : (
								<Textarea
									value={selectedNote.content}
									onChange={(e) => updateNote({ content: e.target.value })}
									placeholder="Start writing in markdown..."
									className="h-full resize-none border-none focus-visible:ring-0 p-6 font-mono text-sm leading-relaxed"
								/>
							)}
						</div>
					</>
				) : (
					<div className="flex-1 flex items-center justify-center text-muted-foreground">
						<div className="text-center">
							<Edit3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
							<p className="text-lg mb-2">No note selected</p>
							<p className="text-sm">
								Choose a note from the sidebar or create a new one
							</p>
						</div>
					</div>
				)}
			</div>
			{/* Conditionally render DeleteConfirmationDialog */}
			{noteToDelete && (
				<DeleteConfirmationDialog
					isOpen={isDeleteDialogOpen}
					onClose={() => {
						setIsDeleteDialogOpen(false);
						setNoteToDelete(null);
					}}
					onConfirm={handleConfirmDelete}
					noteTitle={noteToDelete.title}
				/>
			)}
		</div>
	);
}
