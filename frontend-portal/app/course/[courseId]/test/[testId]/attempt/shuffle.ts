/**
 * An in-place shuffling of any array (using Durstenfeld shuffle, an optimized version of Knuth shuffle)
 * @param array The array to be shuffled
 */
export function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}