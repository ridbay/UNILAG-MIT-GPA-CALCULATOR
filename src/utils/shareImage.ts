import html2canvas from 'html2canvas';

interface ShareData {
  gpa: number;
  gpaClass: string;
  matricNumber: string;
  coursesCount: number;
  totalUnits: number;
  totalGradePoints: number;
}

export async function shareAsImage(data: ShareData): Promise<void> {
  // Create a temporary element for the share image
  const shareCard = document.createElement('div');
  shareCard.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: 400px;
    padding: 32px;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-radius: 24px;
    font-family: system-ui, -apple-system, sans-serif;
  `;
  
  shareCard.innerHTML = `
    <div style="text-align: center; color: white;">
      <div style="font-size: 72px; font-weight: 900; background: linear-gradient(135deg, #10b981, #059669); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px;">
        ${data.gpa.toFixed(2)}
      </div>
      <div style="font-size: 14px; color: #64748b; margin-bottom: 16px;">Cumulative GPA</div>
      
      <div style="display: inline-block; padding: 8px 20px; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 9999px; margin-bottom: 24px;">
        <span style="color: #10b981; font-weight: 600;">${data.gpaClass}</span>
      </div>
      
      <div style="display: flex; justify-content: center; gap: 24px;">
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #f1f5f9;">${data.coursesCount}</div>
          <div style="font-size: 11px; color: #64748b;">Courses</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #f1f5f9;">${data.totalUnits}</div>
          <div style="font-size: 11px; color: #64748b;">Units</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #f1f5f9;">${data.totalGradePoints}</div>
          <div style="font-size: 11px; color: #64748b;">Grade Points</div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(shareCard);

  try {
    const canvas = await html2canvas(shareCard, {
      backgroundColor: null,
      scale: 2,
    });

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      // Try native share first (mobile)
      if (navigator.share) {
        const file = new File([blob], `GPA_${data.gpa.toFixed(2)}.png`, { type: 'image/png' });
        try {
          await navigator.share({
            title: 'My GPA Result',
            text: `I scored ${data.gpa.toFixed(2)} GPA (${data.gpaClass})! 🎓`,
            files: [file]
          });
          return;
        } catch (err) {
          // User cancelled or share failed, fallback to download
        }
      }

      // Fallback: Download the image
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GPA_${data.gpa.toFixed(2)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (err) {
    console.error('Failed to capture screenshot:', err);
  } finally {
    document.body.removeChild(shareCard);
  }
}
