import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "@/test/test-utils";
import { ProviderSettingsDrawer } from "../components/ProviderSettingsDrawer";
import { providerOverviewFallback } from "@/features/providers";

describe("ProviderSettingsDrawer", () => {
  it("enables saving when the selection changes", async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();
    const handleSave = jest.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <ProviderSettingsDrawer
        isOpen
        onClose={handleClose}
        overview={providerOverviewFallback}
        isSubmitting={false}
        onSave={handleSave}
      />,
    );

    const saveButton = await screen.findByRole("button", { name: /save providers/i });
    expect(saveButton).toBeDisabled();

    await user.click(screen.getByLabelText(/OpenAI GPT-4.1 Mini/i));
    expect(saveButton).toBeEnabled();

    await user.click(saveButton);

    expect(handleSave).toHaveBeenCalledWith({ text: "openai" });
    expect(handleSave).toHaveBeenCalledTimes(1);
  });
});
