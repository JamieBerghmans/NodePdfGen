export class Config {

    // singleton constructor
    constructor() {
        this.cfg = {
            // Pdf settings
            pageWidth: 460,
            pageHeight: 595,
            marginTop: 20,
            marginRight: 5,
            marginBottom: 20,
            marginLeft: 35,

            // Colors
            grey: 50,
            black: 0,
            white: 255,
            colors:[
                { color: [230, 229, 227], text: cfg.black },  // Light Grey #E6E5E3
                { color: [206, 227, 230], text: cfg.black },  // Light Blue #CEE3E6
                { color: [176, 217, 225], text: cfg.black },  // Sky Blue #B0D9E1
                { color: [149, 211, 224], text: cfg.black },  // Light Sky Blue #95D3E0
                { color: [123, 204, 221], text: cfg.black },  // Deep Sky Blue #7BCCDD
                { color: [69, 194, 219], text: cfg.white },   // Dodger Blue #45C2DB
                { color: [64, 174, 204], text: cfg.white },   // Steel Blue #40AECC
                { color: [69, 160, 190], text: cfg.white },   // Blue #45A0BE
                { color: [55, 135, 170], text: cfg.white },   // Medium Blue #3787AA
                { color: [45, 96, 141], text: cfg.white }     // Dark Blue #2D608D
            ],

            // Text field height
            rowHeight: 28,

            // Side bar
            sectionCount: colors.length,
            sidebarWidth: 20,
            sidebarRounding: 5,
            sidebarItemOverlap: 10,
            sidebarItemHeight: (pageHeight - marginTop - marginBottom) / colors.length + sidebarItemOverlap,
        }
    }
}

export default new Config();


















import { jsPDF } from 'jspdf';
import { ComponentsBuilder } from './ComponentBuilder.js';
import { Helper } from './Helper.js';

class Shared {
  constructor() {
    if (!Shared.instance) {
      this.cfg = {
        pageWidth: 460,
        pageHeight: 595,
        marginTop: 20,
        marginRight: 5,
        marginBottom: 20,
        marginLeft: 35,
        rowHeight: 28,
        taskCount: 18,
        subTaskCount: 17,
        sectionCount: 3,
        grey: 50,
        black: 0,
        white: 255,
        rowColors: [
          [255, 255, 255],
          [109, 215, 237]
        ],
        headerColors: [
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
        ],
      };

      this.pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [this.cfg.pageWidth, this.cfg.pageHeight],
        putOnlyUsedFonts: true,
        floatPrecision: 16 // Default is 16, but can be set to a lower value for performance
      });

      this.helper = new Helper();
      this.componentsBuilder = new ComponentsBuilder(this.pdf, this.cfg, this.helper);
      Shared.instance = this;
    }
    return Shared.instance;
  }
}

const instance = new Shared();
Object.freeze(instance);

export const cfg = instance.cfg;
export const pdf =  instance.pdf;
export const componentsBuilder = instance.componentsBuilder;
export const helper = instance.helper;