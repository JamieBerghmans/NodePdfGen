import { jsPDF } from 'jspdf';
import { ComponentsBuilder } from './ComponentBuilder.js';
import { Helper } from './Helper.js';

class Shared {
  constructor() {
    if (!Shared.instance) {
      this.pdf = new jsPDF({ unit: 'pt', format: 'a5' });
      this.cfg = {
        pageWidth: 420,
        pageHeight: 595,
        margin: 30,
        rowHeight: 28,
        taskCount: 18,
        subTaskCount: 17,
        sectionCount: 3,
        grey: 50,
        black: 0,
        white: 255,
        rowColors: [
          [255, 255, 255],
          [207, 243, 250]
        ],
        headerColors: [
          [255, 210, 218], [255, 225, 200], [255, 250, 180], [210, 255, 210], [200, 255, 250],
          [210, 235, 255], [225, 210, 255], [235, 210, 255], [245, 210, 255], [255, 210, 245]
        ],
      };
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