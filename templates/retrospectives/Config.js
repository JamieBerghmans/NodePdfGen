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
            const pageWidth  = Number(process.env.PDF_PAGE_WIDTH)  || 460;
            const pageHeight = Number(process.env.PDF_PAGE_HEIGHT) || 595;
            const marginTop    = 20;
            const marginRight  = 5;
            const marginBottom = 20;
            const marginLeft   = 35;

            // Colors
            const grey  = 50;
            const black = 0;
            const white = 255;
            const colors = [
                { color: [230, 229, 227], text: black },  // Light Grey #E6E5E3
                { color: [206, 227, 230], text: black },  // Light Blue #CEE3E6
                { color: [176, 217, 225], text: black },  // Sky Blue #B0D9E1
                { color: [149, 211, 224], text: black },  // Light Sky Blue #95D3E0
                { color: [123, 204, 221], text: black },  // Deep Sky Blue #7BCCDD
                { color: [69, 194, 219],  text: white },  // Dodger Blue #45C2DB
                { color: [64, 174, 204],  text: white },  // Steel Blue #40AECC
                { color: [69, 160, 190],  text: white },  // Blue #45A0BE
                { color: [55, 135, 170],  text: white },  // Medium Blue #3787AA
                { color: [45, 96, 141],   text: white }   // Dark Blue #2D608D
            ];

            // Side bar
            const sidebarWidth        = 20;
            const sidebarItemRounding = 5;
            const sidebarItemOverlap  = 10;
            const sidebarOffsetTop    = 10;
            const sidebarItemHeight   = (pageHeight - marginTop - marginBottom - sidebarOffsetTop) / colors.length + sidebarItemOverlap;

            // Other settings
            const rowHeight           = 28;
            const sectionCount        = colors.length;
            const meetingCountPerPage = 18;
            const usableWidth         = pageWidth - marginLeft - marginRight - sidebarWidth - 10;
            const startSprint         = Number(process.env.PDF_START_SPRINT) || 1;

            // Functions
            const dynamicWidth = (percentage) => usableWidth / 100 * percentage;

            const lang = process.env.PDF_LANG || 'en';
            let labels;
            try {
                labels = JSON.parse(readFileSync(join(__dirname, `language/${lang}/strings.json`), 'utf8'));
            } catch {
                console.error(`Language "${lang}" not found for template "retrospectives". Available: en, nl`);
                process.exit(1);
            }

            this.cfg = {
                pageWidth,
                pageHeight,
                marginTop,
                marginRight,
                marginBottom,
                marginLeft,
                grey,
                black,
                white,
                colors,
                sidebarWidth,
                sidebarItemRounding,
                sidebarItemOverlap,
                sidebarOffsetTop,
                sidebarItemHeight,
                rowHeight,
                sectionCount,
                meetingCountPerPage,
                usableWidth,
                startSprint,
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