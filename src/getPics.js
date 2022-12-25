import axios from 'axios';
export async function getPics(value) {
  const KEY = '32337632-b40042b7961cd0f381dab24cb';
  const BASE_URL = `https://pixabay.com/api/?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;
  const response = await axios.get(BASE_URL);
  return response;
}
