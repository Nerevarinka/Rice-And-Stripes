import { Suspense } from "react";

import { getSiteSearchItems } from "@/shared/articleCatalog";

import SearchResults from "./content";

export default async function SearchPage() {
    const items = await getSiteSearchItems();

    return (
        <Suspense fallback={<div className="site-search-page mx-4">Загрузка поиска...</div>}>
            <SearchResults items={items} />
        </Suspense>
    );
}
