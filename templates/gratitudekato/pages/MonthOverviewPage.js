import { pdf, cfg, componentsBuilder, helper } from '../Config.js';
import { TableConfig } from '../../../shared/TableConfig.js';

export class MonthOverviewPage {

    getPageNumber(monthIndex) {
        let currentPage = 0;
        for (let i = 0; i < monthIndex; i++) {
            currentPage += this.getDaysInMonth(i);
        }
        currentPage += (monthIndex + 1);

        return currentPage
    }

    getDaysInMonth(monthIndex) {
        return new Date(cfg.year, monthIndex + 1, 0).getDate();
    }

    build(monthIndex, homePage, previousHomePage, nextHomePage) {
        if (monthIndex > 0) {
            pdf.addPage();
        }

        /*
        {
        helvetica: [ 'normal', 'bold', 'italic', 'bolditalic' ],
        Helvetica: [ '', 'Bold', 'Oblique', 'BoldOblique' ],
        courier: [ 'normal', 'bold', 'italic', 'bolditalic' ],
        Courier: [ '', 'Bold', 'Oblique', 'BoldOblique' ],
        times: [ 'normal', 'bold', 'italic', 'bolditalic' ],
        Times: [ 'Roman', 'Bold', 'Italic', 'BoldItalic' ],
        zapfdingbats: [ 'normal' ],
        ZapfDingbats: [ '' ],
        */

        pdf.setTextColor(...cfg.colors[monthIndex]);
        componentsBuilder.drawPageHeader(cfg.marginLeft + 10, cfg.marginTop + 20, cfg.labels.months[monthIndex], undefined, undefined, 'helvetica', 25);

        const daysInMonth = this.getDaysInMonth(monthIndex);
        const marginLeft = cfg.marginLeft;
        const marginTop = cfg.marginTop + 50; // Adjust starting point below the header
        const spacingBetweenColumns = 10;
        const spacingBetweenRows = 10;
        const daysPerRow = 3; // Days per row
        const cellWidth = (cfg.pageWidth - cfg.marginLeft - cfg.marginRight - cfg.sidebarWidth - (spacingBetweenColumns * (daysPerRow - 1)) - 10) / daysPerRow; // Width of each cell
        const cellHeight = 35; // Height of each cell

        for (let day = 1; day <= daysInMonth; day++) {
            const row = Math.floor((day - 1) / daysPerRow);
            const col = (day - 1) % daysPerRow;

            const x = marginLeft + col * cellWidth + (col * spacingBetweenColumns);
            const y = marginTop + row * cellHeight + (row * spacingBetweenRows);

            // Optional: Draw a border around each cell
            pdf.setDrawColor(cfg.lightGrey);
            pdf.roundedRect(x, y, cellWidth, cellHeight, 5, 5, 'S');

            // Draw the day number
            pdf.setTextColor(...cfg.colors[monthIndex]);
            pdf.setFont('helvetica', 'bold');
            pdf.text(String(day), x + (cellWidth / 2), y + (cellHeight / 2) + (pdf.getFontSize() / 3), { align: 'center' });
            pdf.setFont('helvetica', 'normal');

            // Add a clickable link
            pdf.link(x, y, cellWidth, cellHeight, { pageNumber: homePage + day });
        }
    }
}
