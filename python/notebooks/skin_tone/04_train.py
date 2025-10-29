import marimo

__generated_with = "0.17.2"
app = marimo.App()


@app.cell(hide_code=True)
def _(mo):
    mo.md(
        r"""
    # 3-Class Skin Tone Training (With Realistic Backgrounds)

    Train simplified 3-class skin tone model: dark, medium, light

    **Key improvement**: Uses images with realistic backgrounds (gradients, noise, blur) instead of face crops.
    This forces the model to learn face features and matches production use.
    """
    )
    return


@app.cell
def _():
    import tensorflow as tf
    import numpy as np
    import cv2
    from pathlib import Path
    import matplotlib.pyplot as plt
    import seaborn as sns
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import confusion_matrix, classification_report
    from collections import Counter
    import json

    print(f"TensorFlow version: {tf.__version__}")

    # Configure GPU
    gpus = tf.config.list_physical_devices('GPU')
    if gpus:
        try:
            for gpu in gpus:
                tf.config.experimental.set_memory_growth(gpu, True)
            print(f"✅ Found {len(gpus)} GPU(s)")
            tf.config.set_visible_devices(gpus[0], 'GPU')
        except RuntimeError as e:
            print(f"⚠️  GPU error: {e}")

    print(f"🎯 Device: {tf.test.gpu_device_name() or 'CPU'}")
    return (
        Counter,
        Path,
        classification_report,
        confusion_matrix,
        cv2,
        json,
        np,
        plt,
        sns,
        tf,
        train_test_split,
    )


@app.cell
def _(Path, np, tf):
    np.random.seed(42)
    tf.random.set_seed(42)

    # Updated to use dataset with realistic backgrounds
    DATA_PATH = Path('../../data/fairface-skin-tone-3class')
    MODEL_OUTPUT_PATH = Path('../../models/skin_tone')
    MODEL_OUTPUT_PATH.mkdir(exist_ok=True)

    SKIN_TONES = ['dark', 'medium', 'light']

    IMG_SIZE = 128
    BATCH_SIZE = 32
    EPOCHS = 40
    INITIAL_LR = 0.001

    print("🎯 Configuration (3 classes with realistic backgrounds):")
    print(f"  Image size: {IMG_SIZE}x{IMG_SIZE}")
    print(f"  Batch size: {BATCH_SIZE}")
    print(f"  Epochs: {EPOCHS}")
    print(f"  Initial LR: {INITIAL_LR}")
    print(f"  Classes: {SKIN_TONES}")
    print(f"  Dataset: {DATA_PATH.name}")
    print(f"  ✨ Images have realistic backgrounds (gradients, noise, blur)")
    return (
        BATCH_SIZE,
        DATA_PATH,
        EPOCHS,
        IMG_SIZE,
        INITIAL_LR,
        MODEL_OUTPUT_PATH,
        SKIN_TONES,
    )


@app.cell
def _(DATA_PATH, IMG_SIZE, SKIN_TONES, cv2, np):
    def load_skin_tone_dataset(data_path, img_size=128):
        """Load 3-class skin tone dataset"""
        images = []
        labels = []
        for class_idx, _class_name in enumerate(SKIN_TONES):
            class_path = data_path / _class_name
            if not class_path.exists():
                print(f'⚠️  {class_path} not found')
                continue
            image_files = list(class_path.glob('*.jpg'))
            print(f'Loading {len(image_files):,} {_class_name} images...')
            for img_file in image_files:
                try:
                    img = cv2.imread(str(img_file))
                    if img is None:
                        continue
                    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                    img = cv2.resize(img, (img_size, img_size))
                    images.append(img)
                    labels.append(class_idx)
                except Exception as e:
                    print(f'Error: {img_file}: {e}')
        images = np.array(images, dtype=np.float32) / 255.0
        labels = np.array(labels)
        return (images, labels)
    print('📁 Loading 3-class dataset...')
    X, y = load_skin_tone_dataset(DATA_PATH, IMG_SIZE)
    print(f'\n✅ Dataset: {X.shape}, {y.shape}')
    print(f'   Memory: ~{X.nbytes / 1024 / 1024:.0f} MB')
    print(f'\n📊 Class distribution:')
    for _idx, _class_name in enumerate(SKIN_TONES):
        _count = (y == _idx).sum()
    # Class distribution
        print(f'  {_class_name:15s}: {_count:,}')
    return X, y


