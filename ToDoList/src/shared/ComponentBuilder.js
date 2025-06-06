export class ComponentsBuilder {
  constructor(pdf, cfg) {
    this.pdf = pdf;
    this.cfg = cfg;
  }

  drawPriority = (x, centerY, spacing = 15) => {
    ['H', 'M', 'L'].forEach((label, j) => {
      const cx = x + 8 + j * spacing;
      this.pdf.circle(cx, centerY, 6, 'S');
      this.pdf.setFontSize(5);
      this.pdf.setTextColor(this.cfg.grey);
      this.pdf.text(label, cx, centerY + 1.5, { align: 'center' });
    });
  }

  drawProgressBar = (x, centerY) => {
    const barW = 40;
    const barH = 10;
    const barX = x;
    const barY = centerY - barH / 2;
    this.pdf.setDrawColor(this.cfg.grey);
    this.pdf.setFillColor(230);
    this.pdf.roundedRect(barX, barY, barW, barH, 3, 3, 'S');
    for (let j = 1; j < 4; j++) this.pdf.line(barX + j * (barW / 4), barY, barX + j * (barW / 4), barY + barH);
  }

  drawNoteButton = (x, centerY, pageNumber) => {
    const iconX = x + 5;
    const iconY = centerY - 5;
    const iconW = 12;
    const iconH = 14;
    this.pdf.rect(iconX, iconY, iconW, iconH);
    this.pdf.line(iconX, iconY, iconX + 5, iconY - 5);
    this.pdf.line(iconX + 5, iconY - 5, iconX + iconW, iconY - 5);
    this.pdf.line(iconX + iconW, iconY - 5, iconX + iconW, iconY);
    this.pdf.link(iconX, centerY - this.cfg.rowHeight + 6, iconW, this.cfg.rowHeight, { pageNumber });
  }

  drawSubTasksButton = (x, centerY, pageNumber) => {
    const detailBoxX = x + 12
    const boxSize = 6
    const spacingY = 6
    const lineLength = 7
    const startYBox = centerY - spacingY - 3;

    for (let k = 0; k < 3; k++) {
      const y = startYBox + k * spacingY;
      this.pdf.rect(detailBoxX - 10, y, boxSize, boxSize, 'S');
      this.pdf.line(detailBoxX - 4, y + boxSize / 2, detailBoxX + lineLength, y + boxSize / 2);
    }

    this.pdf.link(x, centerY - 12, 24, 24, { pageNumber });
  }

  drawText = (x, y, pageNumber, text, fontSize = 10, link = false) => {
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setFontSize(fontSize);
    this.pdf.setTextColor(0);
    this.pdf.text(text, x, y, { pageNumber });
    const textWidth = this.pdf.getTextWidth(text);

    if (link) {
      this.pdf.link(x - 4, y - fontSize - 4, textWidth + 8, fontSize + 8, { pageNumber });
    }
  }

  drawPageHeader = (x, y, title, titleBold = undefined, subtitle = undefined) => {
    this.pdf.setFont("helvetica", "bold");
    this.pdf.setFontSize(18);
    this.pdf.text(title, x, y);
    if (titleBold) {
      const width = this.pdf.getTextWidth(title);
      this.pdf.setFont("helvetica", "normal");
      this.pdf.text(titleBold, x + width, y);
    }
    
    if (subtitle) {
      this.pdf.setFont("helvetica", "normal");
      this.pdf.setFontSize(10);
      this.pdf.text(subtitle, x, y + 12);
    }
  };

  drawTableHeaders = (startX, y, headers, colWidths) => {
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(0);
    let x = startX;
    headers.forEach((text, i) => {
      if (text) {
        const colX = x + colWidths[i] / 2;
        this.pdf.text(text, colX, y, { align: "center" });
      }
      x += colWidths[i];
    });
    this.pdf.setDrawColor(this.cfg.grey);
    this.pdf.line(startX, y + 6, this.cfg.pageWidth - this.cfg.margin, y + 6);
  };

  drawRow = (index, x, y, callback, background = false) => {
    const centerY = y - this.cfg.rowHeight / 2;
    const color = this.cfg.colors[Math.floor(index / 2) % this.cfg.colors.length];

    if (index % 2 === 1 && background) {
      this.pdf.setFillColor(...color);
      this.pdf.rect(this.cfg.margin, y - this.cfg.rowHeight, this.cfg.pageWidth - 2 * this.cfg.margin, this.cfg.rowHeight, 'F');
    }

    callback(centerY);
  };

  drawDivider = (x, y, height, width = 0.1, color = this.cfg.grey) => {
    const lineWidth = this.pdf.getLineWidth();
    this.pdf.setLineWidth(width);
    this.pdf.setDrawColor(color);
    this.pdf.line(x, y, x, y + height);
    this.pdf.setLineWidth(lineWidth);
  }
}