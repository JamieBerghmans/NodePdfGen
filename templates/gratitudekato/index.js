import open from "open";
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { join } from 'path';
import { cfg, pdf } from "./Config.js";
import { MonthOverviewPage } from "./pages/MonthOverviewPage.js";
import { DailyPage } from "./pages/DailyPage.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const outputPath = process.env.PDF_OUTPUT_PATH || join(__dirname, '..', '..', 'outputs', 'gratitudekato-default-en.pdf');
mkdirSync(dirname(outputPath), { recursive: true });

const monthOverviewPage = new MonthOverviewPage();
const dailyPage = new DailyPage();

const drawSideBar = (activeMonth) => {
    // Draw rectangles on each tab for each color
    for (let i = 0; i < cfg.sectionCount; i++) {
        const color = activeMonth == i ? cfg.colors[i] : [cfg.lightGrey];
        const pageLink = monthOverviewPage.getPageNumber(i);

        const currentFillColor = pdf.getFillColor();
        const currentTextColor = pdf.getTextColor();
        const currentFontSize  = pdf.getFontSize();

        const y = cfg.marginTop + ((cfg.sidebarItemHeight - cfg.sidebarItemOverlap) * i);
        pdf.setFillColor(...color);
        pdf.roundedRect(cfg.pageWidth - cfg.marginRight - cfg.sidebarWidth, y + cfg.sidebarOffsetTop, cfg.sidebarWidth, cfg.sidebarItemHeight, cfg.sidebarItemRounding, cfg.sidebarItemRounding, 'F')

        pdf.setTextColor(cfg.black);
        pdf.setFontSize(10);

        // Rotate text
        pdf.text(`${cfg.labels.months[i].substring(0, 3)}`, cfg.pageWidth - cfg.marginRight - 13, y + cfg.sidebarOffsetTop + (cfg.sidebarItemHeight / 2) - 12, { align: "left", angle: -90 });

        // Apply link
        pdf.link(cfg.pageWidth - cfg.marginRight - cfg.sidebarWidth, y + cfg.sidebarOffsetTop, cfg.sidebarWidth, cfg.sidebarItemHeight, { pageNumber: pageLink });

        // Reset text color, font size, and fill color
        pdf.setFillColor(currentFillColor);
        pdf.setTextColor(currentTextColor);
        pdf.setFontSize(currentFontSize);
    }
}

for (let i = 0; i < cfg.sectionCount; i++) {
    const homePage = monthOverviewPage.getPageNumber(i);
    const previousHomePage = i > 0 ? monthOverviewPage.getPageNumber(i - 1) : -1;
    const nextHomePage = i < cfg.sectionCount - 1 ? monthOverviewPage.getPageNumber(i + 1) : -1;

    monthOverviewPage.build(i, homePage, previousHomePage, nextHomePage);
    drawSideBar(i);

    for (let j = 0; j < monthOverviewPage.getDaysInMonth(i); j++) {
        dailyPage.build(i, j, homePage);
        drawSideBar(i);
    }
}

pdf.save(outputPath);

const shouldOpen = process.env.PDF_OPEN !== '0';
if (shouldOpen) open(outputPath);