@app.cell
def _(SKIN_TONES, X, tf, train_test_split, y):
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    y_train_cat = tf.keras.utils.to_categorical(y_train, len(SKIN_TONES))
    y_val_cat = tf.keras.utils.to_categorical(y_val, len(SKIN_TONES))

    print(f'📊 Split: Train={X_train.shape[0]:,}, Val={X_val.shape[0]:,}')
    return X_train, X_val, y_train_cat, y_val, y_val_cat


@app.cell
def _(BATCH_SIZE, X_train, y_train_cat):
    from tensorflow.keras.preprocessing.image import ImageDataGenerator

    # Minimal augmentation - preserve skin tone!
    datagen = ImageDataGenerator(
        rotation_range=10,
        width_shift_range=0.1,
        height_shift_range=0.1,
        zoom_range=0.1,
        horizontal_flip=True,
        fill_mode='nearest'
    )

    train_generator = datagen.flow(
        X_train, y_train_cat,
        batch_size=BATCH_SIZE,
        shuffle=True
    )

    print("✅ Augmentation configured")
    return (train_generator,)


@app.cell
def _(BATCH_SIZE, EPOCHS, IMG_SIZE, INITIAL_LR, SKIN_TONES, X_train, tf):
    def create_3class_model(input_shape=(128, 128, 3), num_classes=3):
        """3-class skin tone model"""
    
        model = tf.keras.Sequential([
            tf.keras.layers.Input(shape=input_shape),
        
            # Block 1
            tf.keras.layers.Conv2D(32, 3, padding='same', activation='relu'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.MaxPooling2D(2),
            tf.keras.layers.Dropout(0.1),
        
            # Block 2
            tf.keras.layers.Conv2D(64, 3, padding='same', activation='relu'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.MaxPooling2D(2),
            tf.keras.layers.Dropout(0.1),
        
            # Block 3
            tf.keras.layers.Conv2D(128, 3, padding='same', activation='relu'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.MaxPooling2D(2),
            tf.keras.layers.Dropout(0.2),
        
            # Classifier
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(num_classes, activation='softmax')
        ])
    
        # Cosine decay
        steps_per_epoch = len(X_train) // BATCH_SIZE
        total_steps = steps_per_epoch * EPOCHS
    
        lr_schedule = tf.keras.optimizers.schedules.CosineDecay(
            initial_learning_rate=INITIAL_LR,
            decay_steps=total_steps,
            alpha=0.01
        )
    
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=lr_schedule),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
    
        return model

    model = create_3class_model(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        num_classes=len(SKIN_TONES)
    )

    model.summary()

    param_count = model.count_params()
    print(f"\n📏 Model: {param_count:,} params")
    return (model,)


@app.cell
def _(MODEL_OUTPUT_PATH, tf):
    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor='val_accuracy',
            patience=20,
            restore_best_weights=True,
            mode='max',
            verbose=1
        ),
        tf.keras.callbacks.ModelCheckpoint(
            str(MODEL_OUTPUT_PATH / 'best_skin_tone_3class.keras'),
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_accuracy',
            factor=0.5,
            patience=10,
            min_lr=1e-6,
            mode='max',
            verbose=1
        )
    ]

    print("✅ Callbacks configured")
    return (callbacks,)


@app.cell
def _(
    BATCH_SIZE,
    EPOCHS,
    X_train,
    X_val,
    callbacks,
    model,
    train_generator,
    y_val_cat,
):
    print("🚀 Training 3-class model with realistic backgrounds...\n")
    print("Expected improvements:")
    print("  • Model must learn face features (can't ignore varied backgrounds)")
    print("  • Better generalization to production images")
    print("  • Matches real-world use (photos with backgrounds)\n")

    steps_per_epoch = len(X_train) // BATCH_SIZE

    history = model.fit(
        train_generator,
        steps_per_epoch=steps_per_epoch,
        epochs=EPOCHS,
        validation_data=(X_val, y_val_cat),
        callbacks=callbacks,
        verbose=1
    )

    print("\n✅ Training complete!")
    return (history,)


