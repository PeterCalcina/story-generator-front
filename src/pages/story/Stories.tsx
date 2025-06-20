import { useState } from "react";
import { Card, Button, Loader } from "@/shared/components/ui";
import { useListStories } from "@/api/hooks/story";
import { ImageStory } from "@/shared/types";
import { CreateStoryDialog } from "./components/CreateStoryDialog";
import { ViewStoryDialog } from "./components/ViewStoryDialog";
import { Header } from "./components/Header";
import { Eye, Plus } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tus Historias
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Descubre mundos infinitos a través de la narrativa
          </p>
          <CreateStoryDialog open={openCreate} onOpenChange={setOpenCreate} />
          <Button
            onClick={() => setOpenCreate(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-bounce-subtle"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear nueva historia
          </Button>
        </div>

        {isLoading ? (
          <Loader message="Cargando historias..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.data?.length ? (
              data.data.map((story: ImageStory, index: number) => (
                <Card.Root
                  key={story.id}
                  className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer animate-card-appear"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card.Header className="p-0">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={story.createdImage}
                        alt={story.title}
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Card.Header>

                  <Card.Content className="p-6">
                    <Card.Title className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                      {story.title}
                    </Card.Title>

                    <Card.Description className="text-gray-600 mb-4 line-clamp-3">
                      {truncate(story.story, 120)}
                    </Card.Description>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {formatDate(story.createdAt)}
                      </span>
                      <Button
                        onClick={() => setSelected(story)}
                        variant="outline"
                        size="sm"
                        className="bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver más
                      </Button>
                    </div>
                  </Card.Content>
                </Card.Root>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500"> 
                No hay historias registradas.
              </div>
            )}
          </div>
        )}

        <ViewStoryDialog
          selectedStory={selected}
          onClose={() => setSelected(null)}
        />
      </div>
    </div>
  );
}
