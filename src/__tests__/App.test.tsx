import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // Nhập khẩu BrowserRouter
import Login from "../components/Login";

// Mock matchMedia
beforeAll(() => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
});

test("renders Login component", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  expect(screen.getByText(/The Liems/i)).toBeTruthy(); // Đảm bảo rằng bạn đang tìm kiếm văn bản đúng
});