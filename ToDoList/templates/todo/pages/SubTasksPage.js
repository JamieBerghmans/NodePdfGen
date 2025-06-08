import { pdf, cfg, componentsBuilder, helper } from '../../../shared/Shared.js';
import { TableConfig } from '../../../shared/TableConfig.js';

export class SubTasksPage {

    build(index, sectionIndex, homePage) {
        pdf.addPage();

        // Background
        const height = 40;
        pdf.setFillColor(...cfg.headerColors[(index ?? 0) % cfg.headerColors.length]);
        pdf.rect(cfg.marginLeft + 5, cfg.marginTop - 10, 200, height, 'F');

        pdf.setTextColor(0);
        componentsBuilder.drawPageHeader(cfg.marginLeft + 15, cfg.marginTop + 10, "Sub Task ", "Triage", `Task #${(index + 1) + (sectionIndex * cfg.taskCount)}`);
        
        componentsBuilder.drawMenu(cfg.pageWidth - cfg.marginRight - 30, cfg.marginTop + 10, [
            { text: "Home", pageNumber: homePage, link: true },
            { text: "Notes", pageNumber: homePage + 1 + index + 1, link: true }
        ], 15)

        const tableConfig = new TableConfig();
        tableConfig.Length = cfg.pageWidth - cfg.marginLeft - cfg.marginRight;
        tableConfig.Columns = [
            {
                Width: 249,
                Text: 'Sub Task Description'
            },
            {
                Width: 45,
                Text: 'Priority'
            },
            {
                Width: 80,
                Text: 'Due Date'
            }
        ];
        tableConfig.RowCount = cfg.subTaskCount;
        tableConfig.RowDividerLine = false;
        tableConfig.DividerLineWidth = 0.3;
        tableConfig.Rows = [
            {
                BackgroundColor: [255, 255, 255]
            }
        ];

        componentsBuilder.drawTable(cfg.marginLeft, cfg.marginTop + 60, tableConfig, (rowIndex, columnIndex, xLeading, xTrailing, yTop, yCenter, yBottom) => {
            pdf.setLineWidth(tableConfig.DividerLineWidth)
            
            if (columnIndex === 0) {
                // Checking circle
                pdf.circle(xLeading + 6, yCenter, 6, 'S');

                // Numbering
                pdf.setFontSize(8);
                pdf.setTextColor(cfg.grey);
                pdf.text(`${index + 1}${String.fromCharCode(97 + rowIndex)})`, xLeading + 14, yCenter + 3);

                // Dotted line sub task description
                let lineDashPattern = pdf.lineDashPattern;
                pdf.setDrawColor(0);
                pdf.setLineDashPattern([3, 3], 0);
                pdf.line(xLeading, yBottom, xTrailing - 5, yBottom);
                pdf.setLineDashPattern(lineDashPattern, 0);
            }

            if (columnIndex === 1) {
                // Priority
                componentsBuilder.drawPriority(xLeading, yCenter, 20);
            }

            if (columnIndex === 2) {
                // Dotted line sub task description
                let lineDashPattern = pdf.lineDashPattern;
                pdf.setDrawColor(0);
                pdf.setLineDashPattern([3, 3], 0);
                pdf.line(xLeading + 15, yBottom, xTrailing + 45, yBottom);
                pdf.setLineDashPattern(lineDashPattern, 0);
            }
        });
    }
}