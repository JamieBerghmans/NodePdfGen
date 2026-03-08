import { pdf, cfg, componentsBuilder, helper } from '../Config.js';
import { TableConfig } from '../../../shared/TableConfig.js';

export class RetrospectiveSummaryPage {

    build(sectionIndex, meetingIndex, homePage, pagesPerSection) {
        pdf.addPage();

        const retroNumber = cfg.startSprint + meetingIndex + (sectionIndex * cfg.meetingCountPerPage);
        componentsBuilder.drawPageHeader(cfg.marginLeft + 20, cfg.marginTop + 10, cfg.labels.summaryPageTitle, cfg.labels.summaryPageTitleBold, `${cfg.labels.retroLabel} ${retroNumber}`);

        // === Buttons ===
        const buttons = [{ text: cfg.labels.buttons.back, pageNumber: homePage, link: true }];
        componentsBuilder.drawMenu(cfg.pageWidth - cfg.marginRight - cfg.sidebarWidth - 20, cfg.marginTop + 10, buttons, 15)

        let x = cfg.marginLeft;
        let y = cfg.marginTop + 60;
        const lineSpacing = 25;
        const lineSpacingTop = 25;

        pdf.text(cfg.labels.sections.positive, x, y);
        for (let i = 0; i < 3; i++) {
            pdf.setLineWidth(0.8);
            pdf.setLineDashPattern([1, 2], 0);
            pdf.line(x, y + lineSpacingTop + (i * lineSpacing), x + cfg.usableWidth, y + lineSpacingTop + (i * lineSpacing));
            pdf.setLineDashPattern(0);
            pdf.setLineWidth(0.1);
        }

        y += 110;

        pdf.text(cfg.labels.sections.neutral, x, y);
        for (let i = 0; i < 3; i++) {
            pdf.setLineWidth(0.8);
            pdf.setLineDashPattern([1, 2], 0);
            pdf.line(x, y + lineSpacingTop + (i * lineSpacing), x + cfg.usableWidth, y + lineSpacingTop + (i * lineSpacing));
            pdf.setLineDashPattern(0);
            pdf.setLineWidth(0.1);
        }

        y += 110;

        pdf.text(cfg.labels.sections.negative, x, y);
        for (let i = 0; i < 4; i++) {
            pdf.setLineWidth(0.8);
            pdf.setLineDashPattern([1, 2], 0);
            pdf.line(x, y + lineSpacingTop + (i * lineSpacing), x + cfg.usableWidth, y + lineSpacingTop + (i * lineSpacing));
            pdf.setLineDashPattern(0);
            pdf.setLineWidth(0.1);
        }

        y += 100;

        // === Meeting notes section ===
        {
            x = cfg.marginLeft;

            pdf.setLineWidth(2);
            pdf.setLineDashPattern(0);

            const meetingNotesTableConfig = new TableConfig();
            meetingNotesTableConfig.Length = cfg.usableWidth;
            meetingNotesTableConfig.IncludeHeaders = true;
            meetingNotesTableConfig.OverlineHeaders = true;
            meetingNotesTableConfig.HeaderBold = false;
            meetingNotesTableConfig.HeaderFontSize = 12;
            meetingNotesTableConfig.HeaderTextColor = cfg.black;
            meetingNotesTableConfig.Columns = [
                {
                    Width: cfg.usableWidth,
                    Text: cfg.labels.sections.meetingNotes,
                },
            ];
            meetingNotesTableConfig.RowCount = 5;
            meetingNotesTableConfig.Rows = [
                {
                    BackgroundColor: [255, 255, 255],
                }
            ];
            meetingNotesTableConfig.RowHeight = cfg.rowHeight - 5;
            meetingNotesTableConfig.RowDividerLine = false;

            componentsBuilder.drawTable(x, y + 50, meetingNotesTableConfig, (rowIndex, columnIndex, xLeading, xTrailing, yTop, yCenter, yBottom) => {
                pdf.setLineWidth(0.8);
                pdf.setLineDashPattern([1, 2], 0);
                pdf.line(xLeading + 10, yBottom, xTrailing - 10, yBottom);
                pdf.setLineWidth(2);
                pdf.setLineDashPattern(0);
            });
        }
    }
}
