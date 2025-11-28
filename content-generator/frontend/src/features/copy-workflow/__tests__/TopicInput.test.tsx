import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "@/test/test-utils";
import { TopicInput } from "../components/TopicInput";

describe("TopicInput", () => {
  it("submits sanitized payload", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    renderWithProviders(<TopicInput onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/topic/i), "  Sunrise Vibes  ");
    await user.type(screen.getByLabelText(/creative direction/i), "Focus on golden hour glow.");
    await user.selectOptions(screen.getByLabelText(/tone/i), "minimal");
    await user.selectOptions(screen.getByLabelText(/audience/i), "weekend-storytellers");
    await user.type(screen.getByLabelText(/keywords/i), "sunrise, glow");
    await user.selectOptions(screen.getByLabelText(/language/i), "zh");
    const variantInput = screen.getByLabelText(/variants/i);
    await user.clear(variantInput);
    await user.type(variantInput, "4");

    await user.click(screen.getByRole("button", { name: /generate copy ideas/i }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));
    expect(handleSubmit).toHaveBeenCalledWith({
      topic: "Sunrise Vibes",
      prompt: "Focus on golden hour glow.",
      options: {
        tone: "minimal",
        audience: "weekend-storytellers",
        keywords: ["sunrise", "glow"],
        language: "zh",
        variants: 4,
      },
    });
  });

  it("prevents submission when topic is too short", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    renderWithProviders(<TopicInput onSubmit={handleSubmit} />);

    await user.click(screen.getByRole("button", { name: /generate copy ideas/i }));

    expect(await screen.findByText(/topic must be at least 3 characters/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
