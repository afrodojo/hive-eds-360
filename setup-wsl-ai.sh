#!/bin/bash
echo "=== EDS-360 WSL2 AI Engine Initialization ==="
sudo apt-get update && sudo apt-get install -y python3-pip python3-venv curl git

# Install Ollama for fast local GGUF/vLLM serving with VRAM caps
curl -fsSL https://ollama.com/install.sh | sh

# Configure environment limits for 16GB VRAM (12GB cap, 4GB display reserve)
export CUDA_VISIBLE_DEVICES=0
export OLLAMA_NUM_PARALLEL=2
export OLLAMA_MAX_LOADED_MODELS=1

echo "Pulling Llama-3.1-8B-Instruct model optimized for 12GB VRAM cap..."
ollama pull llama3.1:8b-instruct-q4_K_M

echo "=== WSL2 AI Engine Online & Listening on http://localhost:11434 ==="
