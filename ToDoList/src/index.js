import open from "open";
import { MainPage } from "./pages/MainPage.js";
import { NotePage } from "./pages/NotePage.js";
import { SubTasksPage } from "./pages/SubTasksPage.js";
import { cfg, pdf } from "./shared/Shared.js";

const mainPage = new MainPage(pdf, cfg);
const notePage = new NotePage(pdf, cfg);
const subTasksPage = new SubTasksPage(pdf, cfg);


mainPage.build();
notePage.build(0, "To Do ", "Notes", undefined, false);
for (let i = 0; i < cfg.taskCount; i++) {
    notePage.build(i, 'Notes', undefined, `Task #${i + 1}`);
}
for (let i = 0; i < cfg.taskCount; i++) {
    subTasksPage.build(i);
}

pdf.save("Boox_ToDo_Notes.pdf");
open("Boox_ToDo_Notes.pdf");
