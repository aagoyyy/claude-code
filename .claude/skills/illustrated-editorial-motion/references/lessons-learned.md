# Lessons learned (user feedback, in order)

1. Moving PNG assets around is **not animation** ("cuma gambar yang digerakin"). Real motion = deformation, morph, secondary motion, environmental motion.
2. Generic flat clip-art vector got rejected ("visualnya sampah"). Causes: one stroke weight everywhere, primitives (rect/ellipse), no material difference,
   repetitive grid background, centred symmetric stack, no depth, no lighting model.
3. The fix was a *system*, not more detail: tone ramps + atmospheric perspective + light-aware ink + material library + camera/shot system + purposeful props.
4. The user will ask for a plan before code when quality is the concern: explain the architecture changes first, then implement, then render the SAME scene for comparison.
5. Always show before/after side by side; list remaining weaknesses honestly.
6. AI video generation (Kling/Seedance/Veo) is the only route to reference-grade morphing from raster art; in the SVG-only standard it is off the table.
7. Sandbox notes: Chromium at /opt/pw-browsers/chromium; `api.blueprintstudio.ai` needed allow-listing for downloads (not needed any more under SVG-only);
   `/home/user` is ephemeral: always package the project and send the archive.
