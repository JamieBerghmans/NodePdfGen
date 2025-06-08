import open from "open";
import { cfg } from "./config.js";

this.pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: [this.cfg.pageWidth, this.cfg.pageHeight],
                putOnlyUsedFonts: true,
                floatPrecision: 16 // Default is 16, but can be set to a lower value for performance
            });

// Draw rectangles for each color
for (let i = 0; i < cfg. ; i++) {
colors.forEach((color, index) => {
    const y = cfg.marginTop + ((rectangleHeight - 10) * index);
    pdf.setFillColor(...color.color);
    pdf.roundedRect(cfg.pageWidth - cfg.marginRight - rectWidth, y, rectWidth, rectangleHeight, rectRounding, rectRounding, 'F')

    pdf.setTextColor(color.text);
    pdf.setFontSize(10);
    
    // Rotate text
    pdf.text(`${index + 1}`, cfg.pageWidth - cfg.marginRight - 13, y + (rectangleHeight / 2) - 6, { align: "left", angle: -90 });
});

// const pagesPerSection = 2 + (cfg.taskCount * 2); // 2 sections = Notes + Subtasks

// for (let i = 0; i < cfg.sectionCount; i++) {
//     const homePage = 1 + (i * pagesPerSection);

//     mainPage.build(i, homePage, pagesPerSection);

//     notePage.build(-1, homePage, "To Do ", "Notes", undefined, false);
//     for (let j = 0; j < cfg.taskCount; j++) {
//         notePage.build(j, homePage, 'Notes', undefined, `Task #${(j + 1) + (i * cfg.taskCount)}`);
//     }

//     for (let j = 0; j < cfg.taskCount; j++) {
//         subTasksPage.build(j, i, homePage);
//     }
// }

pdf.save("templates/meetingnotes/Meeting Notes Template.pdf");
open("templates/meetingnotes/Meeting Notes Template.pdf");
