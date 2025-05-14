# Title Component Documentation

The Title component is a powerful, customizable animated text overlay for Remotion videos. It provides a wide range of options for text styling, positioning, animations, and effects. Multiple titles can be displayed at the same time.

## Basic Usage

```json
{
  "title": "Hello World",
  "time": 0,
  "duration": 5
}
```

```js
import { Title } from "./components/Title"

const titles = [
  { "title": "Hello World", "time": 0, "duration": 5 }
]

<Title titles={titles} />
```

## Core Configuration Options

| Option            | Type    | Default  | Description              |
| ----------------- | ------- | -------- | ------------------------ | -------- | -------------------- |
| "title"           | string  | required | The text to display      |
| "time"            | number  | 0        | Start time in seconds    |
| "duration"        | number  | Infinity | Duration in seconds      |
| "top"             | number  | 10       | Position from top (%)    |
| "left"            | number  | 0        | Position from left (%)   |
| "right"           | number  | 0        | Position from right (%)  |
| "bottom"          | number  | 0        | Position from bottom (%) |
| "horizontalAlign" | "start" | "center" | "end"                    | "center" | Horizontal alignment |
| "verticalAlign"   | "start" | "center" | "end"                    | "center" | Vertical alignment   |

## Visual Styling

### Theme Presets

```json
{
  "title": "Cinematic Title",
  "theme": "cinematic",
  "time": 0,
  "duration": 5
}
```

Available themes: "minimal", "impact", "elegant", "neon", "shadow", "outline", "gradient", "retro", "cinematic"

### Custom Styling

```json
{
  "title": "Custom Styled Title",
  "titleStyle": {
    "color": "#ffcc00",
    "fontSize": 120,
    "fontFamily": "Georgia, serif",
    "textShadow": "0 2px 15px rgba(0,0,0,0.6)"
  }
}
```

CSS string format is also supported:

```json
{
  "title": "Custom Styled Title",
  "titleStyle": "color: #ffcc00; font-size: 120px; font-family: Georgia, serif;"
}
```

## Animation

### Basic Animation Timing

```json
{
  "title": "Fade In and Out",
  "time": 0,
  "duration": 5,
  "titleInDuration": 1,
  "titleOutDuration": 0.5,
  "titleEasing": "easeInOut"
}
```

### Transform-based Animation

```json
{
  "title": "Slide In From Left",
  "animation": {
    "from": {
      "opacity": 0,
      "translateX": -100
    },
    "to": {
      "opacity": 1,
      "translateX": 0
    },
    "exit": {
      "opacity": 0,
      "translateX": 100
    },
    "easing": "easeOut"
  }
}
```

Available animation properties:

- Opacity: "opacity"
- Transforms: "scale", "scaleX", "scaleY", "rotate", "translateX", "translateY", "skew"
- Others: "width", "height", "backgroundColor", "borderRadius"

### Offset Controls

```json
{
  "title": "With Custom Timing",
  "time": 1,
  "duration": 5,
  "titleStartOffset": -0.2,
  "titleEndOffset": 0.5
}
```

## Background Box

```json
{
  "title": "With Background Box",
  "backgroundBox": {
    "enabled": true,
    "style": {
      "backgroundColor": "rgba(0, 0, 0, 0.7)",
      "borderRadius": 10,
      "padding": 30
    },
    "padding": 40,
    "animation": {
      "from": {
        "scaleX": 0,
        "opacity": 0
      },
      "to": {
        "scaleX": 1,
        "opacity": 1
      },
      "inDuration": 0.8,
      "outDuration": 0.5,
      "easing": "easeOut"
    },
    "startOffset": -0.3,
    "endOffset": 0.2
  }
}
```

## Letter Animation

### Using Presets

```json
{
  "title": "Typewriter Effect",
  "letterAnimation": {
    "preset": "typewriter",
    "direction": "ltr",
    "animateSpaces": false
  }
}
```

Available presets: "typewriter", "fade", "slide", "bounce", "random"

Direction options: "ltr" (left-to-right), "rtl" (right-to-left), "center", "edges"

### Custom Letter Animation

```json
{
  "title": "Custom Letter Animation",
  "letterAnimation": {
    "staggerDelay": 0.06,
    "duration": 0.4,
    "easing": "easeOut",
    "direction": "center",
    "animateSpaces": true,
    "from": {
      "opacity": 0,
      "scale": 2,
      "rotate": 45
    },
    "to": {
      "opacity": 1,
      "scale": 1,
      "rotate": 0
    }
  }
}
```

## Complex Examples

### Slide-in Title with Background

```json
{
  "title": "Slide from Bottom",
  "time": 0,
  "duration": 5,
  "titleInDuration": 1,
  "titleOutDuration": 0.5,
  "animation": {
    "from": {
      "opacity": 0,
      "translateY": 50
    },
    "to": {
      "opacity": 1,
      "translateY": 0
    },
    "easing": "easeOut"
  },
  "backgroundBox": {
    "enabled": true,
    "startOffset": -0.2,
    "animation": {
      "from": {
        "scaleY": 0,
        "transformOrigin": "center bottom"
      },
      "to": {
        "scaleY": 1
      },
      "easing": "easeOut"
    }
  }
}
```

### Multi-title Sequence

```json
[
  {
    "title": "First Title",
    "time": 0,
    "duration": 3,
    "theme": "impact",
    "animation": {
      "from": { "opacity": 0, "scale": 0.8 },
      "to": { "opacity": 1, "scale": 1 },
      "exit": { "opacity": 0, "scale": 1.2 },
      "easing": "easeInOut"
    }
  },
  {
    "title": "Second Title",
    "time": 3,
    "duration": 3,
    "theme": "elegant",
    "letterAnimation": {
      "preset": "slide",
      "direction": "ltr"
    }
  },
  {
    "title": "Final Title",
    "time": 6,
    "duration": 4,
    "theme": "neon",
    "backgroundBox": {
      "enabled": true,
      "animation": {
        "from": { "scaleX": 0 },
        "to": { "scaleX": 1 }
      }
    }
  }
]
```

## Easing Functions

Available easing options: "linear", "easeIn", "easeOut", "easeInOut", "easeOutElastic"
