// src/components/ui/__tests__/color-mode.test.tsx

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  ColorModeProvider,
  ColorModeButton,
  useColorMode,
  useColorModeValue,
} from "../color-mode";
import { useTheme } from "next-themes";

// 1. Mock modul 'next-themes'—pastikan `useTheme` di‐define sebagai vi.fn()
vi.mock("next-themes", () => {
  return {
    // ThemeProvider (cukup return anak‐anaknya saja)
    ThemeProvider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),

    // Jadikan useTheme() sebagai mock function, bukan arrow function langsung
    useTheme: vi.fn(),
  };
});

// 2. Mock juga komponen‐komponen Chakra UI yang dipakai di dalam ColorModeProvider
vi.mock("@chakra-ui/react", () => ({
  IconButton: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <button onClick={onClick} data-testid="color-mode-button">
      {children}
    </button>
  ),
  ClientOnly: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Skeleton: () => <div data-testid="skeleton" />,
  Span: ({ children, ...props }: { children: React.ReactNode }) => (
    <span {...props}>{children}</span>
  ),
}));

describe("ColorMode Components", () => {
  // 3. Supaya setiap test memiliki nilai default useTheme(), kita lakukan beforeEach
  beforeEach(() => {
    // Default: resolvedTheme = 'light', setTheme = fungsi dummy
    vi.mocked(useTheme).mockReturnValue({
      resolvedTheme: "light",
      setTheme: vi.fn(),
      forcedTheme: undefined,
      themes: ["light", "dark"],
    });
  });

  it("renders ColorModeButton with correct icon", () => {
    // Dalam keadaan default (resolvedTheme: 'light'), komponen harus render IconButton
    render(
      <ColorModeProvider>
        <ColorModeButton />
      </ColorModeProvider>
    );

    const button = screen.getByTestId("color-mode-button");
    expect(button).toBeInTheDocument();
  });

  it("useColorModeValue returns correct value based on theme", () => {
    // Karena default useTheme() sudah di‐mock dengan resolvedTheme: 'light'
    const TestComponent = () => {
      const value = useColorModeValue("light-value", "dark-value");
      return <div data-testid="test-value">{value}</div>;
    };

    render(
      <ColorModeProvider>
        <TestComponent />
      </ColorModeProvider>
    );

    const value = screen.getByTestId("test-value");
    expect(value).toHaveTextContent("light-value");
  });

  it("ColorModeButton toggles theme when clicked", () => {
    // 4. Override mock useTheme untuk test ini:
    const mockSetTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      resolvedTheme: "light",
      setTheme: mockSetTheme,
      forcedTheme: undefined,
      themes: ["light", "dark"],
    });

    render(
      <ColorModeProvider>
        <ColorModeButton />
      </ColorModeProvider>
    );

    const button = screen.getByTestId("color-mode-button");
    fireEvent.click(button);

    // Karena awalnya 'light', setelah klik harus memanggil setTheme('dark')
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });
});
