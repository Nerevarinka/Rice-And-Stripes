"use client";

import { useState, useMemo } from "react";

import { notes } from "@/shared/notes";
import { MediaItemTag, MediaItemTagColors } from "@/models";
import StickyNote from "@/components/stickyNote";

import "./styles.scss";

export default function NotesContainer() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<MediaItemTag[]>([]);

    const availableTags = useMemo(() => {
        const tagsSet = new Set<MediaItemTag>();

        notes.forEach(note => {
            note.tags.forEach(tag => tagsSet.add(tag));
        });

        return Array.from(tagsSet);
    }, []);

    const filteredNotes = useMemo(() => {
        let result = [...notes];

        // Сортировка по убыванию даты публикации
        result.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

        // Фильтрация по тегам
        if (selectedTags.length > 0) {
            result = result.filter(note =>
                selectedTags.some(tag => note.tags.includes(tag))
            );
        }

        // Фильтрация по поисковому запросу
        if (searchQuery.length >= 2) {
            const query = searchQuery.toLowerCase();
            result = result.filter(note => {
                const captionMatch = note.caption?.toLowerCase().includes(query) || false;
                const descriptionMatch = note.description.toLowerCase().includes(query);
                return captionMatch || descriptionMatch;
            });
        }

        return result;
    }, [searchQuery, selectedTags]);

    const handleTagClick = (tag: MediaItemTag, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    return (
        <section className="mx-4">
            <h2 className="title is-2">
                Заметки
            </h2>

            <SearchAndFilterPanel
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                availableTags={availableTags}
            />

            <div className="notes-grid py-4 pr-3 mt-2 pl-1">
                {filteredNotes.map(note =>
                    <StickyNote
                        key={note.link}
                        note={note}
                        onTagClick={handleTagClick}
                    />
                )}
            </div>

            {filteredNotes.length === 0 && (
                <div className="notification is-warning">
                    По вашему запросу ничего не найдено
                </div>
            )}
        </section>
    );
}

interface SearchAndFilterPanelProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedTags: MediaItemTag[];
    setSelectedTags: React.Dispatch<React.SetStateAction<MediaItemTag[]>>;
    availableTags: MediaItemTag[];
}

function SearchAndFilterPanel({
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    availableTags
}: SearchAndFilterPanelProps) {
    return (
        <div className="field pb-4 mb-0 search-field">
            <div className="control">
                <input
                    className="input"
                    type="text"
                    placeholder="Поиск по заметкам..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="mt-3 is-flex is-align-items-center is-flex-wrap-wrap" style={{ gap: '0.75rem' }}>
                <div className="is-flex is-align-items-center">
                    <label className="label mb-0 mr-2">Фильтр по тегам:</label>
                    <div className="select">
                        <select
                            value=""
                            onChange={(e) => {
                                const tag = e.target.value as MediaItemTag;
                                if (tag && !selectedTags.includes(tag)) {
                                    setSelectedTags(prev => [...prev, tag]);
                                }
                            }}
                        >
                            <option value="">Выберите тег...</option>
                            {availableTags
                                .filter(tag => !selectedTags.includes(tag))
                                .map(tag => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                {selectedTags.length > 0 && (
                    <div className="is-flex is-align-items-center is-flex-wrap-wrap" style={{ gap: '0.5rem' }}>
                        {selectedTags.map(tag => (
                            <span
                                key={tag}
                                className="tag is-medium"
                                style={{
                                    backgroundColor: MediaItemTagColors[tag].background,
                                    color: MediaItemTagColors[tag].text
                                }}
                            >
                                {tag}
                                <button
                                    className="delete is-small ml-2"
                                    onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                                />
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
