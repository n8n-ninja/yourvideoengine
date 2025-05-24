# 🧠 YourVideoEngine – Schema & Type Naming Convention

This document outlines the full structure and naming conventions used in `YourVideoEngine` for video generation, timeline modeling, and type safety using Zod + TypeScript.

---

## 📦 1. Top-Level Structure

### `Storyboard`

- **Definition**: The entire video blueprint.
- **Type**: `StoryboardType`
- **Schema**: `Storyboard`
- **Contains**:
  - `tracks`: An array of `Segment`s (ordered scenes + transitions)
  - `overlay`: A persistent `Scene` that overlays the full video (e.g. music, watermark)

---

## 🎬 2. Timeline Segments

### `Segment`

- **Definition**: A timeline block. It can be either a `Scene` or a `Transition`.
- **Type**: `SegmentType`
- **Schema**: `Segment` (a discriminated union on `type`)

---

## 🧱 3. Scene

### `Scene`

- **Definition**: A block of time containing layers (text, image, camera, audio, etc.)
- **Type**: `SceneType`
- **Schema**: `Scene`
- **Contains**:
  - `duration`: In seconds
  - `layers`: An array of visual/audio `Layer`s

---

## 🔁 4. Transition

### `Transition`

- **Definition**: A temporal effect between two `Scene`s (e.g. fade, slide)
- **Type**: `TransitionType`
- **Schema**: `Transition`
- **Fields**:
  - `animation`: `"fade"` | `"slide"` | etc.
  - `duration`, `direction`, `sound`, etc.

---

## 🧩 5. Layers

### `Layer`

- **Definition**: A visual or audio element within a scene
- **Type**: `LayerType`
- **Schema**: `Layer` (a discriminated union)

### Available Layer Types:

| Schema         | Type               | Description                        |
| -------------- | ------------------ | ---------------------------------- |
| `TitleLayer`   | `TitleLayerType`   | A main title element               |
| `CaptionLayer` | `CaptionLayerType` | Timed words/subtitles              |
| `ImageLayer`   | `ImageLayerType`   | Static or animated image           |
| `AudioLayer`   | `AudioLayerType`   | Audio with optional volume control |
| `CameraLayer`  | `CameraLayerType`  | Camera movement or zoom effect     |

---

## 🔧 6. Base Schema Inheritance

Each `Layer` type extends `BaseLayer`, which contains shared properties like:

- `id` – optional UUID
- `timing` – timing controls (start, duration)
- `position` – screen placement
- `reveal` – entrance animation
- `containerStyle` – layout styling
- `effects` – filters, transitions, etc.

---

## 🧪 7. Inferred Types Summary

| Schema         | Type               |
| -------------- | ------------------ |
| `TitleLayer`   | `TitleLayerType`   |
| `AudioLayer`   | `AudioLayerType`   |
| `ImageLayer`   | `ImageLayerType`   |
| `CaptionLayer` | `CaptionLayerType` |
| `CameraLayer`  | `CameraLayerType`  |
| `Scene`        | `SceneType`        |
| `Transition`   | `TransitionType`   |
| `Segment`      | `SegmentType`      |
| `Storyboard`   | `StoryboardType`   |

---

## ✅ Naming Principles

- **Schemas** use clear, semantic names: `TitleLayer`, `Scene`, `Storyboard`
- **Inferred types** follow the `PascalCase + Type` pattern: `SceneType`, `ImageLayerType`
- The word **"Element"** is no longer used to avoid ambiguity with rendering engines or HTML.
- The top-level structure was renamed from `Composition` to `Storyboard` to avoid collision with Remotion's terminology.
