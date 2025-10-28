import { useCallback, type FC } from "react";

import cover from "@app/assets/pages/articles/cageSelection/cover.jpg";
import firstImage from "@app/assets/pages/articles/cageSelection/1.jpg";
import secondImage from "@app/assets/pages/articles/cageSelection/2.jpg";
import thirdImage from "@app/assets/pages/articles/cageSelection/3.mp4";
import fourthImage from "@app/assets/pages/articles/cageSelection/4.jpg";
import fiveImage from "@app/assets/pages/articles/cageSelection/5.jpg";
import sixImage from "@app/assets/pages/articles/cageSelection/6.jpg";
import sevenImage from "@app/assets/pages/articles/cageSelection/7.jpg";
import eightImage from "@app/assets/pages/articles/cageSelection/8.jpg";
import nineImage from "@app/assets/pages/articles/cageSelection/9.png";
import tenImage from "@app/assets/pages/articles/cageSelection/10.png";
import elevenImage from "@app/assets/pages/articles/cageSelection/11.jpg";
import twelveImage from "@app/assets/pages/articles/cageSelection/12.jpg";
import thirteenImage from "@app/assets/pages/articles/cageSelection/13.jpg";
import fourteenImage from "@app/assets/pages/articles/cageSelection/14.jpg";

import "./styles.scss";

