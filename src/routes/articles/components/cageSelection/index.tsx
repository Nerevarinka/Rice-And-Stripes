import type { FC } from "react";

import cover from "@app/assets/pages/articles/cageSelection/cover.jpg";

const CageSelection: FC = () => {
    return (
        <h3>
            Статья: Выбор клетки

            <img
                src={cover}
            />
        </h3>
    );
};

export default CageSelection;
