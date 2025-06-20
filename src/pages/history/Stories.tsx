import { useState } from "react";
import {
  Card,
  Button,
  Loader,
  Badge,
} from "@/shared/components/ui";
import { useListStories } from "@/api/hooks/story";
import { ImageStory } from "@/shared/types";
import { CreateStoryDialog } from "./components/CreateStoryDialog";
import { ViewStoryDialog } from "./components/ViewStoryDialog";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

function truncate(text: string, max = 120) {
  return text.length > max ? text.slice(0, max) + "..." : text;
}

export function StoriesPage() {
  const { data, isLoading } = useListStories();
  const [selected, setSelected] = useState<ImageStory | null>(null);
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Historias</h1>
        <CreateStoryDialog open={openCreate} onOpenChange={setOpenCreate} />
        <Button variant="success" onClick={() => setOpenCreate(true)}>
          Nueva historia
        </Button>
      </div>

      {isLoading ? (
        <Loader message="Cargando historias..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.data?.length ? (
            data.data.map((h: ImageStory) => (
              <Card.Root key={h.id} className="flex flex-col">
                <img
                  src={h.createdImage}
                  alt="Imagen de la historia"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Card.Content className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{formatDate(h.createdAt)}</Badge>
                    </div>
                    <p className="mb-2 text-gray-700">
                      {truncate(h.story, 120)}
                    </p>
                  </div>
                  <Button variant="link" className="p-0 mt-2" onClick={() => setSelected(h)}>
                    Ver más
                  </Button>
                </Card.Content>
              </Card.Root>
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-500">No hay historias registradas.</div>
          )}
        </div>
      )}

      <ViewStoryDialog selected={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
