const nextJest = require("next/jest");

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({
	dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
	// Add more setup options before each test is run
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	testEnvironment: "jest-environment-jsdom",
	moduleNameMapper: {
		// Handle module aliases (this will be automatically configured by next/jest when using tsconfig.json paths)
		// Example:
		// '^@/components/(.*)$': '<rootDir>/components/$1',
	},
	// Automatically clear mock calls and instances between every test
	clearMocks: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
