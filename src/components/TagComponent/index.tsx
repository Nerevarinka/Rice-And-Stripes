import { ArticleTag, ArticleTagColors } from "@/models/article";

interface TagComponentProps {
    /** Тег для отображения */
    tag: ArticleTag;

    /** Обработчик клика по тегу */
    onClick?: (tag: ArticleTag, e: React.MouseEvent) => void;
}

/**
 * Компонент для отображения тега статьи
 */
const TagComponent: React.FC<TagComponentProps> = ({ tag, onClick }) => {
    return (
        <span
            className="tag is-light mr-1"
            style={{
                backgroundColor: ArticleTagColors[tag].background,
                color: ArticleTagColors[tag].text,
                cursor: onClick ? 'pointer' : 'default'
            }}
            onClick={onClick ? (e) => onClick(tag, e) : undefined}
        >
            {tag}
        </span>
    );
};

export default TagComponent;
