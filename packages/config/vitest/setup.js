import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// CI machines are slower than laptops. The first test in a file also loads the lazy page
// and compiles MUI, so give async UI checks and whole tests more time than the defaults.
configure({ asyncUtilTimeout: 5_000 });
vi.setConfig({ testTimeout: 15_000 });

// Every test starts from a clean page and empty storage.
afterEach(() => {
  cleanup();
  globalThis.localStorage.clear();
});
