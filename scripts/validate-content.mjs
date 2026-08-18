import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const contentDirectories = ["data/articles", "data/notes"];
const siteOrigin = "https://nerevarinka.github.io";
const basePath = "/Rice-And-Stripes";
const errors = [];
const warnings = [];
const slugs = new Map();
let legacyHtmlFiles = 0;

function report(target, file, message) {
    target.push(`${file}: ${message}`);
}

function collectStrings(value, result = []) {
    if (typeof value === "string") result.push(value);
    else if (Array.isArray(value)) value.forEach(item => collectStrings(item, result));
    else if (value && typeof value === "object") Object.values(value).forEach(item => collectStrings(item, result));
    return result;
}

function extractUrls(value) {
    const urls = [];
    for (const text of collectStrings(value)) {
        urls.push(...(text.match(/https?:\/\/[^\s"'<>]+/gi) ?? []));
        urls.push(...(text.match(/(?:src|href)=["'](\/[^"']+)["']/gi) ?? []).map(match => match.replace(/^.*?["']/, "").slice(0, -1)));
        if (/^\/(?:uploads|images)\//.test(text)) urls.push(text);
    }
    return [...new Set(urls.map(url => url.replace(/[),.;]+$/, "")))];
}

async function validateLocalAsset(url, file) {
    let pathname = url;
    if (pathname.startsWith(siteOrigin)) pathname = pathname.slice(siteOrigin.length);
    if (pathname.startsWith(basePath)) pathname = pathname.slice(basePath.length);
    pathname = pathname.split(/[?#]/, 1)[0];
    if (!/^\/(?:uploads|images)\//.test(pathname)) return;

    try {
        const relativePath = decodeURIComponent(pathname).replace(/^\/+/, "");
        await access(path.join(root, "public", relativePath));
    } catch {
        report(warnings, file, `локальный файл не найден: ${url}`);
    }
}

async function validateFile(directory, fileName) {
    const relativeFile = path.posix.join(directory.replaceAll("\\", "/"), fileName);
    let value;
    try {
        value = JSON.parse(await readFile(path.join(root, directory, fileName), "utf8"));
    } catch (error) {
        report(errors, relativeFile, `некорректный JSON (${error instanceof Error ? error.message : String(error)})`);
        return;
    }

    if (!value || typeof value !== "object") {
        report(errors, relativeFile, "корневое значение должно быть объектом");
        return;
    }

    for (const field of ["slug", "updatedAt"]) {
        if (typeof value[field] !== "string" || !value[field].trim()) report(errors, relativeFile, `не заполнено поле ${field}`);
    }

    if (value.contentType !== "noteRedirect") {
        for (const field of ["title", "description", "publishDate"]) {
            if (typeof value[field] !== "string" || !value[field].trim()) report(errors, relativeFile, `не заполнено поле ${field}`);
        }
        if (!Array.isArray(value.blocks)) report(errors, relativeFile, "blocks должен быть массивом");
    }

    if (typeof value.slug === "string") {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug)) report(errors, relativeFile, `некорректный slug: ${value.slug}`);
        const expectedFileName = `${value.slug}.json`;
        if (fileName !== expectedFileName) report(errors, relativeFile, `имя файла должно быть ${expectedFileName}`);
        const previous = slugs.get(value.slug);
        if (previous) report(errors, relativeFile, `slug уже используется в ${previous}`);
        else slugs.set(value.slug, relativeFile);
    }

    const { html: legacyHtml, ...sourceContent } = value;
    const urls = extractUrls(sourceContent);
    for (const url of urls) {
        if (url.startsWith(`${siteOrigin}/`) && url !== `${siteOrigin}${basePath}` && !url.startsWith(`${siteOrigin}${basePath}/`)) {
            report(errors, relativeFile, `внутренняя ссылка потеряла ${basePath}: ${url}`);
        }
        await validateLocalAsset(url, relativeFile);
    }

    if (typeof legacyHtml === "string" && legacyHtml.length > 0) {
        legacyHtmlFiles += 1;
    }
}

for (const directory of contentDirectories) {
    try {
        const files = (await readdir(path.join(root, directory))).filter(file => file.endsWith(".json"));
        for (const file of files) await validateFile(directory, file);
    } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") continue;
        throw error;
    }
}

if (warnings.length) {
    console.log(`Предупреждения (${warnings.length}):`);
    warnings.forEach(message => console.log(`  - ${message}`));
}

if (legacyHtmlFiles > 0) {
    console.log(`Совместимость: ${legacyHtmlFiles} файлов пока содержат дублирующее поле html.`);
}

if (errors.length) {
    console.error(`Ошибки контента (${errors.length}):`);
    errors.forEach(message => console.error(`  - ${message}`));
    process.exitCode = 1;
} else {
    console.log(`Контент проверен: ${slugs.size} файлов, критических ошибок нет.`);
}
