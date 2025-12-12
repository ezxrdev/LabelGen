/**
 * Canvas-based export utilities to avoid html2canvas limitations
 */

interface ExportOptions {
  width: number;
  height: number;
  padding: number;
  productName: string;
  productModel: string;
  productionYear: string;
  companyName: string;
  website: string;
  address: string;
  email: string;
  qcStatus: string;
  qcDate: string;
}

export class CanvasExporter {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private options: ExportOptions;

  constructor(options: ExportOptions) {
    this.options = options;
    // Create canvas with border area (700x500) for cutting guides
    this.canvas = document.createElement('canvas');
    this.canvas.width = 700 * 3; // 700px width with 3x scale for high DPI
    this.canvas.height = 500 * 3; // 500px height with 3x scale for high DPI
    this.ctx = this.canvas.getContext('2d')!;

    // Set up high DPI rendering
    this.ctx.scale(3, 3);
    this.ctx.textBaseline = 'top';
  }

  async exportImage(): Promise<string> {
    // Clear canvas with light background
    this.ctx.fillStyle = '#f8f9fa';
    this.ctx.fillRect(0, 0, 700, 500);

    // Wait for fonts to load
    await document.fonts.ready;
    await this.loadFonts();

    // Draw border and cutting guides
    this.drawBorderAndGuides();

    // Draw content within the border
    await this.drawContent();

    // Convert to data URL
    return this.canvas.toDataURL('image/png', 1.0);
  }

  private drawBorderAndGuides(): void {
    // Draw outer label area with border - make it more prominent
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(20, 20, 600, 400);

    // Draw main border with stronger visibility
    this.ctx.strokeStyle = '#6b7280'; // Darker gray for better visibility
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(20, 20, 600, 400);

    // Draw cutting corner marks with stronger lines - positioned correctly at border edges
    this.drawCornerMark(20, 20, true, true); // top-left
    this.drawCornerMark(605, 20, true, false); // top-right (20 + 600 - 15)
    this.drawCornerMark(20, 420, false, true); // bottom-left (20 + 400)
    this.drawCornerMark(605, 420, false, false); // bottom-right (20 + 600 - 15, 20 + 400)
  }

