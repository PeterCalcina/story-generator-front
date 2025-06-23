import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/stores/toastStore";
import { imageStoryService } from "@/api/services/story.service";
import { CreateStory } from "@/shared/types";

export const useCreateStory = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { create: createStory } = imageStoryService();

  return useMutation({
    mutationFn: async (data: CreateStory) => {
      const formData = new FormData();
      formData.append("image", data.image);
      formData.append("description", data.description);
      formData.append("style", data.style);
      return await createStory(formData);
    },

    onSuccess: ({ message }) => {
      addToast("success", message);
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
    onError: ({ message }) => {
      addToast("error", message);
    },
  });
};
