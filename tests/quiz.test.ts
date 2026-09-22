import { describe, expect, it } from "vitest";

import type { EditableArticleQuizBlock } from "@/models/editableArticle";
import { getQuizTieBreakerOptions, getQuizWinners } from "@/shared/utils/quiz";

const block: EditableArticleQuizBlock = {
    id: "quiz",
    type: "quiz",
    questions: [
        {
            id: "q1",
            text: "Первый вопрос",
            options: [
                { id: "q1-a", text: "А", resultId: "zebra" },
                { id: "q1-b", text: "Б", resultId: "gouldian" },
            ],
        },
        {
            id: "q2",
            text: "Второй вопрос",
            options: [
                { id: "q2-a", text: "А", resultId: "zebra" },
                { id: "q2-b", text: "Б", resultId: "gouldian" },
            ],
        },
    ],
    results: [
        { id: "zebra", title: "Зебровая амадина", description: "", imageUrl: "", alt: "" },
        { id: "gouldian", title: "Гульдова амадина", description: "", imageUrl: "", alt: "" },
    ],
    tieBreaker: {
        id: "tie-breaker",
        text: "Финальный вопрос",
        options: [
            { id: "tie-zebra", text: "Зебровая", resultId: "zebra" },
            { id: "tie-gouldian", text: "Гульдова", resultId: "gouldian" },
        ],
    },
};

describe("расчёт результата теста", () => {
    it("показывает всех победителей при равном счёте", () => {
        const winners = getQuizWinners(block, { q1: "q1-a", q2: "q2-b" });

        expect(winners.map(result => result.id)).toEqual(["zebra", "gouldian"]);
    });

    it("выбирает одного победителя при преимуществе по очкам", () => {
        const winners = getQuizWinners(block, { q1: "q1-a", q2: "q2-a" });

        expect(winners.map(result => result.id)).toEqual(["zebra"]);
    });

    it("показывает в финале только варианты победителей", () => {
        const winners = getQuizWinners(block, { q1: "q1-a", q2: "q2-b" });

        expect(getQuizTieBreakerOptions(block, winners).map(option => option.resultId)).toEqual([
            "zebra",
            "gouldian",
        ]);
        expect(getQuizTieBreakerOptions(block, [block.results[0]])).toHaveLength(1);
    });
});
