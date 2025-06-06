import { pdf, cfg, componentsBuilder, helper } from '../shared/Shared.js';

export class MainPage {

    build() {
        let startX = cfg.margin;
        let startY = cfg.margin;

        const colWidths = [20, 140, 50, 45, 55, 50];
        const colHeaders = ["", "Task", "Due", "Priority", "Progress", "Actions"];

        componentsBuilder.drawPageHeader(startX, startY, "To Do ", "List");
        componentsBuilder.drawTableHeaders(startX, startY + 40, colHeaders, colWidths);
        componentsBuilder.drawDivider(helper.sum(colWidths.slice(0, 2)), startY + 20 + (cfg.rowHeight / 2) - 4, cfg.rowHeight);

        // Note button
        componentsBuilder.drawText(cfg.pageWidth - cfg.margin - 20, cfg.margin - 2, 2, "Notes", 10, true);

        for (let i = 0; i < cfg.taskCount; i++) {
            componentsBuilder.drawRow(i, startX, startY + 75 + (cfg.rowHeight * i), (centerY) => {
                
                // Header line
                pdf.line(startX, centerY + (cfg.rowHeight / 2), cfg.pageWidth - cfg.margin, centerY + (cfg.rowHeight / 2));

                // Numbering
                pdf.setFontSize(8);
                pdf.setTextColor(cfg.grey);
                pdf.text(String(i + 1) + ".", startX + 3, centerY + 10);

                // Checking circle
                pdf.circle(startX + 20, centerY, 6, 'S');

                // Divider
                componentsBuilder.drawDivider(helper.sum(colWidths.slice(0, 2)), centerY - (cfg.rowHeight / 2), cfg.rowHeight);

                // Priority
                componentsBuilder.drawPriority(startX + helper.sum(colWidths.slice(0, 3)), centerY);

                // Progress
                componentsBuilder.drawProgressBar(startX + helper.sum(colWidths.slice(0, 4)) + 7, centerY);

                // SubTasks Action Button
                componentsBuilder.drawSubTasksButton(startX + helper.sum(colWidths.slice(0, 5)) + 6, centerY, i + 21);

                // Notes Action Button
                componentsBuilder.drawNoteButton(startX + helper.sum(colWidths.slice(0, 5)) + 25, centerY, i + 3);
            }, true);
        }
    }
}