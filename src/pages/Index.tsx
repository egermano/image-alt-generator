import { useState, useCallback, useRef } from "react";
import { Upload, Copy, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

// API endpoint para gerar alt text
const API_ENDPOINT = "https://mupojq1z1uu.map.azionedge.net/alt-generator";

interface AltTextResult {
  altText: string;
  longDesc: string;
}

const Index = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<AltTextResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const resetState = useCallback(() => {
    setImagePreview(null);
    setResult(null);
    setError(null);
    setUploadedFile(null);
  }, []);

  const handleFileProcess = useCallback(async (file: File) => {
    // Validação do tipo de arquivo
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    // Criar preview local
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setUploadedFile(file);
    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      // Preparar FormData para envio
      const formData = new FormData();
      formData.append("image", file);

      // Fazer requisição para a API
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
        // Não definir Content-Type manualmente para que o browser defina o boundary
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Parse do campo choices[0].message.content que contém JSON como string
      const contentString = data.choices?.[0]?.message?.content;
      
      if (!contentString) {
        throw new Error("Resposta da API não contém o campo content esperado");
      }

      // Parse da string JSON contida no content
      const parsed = JSON.parse(contentString) as AltTextResult;
      
      if (!parsed.altText || !parsed.longDesc) {
        throw new Error("Resposta da API não contém altText ou longDesc");
      }

      // Delay mínimo de 300ms para evitar piscadas bruscas na UI
      await new Promise((resolve) => setTimeout(resolve, 300));

      setResult(parsed);
      toast({
        title: "Sucesso!",
        description: "Alt text e descrição gerados com sucesso.",
      });
    } catch (err) {
      console.error("Erro ao processar imagem:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido ao processar a imagem";
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [toast]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileProcess(files[0]);
      }
    },
    [handleFileProcess]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileProcess(files[0]);
      }
    },
    [handleFileProcess]
  );

  const handleRetry = useCallback(() => {
    if (uploadedFile) {
      handleFileProcess(uploadedFile);
    }
  }, [uploadedFile, handleFileProcess]);

  const copyToClipboard = useCallback(
    (text: string, label: string) => {
      navigator.clipboard.writeText(text).then(() => {
        toast({
          title: "Copiado!",
          description: `${label} copiado para a área de transferência.`,
        });
      });
    },
    [toast]
  );

  const handleNewUpload = useCallback(() => {
    resetState();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [resetState]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Alt Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gere alt text e descrições detalhadas para suas imagens usando inteligência
            artificial
          </p>
        </header>

        {/* Upload Area */}
        {!imagePreview && (
          <Card
            className={`border-2 border-dashed transition-all duration-200 ${
              isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border hover:border-primary/50"
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="p-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-6">
                  <Upload className="w-12 h-12 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">
                  Arraste sua imagem aqui
                </h2>
                <p className="text-muted-foreground">
                  ou clique no botão abaixo para selecionar
                </p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="lg"
                className="bg-primary hover:bg-highlight-hover text-primary-foreground font-semibold"
              >
                Selecionar Imagem
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                aria-label="Selecionar arquivo de imagem"
              />
            </div>
          </Card>
        )}

        {/* Image Preview and Processing */}
        {imagePreview && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview da imagem"
                    className="max-h-80 rounded-lg shadow-lg object-contain"
                  />
                </div>

                {isUploading && (
                  <div className="text-center space-y-3 py-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">
                      Gerando alt text e descrição...
                    </p>
                  </div>
                )}

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-2">
                        <p className="text-destructive font-semibold">Erro ao processar</p>
                        <p className="text-sm text-destructive/80">{error}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleRetry}
                        variant="outline"
                        size="sm"
                        className="border-destructive text-destructive hover:bg-destructive/10"
                      >
                        Tentar Novamente
                      </Button>
                      <Button
                        onClick={handleNewUpload}
                        variant="outline"
                        size="sm"
                      >
                        Nova Imagem
                      </Button>
                    </div>
                  </div>
                )}

                {result && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <CheckCircle2 className="w-5 h-5" />
                      <p className="font-semibold">Gerado com sucesso!</p>
                    </div>

                    {/* Alt Text */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Alt Text (curto)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={result.altText}
                          readOnly
                          className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-foreground"
                          aria-label="Alt text gerado"
                        />
                        <Button
                          onClick={() => copyToClipboard(result.altText, "Alt text")}
                          variant="outline"
                          size="icon"
                          aria-label="Copiar alt text"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Long Description */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Descrição Longa
                      </label>
                      <div className="space-y-2">
                        <Textarea
                          value={result.longDesc}
                          readOnly
                          className="min-h-32 resize-none bg-card border-border"
                          aria-label="Descrição longa gerada"
                        />
                        <Button
                          onClick={() =>
                            copyToClipboard(result.longDesc, "Descrição longa")
                          }
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar Descrição
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleNewUpload}
                      className="w-full bg-primary hover:bg-highlight-hover text-primary-foreground font-semibold"
                    >
                      Gerar Nova Descrição
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground">
          <p>Desenvolvido com IA para acessibilidade digital</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
