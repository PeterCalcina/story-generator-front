import { Dialog, Badge, Button } from "@/shared/components/ui";
import { ImageStory } from "@/shared/types";
import { useState } from "react";

interface ViewStoryDialogProps {
  selected: ImageStory | null;
  onClose: () => void;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

export function ViewStoryDialog({ selected, onClose }: ViewStoryDialogProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const toggleImage = () => {
    setShowOriginal(!showOriginal);
  };

  return (
    <Dialog.Root open={!!selected} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Historia completa</Dialog.Title>
        </Dialog.Header>
        {selected && (
          <div className="space-y-4">
            <img
              src={showOriginal ? selected.originalImage : selected.createdImage}
              alt={showOriginal ? "Imagen original" : "Imagen de la historia"}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="flex gap-2">
              <Button
                variant="outlineTransparent"
                size="sm"
                onClick={toggleImage}
              >
                {showOriginal ? "Ver imagen generada" : "Ver imagen original"}
              </Button>
            </div>
            <div>
              <Badge variant="secondary">{formatDate(selected.createdAt)}</Badge>
            </div>
            <p className="whitespace-pre-line text-gray-800">{selected.story}</p>
            {selected.pdfUrl && (
              <a
                href={selected.pdfUrl}
                target="_blank"
                download={`Historia_generada_${selected.createdAt}.pdf`}
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Descargar PDF
              </a>
            )}
            <div className="text-sm text-gray-500">Teléfono: {selected.phoneNumber}</div>
          </div>
        )}
        <Dialog.Footer>
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
} 