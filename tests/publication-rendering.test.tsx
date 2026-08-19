import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ArticleRenderer from "@/components/articleRenderer";
import MediaCaption from "@/components/mediaCaption";
import type { EditableArticleBlock } from "@/models/editableArticle";

describe("подпись и источник медиа", () => {
    it("не создаёт пустую строку подписи, если указан только источник", () => {
        const html = renderToStaticMarkup(
            <MediaCaption source="stock.adobe.com/example" sourceLabel="Источник" />
        );

        expect(html).toContain('href="https://stock.adobe.com/example"');
        expect(html).not.toContain("media-caption__text");
        expect(html).not.toContain("media-caption__separator");
    });

    it("ставит разделитель только между источником и служебным текстом", () => {
        const html = renderToStaticMarkup(
            <MediaCaption source="https://example.com" sourceLabel="Оригинал" secondary="Не загрузилось?" />
        );

        expect(html).toContain("media-caption__separator");
        expect(html).toContain("Оригинал");
        expect(html).toContain("Не загрузилось?");
    });
});

describe("рендер содержимого публикации", () => {
    it("сохраняет таблицу, выравнивание ячеек и исправляет внутреннюю ссылку", () => {
        const blocks: EditableArticleBlock[] = [{
            id: "table-block",
            type: "richText",
            html: '<table><tbody><tr><td data-text-align="center">Ячейка</td></tr></tbody></table><p><a href="/articles/example">Статья</a></p>',
        }];
        const html = renderToStaticMarkup(<ArticleRenderer blocks={blocks} />);

        expect(html).toContain("<table>");
        expect(html).toContain('data-text-align="center"');
        expect(html).toContain('href="/Rice-And-Stripes/articles/example"');
    });

    it("рендерит заголовок и чередуемое содержимое message-блока", () => {
        const blocks: EditableArticleBlock[] = [{
            id: "message-block",
            type: "message",
            variant: "info",
            title: "Важно",
            collapsible: false,
            defaultOpen: false,
            bodyHtml: "",
            content: [
                { id: "text-1", type: "richText", html: "<p>Первый текст</p>" },
                { id: "text-2", type: "richText", html: "<p>Второй текст</p>" },
            ],
        }];
        const html = renderToStaticMarkup(<ArticleRenderer blocks={blocks} />);

        expect(html).toContain('class="message is-info"');
        expect(html).toContain('class="message-header"');
        expect(html).toContain("Первый текст");
        expect(html).toContain("Второй текст");
    });
});
