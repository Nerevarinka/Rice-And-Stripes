import type { FC } from "react";
import { Link } from "react-router";

import "./styles.scss";

/** Компонент модуля "Полезные статьи" */
const UsefulArticles: FC = () => {
    return (
        <div className="content-wrapper">
            <h3 className="page-title">
                Полезные статьи для владельцев
            </h3>

            <div className="card-group">
                <Link
                    to="/articles/useful/anatomiya-i-fiziologiya"
                    className="card-link"
                >
                    <div className="card">
                        <img src=".\img\pages\useful\anatomiya-i-fiziologiya.jpg" className="card-img"></img>
                        <div className="card-body">
                            <div className="card-title">Некоторые аспекты анатомии и физиологии птиц, которые стоит знать владельцу</div>
                            <div className="card-description">Как птицы дышат на выдохе, почему их нельзя долго держать в руке и как они держатся на жердочках - обо всем этом и многом другом можно узнать в нашей новой статье. Мы постарались включить в нее только самое важное и практичное, и, конечно, снабдили текст наглядными картинками.</div>
                            <div className="card-date">24.04.2025</div>
                        </div>
                    </div>
                </Link>

                <Link to="/articles/useful/vybor-kletki" className="card-link">
                    <div className="card">
                        <img src=".\img\pages\useful\vybor-kletki.jpg" className="card-img"></img>
                        <div className="card-body">
                            <div className="card-title">
                                Выбор клетки для амадин – головная боль владельца</div>
                            <div className="card-description">На что обратить внимание при выборе жилища для птиц.</div>
                            <div className="card-date">12.02.2025</div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default UsefulArticles;
