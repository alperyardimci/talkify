import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { parseWhatsAppChat } from '@/src/services/parser';
import { useChatStore, useAnalysisStore } from '@/src/stores';
import type { ParseProgress } from '@/src/types';

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
        type: 'text/plain',
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
      const content = await file.text();

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
