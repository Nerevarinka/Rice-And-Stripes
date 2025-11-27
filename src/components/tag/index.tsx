import { MediaItemTag, MediaItemTagColors } from "@/models";

interface TagComponentProps {
    /** Тег для отображения */
    tag: MediaItemTag;

    /** Обработчик клика по тегу */
    onClick?: (tag: MediaItemTag, e: React.MouseEvent) => void;
}

/**
 * Компонент для отображения тега статьи
 */
const TagComponent: React.FC<TagComponentProps> = ({
    tag,
    onClick
}) => {
    return (
        <span
            className="tag is-light mr-1"
            style={{
                backgroundColor: MediaItemTagColors[tag].background,
                color: MediaItemTagColors[tag].text,
                cursor: onClick ? 'pointer' : 'default'
            }}
            onClick={onClick ? (e) => onClick(tag, e) : undefined}
        >
            {tag}
        </span>
    );
};

export default TagComponent;
