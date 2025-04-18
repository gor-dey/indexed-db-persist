export const preset = "ts-jest";
export const testEnvironment = "node";
export const testMatch = ["**/tests/**/*.test.ts"];
export const transform = {
  "^.+\\.tsx?$": "ts-jest",
};
export const moduleFileExtensions = ["ts", "tsx", "js", "jsx", "json", "node"];
