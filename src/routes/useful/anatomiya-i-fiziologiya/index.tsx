import { useCallback, type FC } from "react";

import "./styles.scss";
// import { Link } from "react-router";

const AnatomiyaIFiziologiya: FC = () => {

    return (
        <div className="article-content-wrapper">
            <div className="article-content">
                <h3 className="page-title">Некоторые аспекты анатомии и физиологии птиц, которые стоит знать владельцу</h3>
                <p>Эта статья — краткий гайд по анатомии и физиологии птиц, который поможет лучше понять своего питомца. Здесь не будет академической сухости — только практичные вещи, о которых стоит знать каждому хозяину.</p>

                <div className="picture-container">
                    <img src="..\img\pages\useful\anatomiya-i-fiziologiya.jpg" className="main-picture" />
                    <div className="picture-description">Урок анатомии доктора Тульпа, амадиновая версия</div>
                </div>

                <h3 id="skin-and-feathers">Перья и кожа</h3>
                <p>Начнем с главной особенности птиц - перьев. И сразу скажем, что не все участки кожи тела покрыты перьями. Не пугайтесь <b>аптерий</b>, которые видны под крылом и при раздвигании перьев на груди - это нормально.</p>

                <div className="set-of-pictures-container">
                    <div className="picture-container">
                        <img src="..\img\pages\useful\anatomy-and-physiology-of-birds\2.jpg" className="picture" style={{ height: "22rem", width: "auto" }} />
                        <div className="picture-description">
                            Аптерии - участки, лишенные перьев, птерилии (на рисунке с «пупырышками» - перьевыми фолликулами) - оперенные.
                            <a href="https://academy.allaboutbirds.org/features/birdanatomy/" target="_blank" className="source-link">Источник</a>
                        </div>
                    </div>

                    <div className="picture-container">
                        <img src="..\img\pages\useful\anatomy-and-physiology-of-birds\3.jpg" className="picture" style={{ height: "22rem", width: "auto" }} />
                        <div className="picture-description">
                            Аптерии под крылом бронзовой амадины.
                            <a href="https://macaulaylibrary.org/asset/633264257" target="_blank" className="source-link">Источник</a>
                        </div>
                    </div>
                </div>

                <p>Перьевой покров периодически обновляется вместе с верхним роговым слоем клюва (рамфотекой) и кожей (у птиц она намного тоньше, чем у человека). <b>Линька</b> - нормальный физиологический процесс, но птица тратит много ресурсов на рост пера, поэтому в этот период она становится более чувствительной к инфекциям.</p>


                <p>В природе линька птиц, как правило, проходит раз в год, но в домашних условиях может идти чаще, а смена пера может быть полной или частичной. В любом случае, у питомца не должно возникать лысых участков - выпадение должно быть равномерным по всему телу.</p>

                <p>👗 Помимо обычной «рутинной» линьки есть и особая в жизни амадин - первая. Ее называют <b>ювенильной</b>. В ходе нее детское оперение сменяется взрослым нарядом. Цвет клюва тоже может стать другим.</p>

                <div className="picture-container">
                    <img src="..\img\pages\useful\anatomy-and-physiology-of-birds\4.jpg" className="picture" />
                    <div className="picture-description">
                        Взросление рисовой амадины.
                        <a href="https://besgroup.org/2018/12/13/java-sparrow-juvenile-to-adult-transition/" target="_blank" className="source-link">Источник</a>
                    </div>
                </div>

                <p>Новые перья сначала выглядят как <b>трубочки</b>, снимать эти роговые оболочки не надо – это произойдет при самостоятельной чистке, груминге другой птицей или купании.</p>

                <p>Когда перо начинает расти, оно сильно васкуляризовано — внутрь трубочки заходят капилляры, которые питают активно делящиеся клетки пера. На этом этапе перо нежное и уязвимое — его <b>легко травмировать</b>, и тогда может пойти кровотечение.</p>

                <div className="set-of-pictures-container">
                    <div className="picture-container">
                        <img src="..\img\pages\useful\anatomy-and-physiology-of-birds\5.jpg" className="picture" />
                        <div className="picture-description">
                            Вся голова в трубочках.
                            <a href="https://ru.pinterest.com/pin/189432728049748072/" target="_blank" className="source-link">Источник</a>
                        </div>
                    </div>

                    <div className="picture-container">
                        <img src="..\img\pages\useful\anatomy-and-physiology-of-birds\6.jpg" className="picture" />
                        <div className="picture-description">
                            «Кровяное перо» крыла. Будьте осторожны с ним!
                            <a href="https://www.birds-online.de/wp/en/birds-online-english/health-and-diseases/plumage-disorders-and-molt/broken-blood-feathers-in-adult-birds/" target="_blank" className="source-link">Источник</a>
                        </div>
                    </div>
                </div>

                <p>У птиц есть <b>копчиковая железа</b>, выделяющая жироподобное вещество для смазки перьев водонепроницаемой пленочкой. Располагается она над хвостом и выглядит как желтоватый бугорок из двух долек. Владельцы могут узнать о ее существовании, только когда она воспалится, покраснеет и увеличится. В обычном состоянии она неприметна.</p>

                <p>Секрет железы, который птицы выдавливают и распределяют по оперению, содержит предшественник <b>витамина D</b>. В присутствии УФ (UVB-части) он становится активным и в такой форме попадает внутрь при очередной чистке перьев.</p>

                <p>Уход за оперением отнимает много времени в течение дня. Птицы при этом возвращают структуру пера в первоначальный вид, разглаживая их клювом.</p>

                <p><b>Клюв и когти</b> птиц <b>все время растут</b>. В клетке птица двигается меньше, чем в природе, а разнообразие поверхностей невысокое. Поэтому большинству владельцев приходится периодически подрезать когти.</p>

                <p>С клювом ситуация проще - в норме проблем с отрастанием не возникает, и для поддержания длины птицам достаточно шелушения семян и трения о жердочки (даже сепию грызть для этого бывает необязательно, но предлагать ее надо как источник кальция).</p>

                <h3 id="musculoskeletal-system">Опорно-двигательная система</h3>
                <p>Тут текст введения...</p>

                <h3 id="metabolism-and-thermoregulation">Метаболизм и терморегуляция</h3>
                <p>Тут текст введения...</p>

                <h3 id="respiratory-system">Дыхательная система</h3>
                <p>Тут текст введения...</p>

                <h3 id="cardiovascular-system">Сердечно-сосудистая система</h3>
                <p>Тут текст введения...</p>

                <h3 id="digestive-system">Пищеварительная система</h3>
                <p>Тут текст введения...</p>

                <h3 id="excretory-system">Выделительная система</h3>
                <p>Тут текст введения...</p>

                <h3 id="reproductive-system">Репродуктивная система</h3>
                <p>Тут текст введения...</p>

                <h3 id="sense-organs">Органы чувств</h3>
                <p>Тут текст введения...</p>

                <h3 id="brain-and-intelligence">Мозг и интеллект</h3>
                <p>Тут текст введения...</p>

                <h3 id="conclusion">Заключение</h3>
                <p>Тут текст введения...</p>
            </div>
            <div className="table-of-contents">
                <ul>
                    <li><a href="#skin-and-feathers">Перья и кожа</a></li>
                    <li><a href="#musculoskeletal-system">Опорно-двигательная система</a></li>
                    <li><a href="#metabolism-and-thermoregulation">Метаболизм и терморегуляция</a></li>
                    <li><a href="#respiratory-system">Дыхательная система</a></li>
                    <li><a href="#cardiovascular-system">Сердечно-сосудистая система</a></li>
                    <li><a href="#digestive-system">Пищеварительная система</a></li>
                    <li><a href="#excretory-system">Выделительная система</a></li>
                    <li><a href="#reproductive-system">Репродуктивная система</a></li>
                    <li><a href="#sense-organs">Органы чувств</a></li>
                    <li><a href="#brain-and-intelligence">Мозг и интеллект</a></li>
                    <li><a href="#conclusion">Заключение</a></li>
                    <li><AnchorToElement caption="Новый пипирик" elementId="excretory-system" /></li>
                </ul>
            </div>
        </div>
    );
};

export default AnatomiyaIFiziologiya;

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

        })
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