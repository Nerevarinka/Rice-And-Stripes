"use client";

import { type FC } from "react";

import ArticleNavigation from "@/components/articleNavigation";
import { getArticleNavigation } from "@/shared/utils/articleNavigation";

import cover from "@/shared/assets/articles/cageSelection/cover.jpg";
import firstImage from "@/shared/assets/articles/cageSelection/1.jpg";
import secondImage from "@/shared/assets/articles/cageSelection/2.jpg";
import fourthImage from "@/shared/assets/articles/cageSelection/4.jpg";
import fiveImage from "@/shared/assets/articles/cageSelection/5.jpg";
import sixImage from "@/shared/assets/articles/cageSelection/6.jpg";
import sevenImage from "@/shared/assets/articles/cageSelection/7.jpg";
import eightImage from "@/shared/assets/articles/cageSelection/8.jpg";
import nineImage from "@/shared/assets/articles/cageSelection/9.png";
import tenImage from "@/shared/assets/articles/cageSelection/10.png";
import elevenImage from "@/shared/assets/articles/cageSelection/11.jpg";
import twelveImage from "@/shared/assets/articles/cageSelection/12.jpg";
import thirteenImage from "@/shared/assets/articles/cageSelection/13.jpg";
import fourteenImage from "@/shared/assets/articles/cageSelection/14.jpg";

import TableOfContents from "@/components/tableOfContents";
import ImageWithCaption from "@/components/imageWithCaption";
import VideoWithCaption from "@/components/videoWithCaption";

const SECTIONS = {
    HIGHT_AND_LENGTH: "hight-and-length",
    VERTICAL_BARS: "vertical-bars",
    GUILLOTINE_DOORS: "guillotine-doors",
    DOORS_OPENING_UP: "doors-opening-up",
    NO_PALLET: "no-pallet",
    LOW_PALLET_WALLS: "low-pallet-walls",
    PALLET_SIDES_DOWNWARDS: "pallet-sides-downwards",
    FANCY_TOP: "fancy-top",
    COLORED_BARS: "colored-bars",
    NO_FEEDERS: "no-feeders",
    FRAGILE_PLASTIC: "fragile-plastic",
} as const;

const tableOfContents = [
    { caption: "1. Высота больше длины", elementId: SECTIONS.HIGHT_AND_LENGTH, },
    { caption: "2. Вертикальные прутья", elementId: SECTIONS.VERTICAL_BARS, },
    { caption: "3. Дверцы-гильотины", elementId: SECTIONS.GUILLOTINE_DOORS, },
    { caption: "4. Дверцы, открывающиеся вверх", elementId: SECTIONS.DOORS_OPENING_UP, },
    { caption: "5. Отсутствие выдвижного поддона", elementId: SECTIONS.NO_PALLET, },
    { caption: "6. Низкие борта поддона", elementId: SECTIONS.LOW_PALLET_WALLS, },
    { caption: "7. Борта поддона, сужающиеся книзу (трапецией)", elementId: SECTIONS.PALLET_SIDES_DOWNWARDS, },
    { caption: "8. Фигурный верх", elementId: SECTIONS.FANCY_TOP, },
    { caption: "9. Цветные прутья", elementId: SECTIONS.COLORED_BARS, },
    { caption: "10. Отсутствие кормушек с доступом снаружи", elementId: SECTIONS.NO_FEEDERS, },
    { caption: "11. Хрупкий пластик", elementId: SECTIONS.FRAGILE_PLASTIC, },
];

