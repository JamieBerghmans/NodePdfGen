import { pdf, cfg, componentsBuilder } from "../shared/Shared.js";

export class NotePage {

    build(index, homePage, title, titleBold, subtitle, background = true) {
        pdf.addPage();

        // Background
        if (background) {
            const height = subtitle ? 40 : 30;
            pdf.setFillColor(...cfg.headerColors[(index ?? 0) % cfg.headerColors.length]);
            pdf.rect(cfg.margin - 10, cfg.margin - 20, 200, height, 'F');
        }

        // Header
        pdf.setTextColor(0);
        componentsBuilder.drawPageHeader(cfg.margin, cfg.margin, title, titleBold, subtitle);

        // Draw buttons
        let buttons = [
            { text: "Home", pageNumber: homePage, link: true },
        ];
        if (index >= 0) {
            buttons.push(
                { text: "Subtasks", pageNumber: homePage + (index + 2) + cfg.taskCount, link: true }
            );
        }
        componentsBuilder.drawMenu(cfg.pageWidth - cfg.margin, cfg.margin - 2, buttons, 10)

        // Lines
        pdf.setDrawColor(cfg.grey);
        for (let y = 100; y < cfg.pageHeight - cfg.margin; y += 20)
            pdf.line(cfg.margin, y, cfg.pageWidth - cfg.margin, y);
    }
}