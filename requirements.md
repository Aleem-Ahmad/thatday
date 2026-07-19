# Birthday Surprise Website - Requirements

## Project Goal

Create an unforgettable, emotional, and cinematic birthday experience that feels like opening a real surprise rather than browsing a normal website.

The website should be highly interactive, smooth, beautiful, and immersive from start to finish.

---

# User Journey

## Phase 1 - Countdown

- Display a countdown timer.
- Timer is already implemented and working correctly.
- No changes required.
- The surprise experience begins automatically when the countdown reaches zero.

---

# Phase 2 - Celebration

Immediately after the timer reaches zero:

- Trigger an extremely realistic fireworks celebration.
- Fireworks should fill the entire sky.
- Use multiple colors.
- Random launch positions.
- Realistic smoke.
- Bright lighting effects.
- Large explosion particles.
- Continuous celebration for several seconds.

The fireworks should feel like a real professional celebration instead of simple animation.

---

# Phase 3 - Grand Entrance

After or during the fireworks:

- A realistic luxury car appears.
- Car should smoothly enter the scene.
- Lighting and reflections should make it appear realistic.
- Camera animations should feel cinematic.

---

# Phase 4 - Car Interaction

The user can interact with the car.

Buttons:

- Open Trunk
- Close Trunk

Opening the trunk should include:

- Smooth animation
- Realistic motion
- Matching sound effects (optional)

---

# Phase 5 - Decorated Trunk

Inside the trunk should be beautifully decorated.

Decoration ideas:

- Warm fairy lights
- Roses
- Balloons
- Ribbon decorations
- Sparkles
- Confetti
- Soft glowing lights
- Elegant wrapping
- Luxury gift arrangement

The trunk should feel magical and premium.

---

# Phase 6 - Birthday Cake

Inside the trunk there is a birthday cake.

Features:

- Beautiful cake model
- Animated candles
- Realistic candle flames
- Soft lighting

User can:

- Blow the candles

When candles are blown:

- Flame disappears
- Smoke animation appears
- Birthday music becomes softer (optional)
- Celebration particles appear

---

# Phase 7 - Birthday Letter

Beside the cake there is an envelope.

User actions:

- Open Letter
- Close Letter

Opening animation:

- Envelope opens smoothly.
- Letter slides out.
- Paper unfolds naturally.

The letter content is **NOT** hardcoded.

Instead:

```
message.txt
```

stores the complete birthday message.

The application reads the text from:

```
message.txt
```

The sender name shown at the end of the letter is:

```
Cartoon
```

---

# Phase 8 - Gift

A beautiful wrapped gift box is placed beside the cake.

Initially:

- Gift is closed.

User action:

- Open Gift

Opening animation:

- Ribbon unties.
- Box opens slowly.
- Golden particles appear.

Possible gift ideas:

## Option 1 (Recommended ⭐)

A floating crystal heart appears with:

"Happy Birthday ❤️"

It slowly rotates with magical glow.

---

## Option 2

A memory slideshow begins.

Photos slowly appear one after another with soft music.

---

## Option 3

A small animated teddy bear appears holding a heart.

---

## Option 4

A sky lantern flies upward carrying birthday wishes.

---

## Option 5 (Best Choice ⭐⭐⭐)

Inside the gift is a magical glowing crystal.

When clicked:

- Hundreds of butterflies emerge.
- Floating hearts appear.
- Sparkles fill the screen.
- Background changes into a dreamy night sky.

This creates a memorable ending.

---

# Audio

Background music:

- Soft
- Emotional
- Instrumental

Sound effects:

- Fireworks
- Car arrival
- Trunk opening
- Gift opening
- Paper unfolding
- Candle blow
- Sparkles

Users should have:

- Mute button
- Play/Pause button

---

# Animations

All animations must be:

- Smooth
- Natural
- High FPS
- Responsive
- Non-blocking

Avoid sudden transitions.

---

# Visual Style

Theme:

Luxury + Romantic + Magical + Cinematic

Color palette:

- Gold
- Warm White
- Deep Black
- Dark Blue
- Purple
- Soft Pink

Lighting:

- Bloom effects
- Glow
- Reflections
- Shadows

---

# Performance Requirements

- Fast loading
- Optimized assets
- Responsive design
- Mobile compatible
- Desktop compatible
- Smooth animations
- Lazy loading where possible

---

# Accessibility

- Buttons clearly visible
- Keyboard accessible
- Responsive typography
- Good contrast

---

# File Structure

/message.txt

Contains:

- Birthday message only.

No hardcoded message inside the application.

---

# Final Ending

After the user has:

- watched fireworks,
- opened the trunk,
- blown candles,
- read the letter,
- opened the gift,

display a final full-screen message:

> "May this year bring endless happiness, unforgettable memories, and every success your heart dreams of. Happy Birthday! ❤️"

Then allow the user to replay the experience.

---

# Nice-to-Have Features

- Falling flower petals
- Floating lanterns
- Fireflies
- Shooting stars
- Dynamic camera movements
- Parallax background
- Glassmorphism UI
- Ambient fog
- Reflection effects
- Soft particle system
- Background birds before countdown
- Golden confetti after opening the gift
- Smooth page transitions
- Background music fades between scenes
- Screenshot button
- Share birthday memory button