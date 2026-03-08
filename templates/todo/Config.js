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
            const rowHeight = 28;
            const taskCount = 17;
            const subTaskCount = 16;
            const sectionCount = 3;

            // Colors
            const grey = 50;
            const black = 0;
            const white = 255;

            const rowColors = [
                [255, 255, 255],
                [109, 215, 237]
            ];
            const headerColors = [
                [255, 99, 71],
                [255, 165, 0],
                [50, 205, 50],
                [0, 255, 255],
                [0, 191, 255],
                [138, 43, 226],
                [255, 20, 147],
                [240, 230, 140],
                [255, 105, 180],
                [127, 255, 0]
            ];

            // Load language strings
            const lang = process.env.PDF_LANG || 'en';
            let labels;
            try {
                labels = JSON.parse(readFileSync(join(__dirname, `language/${lang}/strings.json`), 'utf8'));
            } catch {
                console.error(`Language "${lang}" not found for template "todo". Available: en, nl`);
                process.exit(1);
            }

            this.cfg = {
                pageWidth,
                pageHeight,
                marginTop,
                marginRight,
                marginBottom,
                marginLeft,
                rowHeight,
                taskCount,
                subTaskCount,
                sectionCount,
                grey,
                black,
                white,
                rowColors,
                headerColors,
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
