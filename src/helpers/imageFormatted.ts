export const formatImageUrl = (imageUrl: string) => {
  return imageUrl.match(/https?:\/\/[^"]+/)?.[0] ?? "";
};
