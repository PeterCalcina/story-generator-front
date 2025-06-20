import { ImageStory } from '@/shared/types/image-story';
import { useAuthFetcher } from '../client/fetcher';
import { API_ENDPOINTS_IMAGE_STORY } from '../endpoints';


export const imageStoryService = () => {
  const fetcher = useAuthFetcher();

  return {
    list: async () => {
      const { data } = await fetcher<ImageStory[]>(API_ENDPOINTS_IMAGE_STORY.imageStory.list);
      return { data };
    },

    get: (id: number) => fetcher<ImageStory>(API_ENDPOINTS_IMAGE_STORY.imageStory.get(id)),

    create: (formData: FormData) =>
      fetcher<ImageStory>(API_ENDPOINTS_IMAGE_STORY.imageStory.create, {
        method: 'POST',
        body: formData,
      }),
  };
};
