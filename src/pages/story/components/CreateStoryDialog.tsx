import React, { useState } from "react";
import {
  Dialog,
  Button,
  Loader,
  Label,
  Textarea,
} from "@/shared/components/ui";
import { useCreateStory } from "@/api/hooks/story";
import { CreateStorySchema } from "@/shared/schemas/create-story.schema";
import { ImageIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Carousel } from "@/shared/components/ui/carousel";

interface CreateStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStoryDialog({
  open,
  onOpenChange,
}: CreateStoryDialogProps) {
  const [newStory, setNewStory] = useState<CreateStorySchema>({
    image: new File([], ""),
    description: "",
    style: "anime",
  });
  const createStory = useCreateStory();
  const styleOptions = [
    {
      name: "anime",
      img: "images/anime.webp",
    },
    {
      name: "cartoon",
      img: "images/cartoon.webp",
    },
    {
      name: "manga",
      img: "images/manga.webp",
    },
    {
      name: "comic",
      img: "images/comic.webp",
    },
    {
      name: "realista",
      img: "images/realista.webp",
    },
    {
      name: "pintura",
      img: "images/pintura.webp",
    },
  ];
  const [activeStyleIdx, setActiveStyleIdx] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const inputElement = e.target as HTMLInputElement;
      setNewStory({
        ...newStory,
        image: inputElement.files?.[0] || new File([], ""),
      });
    } else {
      setNewStory({ ...newStory, [name]: value });
    }
  };
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createStory.mutateAsync({ ...newStory });

    onOpenChange(false);
    setNewStory({
      image: new File([], ""),
      description: "",
      style: "anime",
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="bg-white sm:max-w-[600px] animate-dialog-slide-in overflow-y-auto max-h-[90vh]">
        <Dialog.Header className="space-y-1 pb-6">
          <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Crear nueva historia
          </Dialog.Title>
          <Dialog.Description className="text-gray-600">
            Dale vida a tu imaginación. Crea una historia que inspire y
            emocione.
          </Dialog.Description>
        </Dialog.Header>
        <form onSubmit={handleCreate} className="space-y-6 py-4">
          <div className="space-y-4">
            <Label htmlFor="image" className="text-sm font-medium">
              Imagen para la historia
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition-colors duration-200">
              {newStory.image.size > 0 ? (
                <div className="space-y-4">
                  <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    <img
                      src={URL.createObjectURL(newStory.image)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                      className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Cambiar Imagen
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Haz clic para subir una imagen
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF hasta 10MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                    className="mt-4 bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                  >
                    Seleccionar Imagen
                  </Button>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="style-carousel" className="text-sm font-medium">
              Estilo de la imagen
            </Label>
            <Carousel.Root
              opts={{ align: "start", initial: activeStyleIdx }}
              className="w-full max-w-md mx-auto justify-center"
            >
              <Carousel.Content>
                {styleOptions.map((option, idx) => (
                  <Carousel.Item
                    key={option.name}
                    className="flex flex-col items-center py-2 basis-1/3"
                  >
                    <div className="relative w-32 h-32 mb-2">
                      <img
                        src={option.img}
                        alt={option.name}
                        className={cn(
                          "w-32 h-34 object-cover rounded-lg border-4 transition-all duration-300 cursor-pointer",
                          "hover:scale-105 hover:border-indigo-500 hover:shadow-lg",
                          newStory.style === option.name
                            ? "border-indigo-500 shadow-lg scale-105"
                            : "border-gray-200"
                        )}
                        style={{ userSelect: "none" }}
                        onClick={() => {
                          setNewStory({ ...newStory, style: option.name });
                          setActiveStyleIdx(idx);
                        }}
                      />
                      <div className="absolute -bottom-2 left-0 w-full h-12 rounded-b-lg flex items-end justify-center pointer-events-none">
                        <div className="w-full h-full absolute bottom-0 left-0 rounded-b-lg bg-gradient-to-t from-black/80 to-transparent" />
                        <span className="relative z-10 text-white text-base font-semibold capitalize drop-shadow-md pb-1">
                          {option.name}
                        </span>
                      </div>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel.Content>
              <Carousel.Previous />
              <Carousel.Next />
            </Carousel.Root>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descripción de la historia
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe los aspectos más importantes de tu historia..."
              value={newStory.description}
              onChange={handleChange}
              minLength={25}
              maxLength={1000}
              className="min-h-[120px] border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createStory.status === "pending"}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              {createStory.status === "pending" ? (
                <Loader
                  size="sm"
                  message="Creando..."
                  textColor="white"
                  variant="white"
                />
              ) : (
                "Crear"
              )}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