const Anatomy: FC = () => {
    return (
        <div className="article-content-wrapper">
            <div className="article-content">
                <h3 className="page-title">Выбор клетки для амадин – головная боль владельца</h3>
                <p>Написать эту статью сподвигли муки поиска новой клетки для наших рисовок. Хотели бы поделиться нашими недовольствами по пунктам. Часть минусов может быть субъективна. Но, возможно, кто-то при прочтении подумает «Как жизненно!».</p>

                <div className="picture-container">
                    <img
                        src={cover}
                        className="main-picture"
                    />
                </div>

                <h3 id="hight-and-length">Высота больше длины</h3>
                <p>Таких клеток полно. Возможно, производители подстраиваются под спрос незнающих владельцев – клетка же большая (значит, птица обрадуется), при этом много площади в квартире не занимает. Но птицы летают в большей степени по горизонтали, а не вверх-вниз.</p>

                <div className="picture-container">
                    <img
                        src={firstImage}
                        className="picture"
                    />
                    <div className="picture-description">
                        Китайская клетка с Озона. Высота 90 см – ее бы положить на бок, и было бы супер по пропорциям. Еще и подпитатель и сухая станция в комплекте!
                    </div>
                </div>

                <h3 id="vertical-bars">Вертикальные прутья</h3>
                <p>Проблематично поставить жердочки и повесить кормушки – приходится подгонять их расположение под горизонтальные перекрестные прутики. Птицам тоже не очень удобно – если прыгают на стенку, то сползают по ним вниз.</p>

                <div className="picture-container">
                    <img
                        src={secondImage}
                        className="picture"
                    />
                    <div className="picture-description">
                        Сам производитель ставит жердочки не как попало, а на горизонтальные прутья-опоры (Pirrura с Озона)
                    </div>
                </div>

                <h3 id="guillotine-doors">Дверцы-гильотины</h3>
                <p>Мы выпускаем птиц гулять по комнате, и такую дверь нельзя просто открыть – надо еще чем-то закрепить, и достаточно крепко, чтобы никого не пришибло. Многие попугаи их успешно открывают, амадины вряд ли смогут, хотя мы уже не уверены насчет наших рисовых дебоширов (погреметь ими точно не откажутся).</p>

                <div className="picture-container">
                    <video className="picture" controls>
                        <source src={thirdImage} type="video/mp4" />
                        Браузер не поддерживает HTML5 видео
                    </video>
                    <div className="picture-description">
                        Вскрытие дверей. Недорого. Громко. Видео с ютуб-канала RMVideos_Jukin
                    </div>
                </div>

                <h3 id="doors-opening-up">Дверцы, открывающиеся вверх</h3>
                <p>Проблема, как выше – нужно закрепить их, если хочешь держать открытыми. Мешают ставить купалки.</p>

                <div className="picture-container">
                    <img
                        src={fourthImage}
                        className="picture"
                    />
                </div>

                <h3 id="no-pallet">Отсутствие выдвижного поддона</h3>
                <p>Затрудняет частую уборку. Если птицы пугливые (особенно, если недавно у вас появились), то отстегивание поддона сильно их потревожит.</p>

                <div className="picture-container">
                    <img
                        src={fiveImage}
                        className="picture"
                    />
                    <div className="picture-description">
                        В IMAC Cova 55 цельный отстегивающийся поддон
                    </div>
                </div>

                <h3 id="low-pallet-walls">Низкие борта поддона</h3>
                <p>Совсем не препятствуют выходу легкого мусора (шелухи) со дна за пределы клетки.</p>

                <div className="picture-container">
                    <img
                        src={sixImage}
                        className="picture"
                    />
                    <div className="picture-description">
                        Triol 504-К
                    </div>
                </div>

                <h3 id="pallet-sides-downwards">Борта поддона, сужающиеся книзу (трапецией)</h3>
                <p>Такое, похоже, у всех клеток с пластиковым низом, но выраженно в разной степени. Непонятно, почему нельзя сделать просто прямые стенки. Если птицы сидят вплотную к решетке (наши любят так спать), помет падает не вниз в подстилку, а на бортики.</p>

                <div className="picture-container">
                    <img
                        src={sevenImage}
                        className="picture"
                    />
                    <div className="picture-description">
                        Безымянная китайская клетка с Озона. Бортики сильно скошены
                    </div>
                </div>

                <h3 id="fancy-top">Фигурный верх</h3>
                <p>Бывает, что клетка в целом хорошей прямоугольной формы, но верх аркой или с еще какой-нибудь дизайнерской задумкой. На такую уже не поставишь другую клетку или стенд.</p>

                <div className="picture-container">
                    <img
                        src={eightImage}
                        className="picture"
                    />
                    <div className="picture-description">
                        Ferplast Canto
                    </div>
                </div>

                <p>Здесь на всякий случай отметим давно известный факт – круглые клетки ни для каких птиц не подходят: в них тяжело ориентироваться (птицы, которые долго жили в таких клетках, могут иметь привычку вертеть головой). Для чувства защищенности нужен уголок.</p>

                <h3 id="colored-bars">Цветные прутья</h3>
                <p>Не знаем, влияет ли на психику птицы яркий цвет клетки, это больше про нашу вкусовщину. Черные превращают клетку в гробину, особенно если она большая, а помещение маленькое. Мы предпочитаем белые прутья или хотя бы просто металлические, без эмали.</p>
                <div className="picture-container">
                    <img
                        src={tenImage}
                        className="picture"
                    />
                    <div className="picture-description">
                        Triol 5005 в белом и черном варианте
                    </div>
                </div>

                <p>Кстати, цветастые варианты – это очень часто крошечные клетки, пригодные разве что как переноски.</p>

                <div className="picture-container">
                    <img
                        src={nineImage}
                        className="picture"
                    />
                    <div className="picture-description">
                        Barbie world (для птицы скорее hell). Безымянный Китай с Озона
                    </div>
                </div>

                <h3 id="no-feeders">Отсутствие кормушек с доступом снаружи</h3>
                <p>Такой тип кормушек позволяет менять корм, не засовывая руки в клетку. Это особенно важно, если вы хотите наладить доверительные отношения с птицей.</p>

                <div className="picture-container">
                    <img
                        src={elevenImage}
                        className="picture"
                    />
                    <div className="picture-description">
                        Конструкция клетки PetTails предусматривает только внутренние кормушки
                    </div>
                </div>

                <h3 id="fragile-plastic">Хрупкий пластик</h3>
                <p>Таким грешит как минимум Ferplast. За такую цену мог бы и получше сделать. Наши зебры сейчас живут в клетке Voltrega, и пластик у поддонов более гибкий, а значит его сложнее разбить при случайном падении.</p>

                <p>Сейчас рисовки живут в Ferplast Piano 6 старой версии, и мы ее очень бережем. У нее хорошие пропорции - длина преобладает над высотой, при этом не плоская - можно сделать два яруса.</p>

                <div className="picture-container">
                    <img
                        src={twelveImage}
                        className="picture"
                    />
                    <div className="picture-description">
                        У нас абсолютно такая же
                    </div>
                </div>

                <p>И вот захотели мы отдать ее зебрикам, а рисовкам взять клетку из той же серии, но побольше - Piano 7. Но производитель сильно поменял дизайн.</p>
                <p>Во-первых, кормушки теперь располагаются по боковых сторонах, а не лицевой. Значит, птицы легко могут запачкать их ступеньки, сидя на жердочках, которые расположены на максимальном удалении друг от друга. В старой версии нам нравится, что все кормушки только спереди.</p>

                <div className="picture-container">
                    <img
                        src={thirteenImage}
                        className="picture"
                    />
                    <div className="picture-description">
                        Новенькая Ferplast Piano 7
                    </div>
                </div>

                <p>Во-вторых, сами кормушки теперь модели Brava (в старой клетке - Pretty). У них более сложная конструкция, но такой же хрупкий пластик - их легче сломать и сложнее мыть.</p>

                <div className="picture-container">
                    <img
                        src={fourteenImage}
                        className="picture"
                    />
                    <div className="picture-description">
                        Поворотная кормушка Brava 2 (слева) в новых клетках, Pretty - в старых
                    </div>
                </div>

                <p>В-третьих - цвет прутьев. Новые модели почему-то все черные.</p>
                <p>В-четвертых - дверцы. Мы были уже согласны взять эту клетку, несмотря на остальные минусы, но вовремя заметили, что все они открываются вверх (в старой модели такие только с торцов). Но, что более важно, вместо двух небольших дверей спереди производитель сделал одну огромную по центру. Как повесить стандартную купалку? Вот так бы купили, а потом пришлось бы на помойку нести :))</p>

                <p>В общем, сделали для себя вывод: хочешь идеальную клетку - сделай ее сам.</p>
            </div>

            {/* TODO: to separated component */}
            <div className="table-of-contents">
                <ul>
                    <li><AnchorToElement caption="Высота больше длины" elementId="hight-and-length" /></li>
                    <li><AnchorToElement caption="Вертикальные прутья" elementId="vertical-bars" /></li>
                    <li><AnchorToElement caption="Дверцы-гильотины" elementId="guillotine-doors" /></li>
                    <li><AnchorToElement caption="Дверцы, открывающиеся вверх" elementId="doors-opening-up" /></li>
                    <li><AnchorToElement caption="Отсутствие выдвижного поддона" elementId="no-pallet" /></li>
                    <li><AnchorToElement caption="Низкие борта поддона" elementId="low-pallet-walls" /></li>
                    <li><AnchorToElement caption="Борта поддона, сужающиеся книзу (трапецией)" elementId="pallet-sides-downwards" /></li>
                    <li><AnchorToElement caption="Фигурный верх" elementId="fancy-top" /></li>
                    <li><AnchorToElement caption="Цветные прутья" elementId="colored-bars" /></li>
                    <li><AnchorToElement caption="Отсутствие кормушек с доступом снаружи" elementId="no-feeders" /></li>
                    <li><AnchorToElement caption="Хрупкий пластик" elementId="fragile-plastic" /></li>
                </ul>
            </div>
        </div>
    );
};

export default Anatomy;

type AnchorToElementProps = {
    caption: string;

    elementId: string;

    className?: string;
};

const AnchorToElement: FC<AnchorToElementProps> = ({
    caption, elementId,
    className
}) => {
    const onClick = useCallback(() => {
        const element = document.getElementById(elementId);

        if (!element) {
            return;
        }

        element.scrollIntoView({
            behavior: "smooth",

        });
    }, [elementId]);

    return (
        <a
            onClick={onClick}
            className={className}
            style={{ cursor: "pointer" }}
        >
            {caption}
        </a>
    );
};
