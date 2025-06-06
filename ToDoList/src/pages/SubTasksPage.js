import { pdf, cfg, componentsBuilder, helper } from '../shared/Shared.js';

export class SubTasksPage {

    build(index) {
        pdf.addPage();

        let startX = cfg.margin;
        let startY = cfg.margin;

        const colWidths = [20, 170, 45, 80];
        const colHeaders = ["", "Sub Task Description", "Priority", "Due Date"];

        const backgroundHeight = 40;
        pdf.setFillColor(...cfg.colors[index % cfg.colors.length]);
        pdf.rect(cfg.margin - 10, cfg.margin - 20, 200, backgroundHeight, 'F');

        pdf.setTextColor(0);
        componentsBuilder.drawPageHeader(startX, startY, "Sub Task  ", "Triage", `Task #${index + 1}`);
        componentsBuilder.drawTableHeaders(startX, startY + 50, colHeaders, colWidths);

        // Home button
        componentsBuilder.drawText(cfg.pageWidth - cfg.margin - 70, cfg.margin - 2, 1, "Home", 10, true);

        // Divider
        componentsBuilder.drawDivider(cfg.pageWidth - cfg.margin - 38, cfg.margin - 12, 14, 1, 0);

        // Subtasks button
        componentsBuilder.drawText(cfg.pageWidth - cfg.margin - 33, cfg.margin - 2, index + 3, "Notes", 10, true);

        for (let i = 0; i < cfg.subTaskCount; i++) {
            componentsBuilder.drawRow(i, startX, startY + 85 + (cfg.rowHeight * i), (centerY) => {
                
                // Checking circle
                pdf.circle(startX + 6, centerY, 6, 'S');

                // Numbering
                pdf.setFontSize(8);
                pdf.setTextColor(cfg.grey);
                pdf.text(`${ index + 1}${String.fromCharCode(97 + i)})`, startX + 16, centerY + 3);

                // Dotted line sub task description
                let lineDashPattern = pdf.lineDashPattern;
                pdf.setLineDashPattern([1, 1], 0);
                pdf.line(startX, centerY + (cfg.rowHeight / 2), startX + helper.sum(colWidths.slice(0,2)) - 15, centerY + (cfg.rowHeight / 2));
                pdf.setLineDashPattern(lineDashPattern, 0);

                // Priority
                componentsBuilder.drawPriority(startX + helper.sum(colWidths.slice(0, 2)) - 5, centerY, 20);

                // Due date
                pdf.lineDashPattern;
                pdf.setLineDashPattern([1, 1], 0);
                const dueDateStartX = startX + helper.sum(colWidths.slice(0, 3)) + 16;
                const dueDateEndX = cfg.pageWidth - cfg.margin;
                const dueDateY = centerY + (cfg.rowHeight / 2);
                pdf.line(dueDateStartX, dueDateY, dueDateEndX, dueDateY);
                pdf.setLineDashPattern(lineDashPattern, 0);
            });
        }
    }
}