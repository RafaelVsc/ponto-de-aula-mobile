import { useEffect, useRef, useState } from "react";
import { WebView } from "react-native-webview";
import type { WebViewMessageEvent } from "react-native-webview";

type Props = {
  initialHtml?: string;
  onChange?: (html: string) => void;
  style?: any;
};

const editorSource = require("@/assets/editor.html");

export function RichTextEditor({ initialHtml, onChange, style }: Props) {
  const webviewRef = useRef<WebView>(null);
  const [ready, setReady] = useState(false);
  const lastSentHtml = useRef<string | undefined>(undefined);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'ready') {
        setReady(true);
        if (initialHtml !== undefined) {
          send({ type: 'setContent', html: initialHtml });
          lastSentHtml.current = initialHtml;
        }
      }
      if (data.type === 'change') {
        onChange?.(data.html);
        // Atualiza o último HTML conhecido vindo do editor para evitar reenvio
        lastSentHtml.current = data.html;
      }
    } catch {}
  };

  const send = (msg: any) => {
    webviewRef.current?.postMessage(JSON.stringify(msg));
  };

  useEffect(() => {
    if (ready && initialHtml !== undefined) {
      // Só envia para a WebView se o valor vindo de fora mudou de fato
      if (lastSentHtml.current !== initialHtml) {
        send({ type: 'setContent', html: initialHtml });
        lastSentHtml.current = initialHtml;
      }
    }
  }, [ready, initialHtml]);

  return (
    <WebView
      ref={webviewRef}
      originWhitelist={['*']}
      source={editorSource}
      onMessage={handleMessage}
      javaScriptEnabled
      domStorageEnabled
      style={[
        {
          minHeight: 250,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderRadius: 8,
        },
        style,
      ]}
      scrollEnabled
    />
  );
}
