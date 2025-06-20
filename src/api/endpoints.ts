const BASE_URL = import.meta.env.VITE_API_URL;
const PREFIX = "api";
const IMAGE_STORY_URL = `${BASE_URL}/${PREFIX}/generate-story`;

export const API_ENDPOINTS_IMAGE_STORY = {
  imageStory: {
    list: `${IMAGE_STORY_URL}`,
    create: `${IMAGE_STORY_URL}`,
    get: (id: number) => `${IMAGE_STORY_URL}/${id}`,
  },
};
