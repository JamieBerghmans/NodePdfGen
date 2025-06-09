import open from "open";
import { HomePage } from "./pages/HomePage.js";
import { NotePage } from "./pages/NotePage.js";
import { SubTasksPage } from "./pages/SubTasksPage.js";
import { cfg, pdf } from "./Shared.js";

const mainPage = new HomePage();
const notePage = new NotePage();
const subTasksPage = new SubTasksPage();

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

pdf.save("templates/todo/ToDo Template.pdf");
open("templates/todo/ToDo Template.pdf");
