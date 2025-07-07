export default function filterExercise(exercises, query) {
  // If query is empty, return the original exercises
  if (!query.trim()) {
    return exercises;
  }

  // Convert query to lowercase for case-insensitive search
  const lowerQuery = query.toLowerCase();

  // Filter exercises based on the query
  const filtered = {};

  for (const category in exercises) {
    const matchingExercises = exercises[category].filter((exercises) => {
      return exercises.name.toLowerCase().includes(lowerQuery);
    });
    if (matchingExercises.length > 0) {
      filtered[category] = matchingExercises;
    }
  }

  return filtered;
}
