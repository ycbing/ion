import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "@/test/test-utils";
import { CopySuggestionsList } from "../components/CopySuggestionsList";

const sampleCopies = [
  { id: "a", text: "First copy" },
  { id: "b", text: "Second copy" },
];

describe("CopySuggestionsList", () => {
  it("shows placeholder before any request", () => {
    renderWithProviders(
      <CopySuggestionsList
        copies={[]}
        selectedId={null}
        onSelect={jest.fn()}
        onCopyChange={jest.fn()}
        hasRequested={false}
      />,
    );

    expect(
      screen.getByText(/Provide a topic to see tailored copy directions/i),
    ).toBeInTheDocument();
  });

  it("allows selecting and editing a copy variant", async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();
    const handleChange = jest.fn();

    renderWithProviders(
      <CopySuggestionsList
        copies={sampleCopies}
        metadata={{ topic: "sunrise", requestedVariants: 2, deliveredVariants: 2 }}
        providerName="Mock provider"
        selectedId="a"
        onSelect={handleSelect}
        onCopyChange={handleChange}
        hasRequested
      />,
    );

    const radios = screen.getAllByRole("radio", { name: /use this direction/i });
    await user.click(radios[1]);
    expect(handleSelect).toHaveBeenCalledWith("b");

    const textareas = screen.getAllByRole("textbox");
    await user.clear(textareas[1]);
    await user.type(textareas[1], "Updated copy");
    expect(handleChange).toHaveBeenLastCalledWith("b", "Updated copy");
  });
});
