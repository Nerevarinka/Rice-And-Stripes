"use client";

import Image from "next/image";
// import Link from "next/link";

import { useIsMobile } from "@/hooks/useIsMobile";
import jumbo from "@/shared/assets/home/jumbo.webp";
import getUp from "@/shared/assets/home/getUp.webp";

import "./styles.scss";

export default function Home() {
    const isMobile = useIsMobile();

    return (
        <div className="container mb-6" id="home">
            <div className="content">
                <h3 className="title is-3 has-text-centered">
                    Блог о маленьких птицах с большим характером
                </h3>

                <p>
                    Этот сайт был создан владельцем для владельцев. Здесь вы найдёте статьи и другие материалы об амадинах - представителях семейства вьюрковых ткачиков.
                </p>

                <figure className="image my-5">
                    <Image
                        src={jumbo}
                        alt="Банда"
                        sizes="(max-width: 768px) calc(100vw - 2rem), 960px"
                        style={{
                            maxWidth: isMobile ? "100%" : "60rem",
                            width: "100%",
                            height: "auto",
                            margin: "0 auto"
                        }}
                    />
                    <figcaption className="has-text-centered is-italic has-text-grey mt-3">
                        Моя команда вдохновителей
                    </figcaption>
                    {/* Подробнее о ней можно узнать в разделе&nbsp;
                        <Link href="/about">
                            &ldquo;Мои амадинки&rdquo;
                        </Link> */}
                </figure>

                <div className="message is-info">
                    <div className="message-body">
                        <strong>Rice & Stripes</strong> – отсылка к двум видам амадин, которые появились у меня первыми: <i>
                            rice
                        </i> (рис) – рисовые, <i>
                            stripes
                        </i> (полоски) – зебровые. Я отношусь к питомцам, как к членам семьи - ведь у каждой птички есть свои характер, привычки и особенности, которые я учитываю при уходе.
                    </div>
                </div>

                <p>
                    В блог будут добавляться статьи о содержании амадин, их жизни в природе и исследованиях, связанных с ними. Я стремлюсь не полагаться на &ldquo;так принято&rdquo; и мнение авторитетов без обоснований. Мне нравится анализировать и структурировать информацию, и я стараюсь отвечать на вопросы &ldquo;почему&rdquo;, &ldquo;зачем&rdquo; и &ldquo;как&rdquo;, чтобы каждый владелец мог осознанно принимать решения для своих амадин. Если вам близка эта позиция - добро пожаловать!
                </p>

                <figure className="image my-5">
                    <Image
                        src={getUp}
                        alt="Вставай"
                        sizes="(max-width: 768px) calc(100vw - 2rem), 480px"
                        style={{
                            maxHeight: isMobile ? "25rem" : "40rem",
                            width: "auto",
                            maxWidth: "100%",
                            height: "auto",
                            margin: "0 auto"
                        }}
                    />
                    <figcaption className="has-text-centered is-italic has-text-grey mt-3">
                        Я люблю точность и детали, но не забываю и про чувство юмора: ведь мои питомцы сами постоянно напоминают, что всё слишком серьёзно воспринимать не стоит
                    </figcaption>
                </figure>

                <p className="has-text-centered is-size-5 mt-5">
                    Хотите следить за новостями, обсуждать тему птиц и просто общаться? Заходите в <a href="https://t.me/rice_and_stripes" target="_blank" rel="noreferrer">Телеграм-канал</a>.
                </p>
            </div>
        </div>
    );
}

