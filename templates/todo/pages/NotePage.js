import { pdf, cfg, componentsBuilder } from "../Shared.js";

export class NotePage {

    build(index, homePage, title, titleBold, subtitle, background = true) {
        pdf.addPage();

        // Background
        if (background) {
            const height = subtitle ? 40 : 30;
            pdf.setFillColor(...cfg.headerColors[(index ?? 0) % cfg.headerColors.length]);
            pdf.rect(cfg.marginLeft + 5, cfg.marginTop - 10, 200, height, 'F');
        }

        // Header
        pdf.setTextColor(0);
        componentsBuilder.drawPageHeader(cfg.marginLeft + 15, cfg.marginTop + 10, title, titleBold, subtitle);

        // Draw buttons
        let buttons = [
            { text: "Home", pageNumber: homePage, link: true },
        ];
        if (index >= 0) {
            buttons.push(
                { text: "Subtasks", pageNumber: homePage + (index + 2) + cfg.taskCount, link: true }
            );
        }
        componentsBuilder.drawMenu(cfg.pageWidth - cfg.marginRight - 30, cfg.marginTop + 10, buttons, 15)

        // Lines
        pdf.setDrawColor(cfg.grey);
        for (let y = 100; y < cfg.pageHeight - cfg.marginBottom; y += cfg.rowHeight)
            pdf.line(cfg.marginLeft, y, cfg.pageWidth - cfg.marginRight, y);
    }
}