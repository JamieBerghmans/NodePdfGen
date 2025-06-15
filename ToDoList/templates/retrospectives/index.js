import open from "open";
import { cfg, pdf } from "./Config.js";
import { RetrospectiveListPage } from "./pages/RetrospectiveListPage.js";
import { RetrospectiveSummaryPage } from "./pages/RetrospectiveSummaryPage.js";

const pagesPerSection = 1 + cfg.meetingCountPerPage;

const drawSideBar = () => {
    // Draw rectangles on each tab for each color
    for (let i = 0; i < cfg.sectionCount; i++) {
        const color = cfg.colors[i];

        const currentFillColor = pdf.getFillColor();
        const currentTextColor = pdf.getTextColor();
        const currentFontSize = pdf.getFontSize();

        const y = cfg.marginTop + ((cfg.sidebarItemHeight - cfg.sidebarItemOverlap) * i);
        pdf.setFillColor(...color.color);
        pdf.roundedRect(cfg.pageWidth - cfg.marginRight - cfg.sidebarWidth, y + cfg.sidebarOffsetTop, cfg.sidebarWidth, cfg.sidebarItemHeight, cfg.sidebarItemRounding, cfg.sidebarItemRounding, 'F')

        pdf.setTextColor(color.text);
        pdf.setFontSize(10);
        
        // Rotate text
        pdf.text(`${i + 1}`, cfg.pageWidth - cfg.marginRight - 13, y + cfg.sidebarOffsetTop + (cfg.sidebarItemHeight / 2) - 6, { align: "left", angle: -90 });

        // Apply link
        pdf.link(cfg.pageWidth - cfg.marginRight - cfg.sidebarWidth, y + cfg.sidebarOffsetTop, cfg.sidebarWidth, cfg.sidebarItemHeight, { pageNumber: 1 + (i * pagesPerSection) });

        // Reset text color, font size, and fill color
        pdf.setFillColor(currentFillColor);
        pdf.setTextColor(currentTextColor);
        pdf.setFontSize(currentFontSize);
    }
}

const retrospectiveListPage = new RetrospectiveListPage();
const retrospectiveSummaryPage = new RetrospectiveSummaryPage();

for (let i = 0; i < cfg.sectionCount; i++) {
    const homePage = 1 + (i * pagesPerSection);
    retrospectiveListPage.build(i, homePage, pagesPerSection);
    drawSideBar();

    for (let j = 0; j < cfg.meetingCountPerPage; j++) {
        retrospectiveSummaryPage.build(i, j, homePage, pagesPerSection);
        drawSideBar();
    }
}

pdf.save("templates/retrospectives/Retrospectives Template.pdf");
open("templates/retrospectives/Retrospectives Template.pdf");