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