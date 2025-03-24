module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(react-leaflet|leaflet)/).+\\.js$"
  ],
  extensionsToTreatAsEsm: [".jsx", ".ts", ".tsx"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  }
};