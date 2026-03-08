import { pdf, cfg, componentsBuilder, helper } from '../Config.js';
import { TableConfig } from '../../../shared/TableConfig.js';

export class MeetingListPage {

    build(sectionIndex, homePage, pagesPerSection) {
        if (sectionIndex > 0) {
            pdf.addPage();
        }

        pdf.setLineWidth(0.1);
        pdf.setLineDashPattern([], 0);
        pdf.setTextColor(cfg.colors[sectionIndex].text);
        pdf.setFillColor(...cfg.colors[sectionIndex].color);
        pdf.rect(cfg.marginLeft, cfg.marginTop - 8, 250, 26, 'F');
        componentsBuilder.drawPageHeader(cfg.marginLeft + 7, cfg.marginTop + 10, `${sectionIndex < 9 ? '0' : ''}${sectionIndex + 1}`);
        pdf.setTextColor(0);

        // === Buttons ===
        const buttons = [];
        if (homePage > 1) {
            buttons.push({ text: cfg.labels.buttons.previous, pageNumber: homePage - pagesPerSection, link: true });
        }
        if (sectionIndex < cfg.sectionCount - 1) {
            buttons.push({ text: cfg.labels.buttons.next, pageNumber: homePage + pagesPerSection, link: true });
        }
        componentsBuilder.drawMenu(cfg.pageWidth - cfg.marginRight - cfg.sidebarWidth - 20, cfg.marginTop + 10, buttons, 15)

        const tableConfig = new TableConfig();
        tableConfig.Length = cfg.usableWidth;
        tableConfig.OverlineHeaders = true;
        tableConfig.HeaderBold = true;
        tableConfig.Columns = [
            {
                Width: cfg.dynamicWidth(8),
                DividerLine: true,
                Text: cfg.labels.columns.number,
            },
            {
                Width: cfg.dynamicWidth(65),
                DividerLine: true,
                Text: cfg.labels.columns.meeting
            },
            {
                Width: cfg.dynamicWidth(27),
                Text: cfg.labels.columns.date
            }
        ];
        tableConfig.RowCount = cfg.meetingCountPerPage;
        tableConfig.Rows = [
            {
                BackgroundColor: cfg.colors[sectionIndex].color,
            },
            {
                BackgroundColor: [255, 255, 255],
            }
        ];

        componentsBuilder.drawTable(cfg.marginLeft, cfg.marginTop + 45, tableConfig, (rowIndex, columnIndex, xLeading, xTrailing, yTop, yCenter, yBottom) => {

            if (rowIndex % 2 === 0) {
                pdf.setTextColor(cfg.colors[sectionIndex].text);
            }

            if (columnIndex === 0) {
                // Numbering
                pdf.setFontSize(12);
                pdf.text(String((rowIndex + 1) + (sectionIndex * cfg.meetingCountPerPage)), xLeading + 15, yCenter + 5, { align: 'center' });
            }

            if (columnIndex === 2) {
                // Set the position and size for the circle
                pdf.setLineWidth(1);
                const circleX = xTrailing - 15; // X-coordinate of the circle's center
                const circleY = yCenter;         // Y-coordinate of the circle's center
                const circleRadius = 8;          // Radius of the circle

                // Draw the circle
                pdf.setFillColor(cfg.black)
                pdf.circle(circleX, circleY, circleRadius, 'F');
                pdf.setFillColor(cfg.white);
                pdf.circle(circleX, circleY, circleRadius - 2, 'F');
                pdf.setFillColor(cfg.black);

                // Set the position for the arrow
                pdf.setDrawColor(cfg.black);
                const arrowStartX = circleX - 3; // Start X-coordinate of the arrow
                const arrowStartY = circleY;      // Start Y-coordinate of the arrow
                const arrowEndX = circleX + 4;   // End X-coordinate of the arrow
                const arrowEndY = circleY;        // End Y-coordinate of the arrow

                // Draw the arrow line
                pdf.setLineWidth(1.5);
                pdf.line(arrowStartX, arrowStartY, arrowEndX, arrowEndY);

                // Draw the arrowhead
                pdf.line(arrowEndX, arrowEndY, arrowEndX - 5, arrowEndY - 3);
                pdf.line(arrowEndX, arrowEndY, arrowEndX - 5, arrowEndY + 3);
                pdf.setLineWidth(0.1);

                // Link
                pdf.link(xTrailing - 12 - circleRadius, circleY - circleRadius, circleRadius * 2, circleRadius * 2, { pageNumber: homePage + (rowIndex + 1) });
            }

            pdf.setTextColor(0);
        });
    }
}
