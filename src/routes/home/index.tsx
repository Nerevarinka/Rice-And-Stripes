import type { FC } from "react";

import "./styles.scss";
import { Link } from "react-router";

const Home: FC = () => {
    return (
        <div className="content-wrapper">
            <h3 className="home-page-title">
                Блог о маленьких птицах с большим характером
            </h3>

            <p className="home-page-p">
                Этот сайт был создан владельцами для владельцев. Здесь вы найдёте статьи и другие материалы об амадинах - представителях семейства вьюрковых ткачиков.
            </p>

            <div className="home-page-picture-container">
                <img src=".\img\pages\home\home_page_picture.png" className="home-page-picture-team" alt="Банда" />
                <p className="home-page-picture-description"><i>Наша команда вдохновителей. Подробнее о ней можно узнать в разделе&nbsp;
                    <Link to="/our-band">
                        "Наши амадинки"
                    </Link></i>
                </p>
            </div>

            <p className="home-page-p">
                <b>Rice & Stripes</b> – отсылка к двум видам амадин, которые появились у нас первыми: <i>rice</i> (рис) – рисовые, <i>stripes</i> (полоски) – зебровые. Мы относимся к питомцам, как к членам семьи - ведь у каждой птички есть свои характер, привычки и особенности, которые мы учитываем при уходе.
            </p>
            <p className="home-page-p">
                В блог будут добавляться статьи о содержании амадин, их жизни в природе и исследованиях, связанными с ними. Мы стремимся не полагаться на "так принято" и мнение авторитетов без обоснований. Нам нравится анализировать и структурировать информацию, и мы стараемся отвечать на вопросы "почему", "зачем" и "как", чтобы каждый владелец мог осознанно принимать решения для своих амадин. Если вам близка эта позиция - добро пожаловать!
            </p>


            <div className="home-page-picture-container">
                <img src=".\img\pages\home\get_up.png" className="home-page-picture-meme" alt="Вставай" />
                <p className="home-page-picture-description"><i>Мы любим точность и детали, но не забываем и про чувство юмора: ведь наши питомцы сами постоянно напоминают, что все слишком серьезно воспринимать не стоит</i></p>
            </div>

            <p className="home-page-p ending">
                Хотите следить за новостями, обсуждать тему птиц и просто общаться? Заходите к нам в <a href="https://t.me/rice_and_stripes" target="_blank">Телеграм</a>.
            </p>
        </div>
    );
};

export default Home;