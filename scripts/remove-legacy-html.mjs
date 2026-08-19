import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const directories = ["data/articles", "data/notes"];
const checkOnly = process.argv.includes("--check");
const candidates = [];

for (const directory of directories) {
    const files = (await readdir(path.join(root, directory))).filter(file => file.endsWith(".json"));

    for (const file of files) {
        const filePath = path.join(root, directory, file);
        const value = JSON.parse(await readFile(filePath, "utf8"));
        if (!value || typeof value !== "object" || !Object.hasOwn(value, "html")) continue;

        if (value.contentType === "noteRedirect" || !Array.isArray(value.blocks) || value.blocks.length === 0) {
            throw new Error(`${path.relative(root, filePath)}: нельзя удалить html без непустого массива blocks`);
        }

        candidates.push({ filePath, value });
    }
}

if (checkOnly) {
    if (candidates.length) throw new Error(`Найдено устаревшее корневое поле html: ${candidates.length} файлов`);
    console.log("Устаревших корневых полей html не найдено.");
    process.exit(0);
}

for (const { filePath, value } of candidates) {
    delete value.html;
    await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

console.log(`Удалено корневое поле html: ${candidates.length} файлов.`);
