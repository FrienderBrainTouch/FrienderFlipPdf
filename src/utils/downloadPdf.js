// 안전한 PDF 다운로드 유틸
// fetch로 응답을 확인한 뒤 Blob으로 저장합니다.
export default async function downloadPdf(url, suggestedFileName) {
  try {
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      throw new Error(`파일을 가져오지 못했습니다 (status ${res.status})`);
    }
    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    // 간단한 판정: content-type에 pdf가 포함되어 있거나 octet-stream 허용
    if (!(contentType.includes('pdf') || contentType.includes('application/octet-stream'))) {
      const text = await res.text();
      console.error('다운로드 응답이 PDF가 아님:', contentType, text.slice(0, 200));
      throw new Error('서버 응답이 PDF가 아닙니다. (404 또는 잘못된 파일)');
    }

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = suggestedFileName || url.split('/').pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
    // revoke after a tick to ensure download started
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
  } catch (err) {
    console.error('PDF 다운로드 실패', err);
    // 간단한 사용자 피드백 - 프로젝트의 토스트/에러 UI로 변경 권장
    alert(`PDF 다운로드 실패: ${err.message}`);
    throw err;
  }
}
