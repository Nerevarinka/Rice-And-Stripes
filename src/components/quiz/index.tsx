"use client";

import { useMemo, useState } from "react";

import type {
    EditableArticleQuizBlock,
} from "@/models/editableArticle";
import { withBasePath } from "@/shared/utils/withBasePath";
import { getQuizTieBreakerOptions, getQuizWinners } from "@/shared/utils/quiz";

import "./styles.scss";

type QuizBlockProps = {
    block: EditableArticleQuizBlock;
};

export default function QuizBlock({ block }: QuizBlockProps) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [questionIndex, setQuestionIndex] = useState(0);
    const [isTieBreaker, setIsTieBreaker] = useState(false);
    const [resultId, setResultId] = useState<string | null>(null);
    const [hasStarted, setHasStarted] = useState(false);

    const currentQuestion = isTieBreaker
        ? block.tieBreaker
        : block.questions[questionIndex];

    const winners = useMemo(
        () => getQuizWinners(block, answers),
        [answers, block]
    );

    const result = block.results.find(item => item.id === resultId) ?? null;
    const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : undefined;

    const showResult = (nextResultId: string) => {
        setResultId(nextResultId);
        setIsTieBreaker(false);
    };

    const continueQuiz = () => {
        if (!currentQuestion || !selectedOptionId) return;

        const nextAnswers = { ...answers, [currentQuestion.id]: selectedOptionId };

        if (isTieBreaker) {
            showResult(currentQuestion.options.find(option => option.id === selectedOptionId)?.resultId ?? winners[0]?.id ?? block.results[0]?.id ?? "");
            return;
        }

        if (questionIndex < block.questions.length - 1) {
            setQuestionIndex(current => current + 1);
            return;
        }

        const finalWinners = getQuizWinners(block, nextAnswers);
        if (finalWinners.length > 1 && block.tieBreaker) {
            setIsTieBreaker(true);
            return;
        }

        showResult(finalWinners[0]?.id ?? block.results[0]?.id ?? "");
    };

    const restart = () => {
        setAnswers({});
        setQuestionIndex(0);
        setIsTieBreaker(false);
        setResultId(null);
        setHasStarted(true);
    };

    if (result) {
        return (
            <section className="publication-quiz publication-quiz--result" aria-label="Результат теста">
                <p className="publication-quiz__eyebrow">Твой результат</p>
                <h2 className="publication-quiz__title">{result.title}</h2>
                <img
                    className="publication-quiz__result-image"
                    src={withBasePath(result.imageUrl)}
                    alt={result.alt}
                    width={600}
                    height={600}
                />
                <p className="publication-quiz__description">{result.description}</p>
                <button type="button" className="publication-quiz__button" onClick={restart}>
                    Пройти тест еще раз
                </button>
            </section>
        );
    }

    if (!hasStarted) {
        return (
            <section className="publication-quiz publication-quiz--intro" aria-label="Вступление к тесту">
                {block.introImageUrl ? (
                    <img
                        className="publication-quiz__question-image publication-quiz__intro-image"
                        src={withBasePath(block.introImageUrl)}
                        alt={block.introImageAlt ?? ""}
                        width={700}
                        height={900}
                    />
                ) : null}
                {block.intro ? <p className="publication-quiz__intro-text">{block.intro}</p> : null}
                <button
                    type="button"
                    className="publication-quiz__button publication-quiz__button--primary"
                    onClick={() => setHasStarted(true)}
                >
                    Начать тест
                </button>
            </section>
        );
    }

    if (!currentQuestion) return null;

    const visibleQuestionNumber = isTieBreaker ? "Финальный вопрос" : `Вопрос ${questionIndex + 1} из ${block.questions.length}`;
    const visibleOptions = isTieBreaker
        ? getQuizTieBreakerOptions(block, winners)
        : currentQuestion.options;

    return (
        <section className="publication-quiz" aria-label="Тест Какая ты амадина">
            <div className="publication-quiz__progress">{visibleQuestionNumber}</div>
            <h2 className="publication-quiz__question">{currentQuestion.text}</h2>
            <div className={`publication-quiz__question-layout${currentQuestion.imageUrl ? " has-media" : ""}`}>
                {currentQuestion.imageUrl ? (
                    <div className="publication-quiz__question-media">
                        <img
                            className="publication-quiz__question-image"
                            src={withBasePath(currentQuestion.imageUrl)}
                            alt={currentQuestion.imageAlt ?? ""}
                            width={600}
                            height={600}
                        />
                    </div>
                ) : null}
                <div className="publication-quiz__question-content">
                    <div className="publication-quiz__options" role="radiogroup" aria-label="Варианты ответа">
                        {visibleOptions.map(option => (
                            <button
                                key={option.id}
                                type="button"
                                className={`publication-quiz__option${selectedOptionId === option.id ? " is-selected" : ""}`}
                                onClick={() => setAnswers(current => ({ ...current, [currentQuestion.id]: option.id }))}
                                role="radio"
                                aria-checked={selectedOptionId === option.id}
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                    <div className="publication-quiz__actions">
                        <button
                            type="button"
                            className="publication-quiz__button publication-quiz__button--primary"
                            onClick={continueQuiz}
                            disabled={!selectedOptionId}
                        >
                            Далее
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
