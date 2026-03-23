export function getSeed(str: string): number {
  return str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

export function getMealImageUrl(mealName: string, cuisine: string): string {
  const query = `${mealName} ${cuisine} food dish`;
  const seed = getSeed(mealName);
  return `/api/image?query=${encodeURIComponent(query)}&seed=${seed}`;
}

export function getCookImageUrl(cuisine: string, name: string): string {
  const query = `${cuisine} food cooking homemade`;
  const seed = getSeed(name);
  return `/api/image?query=${encodeURIComponent(query)}&seed=${seed}`;
}