const Article: FC = () => {
    return (
        <TableOfContents items={tableOfContents}>
            <div className="article-content-wrapper">
                <div className="article-content">

                    <h2 className="title is-2">
                        Выбор клетки для амадин – головная боль владельца
                    </h2>

                    <p>
                        Написать эту статью сподвигли муки поиска новой клетки для наших рисовок. Хотели бы поделиться нашими недовольствами по пунктам. Часть минусов может быть субъективна. Но, возможно, кто-то при прочтении подумает «Как жизненно!».
                    </p>


                    <ImageWithCaption
                        image={cover}
                        caption=""
                        alt="Выбор клетки для амадин – головная боль владельца"
                        size="big"
                    />

                    <h3 className="title is-3" id={SECTIONS.HIGHT_AND_LENGTH}>
                        1. Высота больше длины
                    </h3>

                    <p>
                        Таких клеток полно. Возможно, производители подстраиваются под спрос незнающих владельцев – клетка же большая (значит, птица обрадуется), при этом много площади в квартире не занимает. Но птицы летают в большей степени по горизонтали, а не вверх-вниз.
                    </p>

                    <ImageWithCaption
                        image={firstImage}
                        caption="Китайская клетка с Озона. Высота 90 см – ее бы положить на бок, и было бы супер по пропорциям. Еще и подпитатель и сухая станция в комплекте!"
                        alt="Китайская клетка с Озона. Высота 90 см"
                        size="medium"
                    />

                    <h3 className="title is-3" id={SECTIONS.VERTICAL_BARS}>
                        2. Вертикальные прутья
                    </h3>

                    <p>
                        Проблематично поставить жердочки и повесить кормушки – приходится подгонять их расположение под горизонтальные перекрестные прутики. Птицам тоже не очень удобно – если прыгают на стенку, то сползают по ним вниз.
                    </p>

                    <ImageWithCaption
                        image={secondImage}
                        caption="Сам производитель ставит жердочки не как попало, а на горизонтальные прутья-опоры (Pirrura с Озона)"
                        alt="Сам производитель ставит жердочки не как попало, а на горизонтальные прутья-опоры (Pirrura с Озона)"
                        size="medium"
                    />

                    <h3 className="title is-3" id={SECTIONS.GUILLOTINE_DOORS}>
                        3. Дверцы-гильотины
                    </h3>

                    <p>
                        Мы выпускаем птиц гулять по комнате, и такую дверь нельзя просто открыть – надо еще чем-то закрепить, и достаточно крепко, чтобы никого не пришибло. Многие попугаи их успешно открывают, амадины вряд ли смогут, хотя мы уже не уверены насчет наших рисовых дебоширов (погреметь ими точно не откажутся).
                    </p>

                    <VideoWithCaption
                        src="/assets/articles/cageSelection/3.mp4"
                        caption="Вскрытие дверей. Недорого. Громко. Видео с ютуб-канала RMVideos_Jukin"
                        size="medium"
                    />

                    <h3 className="title is-3" id={SECTIONS.DOORS_OPENING_UP}>
                        4. Дверцы, открывающиеся вверх
                    </h3>

                    <p>
                        Проблема, как выше – нужно закрепить их, если хочешь держать открытыми. Мешают ставить купалки.
                    </p>

                    <ImageWithCaption
                        image={fourthImage}
                        caption=""
                        alt="Дверца мешает ставить купалку"
                        size="medium"
                    />

                    <h3 className="title is-3" id={SECTIONS.NO_PALLET}>
                        5. Отсутствие выдвижного поддона
                    </h3>

                    <p>
                        Затрудняет частую уборку. Если птицы пугливые (особенно, если недавно у вас появились), то отстегивание поддона сильно их потревожит.
                    </p>

                    <ImageWithCaption
                        image={fiveImage}
                        caption="В IMAC Cova 55 цельный отстегивающийся поддон"
                        alt="В IMAC Cova 55 цельный отстегивающийся поддон"
                        size="medium"
                    />

                    <h3 className="title is-3" id={SECTIONS.LOW_PALLET_WALLS}>
                        6. Низкие борта поддона
                    </h3>

                    <p>
                        Совсем не препятствуют выходу легкого мусора (шелухи) со дна за пределы клетки.
                    </p>

                    <ImageWithCaption
                        image={sixImage}
                        caption="Triol 504-К"
                        alt="Triol 504-К"
                        size="medium"
                    />

                    <h3 className="title is-3" id={SECTIONS.PALLET_SIDES_DOWNWARDS}>
                        7. Борта поддона, сужающиеся книзу (трапецией)
                    </h3>

                    <p>
                        Такое, похоже, у всех клеток с пластиковым низом, но выраженно в разной степени. Непонятно, почему нельзя сделать просто прямые стенки. Если птицы сидят вплотную к решетке (наши любят так спать), помет падает не вниз в подстилку, а на бортики.
                    </p>

                    <ImageWithCaption
                        image={sevenImage}
                        caption="Безымянная китайская клетка с Озона. Бортики сильно скошены"
                        alt="Безымянная китайская клетка с Озона. Бортики сильно скошены"
                        size="medium"
                    />

                    <h3 className="title is-3" id={SECTIONS.FANCY_TOP}>
                        8. Фигурный верх
                    </h3>

                    <p>
                        Бывает, что клетка в целом хорошей прямоугольной формы, но верх аркой или с еще какой-нибудь дизайнерской задумкой. На такую уже не поставишь другую клетку или стенд.
                    </p>

                    <ImageWithCaption
                        image={eightImage}
                        caption="Ferplast Canto"
                        alt="Ferplast Canto"
                        size="medium"
                    />

                    <p>
                        Здесь на всякий случай отметим давно известный факт – круглые клетки ни для каких птиц не подходят: в них тяжело ориентироваться (птицы, которые долго жили в таких клетках, могут иметь привычку вертеть головой). Для чувства защищенности нужен уголок.
                    </p>

                    <h3 className="title is-3" id={SECTIONS.COLORED_BARS}>
                        9. Цветные прутья
                    </h3>

                    <p>
                        Не знаем, влияет ли на психику птицы яркий цвет клетки, это больше про нашу вкусовщину. Черные превращают клетку в гробину, особенно если она большая, а помещение маленькое. Мы предпочитаем белые прутья или хотя бы просто металлические, без эмали.
                    </p>

                    <ImageWithCaption
                        image={tenImage}
                        caption="Triol 5005 в белом и черном варианте"
                        alt="Triol 5005 в белом и черном варианте"
                        size="medium"
                    />

                    <p>
                        Кстати, цветастые варианты – это очень часто крошечные клетки, пригодные разве что как переноски.
                    </p>

                    <ImageWithCaption
                        image={nineImage}
                        caption="Barbie world (для птицы скорее hell). Безымянный Китай с Озона"
                        alt="Barbie world (для птицы скорее hell). Безымянный Китай с Озона"
                    />

                    <h3 className="title is-3" id={SECTIONS.NO_FEEDERS}>
                        10. Отсутствие кормушек с доступом снаружи
                    </h3>

                    <p>
                        Такой тип кормушек позволяет менять корм, не засовывая руки в клетку. Это особенно важно, если вы хотите наладить доверительные отношения с птицей.
                    </p>

                    <ImageWithCaption
                        image={elevenImage}
                        caption="Конструкция клетки PetTails предусматривает только внутренние кормушки"
                        alt="Конструкция клетки PetTails предусматривает только внутренние кормушки"
                        size="medium"
                    />

                    <h3 className="title is-3" id={SECTIONS.FRAGILE_PLASTIC}>
                        11. Хрупкий пластик
                    </h3>

                    <p>
                        Таким грешит как минимум Ferplast. За такую цену мог бы и получше сделать. Наши зебры сейчас живут в клетке Voltrega, и пластик у поддонов более гибкий, а значит его сложнее разбить при случайном падении.
                    </p>

                    <p>
                        Сейчас рисовки живут в Ferplast Piano 6 старой версии, и мы ее очень бережем. У нее хорошие пропорции - длина преобладает над высотой, при этом не плоская - можно сделать два яруса.
                    </p>

                    <ImageWithCaption
                        image={twelveImage}
                        caption="У нас абсолютно такая же"
                        alt="У нас абсолютно такая же"
                        size="medium"
                    />

                    <p>
                        И вот захотели мы отдать ее зебрикам, а рисовкам взять клетку из той же серии, но побольше - Piano 7. Но производитель сильно поменял дизайн.
                    </p>

                    <p>
                        Во-первых, кормушки теперь располагаются по боковых сторонах, а не лицевой. Значит, птицы легко могут запачкать их ступеньки, сидя на жердочках, которые расположены на максимальном удалении друг от друга. В старой версии нам нравится, что все кормушки только спереди.
                    </p>

                    <ImageWithCaption
                        image={thirteenImage}
                        caption="Новенькая Ferplast Piano 7"
                        alt="Новенькая Ferplast Piano 7"
                        size="medium"
                    />

                    <p>
                        Во-вторых, сами кормушки теперь модели Brava (в старой клетке - Pretty). У них более сложная конструкция, но такой же хрупкий пластик - их легче сломать и сложнее мыть.
                    </p>

                    <ImageWithCaption
                        image={fourteenImage}
                        caption="Поворотная кормушка Brava 2 (слева) в новых клетках, Pretty - в старых"
                        alt="Поворотная кормушка Brava 2 (слева) в новых клетках, Pretty - в старых"
                        size="medium"
                    />

                    <p>
                        В-третьих - цвет прутьев. Новые модели почему-то все черные.
                    </p>

                    <p>
                        В-четвертых - дверцы. Мы были уже согласны взять эту клетку, несмотря на остальные минусы, но вовремя заметили, что все они открываются вверх (в старой модели такие только с торцов). Но, что более важно, вместо двух небольших дверей спереди производитель сделал одну огромную по центру. Как повесить стандартную купалку? Вот так бы купили, а потом пришлось бы на помойку нести :))
                    </p>

                    <p>
                        В общем, сделали для себя вывод: хочешь идеальную клетку - сделай ее сам.
                    </p>
                    <ArticleNavigation {...getArticleNavigation("/articles/cageSelection")} />
                </div>
            </div>
        </TableOfContents>
    );
};

export default Article;
