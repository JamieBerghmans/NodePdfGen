import { pdf, cfg, componentsBuilder, helper } from '../shared/Shared.js';
import { TableConfig } from '../shared/TableConfig.js';

export class HomePage {

    build(sectionIndex, homePage, pagesPerSection) {
        if (homePage > 1) {
            pdf.addPage();
        }

        let startX = cfg.margin;
        let startY = cfg.margin;

        componentsBuilder.drawPageHeader(startX, startY, "To Do ", "List");

        // === Buttons ===
        const buttons = [];
        if (homePage > 1) {
            buttons.push({ text: "Previous", pageNumber: homePage - pagesPerSection, link: true });
        }
        buttons.push({ text: "Notes", pageNumber: homePage + 1, link: true });
        if (sectionIndex < cfg.sectionCount - 1) {
            buttons.push({ text: "Next", pageNumber: homePage + pagesPerSection, link: true });
        }
        
        componentsBuilder.drawMenu(cfg.pageWidth - cfg.margin, cfg.margin - 2, buttons, 10)

        const tableConfig = new TableConfig();
        tableConfig.Length = cfg.pageWidth - (2 * cfg.margin);
        tableConfig.Columns = [
            {
                Width: 160,
                DividerLine: true,
                Text: 'Task',
            },
            {
                Width: 50,
                Text: 'Due'
            },
            {
                Width: 45,
                Text: 'Priority'
            },
            {
                Width: 55,
                Text: 'Progress'
            },
            {
                Width: 50,
                Text: 'Actions'
            }
        ];
        tableConfig.RowCount = cfg.taskCount;
        tableConfig.Rows = [
            {
                BackgroundColor: [255, 255, 255],
                DividerLine: true
            },
            {
                BackgroundColor: [207, 243, 250]
            }
        ];

        componentsBuilder.drawTable(startX, startY + 20, tableConfig, (rowIndex, columnIndex, xLeading, xTrailing, yTop, yCenter, yBottom) => {
            pdf.setLineWidth(tableConfig.DividerLineWidth)
            
            if (rowIndex % 2 === 0) {
                pdf.setDrawColor(cfg.grey);
                pdf.setTextColor(cfg.grey);
            } else {
                pdf.setDrawColor(cfg.grey);
                pdf.setTextColor(cfg.grey);
            }

            // Numbering + checkbox
            if (columnIndex === 0) {
                // Numbering
                pdf.setFontSize(8);
                pdf.text(String((rowIndex + 1) + (sectionIndex * cfg.taskCount)) + ".", xLeading + 3, yCenter + 10);

                // Checking circle
                pdf.setDrawColor(cfg.grey);
                pdf.circle(xLeading + 20, yCenter, 6, 'S');
            }

            // Priority
            if (columnIndex === 2) {
                componentsBuilder.drawPriority(xLeading, yCenter);
            }

            // Progress
            if (columnIndex === 3) {
                componentsBuilder.drawProgressBar(xLeading + 7, yCenter);
            }

            // Buttons
            if (columnIndex === 4) {
                // SubTasks Action Button
                componentsBuilder.drawSubTasksButton(xLeading + 6, yCenter, homePage + (rowIndex + 2) + cfg.taskCount);

                // Notes Action Button
                componentsBuilder.drawNoteButton(xLeading + 25, yCenter, homePage + (rowIndex + 2));
            }
        });
    }
}