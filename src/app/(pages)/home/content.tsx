"use client";

import Image from "next/image";
import Link from "next/link";

import { useIsMobile } from "@/hooks/useIsMobile";
import jumbo from "@/shared/assets/home/jumbo.png";
import getUp from "@/shared/assets/home/getUp.png";

export default function Home() {
    const isMobile = useIsMobile();

    return (
        <div className="container mb-6">
            <div className="content">
                <h3 className="title is-3 has-text-centered">
                    Блог о маленьких птицах с большим характером
                </h3>

                <p>
                    Этот сайт был создан владельцами для владельцев. Здесь вы найдёте статьи и другие материалы об амадинах - представителях семейства вьюрковых ткачиков.
                </p>

                <figure className="image my-5">
                    <Image
                        src={jumbo}
                        alt="Банда"
                        style={{
                            maxWidth: isMobile ? "100%" : "60rem",
                            width: "100%",
                            height: "auto",
                            margin: "0 auto"
                        }}
                    />
                    <figcaption className="has-text-centered is-italic has-text-grey mt-3">
                        Наша команда вдохновителей. Подробнее о ней можно узнать в разделе&nbsp;
                        <Link href="/our-band" className="has-text-link">
                            &ldquo;Наши амадинки&rdquo;
                        </Link>
                    </figcaption>
                </figure>

                <p>
                    <strong>Rice & Stripes</strong> – отсылка к двум видам амадин, которые появились у нас первыми: <i>
                        rice
                    </i> (рис) – рисовые, <i>
                        stripes
                    </i> (полоски) – зебровые. Мы относимся к питомцам, как к членам семьи - ведь у каждой птички есть свои характер, привычки и особенности, которые мы учитываем при уходе.
                </p>

                <p>
                    В блог будут добавляться статьи о содержании амадин, их жизни в природе и исследованиях, связанными с ними. Мы стремимся не полагаться на &ldquo;так принято&rdquo; и мнение авторитетов без обоснований. Нам нравится анализировать и структурировать информацию, и мы стараемся отвечать на вопросы &ldquo;почему&rdquo;, &ldquo;зачем&rdquo; и &ldquo;как&rdquo;, чтобы каждый владелец мог осознанно принимать решения для своих амадин. Если вам близка эта позиция - добро пожаловать!
                </p>

                <figure className="image my-5">
                    <Image
                        src={getUp}
                        alt="Вставай"
                        style={{
                            maxHeight: isMobile ? "25rem" : "40rem",
                            width: "auto",
                            maxWidth: "100%",
                            height: "auto",
                            margin: "0 auto"
                        }}
                    />
                    <figcaption className="has-text-centered is-italic has-text-grey mt-3">
                        Мы любим точность и детали, но не забываем и про чувство юмора: ведь наши питомцы сами постоянно напоминают, что все слишком серьезно воспринимать не стоит
                    </figcaption>
                </figure>

                <p className="has-text-centered is-size-5 mt-5">
                    Хотите следить за новостями, обсуждать тему птиц и просто общаться? Заходите к нам в <a href="https://t.me/rice_and_stripes" target="_blank" rel="noreferrer" className="has-text-link">Телеграм</a>.
                </p>
            </div>
        </div>
    );
}

