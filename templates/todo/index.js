import open from "open";
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { join } from 'path';
import { HomePage } from "./pages/HomePage.js";
import { NotePage } from "./pages/NotePage.js";
import { SubTasksPage } from "./pages/SubTasksPage.js";
import { cfg, pdf } from "./Config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const outputPath = process.env.PDF_OUTPUT_PATH || join(__dirname, '..', '..', 'outputs', 'todo-default-en.pdf');
mkdirSync(dirname(outputPath), { recursive: true });

const mainPage = new HomePage();
const notePage = new NotePage();
const subTasksPage = new SubTasksPage();

const pagesPerSection = 2 + (cfg.taskCount * 2); // 2 sections = Notes + Subtasks

for (let i = 0; i < cfg.sectionCount; i++) {
    const homePage = 1 + (i * pagesPerSection);

    mainPage.build(i, homePage, pagesPerSection);

    notePage.build(-1, homePage, cfg.labels.notesIntroTitle, cfg.labels.notesIntroTitleBold, undefined, false);
    for (let j = 0; j < cfg.taskCount; j++) {
        notePage.build(j, homePage, cfg.labels.buttons.notes, undefined, `${cfg.labels.taskLabel}${(j + 1) + (i * cfg.taskCount)}`);
    }

    for (let j = 0; j < cfg.taskCount; j++) {
        subTasksPage.build(j, i, homePage);
    }
}

pdf.save(outputPath);

const shouldOpen = process.env.PDF_OPEN !== '0';
if (shouldOpen) open(outputPath);
