import type { Metadata } from "next";

import { createCommonMetadata } from "@/shared/metadata";

import "./styles.scss";

export const metadata: Metadata = createCommonMetadata(
    "Мои амадины | Rice & Stripes",
    "Истории и фотографии амадин, которые живут или жили в семье Rice & Stripes.",
    ["амадины", "домашние амадины", "рисовые амадины", "зебровые амадины"],
);

export default function FinchesPage() {
    return (
        <div className="finches-page mx-4">
            <header className="finches-page__header">
                <h1 className="title is-2">Мои амадины</h1>
                <p>
                    Здесь будут собраны фотографии и истории птиц, которые живут или жили со мной:
                    их характеры и привычки.
                </p>
            </header>
        </div>
    );
}
