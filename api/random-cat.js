export async function fetchTheCat() {
  const randomSkip = Math.floor(Math.random() * 500);
  const responce = await fetch(
    `https://cataas.com/api/cats?limit=15&skip=${randomSkip}&height=300&width=500`
  ); // fetch 15 cats
  const data = await responce.json();

  if (!responce.ok) {
    throw new Error("Problem conection");
  }
  return data;
}
