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
    this.canvas = document.createElement('canvas');
    this.canvas.width = options.width * 3; // 3x scale for high DPI
    this.canvas.height = options.height * 3;
    this.ctx = this.canvas.getContext('2d')!;

    // Set up high DPI rendering
    this.ctx.scale(3, 3);
    this.ctx.textBaseline = 'top';
  }

  async exportImage(): Promise<string> {
    // Clear canvas
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.options.width, this.options.height);

    // Wait for fonts to load
    await document.fonts.ready;
    await this.loadFonts();

    // Draw content
    await this.drawContent();

    // Convert to data URL
    return this.canvas.toDataURL('image/png', 1.0);
  }

  private async loadFonts(): Promise<void> {
    // Wait for document fonts to be ready
    await document.fonts.ready;
    // Additional delay to ensure fonts are fully rendered
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  private async drawContent(): Promise<void> {
    const { width, height, padding } = this.options;
    const contentWidth = width - padding * 2;

    // Set up text styles
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';

    // Top section
    let currentY = padding;

    // Product Name - using slate-500 (#64748b) to match preview
    this.ctx.fillStyle = '#64748b';
    this.ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif';
    this.drawTextWithLetterSpacing('产品名称 / PRODUCT NAME:', padding, currentY, 2); // Added colon for better readability

    currentY += 16;
    this.ctx.fillStyle = '#0f172a'; // slate-900
    this.ctx.font = '900 30px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif'; // font-black text-3xl
    await this.wrapText(this.options.productName, padding, currentY, contentWidth * 0.6, 38);

    // Model and Date - proper spacing gap-6 = 24px
    currentY += 70;
    const modelLabelX = padding;
    const dateLabelX = padding + 200; // gap-12 = 48px for flex gap

    // Model label - using slate-500 (#64748b) to match preview
    this.ctx.fillStyle = '#64748b';
    this.ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif';
    this.drawTextWithLetterSpacing('型号 / MODEL:', modelLabelX, currentY, 2); // Added colon for better readability

    // Date label (aligned with model label)
    this.drawTextWithLetterSpacing('日期 / DATE:', dateLabelX, currentY, 2); // Added colon for better readability

    currentY += 16; // gap-1 = 4px, but using 16px for better spacing
    // Model value - using slate-900, font-bold, text-2xl, font-mono, tracking-tight
    this.ctx.fillStyle = '#0f172a';
    this.ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto Mono", monospace';
    this.ctx.fillText(this.options.productModel, modelLabelX, currentY);

    // Date value (aligned with model value)
    this.ctx.fillText(this.options.productionYear, dateLabelX, currentY);

    // QC Stamp
    await this.drawQCStamp(width - padding - 120, padding + 20);

    // Bottom section
    const bottomY = height - padding - 80;

    // Draw line
    this.ctx.strokeStyle = '#e2e8f0';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(padding, bottomY - 20);
    this.ctx.lineTo(width - padding, bottomY - 20);
    this.ctx.stroke();

    // Company info - uppercase tracking-wide
    this.ctx.fillStyle = '#0f172a';
    this.ctx.font = '900 16px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif'; // font-black text-base uppercase tracking-wide
    const upperCompanyName = this.options.companyName.toUpperCase();
    await this.wrapText(upperCompanyName, padding, bottomY, contentWidth * 0.7, 20);

    // Website - slate-500 font-mono tracking-wider
    this.ctx.fillStyle = '#64748b';
    this.ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto Mono", monospace';
    this.ctx.fillText(this.options.website, padding, bottomY + 25);

    // Address and Mail grid - text-slate-600 leading-snug font-medium
    this.ctx.fillStyle = '#475569'; // slate-600
    this.ctx.font = '500 10px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif'; // font-medium

    // Add label - using slate-400 (#94a3b8) to match preview
    this.ctx.fillStyle = '#94a3b8'; // slate-400
    this.ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif'; // font-bold
    this.drawTextWithLetterSpacing('ADD:', padding, bottomY + 45, 1); // Minimal spacing with colon

    // Address value - slate-600 break-words
    this.ctx.fillStyle = '#475569'; // slate-600
    this.ctx.font = '500 10px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif'; // font-medium
    await this.wrapText(this.options.address, padding + 35, bottomY + 45, contentWidth * 0.7 - 35, 12);

    // Mail label - using slate-400 (#94a3b8) to match preview
    this.ctx.fillStyle = '#94a3b8'; // slate-400
    this.ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif'; // font-bold
    this.drawTextWithLetterSpacing('MAIL:', padding, bottomY + 65, 1); // Minimal spacing with colon

    // Email value - slate-600 font-mono
    this.ctx.fillStyle = '#475569'; // slate-600
    this.ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto Mono", monospace';
    this.ctx.fillText(this.options.email, padding + 35, bottomY + 65);
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