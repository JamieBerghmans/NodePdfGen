import { pdf, cfg, componentsBuilder, helper } from '../../meetingnotes/Config.js';
import { TableConfig } from '../../../shared/TableConfig.js';

export class MeetingNotesPage {

    build(sectionIndex, meetingIndex, homePage, pagesPerSection) {
        pdf.addPage();

        componentsBuilder.drawPageHeader(cfg.marginLeft + 20, cfg.marginTop + 10, 'Meeting ', 'Summary', `Meeting ${meetingIndex + 1 + (sectionIndex * cfg.meetingCountPerPage)}`);

        // === Buttons ===
        const buttons = [{ text: "Back", pageNumber: homePage, link: true }];
        componentsBuilder.drawMenu(cfg.pageWidth - cfg.marginRight - cfg.sidebarWidth - 20, cfg.marginTop + 10, buttons, 15)

        const verticalSpacing = 25;
        const itemFontSizes = 10;
        const rectRounding = 2;

        let x = cfg.marginLeft;
        let y = cfg.marginTop;

        //pdf.line(x + 277, y, x + 277, y + 500); // debug line

        // === Header section ===
        {
            x = cfg.marginLeft;

            pdf.setLineWidth(2);
            pdf.roundedRect(x, y + 40, cfg.usableWidth, verticalSpacing * 3 + 10, rectRounding, rectRounding, 'S');

            y = cfg.marginTop + 60;
            // First line
            {
                // Meeting name label
                componentsBuilder.drawText(x + 10, y, homePage, `Meeting name:`, itemFontSizes);
                const meetingNameTextWidth = pdf.getTextWidth('Meeting name:');
                x += meetingNameTextWidth + 10;

                // Meeting name dotted line
                pdf.setLineWidth(0.8);
                pdf.setLineDashPattern([1, 2], 0);
                pdf.line(x + 5, y, x + 190.2, y);
                x += 190.4;

                // Date label
                componentsBuilder.drawText(x + 10, y, homePage, `Date:`, itemFontSizes);
                const dateTextWidth = pdf.getTextWidth('Date:');
                x += dateTextWidth + 10;

                // Date dotted line
                pdf.setLineWidth(0.8);
                pdf.setLineDashPattern([1, 2], 0);
                pdf.line(x + 5, y, cfg.pageWidth - cfg.sidebarWidth - 30, y);
            }

            x = cfg.marginLeft;
            y += verticalSpacing;

            // Second line
            {
                // Objective label
                componentsBuilder.drawText(x + 10, y, homePage, `Objective:`, itemFontSizes);
                const meetingNameTextWidth = pdf.getTextWidth('Objective:');
                x += meetingNameTextWidth + 10;

                // Objective dotted line part 1
                pdf.setLineWidth(0.8);
                pdf.setLineDashPattern([1, 2], 0);
                pdf.line(x + 5, y, x + 212.5, y);
                x += 212.5;

                // Time label
                componentsBuilder.drawText(x + 10, y, homePage, `Time:`, itemFontSizes);
                const dateTextWidth = pdf.getTextWidth('Time:');
                x += dateTextWidth + 10;

                // Time dotted line
                pdf.setLineWidth(0.8);
                pdf.setLineDashPattern([1, 2], 0);
                pdf.line(x + 5, y, cfg.pageWidth - cfg.sidebarWidth - 30, y);
            }

            x = cfg.marginLeft;
            y += verticalSpacing;

            // Third line
            {
                // Objective dotted line part 2
                pdf.setLineWidth(0.8);
                pdf.setLineDashPattern([1, 2], 0);
                pdf.line(x + 10, y, x + 266.3, y);
                x += 266.3;

                // Location label
                componentsBuilder.drawText(x + 10, y, homePage, `Location:`, itemFontSizes);
                const dateTextWidth = pdf.getTextWidth('Time:');
                x += dateTextWidth + 10;

                // Location dotted line
                pdf.setLineWidth(0.8);
                pdf.setLineDashPattern([1, 2], 0);
                pdf.line(x + 5, y, cfg.pageWidth - cfg.sidebarWidth - 30, y);
            }
        }

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
                    Text: 'MEETING NOTES',
                },
            ];
            meetingNotesTableConfig.RowCount = 10;
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

        // === Action items section ===
        {
            x = cfg.marginLeft;

            pdf.setLineWidth(1);
            pdf.setLineDashPattern(0);

            const actionItemsTableConfig = new TableConfig();
            actionItemsTableConfig.Length = cfg.usableWidth - 10;
            actionItemsTableConfig.IncludeHeaders = true;
            actionItemsTableConfig.HeaderBold = false;
            actionItemsTableConfig.HeaderFontSize = 12;
            actionItemsTableConfig.HeaderTextColor = cfg.black;
            actionItemsTableConfig.DividerLineWidth = 0.5;
            actionItemsTableConfig.Columns = [
                {
                    Width: cfg.dynamicWidth(60),
                    Text: 'Action item',
                    DividerLine: true,
                },
                {
                    Width: cfg.dynamicWidth(20),
                    Text: 'Owner',
                    DividerLine: true,
                },
                {
                    Width: cfg.dynamicWidth(20),
                    Text: 'Due',
                }
            ];
            actionItemsTableConfig.RowCount = 5;
            actionItemsTableConfig.Rows = [
                {
                    BackgroundColor: [255, 255, 255],
                }
            ];
            actionItemsTableConfig.RowHeight = 20;
            actionItemsTableConfig.RowDividerLine = false;

            componentsBuilder.drawTable(x + 5, y + 330, actionItemsTableConfig, (rowIndex, columnIndex, xLeading, xTrailing, yTop, yCenter, yBottom) => {
                pdf.setLineWidth(0.8);
                pdf.setLineDashPattern([1, 2], 0);
                pdf.line(xLeading + 10, yBottom - 5, xTrailing - (columnIndex < 2 ? 10 : 15), yBottom - 5);
                pdf.setLineWidth(1);
                pdf.setLineDashPattern(0);
            });

            // Draw border
            pdf.setLineWidth(1);
            pdf.roundedRect(x, y + 308, cfg.usableWidth, 140, 2, 2, 'S');
        }


    }
}