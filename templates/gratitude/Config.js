import { jsPDF } from 'jspdf';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ComponentsBuilder } from '../../shared/ComponentBuilder.js';
import { Helper } from '../../shared/Helper.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

class Config {
    constructor() {
        if (!Config.instance) {
            // Pdf settings
            const pageWidth = Number(process.env.PDF_PAGE_WIDTH) || 460;
            const pageHeight = Number(process.env.PDF_PAGE_HEIGHT) || 595;
            const marginTop = 55;
            const marginRight = 5;
            const marginBottom = 20;
            const marginLeft = 5;

            // Colors
            const veryLightGrey = 220;
            const lightGrey = 150;
            const grey = 50;
            const black = 0;
            const white = 255;
            const colors = [
                [255, 99, 71],
                [255, 165, 0],
                [240, 230, 140],
                [50, 205, 50],
                [127, 255, 0],
                [0, 255, 255],
                [0, 191, 255],
                [138, 43, 226],
                [255, 20, 147],
                [255, 105, 180],
                [240, 128, 128],
                [238, 232, 170]
            ];

            // Side bar
            const sidebarWidth = 20;
            const sidebarItemRounding = 5;
            const sidebarItemOverlap = 10;
            const sidebarOffsetTop = 10;
            const sidebarItemHeight = (pageHeight - marginTop - marginBottom - sidebarOffsetTop) / colors.length + sidebarItemOverlap;

            // Other settings
            const year = Number(process.env.PDF_YEAR) || new Date().getFullYear();
            const rowHeight = 28;
            const usableWidth = pageWidth - marginLeft - marginRight - sidebarWidth - 10;

            // Functions
            const dynamicWidth = (percentage) => usableWidth / 100 * percentage;

            // Load language strings
            const lang = process.env.PDF_LANG || 'en';
            let labels;
            try {
                labels = JSON.parse(readFileSync(join(__dirname, `language/${lang}/strings.json`), 'utf8'));
            } catch {
                console.error(`Language "${lang}" not found for template "gratitude". Available: en, nl`);
                process.exit(1);
            }

            const sectionCount = labels.months.length;

            this.cfg = {
                pageWidth,
                pageHeight,
                marginTop,
                marginRight,
                marginBottom,
                marginLeft,
                veryLightGrey,
                lightGrey,
                grey,
                black,
                white,
                colors,
                sidebarWidth,
                sidebarItemRounding,
                sidebarItemOverlap,
                sidebarOffsetTop,
                sidebarItemHeight,
                year,
                rowHeight,
                sectionCount,
                usableWidth,
                dynamicWidth,
                labels,
            };

            this.pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: [pageWidth, pageHeight],
                putOnlyUsedFonts: true,
                floatPrecision: 16 // Default is 16, but can be set to a lower value for performance
            });

            this.helper = new Helper();
            this.componentsBuilder = new ComponentsBuilder(this.pdf, this.cfg, this.helper);
            Config.instance = this;
        }

        return Config.instance;
    }
}

const instance = new Config();
Object.freeze(instance);

export const cfg = instance.cfg;
export const pdf = instance.pdf;
export const componentsBuilder = instance.componentsBuilder;
export const helper = instance.helper;