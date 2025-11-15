"use client";

import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@bodynarf/utils";

import { articles } from "@/shared/articles";

import "./styles.scss";

export default function ArticlesContainer() {
    return (
        <>
            <h3 className="page-title">
                Полезные статьи для владельцев
            </h3>

            <div className="card-group">
                {articles.map(x =>
                    <Link
                        key={x.link}
                        href={x.link}
                    >
                        <div className="card mb-5 m-card">
                            <div className="card-content">
                                <article className="media">
                                    <figure className="media-left is-flex is-align-items-center">
                                        <p className="image">
                                            <Image
                                                src={x.cover}
                                                alt={x.caption}
                                            />
                                        </p>
                                    </figure>
                                    <div className="media-content">
                                        <div className="content">
                                            <p>
                                                <strong>
                                                    {x.caption}
                                                </strong>
                                                <br />
                                                {x.description}
                                                <br />
                                                <small>
                                                    {formatDate(x.publishDate, "dd.MM.yyyy")}
                                                </small>
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </Link>
                )}
            </div>
        </>
    );
}
