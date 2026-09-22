import type { EditableArticleQuizBlock, EditableArticleQuizResult } from "@/models/editableArticle";

export function getQuizWinners(
    block: EditableArticleQuizBlock,
    answers: Record<string, string>
): EditableArticleQuizResult[] {
    const scores = new Map(block.results.map(result => [result.id, 0]));

    for (const question of block.questions) {
        const selectedOption = question.options.find(option => option.id === answers[question.id]);
        if (selectedOption && scores.has(selectedOption.resultId)) {
            scores.set(selectedOption.resultId, (scores.get(selectedOption.resultId) ?? 0) + 1);
        }
    }

    const maxScore = Math.max(...scores.values());
    return block.results.filter(result => scores.get(result.id) === maxScore);
}

export function getQuizTieBreakerOptions(
    block: EditableArticleQuizBlock,
    winners: EditableArticleQuizResult[]
) {
    return (block.tieBreaker?.options ?? []).filter(option =>
        winners.some(result => result.id === option.resultId)
    );
}
