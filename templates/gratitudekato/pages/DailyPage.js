import { pdf, cfg, componentsBuilder, helper } from '../Config.js';
import { TableConfig } from '../../../shared/TableConfig.js';

export class DailyPage {

    getDaysInMonth(monthIndex) {
        return new Date(cfg.year, monthIndex + 1, 0).getDate();
    }

    build(monthIndex, dayIndex, homePage) {
        pdf.addPage();

        const daysInMonth = this.getDaysInMonth(monthIndex);

        const spacing = 10;
        const extraSpacingTop = 40;
        const blockWidth = (cfg.usableWidth - spacing) / 2;
        const blockHeight = (cfg.pageHeight - cfg.marginTop - cfg.marginBottom - (spacing * 2) - extraSpacingTop) / 3;
        const textSpacingTop = 15;

        // === Buttons ===
        const button = []
        if (monthIndex > 0 || dayIndex > 0) {
            button.push({ text: cfg.labels.buttons.previousDay, pageNumber: (homePage + (dayIndex + 1) - (dayIndex == 0 ? 2 : 1)), link: true });
        }

        if (monthIndex < 11 || dayIndex < (this.getDaysInMonth(monthIndex) - 1)) {
            button.push({ text: cfg.labels.buttons.nextDay, pageNumber: (homePage + (dayIndex + 1) + (dayIndex == (daysInMonth - 1) ? 2 : 1)), link: true });
        }
        componentsBuilder.drawMenu(cfg.pageWidth - cfg.marginRight - cfg.sidebarWidth - 20, cfg.marginTop + 10, button, 15);

        // Date
        pdf.setTextColor(...cfg.colors[monthIndex]);
        componentsBuilder.drawPageHeader(cfg.marginLeft + 20, cfg.marginTop + 10, `${dayIndex < 9 ? '0' : ''}${dayIndex + 1}`, `/${String(monthIndex + 1).padStart(2, '0')}/${cfg.year}`);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        pdf.setTextColor(cfg.black);

        let x = cfg.marginLeft;
        let y = cfg.marginTop + extraSpacingTop;

        // Positive affirmations
        pdf.roundedRect(x, y, blockWidth, blockHeight, 5, 5, 'S');
        pdf.text(cfg.labels.affirmations, x + (blockWidth / 2), y + textSpacingTop, { 'align': 'center' })

        x += blockWidth + spacing;

        // Looking forward to
        pdf.roundedRect(x, y, blockWidth, blockHeight, 5, 5, 'S');
        pdf.text(cfg.labels.future, x + (blockWidth / 2), y + textSpacingTop, { 'align': 'center' })

        x = cfg.marginLeft;
        y += blockHeight + spacing;

        // Meals
        pdf.roundedRect(x, y, blockWidth, blockHeight, 5, 5, 'S');
        pdf.line(x, y + (blockHeight / 2), x + blockWidth, y + (blockHeight / 2));
        pdf.line(x + (blockWidth / 2), y, x + (blockWidth / 2), y + blockHeight);
        pdf.text(cfg.labels.breakfast, x + (blockWidth / 4), y + textSpacingTop, { 'align': 'center' })
        pdf.text(cfg.labels.lunch, x + (blockWidth / 4 * 3), y + textSpacingTop, { 'align': 'center' })
        pdf.text(cfg.labels.dinner, x + (blockWidth / 4), y + textSpacingTop + (blockHeight / 2), { 'align': 'center' })
        pdf.text(cfg.labels.delicious, x + (blockWidth / 4 * 3), y + textSpacingTop + (blockHeight / 2), { 'align': 'center' })

        x += blockWidth + spacing;

        // People influenced
        pdf.roundedRect(x, y, blockWidth, blockHeight, 5, 5, 'S');
        pdf.text(cfg.labels.people, x + (blockWidth / 2), y + textSpacingTop, { 'align': 'center' })

        x = cfg.marginLeft;
        y += blockHeight + spacing;

        // Grateful for
        pdf.roundedRect(x, y, cfg.usableWidth, blockHeight, 5, 5, 'S');
        pdf.text(cfg.labels.gratefulFor, x + (blockWidth + spacing), y + textSpacingTop, { 'align': 'center' })
    }
}
