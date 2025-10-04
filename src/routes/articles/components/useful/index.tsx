import type { FC } from "react";
import { Link } from "react-router";

import "./styles.scss";
import { articles } from "@app/shared";

/** Компонент модуля "Полезные статьи" */
const UsefulArticles: FC = () => {
    return (
        <div className="content-wrapper">
            <h3 className="page-title">
                Полезные статьи для владельцев
            </h3>

            <div className="card-group">
                {articles.map(x =>
                    <Link
                        key={x.link}
                        to={x.link}
                        className="card-link"
                    >
                        <div className="card">
                            <img
                                src={x.cover}
                                className="card-img"
                            />
                            <div className="card-body">
                                <div className="card-title">
                                    {x.caption}
                                </div>
                                <div className="card-description">
                                    {x.description}
                                </div>
                                <div className="card-date">
                                    {x.publishDate.toDateString()}
                                </div>
                            </div>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default UsefulArticles;
