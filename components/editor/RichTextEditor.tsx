import { useEffect, useMemo, useRef, useState } from "react";
import { Asset } from "expo-asset";
import { WebView } from "react-native-webview";
import type { WebViewMessageEvent } from "react-native-webview";
import quillCss from "../../assets/editor/quill.snow.cssasset";
import quillJs from "../../assets/editor/quill.min.jsbundle";

type Props = {
  initialHtml?: string;
  onChange?: (html: string) => void;
  style?: any;
};

const quillCssAsset = Asset.fromModule(quillCss as any);
const quillJsAsset = Asset.fromModule(quillJs as any);

export function RichTextEditor({ initialHtml, onChange, style }: Props) {
  const webviewRef = useRef<WebView>(null);
  const [ready, setReady] = useState(false);
  const lastSentHtml = useRef<string | undefined>(undefined);
  const [assetsReady, setAssetsReady] = useState(false);
  const [cssContent, setCssContent] = useState<string | null>(null);
  const [jsContent, setJsContent] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadAssets = async () => {
      try {
        await Asset.loadAsync([quillCssAsset, quillJsAsset]);
        const [cssRes, jsRes] = await Promise.all([
          fetch(quillCssAsset.uri),
          fetch(quillJsAsset.uri),
        ]);
        const [css, js] = await Promise.all([cssRes.text(), jsRes.text()]);
        if (!cancelled) {
          setCssContent(css);
          setJsContent(js);
        }
      } catch (err) {
        // silencioso; o toast visual do WebView é suficiente em dev
      } finally {
        if (!cancelled) setAssetsReady(true);
      }
    };
    loadAssets();
    return () => {
      cancelled = true;
    };
  }, []);

  const editorHtml = useMemo(() => {
    const quillCssInline = cssContent ?? "";
    const quillJsInline = jsContent ?? "";
    return `
<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>${quillCssInline}</style>
  <style>
    body { margin: 0; padding: 12px; font-family: -apple-system, 'Segoe UI', sans-serif; background: #fff; }
    #toolbar { border: 1px solid #e5e7eb; border-radius: 8px 8px 0 0; }
    #editor { min-height: 200px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 12px; }
  </style>
</head>
<body>
  <div id="toolbar">
    <select class="ql-header"><option value="1"></option><option value="2"></option><option selected></option></select>
    <button class="ql-bold"></button><button class="ql-italic"></button><button class="ql-underline"></button>
    <button class="ql-list" value="ordered"></button><button class="ql-list" value="bullet"></button>
    <select class="ql-color"></select><select class="ql-background"></select>
    <button class="ql-link"></button>
  </div>
  <div id="editor"></div>
  <script>
    ${quillJsInline}
    const RN = window.ReactNativeWebView;
    const send = (msg) => RN && RN.postMessage(JSON.stringify(msg));
    const quill = new Quill('#editor', {
      theme: 'snow',
      modules: { toolbar: '#toolbar' },
    });
    send({ type: 'ready' });
    quill.on('text-change', () => {
      send({ type: 'change', html: quill.root.innerHTML, delta: quill.getContents() });
    });
    const setContent = (html) => {
      quill.root.innerHTML = html || '';
    };
    const setDelta = (delta) => {
      try { quill.setContents(delta); } catch (e) { setContent(''); }
    };
    const handleMessage = (event) => {
      let data;
      try { data = JSON.parse(event.data); } catch { return; }
      if (data.type === 'setContent') setContent(data.html);
      if (data.type === 'setDelta') setDelta(data.delta);
    };
    document.addEventListener('message', handleMessage);
    window.addEventListener('message', handleMessage);
  </script>
</body>
</html>
`;
  }, [cssContent, jsContent]);

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

  if (!assetsReady || !cssContent || !jsContent) {
    return null;
  }

  return (
    <WebView
      ref={webviewRef}
      originWhitelist={['*']}
      source={{ html: editorHtml }}
      onMessage={handleMessage}
      onError={(_event) => {
        /* silencia erros de WebView; devtools já capturam se necessário */
      }}
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
