import { pdf, cfg, componentsBuilder } from "../shared/Shared.js";

export class NotePage {

    build(index, title, titleBold, subtitle, background = true) {
        pdf.addPage();

        // Background
        if (background) {
            const height = subtitle ? 40 : 30;
            pdf.setFillColor(...cfg.colors[(index ?? 0) % cfg.colors.length]);
            pdf.rect(cfg.margin - 10, cfg.margin - 20, 200, height, 'F');
        }

        // Header
        pdf.setTextColor(0);
        componentsBuilder.drawPageHeader(cfg.margin, cfg.margin, title, titleBold, subtitle);

        // Lines
        pdf.setDrawColor(cfg.grey);
        for (let y = 100; y < cfg.pageHeight - cfg.margin; y += 20)
            pdf.line(cfg.margin, y, cfg.pageWidth - cfg.margin, y);

        const buttonStartX = index ? cfg.pageWidth - cfg.margin - 80 : cfg.pageWidth - cfg.margin - 20;

        // Home button
        componentsBuilder.drawText(buttonStartX, cfg.margin - 2, 1, "Home", 10, true);
        
        if (index) {
            // Divider
            componentsBuilder.drawDivider(cfg.pageWidth - cfg.margin - 48, cfg.margin - 12, 14, 1, 0);

            // Subtasks button
            componentsBuilder.drawText(cfg.pageWidth - cfg.margin - 43, cfg.margin - 2, index + 21, "Subtasks", 10, true);
        
            // Home button
            componentsBuilder.drawText(cfg.pageWidth - cfg.margin - 20, cfg.margin - 2, 1, "Home", 10, true);
        }
    }
}