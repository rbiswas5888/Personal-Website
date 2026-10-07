# UX Designer Portfolio --- Color Palette

A premium, modern color system for a UX/Product Designer portfolio
supporting both **Light Mode** and **Dark Mode**.

## Design Direction

-   Minimal
-   Premium
-   Creative
-   Editorial
-   Product-design focused
-   Warm-neutral foundation
-   Electric violet as the primary brand accent

------------------------------------------------------------------------

# 1. Light Mode

  -----------------------------------------------------------------------
  Token             Color             Hex               Usage
  ----------------- ----------------- ----------------- -----------------
  Background        Soft White        `#FAFAF9`         Main page
                                                        background

  Surface           White             `#FFFFFF`         Cards and
                                                        sections

  Surface Alt       Warm Gray         `#F4F4F2`         Secondary
                                                        sections

  Text Primary      Near Black        `#171717`         Headings and
                                                        important content

  Text Secondary    Graphite          `#525252`         Body text

  Text Muted        Gray              `#737373`         Supporting text

  Border            Light Gray        `#E5E5E5`         Dividers and card
                                                        borders

  Primary           Electric Violet   `#6D4AFF`         CTA, links,
                                                        highlights

  Primary Hover     Deep Violet       `#5935E8`         Hover state

  Primary Soft      Lavender          `#EEE9FF`         Tags and subtle
                                                        backgrounds

  Success           Emerald           `#16A34A`         Success states

  Warning           Amber             `#D97706`         Warning states

  Error             Red               `#DC2626`         Error states
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 2. Dark Mode

  -----------------------------------------------------------------------
  Token             Color             Hex               Usage
  ----------------- ----------------- ----------------- -----------------
  Background        Deep Charcoal     `#0D0D0F`         Main page
                                                        background

  Surface           Dark Gray         `#151518`         Cards and
                                                        sections

  Surface Elevated  Graphite          `#1C1C21`         Modals and
                                                        elevated cards

  Surface Alt       Dark Neutral      `#222228`         Secondary
                                                        sections

  Text Primary      Off White         `#F5F5F5`         Headings and
                                                        important content

  Text Secondary    Light Gray        `#B8B8BE`         Body text

  Text Muted        Gray              `#85858E`         Supporting text

  Border            Dark Border       `#2A2A31`         Dividers and card
                                                        borders

  Primary           Bright Violet     `#8B75FF`         CTA, links,
                                                        highlights

  Primary Hover     Soft Violet       `#A394FF`         Hover state

  Primary Soft      Violet Tint       `#211A3D`         Tags and subtle
                                                        backgrounds

  Success           Green             `#4ADE80`         Success states

  Warning           Amber             `#FBBF24`         Warning states

  Error             Coral Red         `#F87171`         Error states
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 3. Brand Accent

Use a consistent violet identity across both themes.

  Theme   Primary     Hover
  ------- ----------- -----------
  Light   `#6D4AFF`   `#5935E8`
  Dark    `#8B75FF`   `#A394FF`

## Optional Gradient

Use sparingly for hero moments, artwork, selected work, or decorative
accents.

`#6D4AFF → #8B5CF6 → #3B82F6`

Avoid using gradients throughout the entire interface.

------------------------------------------------------------------------

# 4. Semantic Color Tokens

Use semantic tokens instead of hard-coding hex values throughout the
design.

``` text
COLOR
│
├── Background
│   ├── Default
│   ├── Subtle
│   └── Inverse
│
├── Surface
│   ├── Default
│   ├── Elevated
│   └── Hover
│
├── Content
│   ├── Primary
│   ├── Secondary
│   ├── Muted
│   └── Inverse
│
├── Border
│   ├── Default
│   ├── Strong
│   └── Focus
│
├── Brand
│   ├── Primary
│   ├── Hover
│   ├── Active
│   └── Subtle
│
└── Feedback
    ├── Success
    ├── Warning
    └── Error
```

------------------------------------------------------------------------

# 5. Portfolio Usage

## Homepage

### Light

``` text
Background: #FAFAF9
Heading:    #171717
Body:       #525252
Accent:     #6D4AFF
```

### Dark

``` text
Background: #0D0D0F
Heading:    #F5F5F5
Body:       #B8B8BE
Accent:     #8B75FF
```

------------------------------------------------------------------------

## Navigation

### Light

``` text
Background: Transparent
Default:    #525252
Active:     #171717
CTA:        #6D4AFF
```

### Dark

``` text
Background: Transparent
Default:    #B8B8BE
Active:     #F5F5F5
CTA:        #8B75FF
```

------------------------------------------------------------------------

## Case Study Cards

### Light

``` text
Card:        #FFFFFF
Border:      #E5E5E5
Title:       #171717
Description: #525252
Tag:         #EEE9FF
Tag Text:    #5935E8
```

### Dark

``` text
Card:        #151518
Border:      #2A2A31
Title:       #F5F5F5
Description: #B8B8BE
Tag:         #211A3D
Tag Text:    #A394FF
```

------------------------------------------------------------------------

# 6. Design Principles

### 01 --- Keep the UI restrained

The portfolio chrome should remain mostly neutral. Let case-study
imagery and product screenshots provide the majority of visual color.

### 02 --- Use violet as an accent

Primary violet should communicate interaction, selection, focus, and
brand identity. Avoid using it for large areas unless intentionally
creating a visual focal point.

### 03 --- Avoid pure black and pure white

Use `#0D0D0F` instead of `#000000` for dark backgrounds and `#FAFAF9`
instead of `#FFFFFF` for the main light background. This creates a
softer, more premium visual experience.

### 04 --- Preserve hierarchy

Primary text should have strong contrast. Secondary and muted text
should be visibly subordinate without becoming difficult to read.

### 05 --- Dark mode is not an inversion

Dark mode uses independently tuned surface, border, text, and accent
values rather than simply swapping black and white.

------------------------------------------------------------------------

# 7. Core Palette

## Light

``` text
Background       #FAFAF9
Surface          #FFFFFF
Surface Alt      #F4F4F2
Text Primary     #171717
Text Secondary   #525252
Text Muted       #737373
Border           #E5E5E5
Primary          #6D4AFF
Primary Hover    #5935E8
Primary Soft     #EEE9FF
```

## Dark

``` text
Background       #0D0D0F
Surface          #151518
Surface Elevated #1C1C21
Surface Alt      #222228
Text Primary     #F5F5F5
Text Secondary   #B8B8BE
Text Muted       #85858E
Border           #2A2A31
Primary          #8B75FF
Primary Hover    #A394FF
Primary Soft     #211A3D
```

------------------------------------------------------------------------

# 8. Recommended Portfolio Identity

**Primary Brand:** Electric Violet\
**Light Background:** Soft White\
**Dark Background:** Deep Charcoal\
**Typography:** Near Black / Off White\
**Supporting UI:** Warm and cool neutral grays\
**Interaction:** Violet\
**Feedback:** Semantic green, amber, and red

> The goal is a portfolio that feels like a **designer's workbench**,
> not a generic SaaS product. Keep the interface quiet and let the work
> take center stage.
