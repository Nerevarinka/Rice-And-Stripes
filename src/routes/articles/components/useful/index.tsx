import type { FC } from "react";
import { Link } from "react-router";

import "@bodynarf/utils";

import { articles } from "@app/shared";

import styles from "./styles.module.scss";

/** Компонент модуля "Полезные статьи" */
const UsefulArticles: FC = () => {
    return (
        <>
            <h3 className="page-title">
                Полезные статьи для владельцев
            </h3>

            <div className="card-group">
                {articles.map(x =>
                    <Link
                        key={x.link}
                        to={x.link}
                    >
                        <div className={`card mb-5 ${styles["m-card"]}`}>
                            <div className="card-content">
                                <article className="media">
                                    <figure className="media-left is-flex is-align-items-center">
                                        <p className="image">
                                            <img
                                                src={x.cover}
                                            />
                                        </p>
                                    </figure>
                                    <div className="media-content">
                                        <div className="content">
                                            <p>
                                                <strong>{x.caption}</strong>
                                                <br />
                                                {x.description}
                                                <br />
                                                <small>{x.publishDate.format("dd.MM.yyyy")}</small>
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
};

export default UsefulArticles;
