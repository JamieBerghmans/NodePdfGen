import { jsPDF } from 'jspdf';
import { ComponentsBuilder } from '../../shared/ComponentBuilder.js';
import { Helper } from '../../shared/Helper.js';

class Config {
  constructor() {
    if (!Config.instance) {
      // Pdf settings
      const pageWidth = 460;
      const pageHeight = 595;
      const marginTop = 20;
      const marginRight = 5;
      const marginBottom = 20;
      const marginLeft = 35;

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
      ]
        ;

      // Side bar
      const sidebarWidth = 20;
      const sidebarItemRounding = 5;
      const sidebarItemOverlap = 10;
      const sidebarOffsetTop = 10;
      const sidebarItemHeight = (pageHeight - marginTop - marginBottom - sidebarOffsetTop) / colors.length + sidebarItemOverlap;

      // === Labels ===
      // ENGLISH
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const affirmations = "Positive affirmations";
      const future = "I look forward to...";
      const breakfast = "Breakfast";
      const lunch = "Lunch";
      const dinner = "Dinner";
      const delicious = "Delicious!";
      const people = "People positively influenced";
      const gratefulFor = "I am grateful for...";
      // DUTCH
      // const months = [
      //   'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
      //   'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
      // ];
      // const affirmations = "Positieve affirmaties";
      // const future = "Ik kijk uit naar..."
      // const breakfast = "Ontbijt";
      // const lunch = "Lunch";
      // const dinner = "Diner";
      // const delicious = "Het smaakt!";
      // const people = "Mensen positief beïnvloed";
      // const gratefulFor = "Ik ben dankbaar voor..."

      // Other settings
      const year = 2025;

      const rowHeight = 28;
      const sectionCount = months.length;
      const meetingCountPerPage = 18;
      const usableWidth = pageWidth - marginLeft - marginRight - sidebarWidth - 10;


      // Functions
      const dynamicWidth = (percentage) => usableWidth / 100 * percentage;

      this.cfg = {
        // Pdf settings
        pageWidth,
        pageHeight,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,

        // Colors
        veryLightGrey,
        lightGrey,
        grey,
        black,
        white,
        colors,

        // Side bar
        sidebarWidth,
        sidebarItemRounding,
        sidebarItemOverlap,
        sidebarOffsetTop,
        sidebarItemHeight,

        // Labels
        months,
        affirmations,
        future,
        breakfast,
        lunch,
        dinner,
        delicious,
        people,
        gratefulFor,

        // Other settings
        year,
        rowHeight,
        sectionCount,
        meetingCountPerPage,
        usableWidth,

        // Functions
        dynamicWidth
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