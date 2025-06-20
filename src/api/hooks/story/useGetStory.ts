import { useQuery } from '@tanstack/react-query';
import { imageStoryService } from '@/api/services/story.service';

export const useGetStory = (id: number) => {
  const { get } = imageStoryService();

  return useQuery({
    queryKey: ['story', id],
    queryFn: () => get(id),
  });
};