@app.cell
def _(MODEL_OUTPUT_PATH, history, plt):
    _fig, _axes = plt.subplots(1, 2, figsize=(14, 5))
    _axes[0].plot(history.history['accuracy'], label='Train', linewidth=2)
    _axes[0].plot(history.history['val_accuracy'], label='Validation', linewidth=2)
    _axes[0].set_title('3-Class Model Accuracy', fontsize=14, fontweight='bold')
    _axes[0].set_xlabel('Epoch')
    _axes[0].set_ylabel('Accuracy')
    _axes[0].legend()
    _axes[0].grid(True, alpha=0.3)
    _axes[1].plot(history.history['loss'], label='Train', linewidth=2)
    _axes[1].plot(history.history['val_loss'], label='Validation', linewidth=2)
    _axes[1].set_title('3-Class Model Loss', fontsize=14, fontweight='bold')
    _axes[1].set_xlabel('Epoch')
    _axes[1].set_ylabel('Loss')
    _axes[1].legend()
    _axes[1].grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(MODEL_OUTPUT_PATH / 'skin_tone_3class_history.png', dpi=150)
    plt.show()
    return


@app.cell
def _(Counter, SKIN_TONES, X_val, classification_report, model, np, y_val):
    y_pred_probs = model.predict(X_val, verbose=0)
    y_pred = np.argmax(y_pred_probs, axis=1)
    print('\n📊 Classification Report:')
    print('=' * 60)
    print(classification_report(y_val, y_pred, target_names=SKIN_TONES, zero_division=0))
    val_accuracy = np.mean(y_val == y_pred)
    print(f'\n✅ Validation Accuracy: {val_accuracy * 100:.2f}%')
    print('\n📊 Per-class Performance:')
    for _idx, _class_name in enumerate(SKIN_TONES):
        mask = y_val == _idx
        if mask.sum() > 0:
            class_acc = (y_pred[mask] == _idx).sum() / mask.sum()
            support = mask.sum()
            print(f'  {_class_name:15s}: {class_acc * 100:5.1f}% (n={support})')
    print('\n📊 Prediction Distribution:')
    pred_counts = Counter(y_pred)
    for _idx, _class_name in enumerate(SKIN_TONES):
        _count = pred_counts.get(_idx, 0)
    # Prediction distribution
        percentage = _count / len(y_pred) * 100
        bar = '█' * int(percentage / 3)
        print(f'  {_class_name:15s}: {_count:6,} ({percentage:5.1f}%) {bar}')
    return (y_pred,)


@app.cell
def _(
    MODEL_OUTPUT_PATH,
    SKIN_TONES,
    confusion_matrix,
    np,
    plt,
    sns,
    y_pred,
    y_val,
):
    cm = confusion_matrix(y_val, y_pred)
    cm_norm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
    _fig, _axes = plt.subplots(1, 2, figsize=(14, 7))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=SKIN_TONES, yticklabels=SKIN_TONES, ax=_axes[0])
    _axes[0].set_title('Confusion Matrix (Counts)', fontweight='bold')
    _axes[0].set_ylabel('True')
    _axes[0].set_xlabel('Predicted')
    sns.heatmap(cm_norm, annot=True, fmt='.2f', cmap='Blues', xticklabels=SKIN_TONES, yticklabels=SKIN_TONES, ax=_axes[1])
    _axes[1].set_title('Confusion Matrix (Normalized)', fontweight='bold')
    _axes[1].set_ylabel('True')
    _axes[1].set_xlabel('Predicted')
    plt.tight_layout()
    plt.savefig(MODEL_OUTPUT_PATH / 'skin_tone_3class_confusion.png', dpi=150)
    plt.show()
    return


