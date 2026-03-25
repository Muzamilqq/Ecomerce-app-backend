// Only the fetchAIFilteredProducts function needs updating due to getAIRecommendation fix.
// Replace only this function in your controllers/productController.js

export const fetchAIFilteredProducts = catchAsyncErrors(
  async (req, res, next) => {
    const { userPrompt } = req.body;
    if (!userPrompt) {
      return next(new ErrorHandler("Provide a valid prompt.", 400));
    }

    const filterKeywords = (query) => {
      const stopWords = new Set([
        "the",
        "they",
        "them",
        "then",
        "I",
        "we",
        "you",
        "he",
        "she",
        "it",
        "is",
        "a",
        "an",
        "of",
        "and",
        "or",
        "to",
        "for",
        "from",
        "on",
        "who",
        "whom",
        "why",
        "when",
        "which",
        "with",
        "this",
        "that",
        "in",
        "at",
        "by",
        "be",
        "not",
        "was",
        "were",
        "has",
        "have",
        "had",
        "do",
        "does",
        "did",
        "so",
        "some",
        "any",
        "how",
        "can",
        "could",
        "should",
        "would",
        "there",
        "here",
        "just",
        "than",
        "because",
        "but",
        "its",
        "it's",
        "if",
        ".",
        ",",
        "!",
        "?",
        ">",
        "<",
        ";",
        "`",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
      ]);

      return query
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((word) => !stopWords.has(word))
        .map((word) => `%${word}%`);
    };

    const keywords = filterKeywords(userPrompt);

    const result = await database.query(
      `
      SELECT * FROM products
      WHERE name ILIKE ANY($1)
      OR description ILIKE ANY($1)
      OR category ILIKE ANY($1)
      LIMIT 200;
      `,
      [keywords],
    );

    const filteredProducts = result.rows;

    if (filteredProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No products found matching your prompt.",
        products: [],
      });
    }

    // FIX: getAIRecommendation no longer takes (req, res) — just (userPrompt, products)
    // It now throws on error instead of calling res.json() directly
    try {
      const { success, products } = await getAIRecommendation(
        userPrompt,
        filteredProducts,
      );

      res.status(200).json({
        success,
        message: "AI filtered products.",
        products,
      });
    } catch (aiError) {
      return next(
        new ErrorHandler(aiError.message || "AI filtering failed.", 500),
      );
    }
  },
);
