import html2canvas from 'html2canvas';

interface ShareData {
  gpa: number;
  gpaClass: string;
  matricNumber: string;
}

export async function shareAsImage(
  elementId: string,
  data: ShareData
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#1e293b',
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
            text: `I scored ${data.gpa.toFixed(2)} GPA (${data.gpaClass}) in UNILAG MIT Programme! 🎓`,
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
      a.download = `UNILAG_MIT_GPA_${data.gpa.toFixed(2)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (err) {
    console.error('Failed to capture screenshot:', err);
  }
}
