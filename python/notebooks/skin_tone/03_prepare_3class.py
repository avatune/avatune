import marimo

__generated_with = "0.17.2"
app = marimo.App()


@app.cell(hide_code=True)
def _(mo):
    mo.md(
        r"""
    # Prepare 3-Class Skin Tone with Realistic Backgrounds

    **Improved**: Uses realistic backgrounds (gradients, textures, blur) instead of solid colors.

    **Why this is better**:
    1. ✅ Ethnicity labels from FairFace (proven reliable)
    2. ✅ Realistic backgrounds (gradients, noise, blur) - not solid colors
    3. ✅ Model can't filter out as 'noise' - must learn to focus on face
    4. ✅ Matches real-world scenarios (varied backgrounds)
    """
    )
    return


@app.cell
def _():
    from pathlib import Path
    import shutil
    from collections import Counter
    import cv2
    import numpy as np
    from tqdm import tqdm
    import random

    random.seed(42)
    np.random.seed(42)

    print("📦 Setup complete")
    return Counter, Path, cv2, np, random, tqdm


@app.cell
def _(Path):
    SOURCE_PATH = Path('./data/fairface-skin')
    OUTPUT_PATH = Path('./data/fairface-skin-tone-3class')
    ETHNICITY_TO_TONE = {'black': 'dark', 'indian': 'medium', 'middle_eastern': 'medium', 'southeast_asian': 'medium', 'east_asian': 'medium', 'latino_hispanic': 'medium', 'white': 'light'}
    SKIN_TONES = ['dark', 'medium', 'light']
    MAX_PER_CLASS = 15000
    print(f'Source: {SOURCE_PATH}')
    print(f'Output: {OUTPUT_PATH}')
    print(f'\nMapping (3 classes):')
    for eth, _tone in sorted(ETHNICITY_TO_TONE.items()):
        print(f'  {eth:20s} → {_tone}')
    return (
        ETHNICITY_TO_TONE,
        MAX_PER_CLASS,
        OUTPUT_PATH,
        SKIN_TONES,
        SOURCE_PATH,
    )