@app.cell
def _(MODEL_OUTPUT_PATH, SKIN_TONES, history, json, model):
    print("\n💾 Saving 3-class model...")

    # Save with descriptive name
    model.save(MODEL_OUTPUT_PATH / 'skin_tone_3class_realistic_bg.keras')
    print("✅ Saved: skin_tone_3class_realistic_bg.keras")

    # Also save as the default name (for backwards compatibility)
    model.save(MODEL_OUTPUT_PATH / 'skin_tone_3class.keras')
    print("✅ Saved: skin_tone_3class.keras")

    with open(MODEL_OUTPUT_PATH / 'skin_tone_classes.json', 'w') as f:
        json.dump(SKIN_TONES, f, indent=2)
    print("✅ Saved: skin_tone_classes.json")

    history_dict = {
        'accuracy': [float(x) for x in history.history['accuracy']],
        'val_accuracy': [float(x) for x in history.history['val_accuracy']],
        'loss': [float(x) for x in history.history['loss']],
        'val_loss': [float(x) for x in history.history['val_loss']],
        'epochs': len(history.history['accuracy']),
        'final_val_accuracy': float(history.history['val_accuracy'][-1]),
        'best_val_accuracy': float(max(history.history['val_accuracy'])),
        'dataset': 'fairface-3class-realistic-bg',
        'background_types': ['gradient', 'noise', 'blur', 'mixed']
    }

    with open(MODEL_OUTPUT_PATH / 'skin_tone_3class_history.json', 'w') as f:
        json.dump(history_dict, f, indent=2)
    print("✅ Saved: skin_tone_3class_history.json")

    print(f"\n🎉 Results:")
    print(f"="*60)
    print(f"Dataset: FairFace 3-class with realistic backgrounds")
    print(f"Train accuracy: {history.history['accuracy'][-1]*100:.2f}%")
    print(f"Val accuracy: {history.history['val_accuracy'][-1]*100:.2f}%")
    print(f"Best val accuracy: {max(history.history['val_accuracy'])*100:.2f}%")
    print(f"Epochs trained: {len(history.history['accuracy'])}")

    model_size_mb = (MODEL_OUTPUT_PATH / 'skin_tone_3class.keras').stat().st_size / 1024 / 1024
    print(f"\nModel size: {model_size_mb:.1f} MB")
    print(f"="*60)

    print("\n✅ Model trained on images with realistic backgrounds!")
    print("   Should work better on production photos with varied backgrounds.")
    return


@app.cell
def _(MODEL_OUTPUT_PATH, model):
    # Convert to TensorFlow.js
    import tensorflowjs as tfjs
    import shutil

    print("\n" + "="*60)
    print("🔄 Converting to TensorFlow.js...")
    print("="*60)

    TFJS_OUTPUT = MODEL_OUTPUT_PATH / 'skin_tone' / 'tfjs'
    TFJS_OUTPUT.mkdir(parents=True, exist_ok=True)

    print(f"\n📦 Loading model from: {MODEL_OUTPUT_PATH / 'skin_tone_3class.keras'}")
    print(f"📁 Output directory: {TFJS_OUTPUT}")

    # Convert with quantization for smaller size
    tfjs.converters.save_keras_model(
        model,
        str(TFJS_OUTPUT),
        quantization_dtype_map={'uint8': '*'}
    )

    # Copy classes file
    shutil.copy(
        MODEL_OUTPUT_PATH / 'skin_tone_classes.json',
        TFJS_OUTPUT / 'classes.json'
    )

    print("\n✅ TensorFlow.js conversion complete!")
    print("\n📁 Generated files:")
    _total_size = 0
    for _file in sorted(TFJS_OUTPUT.glob('*')):
        _size = _file.stat().st_size / 1024
        _total_size += _size
        print(f"   - {_file.name}: {_size:.1f} KB")

    print(f"\n📦 Total size: {_total_size:.1f} KB ({_total_size/1024:.2f} MB)")
    print("\n🎯 Ready for deployment!")
    print(f"   Location: {TFJS_OUTPUT}")
    return TFJS_OUTPUT, shutil, tfjs


@app.cell
def _():
    import marimo as mo
    return (mo,)


if __name__ == "__main__":
    app.run()
