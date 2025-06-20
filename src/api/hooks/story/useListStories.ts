import { useQuery } from '@tanstack/react-query';
import { imageStoryService } from '@/api/services/story.service';

export const useListStories = () => {
  const { list } = imageStoryService();

  return useQuery({
    queryKey: ['stories'],
    queryFn: list,
  });
};
