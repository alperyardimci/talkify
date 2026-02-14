import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import JSZip from 'jszip';
import { parseWhatsAppChat } from '@/src/services/parser';
import { useChatStore, useAnalysisStore } from '@/src/stores';
import type { ParseProgress } from '@/src/types';

/**
 * Given a ZIP ArrayBuffer, find and return the contents of the first .txt file.
 * WhatsApp exports typically contain a single _chat.txt file inside the ZIP.
 */
async function extractTxtFromZip(data: ArrayBuffer): Promise<string> {
  const zip = await JSZip.loadAsync(data);

  // Find .txt files, prefer _chat.txt naming convention
  const txtFiles = Object.keys(zip.files).filter(
    (name) => name.endsWith('.txt') && !zip.files[name].dir
  );

  if (txtFiles.length === 0) {
    throw new Error('ZIP dosyasında .txt dosyası bulunamadı');
  }

  // Prefer the WhatsApp chat file (_chat.txt or WhatsApp Chat)
  const chatFile =
    txtFiles.find((n) => n.includes('_chat') || n.toLowerCase().includes('whatsapp chat')) ??
    txtFiles[0];

  const content = await zip.files[chatFile].async('string');
  return content;
}

export function useWhatsAppParser() {
  const { setChat, setProgress, setFileName, setLoading, setError, reset } =
    useChatStore();
  const resetAnalysis = useAnalysisStore((s) => s.reset);

  const pickAndParse = useCallback(async () => {
    try {
      reset();
      resetAnalysis();
      setLoading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'application/zip', 'application/x-zip-compressed', 'application/octet-stream'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) {
        setLoading(false);
        return;
      }

      const asset = result.assets[0];
      setFileName(asset.name);

      setProgress({
        stage: 'reading',
        progress: 10,
        message: 'Dosya okunuyor...',
      });

      const file = new File(asset.uri);
      let content: string;

      const isZip =
        asset.name.toLowerCase().endsWith('.zip') ||
        asset.mimeType === 'application/zip' ||
        asset.mimeType === 'application/x-zip-compressed';

      if (isZip) {
        setProgress({
          stage: 'reading',
          progress: 15,
          message: 'ZIP açılıyor...',
        });
        const arrayBuffer = await file.bytes();
        content = await extractTxtFromZip(arrayBuffer.buffer as ArrayBuffer);
      } else {
        content = await file.text();
      }

      if (!content || content.trim().length === 0) {
        throw new Error('Dosya boş veya okunamadı');
      }

      const onProgress = (progress: ParseProgress) => {
        setProgress(progress);
      };

      const parsedChat = await parseWhatsAppChat(content, onProgress);

      setChat(parsedChat);
      setProgress({
        stage: 'done',
        progress: 100,
        message: 'Tamamlandı!',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      setError(message);
      setProgress({
        stage: 'error',
        progress: 0,
        message,
      });
    } finally {
      setLoading(false);
    }
  }, [reset, setLoading, setFileName, setProgress, setChat, setError]);

  return { pickAndParse };
}
