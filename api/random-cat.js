export async function fetchTheCat() {
  const randomSkip = Math.floor(Math.random() * 500);

  const response = await fetch(
    `https://cataas.com/api/cats?limit=15&skip=${randomSkip}`
  );

  if (!response.ok) {
    throw new Error("Problem connection");
  }

  const data = await response.json();

  return data.map((cat) => {
    const catId = cat.id;

    return {
      ...cat,
      id: catId,
      imageUrl: `https://cataas.com/cat/${catId}?width=500&height=300&fit=cover&type=square`,
    };
  });
}
