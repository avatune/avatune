#!/bin/bash
# Copy TFJS models from python/models to public/models

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/../../.."
PUBLIC_DIR="$SCRIPT_DIR/../public"

echo "Copying TFJS models to public directory..."

# Create models directory
mkdir -p "$PUBLIC_DIR/models"

# Copy each model
for model in hair-color hair-length skin-tone; do
  # Convert hyphenated names to underscored for source
  source_name="${model//-/_}"

  if [ -d "$PROJECT_ROOT/python/models/$source_name/tfjs" ]; then
    echo "Copying $model model..."
    mkdir -p "$PUBLIC_DIR/models/$model"
    cp -r "$PROJECT_ROOT/python/models/$source_name/tfjs/"* "$PUBLIC_DIR/models/$model/"
  else
    echo "Warning: Model not found at $PROJECT_ROOT/python/models/$source_name/tfjs"
  fi
done

echo "✓ Models copied successfully"
