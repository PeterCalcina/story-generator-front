import { Dialog, Button } from "@/shared/components/ui";
import { ImageStory } from "@/shared/types";
import { BookOpen, ImageIcon } from "lucide-react";
import { useState } from "react";

interface ViewStoryDialogProps {
  selectedStory: ImageStory | null;
  onClose: () => void;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

export function ViewStoryDialog({
  selectedStory,
  onClose,
}: ViewStoryDialogProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const toggleImage = () => {
    setShowOriginal(!showOriginal);
  };

  return (
    <Dialog.Root open={!!selectedStory} onOpenChange={onClose}>
      <Dialog.Content className="bg-white sm:max-w-[800px] max-h-[90vh] overflow-y-auto animate-dialog-slide-in">
        {selectedStory && (
          <>
            <Dialog.Header>
              <Dialog.Title className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {selectedStory.title}
              </Dialog.Title>
            </Dialog.Header>

            <div className="space-y-6 py-4">
              <div className="relative">
                <div className="relative h-80 overflow-hidden rounded-lg">
                  <img
                    src={
                      showOriginal
                        ? selectedStory.originalImage
                        : selectedStory.createdImage
                    }
                    alt={selectedStory.title}
                    className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                  />
                </div>

                <Button
                  className="absolute top-4 right-4 bg-white/90 text-gray-700 hover:bg-white hover:text-gray-900 shadow-lg backdrop-blur-sm"
                  size="sm"
                  onClick={toggleImage}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {showOriginal ? "Ver imagen generada" : "Ver imagen original"}
                </Button>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {selectedStory.story}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <BookOpen className="w-4 h-4" />
                <span>Creada el {formatDate(selectedStory.createdAt)}</span>
              </div>

              <a
                href={selectedStory.pdfUrl}
                target="_blank"
                download={`Historia_generada_${selectedStory.createdAt}.pdf`}
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Ver en PDF
              </a>
            </div>
          </>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
