import open from "open";
import { HomePage } from "./pages/HomePage.js";
import { NotePage } from "./pages/NotePage.js";
import { SubTasksPage } from "./pages/SubTasksPage.js";
import { cfg, pdf } from "./shared/Shared.js";

const mainPage = new HomePage(pdf, cfg);
const notePage = new NotePage(pdf, cfg);
const subTasksPage = new SubTasksPage(pdf, cfg);

const pagesPerSection = 2 + (cfg.taskCount * 2); // 2 sections = Notes + Subtasks

for (let i = 0; i < cfg.sectionCount; i++) {
    const homePage = 1 + (i * pagesPerSection);

    mainPage.build(i, homePage, pagesPerSection);

    notePage.build(-1, homePage, "To Do ", "Notes", undefined, false);
    for (let j = 0; j < cfg.taskCount; j++) {
        notePage.build(j, homePage, 'Notes', undefined, `Task #${(j + 1) + (i * cfg.taskCount)}`);
    }

    for (let j = 0; j < cfg.taskCount; j++) {
        subTasksPage.build(j, i, homePage);
    }
}

pdf.save("Boox_ToDo_Notes.pdf");
open("Boox_ToDo_Notes.pdf");
