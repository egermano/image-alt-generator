// Helper: ArrayBuffer -> base64
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

async function handleRequest(request, args) {
  try {
    // Apenas POST neste exemplo
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        ...CORS_HEADERS,
        status: 405,
      });
    }

    // Config simples via args
    const model = args?.model || "qwen-qwen25-vl-3b-instruct-awq";
    const systemPrompt =
      args?.systemPrompt ||
      "You are an assistant that analyzes images and produces concise, accurate, SEO-optimized alt text in Brazilian Portuguese.";
    const temperature = Number(args?.temperature ?? 0.1);

    // Pega arquivo do form-data (campo "image")
    const form = await request.formData();
    const file = form.get("image"); // assume que existe e é um File/Blob

    const buf = await file.arrayBuffer();
    const base64 = arrayBufferToBase64(buf);
    const mime = file.type || "image/jpeg";
    const dataUrl = `data:${mime};base64,${base64}`;

    // Mensagens no formato multimodal da doc
    const userInstruction = `Analyze the attached image and return a single JSON object with keys "altText" and "longDesc" in Brazilian Portuguese. Return only the JSON object.`;
    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: userInstruction },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      },
    ];

    const modelInput = { messages, temperature, stream: false };

    // Chama Azion AI runtime
    const aiResponse = await Azion.AI.run(model, modelInput);

    // Retorna a resposta do modelo como JSON (exemplo simples)
    return new Response(JSON.stringify(aiResponse), {
      ...CORS_HEADERS,
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      ...CORS_HEADERS,
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request, event.args));
});
