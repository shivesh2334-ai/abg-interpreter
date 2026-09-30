# ABG Interpreter

Static web app (HTML/CSS/JS, no build step) that interprets an arterial blood gas using the six-step anion gap approach, explains each value, gives a summary, and ranks differential diagnoses from clinical findings.

Educational use only. Not a medical device.

## Run locally
    npx serve .

## Push to GitHub
    git init && git add . && git commit -m "ABG interpreter"
    gh repo create abg-interpreter --public --source=. --push
    # or: create an empty repo on github.com, then
    # git remote add origin https://github.com/<you>/abg-interpreter.git && git push -u origin main

## Deploy on Vercel
Dashboard: vercel.com/new, import the GitHub repo, keep defaults (Framework: Other, no build command, output directory blank), click Deploy.
CLI: `npm i -g vercel && vercel --prod`
Every push to `main` then redeploys automatically.

## Formulas used (from the source guide)
- [H+] = 24 x PaCO2 / HCO3
- Metabolic acidosis: expected PaCO2 = 1.5 x HCO3 + 8 (+/-2)
- Metabolic alkalosis: PaCO2 rises 0.6 per 1 rise in HCO3 (tolerance +/-3 assumed)
- Acute resp. acidosis: HCO3 up 1 per 10 PaCO2 (+/-3); chronic: 3.5 per 10
- Acute resp. alkalosis: HCO3 down 2 per 10 PaCO2; chronic: 5 to 7 per 10
- Anion gap = Na - (Cl + HCO3); normal 12 +/-2, lowered 2.5 per 1 g/dL fall in albumin
- Osmolal gap = measured - (2Na + glucose/18 + BUN/2.8); normal < 10
- Delta ratio = change in AG / change in HCO3 (1 to 2 = uncomplicated AG acidosis)
