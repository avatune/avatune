import marimo

__generated_with = "0.17.2"
app = marimo.App()


@app.cell(hide_code=True)
def _(mo):
    mo.md(
        r"""
    # 3-Class Hair Length Training

    Train lightweight 3-class hair length model: short, medium, long

    **Dataset**: CelebAMask-HQ with hair segmentation masks
    **Architecture**: Same lightweight design as hair color and skin tone (~111K params)
    **Classes**: Combined bald+short into single "short" class for better balance
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
            print(f"   Using GPU: {gpus[0].name}")
            tf.config.set_visible_devices(gpus[0], 'GPU')
        except RuntimeError as e:
            print(f"⚠️  GPU error: {e}")
    else:
        print("⚠️  No GPU, using CPU")

    print(f"\n🎯 Device: {tf.test.gpu_device_name() or 'CPU'}")
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

    # Configuration
    DATA_PATH = Path('../../data/hair-length-3class')
    MODEL_OUTPUT_PATH = Path('../../models/hair_length')
    MODEL_OUTPUT_PATH.mkdir(exist_ok=True)

    HAIR_LENGTHS = ['short', 'medium', 'long']  # 3 classes

    IMG_SIZE = 128
    BATCH_SIZE = 32
    EPOCHS = 50
    INITIAL_LR = 0.001

    print("🎯 Configuration (3 classes):")
    print(f"  Image size: {IMG_SIZE}x{IMG_SIZE}")
    print(f"  Batch size: {BATCH_SIZE}")
    print(f"  Epochs: {EPOCHS}")
    print(f"  Initial LR: {INITIAL_LR}")
    print(f"  Classes: {HAIR_LENGTHS}")
    return (
        BATCH_SIZE,
        DATA_PATH,
        EPOCHS,
        HAIR_LENGTHS,
        IMG_SIZE,
        INITIAL_LR,
        MODEL_OUTPUT_PATH,
    )


@app.cell
def _(DATA_PATH, HAIR_LENGTHS, IMG_SIZE, cv2, np):
    def load_hair_length_dataset(data_path, img_size=128):
        """Load 4-class hair length dataset"""
        images = []
        labels = []
        for _class_idx, _class_name in enumerate(HAIR_LENGTHS):
            class_path = data_path / _class_name
            if not class_path.exists():
                print(f'⚠️  {class_path} not found')
                continue
            image_files = list(class_path.glob('*.jpg'))
            print(f'Loading {len(image_files):,} {_class_name} hair images...')
            for img_file in image_files:
                try:
                    img = cv2.imread(str(img_file))
                    if img is None:
                        continue
                    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                    img = cv2.resize(img, (img_size, img_size))
                    images.append(img)
                    labels.append(_class_idx)
                except Exception as e:
                    print(f'Error loading {img_file}: {e}')
        images = np.array(images, dtype=np.float32) / 255.0
        labels = np.array(labels)
        return (images, labels)
    print('📁 Loading hair length dataset...')
    X, y = load_hair_length_dataset(DATA_PATH, IMG_SIZE)
    print(f'\n✅ Dataset loaded:')
    print(f'  Images shape: {X.shape}')
    print(f'  Labels shape: {y.shape}')
    print(f'  Memory: ~{X.nbytes / 1024 / 1024:.1f} MB')
    print(f'\n📊 Class distribution:')
    for _idx, _class_name in enumerate(HAIR_LENGTHS):
        _count = (y == _idx).sum()
        _percentage = _count / len(y) * 100
    # Class distribution
        print(f'  {_class_name:10s}: {_count:6,} ({_percentage:5.1f}%)')
    return X, y


@app.cell
def _(Counter, HAIR_LENGTHS, X, np, tf, train_test_split, y):
    # Train/validation split
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    print(f'📊 Data split:')
    print(f'  Training set: {X_train.shape[0]:,} samples')
    print(f'  Validation set: {X_val.shape[0]:,} samples')
    print(f'\n📊 Train distribution (before balancing):')
    train_dist = Counter(y_train)
    for _idx, _class_name in enumerate(HAIR_LENGTHS):
        _count = train_dist[_idx]
        _percentage = _count / len(y_train) * 100
        print(f'  {_class_name:10s}: {_count:6,} ({_percentage:5.1f}%)')
    print(f'\n📊 Val distribution (before balancing):')
    val_dist = Counter(y_val)
    for _idx, _class_name in enumerate(HAIR_LENGTHS):
        _count = val_dist[_idx]
        _percentage = _count / len(y_val) * 100
        print(f'  {_class_name:10s}: {_count:6,} ({_percentage:5.1f}%)')
    print(f'\n🔄 Balancing validation set...')
    min_val_size = min(val_dist.values())
    print(f'   Using {min_val_size} samples per class')
    X_val_balanced = []
    y_val_balanced = []
    for _class_idx in range(len(HAIR_LENGTHS)):
        _class_mask = y_val == _class_idx
        _class_samples = X_val[_class_mask]
        _class_labels = y_val[_class_mask]
    # Balance validation set too for stable metrics
        _current_size = len(_class_samples)
        if _current_size > min_val_size:
            _indices = np.random.choice(_current_size, min_val_size, replace=False)
            _class_samples = _class_samples[_indices]
            _class_labels = _class_labels[_indices]
        X_val_balanced.append(_class_samples)
        y_val_balanced.append(_class_labels)
    X_val_balanced = np.concatenate(X_val_balanced)
    y_val_balanced = np.concatenate(y_val_balanced)
    _shuffle_idx = np.random.permutation(len(X_val_balanced))
    X_val = X_val_balanced[_shuffle_idx]
    y_val = y_val_balanced[_shuffle_idx]
    y_train_cat = tf.keras.utils.to_categorical(y_train, len(HAIR_LENGTHS))
    y_val_cat = tf.keras.utils.to_categorical(y_val, len(HAIR_LENGTHS))
    print(f'\n✅ Balanced validation set: {len(X_val):,} samples')
    # Shuffle
    print(f'   Each class: {min_val_size:,} samples')
    return X_train, X_val, train_dist, y_train, y_val, y_val_cat


@app.cell
def _(HAIR_LENGTHS, X_train, np, tf, train_dist, y_train):
    from tensorflow.keras.preprocessing.image import ImageDataGenerator
    datagen = ImageDataGenerator(rotation_range=10, width_shift_range=0.1, height_shift_range=0.1, brightness_range=[0.9, 1.1], zoom_range=0.1, horizontal_flip=True, fill_mode='nearest')
    # Minimal augmentation
    print('🔄 Balancing dataset via undersampling...')
    min_class_size = min(train_dist.values())
    print(f'   Target samples per class: {min_class_size:,} (matching smallest class)')
    X_train_balanced = []
    y_train_balanced = []
    for _class_idx in range(len(HAIR_LENGTHS)):
        _class_mask = y_train == _class_idx
        _class_samples = X_train[_class_mask]
        _class_labels = y_train[_class_mask]
        _current_size = len(_class_samples)
    # Undersample to match smallest class
        if _current_size > min_class_size:
            _indices = np.random.choice(_current_size, min_class_size, replace=False)
    # Find min class size
            _class_samples = _class_samples[_indices]
            _class_labels = _class_labels[_indices]
            print(f'   {HAIR_LENGTHS[_class_idx]:10s}: {_current_size:5,} → {min_class_size:5,} samples')
    # Undersample each class to match the smallest
        else:
            print(f'   {HAIR_LENGTHS[_class_idx]:10s}: {_current_size:5,} → {min_class_size:5,} samples (kept all)')
        X_train_balanced.append(_class_samples)
        y_train_balanced.append(_class_labels)
    X_train_balanced = np.concatenate(X_train_balanced)  # Get all samples for this class
    y_train_balanced = np.concatenate(y_train_balanced)
    _shuffle_idx = np.random.permutation(len(X_train_balanced))
    X_train_balanced = X_train_balanced[_shuffle_idx]
    y_train_balanced = y_train_balanced[_shuffle_idx]
    y_train_balanced_cat = tf.keras.utils.to_categorical(y_train_balanced, len(HAIR_LENGTHS))
    print(f'\n✅ Balanced dataset: {X_train_balanced.shape[0]:,} samples')
    print(f'   Each class: {min_class_size:,} samples')  # Randomly sample min_class_size samples
    # Combine and shuffle
    # Shuffle
    print('✅ Using direct training (no generator) for stability')  # Undersample
    return X_train_balanced, y_train_balanced_cat


@app.cell
def _(HAIR_LENGTHS, IMG_SIZE, INITIAL_LR, tf):
    def create_hair_length_model(input_shape=(128, 128, 3), num_classes=3):
        """Simplified 3-class hair length model"""
    
        model = tf.keras.Sequential([
            tf.keras.layers.Input(shape=input_shape),
        
            # Block 1
            tf.keras.layers.Conv2D(32, 3, padding='same', activation='relu'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.MaxPooling2D(2),
        
            # Block 2
            tf.keras.layers.Conv2D(64, 3, padding='same', activation='relu'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.MaxPooling2D(2),
        
            # Block 3
            tf.keras.layers.Conv2D(128, 3, padding='same', activation='relu'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.MaxPooling2D(2),
        
            # Classifier - minimal dropout
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(num_classes, activation='softmax')
        ])
    
        # Simple fixed learning rate
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=INITIAL_LR),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
    
        return model

    model = create_hair_length_model(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        num_classes=len(HAIR_LENGTHS)
    )

    model.summary()

    param_count = model.count_params()
    print(f"\n📏 Model size: {param_count:,} params (~{param_count * 4 / 1024:.0f} KB)")
    print(f"💡 3-class model for easier learning")
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
            str(MODEL_OUTPUT_PATH / 'best_hair_length_model.keras'),
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_accuracy',
            factor=0.5,
            patience=5,
            min_lr=1e-6,
            mode='max',
            verbose=1
        )
    ]

    print("✅ Callbacks configured (EarlyStopping + ReduceLROnPlateau)")
    return (callbacks,)


@app.cell
def _(
    BATCH_SIZE,
    EPOCHS,
    X_train_balanced,
    X_val,
    callbacks,
    model,
    train_dist,
    y_train_balanced_cat,
    y_val_cat,
):
    print("🚀 Starting training with balanced dataset (no augmentation)...\n")
    print(f"   Training samples: {len(X_train_balanced):,} (balanced)")
    print(f"   Validation samples: {len(X_val):,} (balanced)")
    print(f"   Each class: {min(train_dist.values()):,} samples\n")

    history = model.fit(
        X_train_balanced, y_train_balanced_cat,  # Direct training, no generator
        batch_size=BATCH_SIZE,
        epochs=EPOCHS,
        validation_data=(X_val, y_val_cat),
        callbacks=callbacks,
        verbose=1
    )

    print("\n✅ Training complete!")
    return (history,)


@app.cell
def _(MODEL_OUTPUT_PATH, history, plt):
    # Plot training history
    _fig, _axes = plt.subplots(1, 2, figsize=(14, 5))
    _axes[0].plot(history.history['accuracy'], label='Train', linewidth=2)
    _axes[0].plot(history.history['val_accuracy'], label='Validation', linewidth=2)
    _axes[0].set_title('Hair Length Model Accuracy', fontsize=14, fontweight='bold')
    _axes[0].set_xlabel('Epoch')
    _axes[0].set_ylabel('Accuracy')
    _axes[0].legend()
    _axes[0].grid(True, alpha=0.3)
    _axes[1].plot(history.history['loss'], label='Train', linewidth=2)
    _axes[1].plot(history.history['val_loss'], label='Validation', linewidth=2)
    _axes[1].set_title('Hair Length Model Loss', fontsize=14, fontweight='bold')
    _axes[1].set_xlabel('Epoch')
    _axes[1].set_ylabel('Loss')
    _axes[1].legend()
    _axes[1].grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(MODEL_OUTPUT_PATH / 'hair_length_history.png', dpi=150)
    plt.show()
    return


@app.cell
def _(Counter, HAIR_LENGTHS, X_val, classification_report, model, np, y_val):
    # Evaluate model
    y_pred_probs = model.predict(X_val, verbose=0)
    y_pred = np.argmax(y_pred_probs, axis=1)
    print('\n📊 Classification Report:')
    print('=' * 60)
    print(classification_report(y_val, y_pred, target_names=HAIR_LENGTHS, zero_division=0))
    val_accuracy = np.mean(y_val == y_pred)
    print(f'\n✅ Validation Accuracy: {val_accuracy * 100:.2f}%')
    print('\n📊 Per-class Performance:')
    for _idx, _class_name in enumerate(HAIR_LENGTHS):
        mask = y_val == _idx
        if mask.sum() > 0:
            class_acc = (y_pred[mask] == _idx).sum() / mask.sum()
            support = mask.sum()
            print(f'  {_class_name:10s}: {class_acc * 100:5.1f}% (n={support})')
    print('\n📊 Prediction Distribution:')
    # Per-class performance
    pred_counts = Counter(y_pred)
    for _idx, _class_name in enumerate(HAIR_LENGTHS):
        _count = pred_counts.get(_idx, 0)
        _percentage = _count / len(y_pred) * 100
        bar = '█' * int(_percentage / 5)
        print(f'  {_class_name:10s}: {_count:6,} ({_percentage:5.1f}%) {bar}')
    zero_pred_classes = [HAIR_LENGTHS[i] for i in range(len(HAIR_LENGTHS)) if pred_counts.get(i, 0) == 0]
    if zero_pred_classes:
    # Prediction distribution
    # Check for zero predictions
        print(f"\n⚠️  Classes with ZERO predictions: {', '.join(zero_pred_classes)}")
    return (y_pred,)


@app.cell
def _(
    HAIR_LENGTHS,
    MODEL_OUTPUT_PATH,
    confusion_matrix,
    np,
    plt,
    sns,
    y_pred,
    y_val,
):
    # Confusion matrix
    cm = confusion_matrix(y_val, y_pred)
    cm_normalized = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
    _fig, _axes = plt.subplots(1, 2, figsize=(16, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=HAIR_LENGTHS, yticklabels=HAIR_LENGTHS, ax=_axes[0], cbar_kws={'label': 'Count'})
    _axes[0].set_title('Confusion Matrix (Counts)', fontsize=14, fontweight='bold')
    _axes[0].set_ylabel('True Label')
    _axes[0].set_xlabel('Predicted Label')
    sns.heatmap(cm_normalized, annot=True, fmt='.2f', cmap='Blues', xticklabels=HAIR_LENGTHS, yticklabels=HAIR_LENGTHS, ax=_axes[1], cbar_kws={'label': 'Percentage'})
    _axes[1].set_title('Confusion Matrix (Normalized)', fontsize=14, fontweight='bold')
    _axes[1].set_ylabel('True Label')
    _axes[1].set_xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig(MODEL_OUTPUT_PATH / 'hair_length_confusion.png', dpi=150)
    plt.show()
    return


@app.cell
def _(HAIR_LENGTHS, MODEL_OUTPUT_PATH, history, json, model):
    print("\n💾 Saving model...")

    # Save model
    model.save(MODEL_OUTPUT_PATH / 'hair_length_model.keras')
    print(f"✅ Saved: hair_length_model.keras")

    # Save class names
    with open(MODEL_OUTPUT_PATH / 'hair_length_classes.json', 'w') as f:
        json.dump(HAIR_LENGTHS, f, indent=2)
    print(f"✅ Saved: hair_length_classes.json")

    # Save training history
    history_dict = {
        'accuracy': [float(x) for x in history.history['accuracy']],
        'val_accuracy': [float(x) for x in history.history['val_accuracy']],
        'loss': [float(x) for x in history.history['loss']],
        'val_loss': [float(x) for x in history.history['val_loss']],
        'epochs': len(history.history['accuracy']),
        'final_val_accuracy': float(history.history['val_accuracy'][-1]),
        'best_val_accuracy': float(max(history.history['val_accuracy'])),
        'dataset': 'celebamask-hq',
        'method': 'hair-segmentation-masks'
    }

    with open(MODEL_OUTPUT_PATH / 'hair_length_history.json', 'w') as f:
        json.dump(history_dict, f, indent=2)
    print(f"✅ Saved: hair_length_history.json")

    # Print summary
    print(f"\n🎉 Training Complete!")
    print(f"="*60)
    print(f"📊 Final Results:")
    print(f"   Training accuracy: {history.history['accuracy'][-1]*100:.2f}%")
    print(f"   Validation accuracy: {history.history['val_accuracy'][-1]*100:.2f}%")
    print(f"   Best validation accuracy: {max(history.history['val_accuracy'])*100:.2f}%")
    print(f"   Total epochs: {len(history.history['accuracy'])}")

    model_size_mb = (MODEL_OUTPUT_PATH / 'hair_length_model.keras').stat().st_size / 1024 / 1024
    print(f"\n📁 Files saved to: {MODEL_OUTPUT_PATH}")
    print(f"   - hair_length_model.keras ({model_size_mb:.1f} MB)")
    print(f"   - hair_length_classes.json")
    print(f"   - hair_length_history.json")
    print(f"="*60)
    return


@app.cell
def _(MODEL_OUTPUT_PATH, model):
    # Convert to TensorFlow.js
    import tensorflowjs as tfjs
    import shutil

    print("\n" + "="*60)
    print("🔄 Converting to TensorFlow.js...")
    print("="*60)

    TFJS_OUTPUT = MODEL_OUTPUT_PATH / 'hair_length' / 'tfjs'
    TFJS_OUTPUT.mkdir(parents=True, exist_ok=True)

    print(f"\n📦 Loading model from: {MODEL_OUTPUT_PATH / 'hair_length_model.keras'}")
    print(f"📁 Output directory: {TFJS_OUTPUT}")

    # Convert with quantization for smaller size
    tfjs.converters.save_keras_model(
        model,
        str(TFJS_OUTPUT),
        quantization_dtype_map={'uint8': '*'}
    )

    # Copy classes file
    shutil.copy(
        MODEL_OUTPUT_PATH / 'hair_length_classes.json',
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