@app.cell
def _(cv2, np):
    def create_realistic_background(target_size=(256, 256)):
        """
        Create realistic background: gradients, noise, or blur.
        These are much harder for the model to filter out.
        """
    
        bg_type = np.random.choice(['gradient', 'noise', 'blur', 'mixed'])
    
        if bg_type == 'gradient':
            # Random gradient (like studio lighting)
            color1 = np.random.randint(80, 240, 3)
            color2 = np.random.randint(80, 240, 3)
        
            background = np.zeros((target_size[1], target_size[0], 3), dtype=np.float32)
        
            # Vertical or horizontal gradient
            if np.random.random() > 0.5:
                for i in range(target_size[1]):
                    alpha = i / target_size[1]
                    background[i, :] = color1 * (1 - alpha) + color2 * alpha
            else:
                for i in range(target_size[0]):
                    alpha = i / target_size[0]
                    background[:, i] = color1 * (1 - alpha) + color2 * alpha
        
            background = background.astype(np.uint8)
    
        elif bg_type == 'noise':
            # Textured background (like walls, fabric)
            base_color = np.random.randint(80, 220, 3)
            noise = np.random.randint(-40, 40, (target_size[1], target_size[0], 3))
            background = np.clip(base_color + noise, 0, 255).astype(np.uint8)
        
            # Sometimes add slight blur to make it more natural
            if np.random.random() > 0.5:
                background = cv2.GaussianBlur(background, (5, 5), 0)
    
        elif bg_type == 'blur':
            # Blurred bokeh-like background
            bg = np.random.randint(60, 255, (target_size[1] // 4, target_size[0] // 4, 3), dtype=np.uint8)
            background = cv2.resize(bg, target_size, interpolation=cv2.INTER_LINEAR)
            background = cv2.GaussianBlur(background, (51, 51), 0)
    
        else:  # mixed
            # Combination of gradient + noise
            color1 = np.random.randint(80, 220, 3)
            color2 = np.random.randint(100, 240, 3)
        
            background = np.zeros((target_size[1], target_size[0], 3), dtype=np.float32)
            for i in range(target_size[1]):
                alpha = i / target_size[1]
                background[i, :] = color1 * (1 - alpha) + color2 * alpha
        
            # Add noise
            noise = np.random.randint(-20, 20, (target_size[1], target_size[0], 3))
            background = np.clip(background + noise, 0, 255).astype(np.uint8)
    
        return background

    def add_realistic_background(face_img, target_size=(256, 256)):
        """
        Composite face onto realistic background.
        Includes edge blending for more natural look.
        """
    
        # Create realistic background
        background = create_realistic_background(target_size)
    
        face_h, face_w = face_img.shape[:2]
    
        # Random scale (65-85% of target size)
        max_scale = min(target_size[0] / face_w, target_size[1] / face_h) * 0.85
        scale = np.random.uniform(0.65, max_scale)
    
        new_w = int(face_w * scale)
        new_h = int(face_h * scale)
    
        # Resize face
        face_resized = cv2.resize(face_img, (new_w, new_h))
    
        # Random position (centered with offset)
        x_offset = (target_size[0] - new_w) // 2 + np.random.randint(-30, 31)
        y_offset = (target_size[1] - new_h) // 2 + np.random.randint(-30, 31)
    
        # Clamp to bounds
        x_offset = max(0, min(x_offset, target_size[0] - new_w))
        y_offset = max(0, min(y_offset, target_size[1] - new_h))
    
        # Add soft edge blending (30% of images)
        if np.random.random() > 0.7:
            # Create feathered mask
            mask = np.ones((new_h, new_w), dtype=np.float32)
            border = min(8, min(new_h, new_w) // 20)
        
            if border > 0:
                # Feather edges
                for i in range(border):
                    alpha = (i + 1) / border
                    mask[i, :] *= alpha
                    mask[-(i+1), :] *= alpha
                    mask[:, i] *= alpha
                    mask[:, -(i+1)] *= alpha
        
            mask = mask[:, :, None]
        
            # Blend
            bg_region = background[y_offset:y_offset+new_h, x_offset:x_offset+new_w]
            blended = (face_resized * mask + bg_region * (1 - mask)).astype(np.uint8)
            background[y_offset:y_offset+new_h, x_offset:x_offset+new_w] = blended
        else:
            # Direct placement
            background[y_offset:y_offset+new_h, x_offset:x_offset+new_w] = face_resized
    
        return background

    # Test
    print("\nTesting realistic background generation...")
    test_face = np.random.randint(100, 200, (224, 224, 3), dtype=np.uint8)
    result = add_realistic_background(test_face)
    print(f"✅ Test passed: {test_face.shape} → {result.shape}")
    print("\nBackground types: gradient, noise, blur, mixed")
    print("Edge blending: 30% of images have soft edges")
    return (add_realistic_background,)


@app.cell
def _(OUTPUT_PATH, SKIN_TONES):
    # Create output directories
    for _tone in SKIN_TONES:
        (OUTPUT_PATH / _tone).mkdir(parents=True, exist_ok=True)
    print('✅ Created output directories')
    return


@app.cell
def _(ETHNICITY_TO_TONE, SKIN_TONES, SOURCE_PATH):
    print('\n📁 Grouping images by tone...\n')
    tone_images = {_tone: [] for _tone in SKIN_TONES}
    for ethnicity, _tone in ETHNICITY_TO_TONE.items():
        ethnicity_path = SOURCE_PATH / ethnicity
        if not ethnicity_path.exists():
            print(f'⚠️  {ethnicity} directory not found')
            continue
        _images = list(ethnicity_path.glob('*.jpg'))
        print(f'{ethnicity:20s} ({len(_images):5,} images) → {_tone}')
        tone_images[_tone].extend(_images)
    print(f'\n📊 Total per tone:')
    for _tone, _images in tone_images.items():
        print(f'  {_tone:15s}: {len(_images):6,}')
    return (tone_images,)


@app.cell
def _(
    Counter,
    MAX_PER_CLASS,
    OUTPUT_PATH,
    add_realistic_background,
    cv2,
    random,
    tone_images,
    tqdm,
):
    print(f'\n📁 Adding realistic backgrounds to {MAX_PER_CLASS:,} images per tone...\n')
    tone_counts = Counter()
    processed = 0
    for _tone, _images in tone_images.items():
        print(f'\nProcessing {_tone}...')
        random.shuffle(_images)
        selected = _images[:MAX_PER_CLASS]
        for _img_path in tqdm(selected, desc=f'  {_tone}'):
            face_img = cv2.imread(str(_img_path))  # Shuffle and sample
            if face_img is None:
                continue
            img_with_bg = add_realistic_background(face_img, target_size=(256, 256))
            dst = OUTPUT_PATH / _tone / f'{_tone}_{tone_counts[_tone]:06d}.jpg'
            cv2.imwrite(str(dst), img_with_bg)
            tone_counts[_tone] += 1
            processed += 1
    print(f'\n✅ Processed {processed:,} images with realistic backgrounds')  # Add realistic background  # Save
    return (tone_counts,)


@app.cell
def _(OUTPUT_PATH, SKIN_TONES, tone_counts):
    print('\n📊 Final Distribution:\n')
    for _tone in SKIN_TONES:
        count = len(list((OUTPUT_PATH / _tone).glob('*.jpg')))
        percentage = count / sum(tone_counts.values()) * 100
        bar = '█' * int(percentage / 3)
        print(f'  {_tone:15s}: {count:6,} ({percentage:5.1f}%) {bar}')
    print(f'\n  Total: {sum(tone_counts.values()):,}')
    print(f'\n✅ Dataset: {OUTPUT_PATH}')
    print('\n🎯 Advantages over solid colors:')
    print('  1. ✅ Gradients (like studio lighting)')
    print('  2. ✅ Noise/texture (like walls, fabric)')
    print('  3. ✅ Blur (like bokeh/depth of field)')
    print('  4. ✅ Edge blending (30% have soft edges)')
    print("  5. ✅ Model MUST learn face features, can't ignore background")
    print('\nReady for 06_train notebook!')
    return


@app.cell
def _(OUTPUT_PATH, SKIN_TONES, cv2):
    # Visualize samples
    import matplotlib.pyplot as plt
    fig, axes = plt.subplots(3, 6, figsize=(18, 9))
    fig.suptitle('Realistic Backgrounds: Gradients, Noise, Blur, Mixed', fontsize=16, fontweight='bold')
    for tone_idx, _tone in enumerate(SKIN_TONES):
        imgs = list((OUTPUT_PATH / _tone).glob('*.jpg'))[:6]
        for img_idx, _img_path in enumerate(imgs):
            img = cv2.imread(str(_img_path))
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            axes[tone_idx, img_idx].imshow(img_rgb)
            axes[tone_idx, img_idx].axis('off')
            if img_idx == 0:
                axes[tone_idx, img_idx].set_ylabel(_tone.upper(), fontsize=12, fontweight='bold')
    plt.tight_layout()
    plt.show()
    print('\n✅ Notice: Each image has a DIFFERENT realistic background!')
    print('   Model cannot treat background as constant noise.')
    return


@app.cell
def _():
    import marimo as mo
    return (mo,)


if __name__ == "__main__":
    app.run()
