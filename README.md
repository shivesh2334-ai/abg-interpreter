# ABG Interpreter

Educational arterial blood gas workbench. Enter values manually or extract them from a de-identified JPEG, PNG, WebP or PDF (up to 3 MiB) with Claude. Review the extracted values before interpretation. The consistency precheck is followed by pH, primary disorder, compensation, anion gap and delta ratio. The history field supports optional Claude clinical correlation. Download the interpretation as a UTF-8 text report.

## Run locally

Use `vercel dev` to exercise the API routes. A static server can serve the manual interpreter.

## Vercel setup

Import the repository with the Other framework preset. Set `ANTHROPIC_API_KEY` as a server-side environment variable for the intended environments, then deploy. Optionally set `ANTHROPIC_MODEL` to a Claude model supporting images, PDFs and tool calls. The default is `claude-haiku-4-5-20251001`. Manual interpretation and text export are available without an API key.

Use de-identified uploads and history. Claude receives the selected file during extraction and receives the entered values, history, and rule-based assessment only when correlation is enabled. The app does not store case data. The API's per-instance throttle is best effort. Set provider spending limits or apply deployment-level access controls before enabling AI on a public deployment.

## Formulas used (from the source guide)
- [H+] = 24 x PaCO2 / HCO3
- Metabolic acidosis: expected PaCO2 = 1.5 x HCO3 + 8 (+/-2)
- Metabolic alkalosis: PaCO2 rises 0.6 per 1 rise in HCO3 (tolerance +/-3 assumed)
- Acute resp. acidosis: HCO3 up 1 per 10 PaCO2 (+/-3); chronic: 3.5 per 10
- Acute resp. alkalosis: HCO3 down 2 per 10 PaCO2; chronic: 5 to 7 per 10
- Anion gap = Na - (Cl + HCO3); normal 12 +/-2, lowered 2.5 per 1 g/dL fall in albumin
- Osmolal gap = measured - (2Na + glucose/18 + BUN/2.8); normal < 10
- Delta ratio = change in AG / change in HCO3 (1 to 2 = uncomplicated AG acidosis)

Clinical reference: [Merck Manual Professional Edition, Acid–Base Disorders](https://www.merckmanuals.com/professional/nephrology/acid-base-regulation-and-disorders/acid-base-disorders). Local laboratory reference intervals may differ.