  private drawCornerMark(x: number, y: number, top: boolean, left: boolean): void {
    this.ctx.save();
    this.ctx.strokeStyle = '#374151';
    this.ctx.lineWidth = 2;

    if (top) {
      // Draw top horizontal line (from top-left corner, extending right)
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + 15, y);
      this.ctx.stroke();
    } else {
      // Draw bottom horizontal line (from bottom-left corner, extending right)
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + 15, y);
      this.ctx.stroke();
    }

    if (left) {
      // Draw left vertical line
      if (top) {
        // Top-left: extend downward
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, y + 15);
        this.ctx.stroke();
      } else {
        // Bottom-left: extend upward
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, y - 15);
        this.ctx.stroke();
      }
    } else {
      // Draw right vertical line
      if (top) {
        // Top-right: extend downward
        this.ctx.beginPath();
        this.ctx.moveTo(x + 15, y);
        this.ctx.lineTo(x + 15, y + 15);
        this.ctx.stroke();
      } else {
        // Bottom-right: extend upward
        this.ctx.beginPath();
        this.ctx.moveTo(x + 15, y);
        this.ctx.lineTo(x + 15, y - 15);
        this.ctx.stroke();
      }
    }

    this.ctx.restore();
  }

  
  private async loadFonts(): Promise<void> {
    // Wait for document fonts to be ready
    await document.fonts.ready;
    // Additional delay to ensure fonts are fully rendered
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  private async drawContent(): Promise<void> {
    // Content area within border (20px offset from canvas edges, plus 48px padding)
    const borderX = 20;
    const borderY = 20;
    const padding = 48;
    const contentWidth = 600;
    const contentHeight = 400;

    // Actual content coordinates
    const contentX = borderX + padding;
    const contentY = borderY + padding;
    const availableWidth = contentWidth - (padding * 2);

    // Set up text styles
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';

    // Top section - matching preview's pt-1 (4px top padding)
    let currentY = contentY + 4;

    // Product Name - using slate-500 (#64748b) to match preview
    this.ctx.fillStyle = '#64748b';
    this.ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif';
    this.drawTextWithLetterSpacing('产品名称 / PRODUCT NAME:', contentX, currentY, 2);

    currentY += 16;
    this.ctx.fillStyle = '#0f172a'; // slate-900
    this.ctx.font = '900 30px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif'; // font-black text-3xl
    await this.wrapText(this.options.productName, contentX, currentY, availableWidth * 0.6, 38);

    // Model and Date - proper spacing gap-6 = 24px
    currentY += 70;
    const modelLabelX = contentX;
    const dateLabelX = contentX + 200; // gap-12 = 48px for flex gap

    // Model label - using slate-500 (#64748b) to match preview
    this.ctx.fillStyle = '#64748b';
    this.ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif';
    this.drawTextWithLetterSpacing('型号 / MODEL:', modelLabelX, currentY, 2);

    // Date label (aligned with model label)
    this.drawTextWithLetterSpacing('日期 / DATE:', dateLabelX, currentY, 2);

    currentY += 16;
    // Model value - using slate-900, font-bold, text-2xl, font-mono, tracking-tight
    this.ctx.fillStyle = '#0f172a';
    this.ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto Mono", monospace';
    this.ctx.fillText(this.options.productModel, modelLabelX, currentY);

    // Date value (aligned with model value)
    this.ctx.fillText(this.options.productionYear, dateLabelX, currentY);

    // QC Stamp - positioned at the right edge of the content area with proper top margin to match preview mt-2
    await this.drawQCStamp(borderX + contentWidth - 120 - padding, contentY + 8); // 8px = 0.5rem to match mt-2

    // Let's use the exact same layout as preview - Flexbox simulation
    const bottomSectionStart = contentY + (contentHeight - (padding * 2)) - 120; // Leave space for bottom section

    // Draw separator line at bottom section start
    this.ctx.strokeStyle = '#e2e8f0';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(contentX, bottomSectionStart);
    this.ctx.lineTo(contentX + availableWidth, bottomSectionStart);
    this.ctx.stroke();

    // Use preview's exact spacing: pt-8 = 32px, gap-3 = 12px, gap-y-1 = 4px
    let bottomCurrentY = bottomSectionStart + 16; // Reduced from 32px to fit better

    // Company name (text-base font-black = 16px)
    this.ctx.fillStyle = '#0f172a';
    this.ctx.font = '900 16px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif';
    const upperCompanyName = this.options.companyName.toUpperCase();
    await this.wrapText(upperCompanyName, contentX, bottomCurrentY, availableWidth * 0.7, 16);
    bottomCurrentY += 18; // Company name height

    // Website (text-[10px] font-bold font-mono tracking-wider = 10px)
    this.ctx.fillStyle = '#64748b';
    this.ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto Mono", monospace';
    this.ctx.fillText(this.options.website, contentX, bottomCurrentY);
    bottomCurrentY += 12; // Website height

    // Gap-3 = 12px between sections
    bottomCurrentY += 12;

    // Address/Mail grid (text-[10px] font-medium leading-snug = 10px with tight line height)
    // ADD label (font-bold text-slate-400 uppercase tracking-wider)
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif';
    this.drawTextWithLetterSpacing('ADD:', contentX, bottomCurrentY, 1);

    // Address value (font-medium text-slate-600)
    this.ctx.fillStyle = '#475569';
    this.ctx.font = '500 10px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif';
    await this.wrapText(this.options.address, contentX + 35, bottomCurrentY, availableWidth * 0.7 - 35, 10);
    bottomCurrentY += 12; // Address row height

    // Gap-y-1 = 4px between rows
    bottomCurrentY += 4;

    // MAIL label
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif';
    this.drawTextWithLetterSpacing('MAIL:', contentX, bottomCurrentY, 1);

    // Email value (font-mono)
    this.ctx.fillStyle = '#475569';
    this.ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto Mono", monospace';
    this.ctx.fillText(this.options.email, contentX + 35, bottomCurrentY);
  }

  private async drawQCStamp(x: number, y: number): Promise<void> {
    const stampWidth = 120;
    const stampHeight = 100;

    // Draw border - slate-900
    this.ctx.strokeStyle = '#0f172a';
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(x, y, stampWidth, stampHeight);

    // Inner border - slate-400 opacity-40
    this.ctx.strokeStyle = '#94a3b8';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x + 4, y + 4, stampWidth - 8, stampHeight - 8);

    // QC Status - slate-900 font-black text-3xl tracking-widest mt-1
    this.ctx.fillStyle = '#0f172a';
    this.ctx.font = '900 30px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif'; // font-black text-3xl
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.options.qcStatus, x + stampWidth / 2, y + 25);

    // Line - w-[85%] h-[2px] bg-slate-900 my-1, moved down to create more space
    this.ctx.strokeStyle = '#0f172a';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x + stampWidth * 0.075, y + 55); // Moved down 3px
    this.ctx.lineTo(x + stampWidth * 0.925, y + 55);
    this.ctx.stroke();

    // INSPECTED text - reduced font size and increased spacing from line
    this.ctx.fillStyle = '#475569'; // slate-600
    this.ctx.font = '700 8px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif'; // Smaller font
    this.drawTextWithLetterSpacing('INSPECTED', x + stampWidth / 2, y + 68, 1.5, true); // Reduced spacing and centered

    // QC Date - text-xs font-bold font-mono text-slate-900 (further reduced size)
    this.ctx.fillStyle = '#0f172a'; // slate-900
    this.ctx.font = 'bold 9px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto Mono", monospace'; // Smaller to match preview
    this.ctx.fillText(this.options.qcDate, x + stampWidth / 2, y + 80);

    // Reset text alignment
    this.ctx.textAlign = 'left';
  }

  private async wrapText(text: string, x: number, y: number, maxWidth: number, lineHeight: number): Promise<void> {
    const words = text.split('');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n];
      const metrics = this.ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        this.ctx.fillText(line, x, currentY);
        line = words[n];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    this.ctx.fillText(line, x, currentY);
  }

  private drawTextWithLetterSpacing(text: string, x: number, y: number, letterSpacing: number = 0, isCentered: boolean = false): void {
    if (letterSpacing === 0) {
      this.ctx.fillText(text, x, y);
      return;
    }

    // Calculate total width with letter spacing
    let totalWidth = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      totalWidth += this.ctx.measureText(char).width;
      if (i < text.length - 1) {
        totalWidth += letterSpacing;
      }
    }

    let currentX = x;
    if (isCentered) {
      currentX = x - totalWidth / 2;
    }

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      this.ctx.fillText(char, currentX, y);
      const charWidth = this.ctx.measureText(char).width;
      currentX += charWidth + letterSpacing;
    }
  }

  downloadImage(filename: string): void {
    this.exportImage().then(dataUrl => {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      link.click();
    });
  }

  async exportPDF(filename: string): Promise<void> {
    const imgData = await this.exportImage();
    const { jsPDF } = await import('jspdf');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [this.options.width, this.options.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, this.options.width, this.options.height);
    pdf.save(filename);
  }
}