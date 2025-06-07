export class ComponentsBuilder {
  constructor(pdf, cfg, helper) {
    this.pdf = pdf;
    this.cfg = cfg;
    this.helper = helper;
  }

  drawPriority = (x, centerY, spacing = 15) => {
    ['H', 'M', 'L'].forEach((label, j) => {
      const cx = x + 8 + j * spacing;
      this.pdf.circle(cx, centerY, 6, 'S');
      this.pdf.setFontSize(5);
      this.pdf.text(label, cx, centerY + 1.5, { align: 'center' });
    });
  }

  drawProgressBar = (x, centerY) => {
    const barW = 40;
    const barH = 10;
    const barX = x;
    const barY = centerY - barH / 2;
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
      const lineWidth = this.pdf.getLineWidth();
      this.pdf.setLineWidth(0.5);
      this.pdf.line(x - 2, y + 2, x + textWidth + 2, y + 2);
      this.pdf.setLineWidth(lineWidth);
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

  drawTableHeaders = (startX, y, tableConfig) => {
    if (!tableConfig.IncludeHeaders) return;

    let x = startX;
    tableConfig.Columns.forEach((columnConfig, i) => {
      const fontSize = columnConfig.FontSize ?? tableConfig.HeaderFontSize;

      this.pdf.setFontSize(fontSize);
      this.pdf.setTextColor(columnConfig.TextColor ?? tableConfig.HeaderTextColor);

      if (columnConfig.Text) {
        const colX = x + columnConfig.Width / 2;
        this.pdf.text(columnConfig.Text, colX, y, { align: "center" });
      }
      x += columnConfig.Width;

      if (columnConfig.DividerLine) {
        this.pdf.setDrawColor(tableConfig.DividerLineColour);
        this.pdf.line(x, y - (fontSize / 2), x, y + 6);
      }
    });

    if (tableConfig.UnderlineHeaders) {
      this.pdf.setDrawColor(tableConfig.DividerLineColour);
      this.pdf.line(startX, y + 6, startX + tableConfig.Length, y + 6);
    }
  };

  drawTable = (x, y, tableConfig, callback) => {
    this.drawTableHeaders(x, y, tableConfig);
    y = y + 6 + tableConfig.DividerLineWidth; // Adjust y position after headers
    for (let i = 0; i < tableConfig.RowCount; i++) {
      var rowConfig = tableConfig.Rows[i % tableConfig.Rows.length];
      const rowY = y + (tableConfig.RowHeight * i) + (tableConfig.DividerLineWidth * i);
      const centerRowY = rowY + (tableConfig.RowHeight / 2);

      // Draw row background color
      if (rowConfig.BackgroundColor) {
        this.pdf.setFillColor(...rowConfig.BackgroundColor);
        this.pdf.rect(x, rowY, tableConfig.Length, tableConfig.RowHeight, 'F');
      }

      // Horizontal divider line
      if (tableConfig.RowDividerLine) {
        this.pdf.setDrawColor(tableConfig.DividerLineColour);
        this.pdf.line(x, rowY + tableConfig.RowHeight, x + tableConfig.Length, rowY + tableConfig.RowHeight);
      }

      for (let j = 0; j < tableConfig.Columns.length; j++) {
        const columnConfig = tableConfig.Columns[j];
        const columnBegin = x + this.helper.sum(tableConfig.Columns.map(c => c.Width).slice(0, j));
        const columnEnd = x + this.helper.sum(tableConfig.Columns.map(c => c.Width).slice(0, j+1));

        // Vertical divider line
        if (columnConfig.DividerLine) {
          this.pdf.setDrawColor(tableConfig.DividerLineColour);
          this.pdf.line(columnEnd, rowY, columnEnd, rowY + tableConfig.RowHeight);
        }

        callback(i, j, columnBegin, columnEnd, rowY, centerRowY, rowY + tableConfig.RowHeight);
      }
    }
  }

  drawMenu(x, y, items, fontSize = 10) {
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setFontSize(fontSize);

    x = x - this.helper.sum(items.map(item => this.pdf.getTextWidth(item.text))) - ((items.length - 1) * ((fontSize - 5) * 2));

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      this.drawText(x, y, item.pageNumber, item.text, fontSize, item.link)

      x += this.pdf.getTextWidth(item.text) + (fontSize - 5);

      if (i < items.length - 1) {
        // Not last item, draw separator
        const lineWidth = this.pdf.getLineWidth();
        this.pdf.setLineWidth(1);
        this.pdf.setDrawColor(0);
        this.pdf.line(x, y + 2, x, y - fontSize);
        this.pdf.setLineWidth(lineWidth);

        x += (fontSize - 5);
      }
    }
  }
}