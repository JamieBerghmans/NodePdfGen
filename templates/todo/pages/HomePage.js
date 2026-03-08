import { pdf, cfg, componentsBuilder, helper } from '../Config.js';
import { TableConfig } from '../../../shared/TableConfig.js';

export class HomePage {

    build(sectionIndex, homePage, pagesPerSection) {
        if (homePage > 1) {
            pdf.addPage();
        }

        componentsBuilder.drawPageHeader(cfg.marginLeft + 15, cfg.marginTop + 10, cfg.labels.homePageTitle, cfg.labels.homePageTitleBold);

        // === Buttons ===
        const buttons = [];
        if (homePage > 1) {
            buttons.push({ text: cfg.labels.buttons.previous, pageNumber: homePage - pagesPerSection, link: true });
        }
        buttons.push({ text: cfg.labels.buttons.notes, pageNumber: homePage + 1, link: true });
        if (sectionIndex < cfg.sectionCount - 1) {
            buttons.push({ text: cfg.labels.buttons.next, pageNumber: homePage + pagesPerSection, link: true });
        }

        componentsBuilder.drawMenu(cfg.pageWidth - cfg.marginRight - 30, cfg.marginTop + 10, buttons, 15)

        const tableConfig = new TableConfig();
        tableConfig.Length = cfg.pageWidth - cfg.marginLeft - cfg.marginRight;
        tableConfig.Columns = [
            {
                Width: 230,
                DividerLine: true,
                Text: cfg.labels.columns.task,
            },
            {
                Width: 60,
                Text: cfg.labels.columns.due
            },
            {
                Width: 45,
                Text: cfg.labels.columns.priority
            },
            {
                Width: 55,
                Text: cfg.labels.columns.progress
            },
            {
                Width: 50,
                Text: cfg.labels.columns.actions
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

        componentsBuilder.drawTable(cfg.marginLeft, cfg.marginTop + 40, tableConfig, (rowIndex, columnIndex, xLeading, xTrailing, yTop, yCenter, yBottom) => {
            pdf.setLineWidth(tableConfig.DividerLineWidth)

            pdf.setDrawColor(cfg.black);
            pdf.setTextColor(cfg.black);

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
