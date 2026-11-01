import '@testing-library/jest-dom';

// Mock IntersectionObserver for Vitest / JSDOM environment
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe = (target) => {
    this.target = target;
  };

  unobserve = () => {
    this.target = null;
  };

  disconnect = () => {
    this.target = null;
    MockIntersectionObserver.instances = MockIntersectionObserver.instances.filter(
      (inst) => inst !== this
    );
  };

  // Helper method for tests to simulate intersection
  triggerIntersect(isIntersecting = true) {
    this.callback([
      {
        isIntersecting,
        target: this.target,
      },
    ]);
  }
}

MockIntersectionObserver.instances = [];
global.IntersectionObserver = MockIntersectionObserver;
