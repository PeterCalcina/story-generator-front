import React, { useState } from "react";
import { Dialog, Input, Button, Loader, Label } from "@/shared/components/ui";
import { useCreateStory } from "@/api/hooks/story";
import { CreateStorySchema } from "@/shared/schemas/create-story.schema";

interface CreateStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStoryDialog({
  open,
  onOpenChange,
}: CreateStoryDialogProps) {
  const [form, setForm] = useState<CreateStorySchema>({
    image: new File([], ""),
    description: "",
  });
  const createStory = useCreateStory();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const inputElement = e.target as HTMLInputElement;
      setForm({
        ...form,
        [name]: inputElement.files ? inputElement.files[0] : new File([], ""),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createStory.mutate({ ...form });
    onOpenChange(false);
    setForm({
      image: new File([], ""),
      description: "",
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Nueva historia</Dialog.Title>
        </Dialog.Header>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <Label htmlFor="image">Imagen</Label>
            <Input
              id="image"
              name="image"
              type="file"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Describe la historia..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createStory.status === "pending"}>
              {createStory.status === "pending" ? (
                <Loader size="sm" message="Creando..." />
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
